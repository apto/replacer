var Transform = require('stream').Transform;
var util = require('util');

util.inherits(Replacer, Transform);

/**
   Duplex stream that replaces all occurences of search text in input
   with replace text.

   Does NOT support regular expression matching.  The input and output
   streams are assumed to be text streams.  Replacer is not
   designed to work with binary data.

   @param replacments array of replacement objects.  For each
   replacement, replacement.search is replaced with replacement.replace.

   For a single search and replace, pass two string arguments search and replace:
   new Replace('foo', 'bar');
*/
function Replacer(replacments) {
  if (arguments.length === 2) {
    replacments = [{search: arguments[0], replace: arguments[1]}];
  }

  Transform.call(this);
  this.buffer = '';

  this.anyMatchRegexp = buildAnyMatchRegexp(replacments);
  this.replacements = buildReplacementsMap(replacments);
  this.partialMatchRegexp = new RegExp(buildPartialMatchRegexp(replacments));
}

function buildAnyMatchRegexp(replacments) {
  var s = replacments.map(function (r) {
    return '(' + escape(r.search) + ')';
  }).join('|');
  return new RegExp(s, 'g');
}

function buildReplacementsMap(replacments) {
  var map = {};
  replacments.forEach(function (r) {
    map[r.search] = r.replace;
  });
  return map;
}

function buildPartialMatchRegexp(replacments) {
  var s = replacments.map(function (r) {
    return '(' + buildOnePartialMatchRegexp(r.search) + ')';
  }).join('|');
  return new RegExp(s);
}

function buildOnePartialMatchRegexp(s) {
  var matches = [];
  for (var i = 1; i < s.length; i++) {
    var partial = escape(s.substr(0, i));
    var group = '(' + partial + '$)';
    matches.push(group);
  }
  return matches.join('|');
}

function escape(s) {
  return s.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g, '\\$&');
}

Replacer.prototype._transform = function (chunk, encoding, done) {
  this.buffer += chunk.toString();

  var that = this;
  this.buffer = this.buffer.replace(this.anyMatchRegexp, function (match) {
    return that.replacements[match];
  });

  if (!this.buffer.match(this.partialMatchRegexp)) {
    this.push(this.buffer);
    this.buffer = '';
  }

  done();
};

Replacer.prototype._flush = function (done) {
  this.push(this.buffer);
  done();
};

module.exports = Replacer;
