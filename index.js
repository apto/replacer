'use strict';
/*jshint regexp: false */

var Transform = require('stream').Transform;
var util = require('util');

util.inherits(Replacer, Transform);

/**
   Duplex stream that replaces all occurences of search text in input
   with replace text.

   Does NOT support regular expression matching.  The input and output
   streams are assumed to be text streams.  Replacer is not
   designed to work with binary data.

   @param rules array of rule objects.  For each rule, rule.search is
   replaced with rule.replace.  Throws Error if rules is empty, null or undefined.
*/
function Replacer(rules) {
  if (!rules || rules.length === 0) {
    throw new Error('Undefined or empty rules array passed to Replacer');
  }

  Transform.call(this);
  this.buffer = '';

  this.anyMatchRegexp = buildAnyMatchRegexp(rules);
  this.replacements = buildReplacementsMap(rules);
  this.partialMatchRegexp = new RegExp(buildPartialMatchRegexp(rules));
}

function buildAnyMatchRegexp(rules) {
  var s = rules.map(function (rule) {
    return '(' + escape(rule.search) + ')';
  }).join('|');
  return new RegExp(s, 'g');
}

function buildReplacementsMap(rules) {
  var map = {};
  rules.forEach(function (rule) {
    map[rule.search] = rule.replace;
  });
  return map;
}

function buildPartialMatchRegexp(rules) {
  var s = rules.map(function (rule) {
    return '(' + buildOnePartialMatchRegexp(rule.search) + ')';
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

module.exports = function (replacements) {
  return new Replacer(replacements);
};
