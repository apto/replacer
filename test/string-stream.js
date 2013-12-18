'use strict';
/*jshint regexp: false */

var Readable = require('stream').Readable;
var util = require('util');

function StringStream(string, options) {
  Readable.call(this);

  // split into 2 character chunks, to test streaming boundaries
  this.chunks = string.match(/.{1,2}/g);
}

util.inherits(StringStream, Readable);

StringStream.prototype._read = function () {
  var that = this;
  this.chunks.forEach(function (chunk) {
    that.push(new Buffer(chunk));
  });

  // signal that we're done
  this.push(null);
};

module.exports = StringStream;
