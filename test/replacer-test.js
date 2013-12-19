var chai = require('chai');
var expect = chai.expect;
var StringStream = require('./string-stream');
var Replacer = require('../index');

describe('Replacer', function () {
  function collectData(stream, cb) {
    var data = '';
    stream.on('data', function (chunk) {
      data += chunk.toString();
    });
    stream.on('end', function () {
      cb(data);
    });
  }

  it('should perform one transform', function (done) {
    var input = 'The cat ate the dog. The cat ate the dog. The cat ate the dog.';
    var expectedOutput = 'The cow ate the dog. The cow ate the dog. The cow ate the dog.';

    var inputStream = new StringStream(input);
    var replacer = new Replacer('cat', 'cow');
    inputStream.pipe(replacer);

    collectData(replacer, function (data) {
      expect(data).to.equal(expectedOutput);
      done();
    });
  });

  it('should perform two transforms', function (done) {
    var input = 'The cat ate the dog. The cat ate the dog. The cat ate the dog.';
    var expectedOutput = 'The cow ate the pig. The cow ate the pig. The cow ate the pig.';

    var replacments = [
      { search: 'cat', replace: 'cow' },
      { search: 'dog', replace: 'pig' }
    ];
    var replacer = new Replacer(replacments);
    var inputStream = new StringStream(input);
    inputStream.pipe(replacer);

    collectData(replacer, function (data) {
      expect(data).to.equal(expectedOutput);
      done();
    });
  });

  it('should do global replacments', function (done) {
    var input = 'The cat ate the dog. The cat ate the dog. The cat ate the dog.';
    var expectedOutput = 'The cow ate the dog. The cow ate the dog. The cow ate the dog.';

    var inputStream = new StringStream(input);
    var replacments = [{search: 'cat', replace: 'cow'}];
    var replacer = new Replacer(replacments);
    inputStream.pipe(replacer);

    collectData(replacer, function (data) {
      expect(data).to.equal(expectedOutput);
      done();
    });
  });

  it('should handle funky characters', function (done) {
    var input = '~!@#$%^&* (){}[cat]';
    var expectedOutput = '~!@#$%^&* (){}[cow]';

    var inputStream = new StringStream(input);
    var replacments = [{search: 'cat', replace: 'cow'}];
    var replacer = new Replacer(replacments);
    inputStream.pipe(replacer);

    collectData(replacer, function (data) {
      expect(data).to.equal(expectedOutput);
      done();
    });
  });
});
