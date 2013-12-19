var chai = require('chai');
var expect = chai.expect;
var StringStream = require('./string-stream');
var Replacer = require('../index');

describe('replacer examples', function () {
  it('should do streaming search and replace', function () {
    var fs = require('fs');
    var path = require('path');
    var Replacer = require('../index');

    var filePath = path.resolve(__dirname, 'story.txt');
    fs.createReadStream(filePath)
      .pipe(new Replacer('cow', 'dog'))
      .pipe(process.stdout);
  });

  it('should perform multiple replacments', function () {
    var fs = require('fs');
    var path = require('path');
    var Replacer = require('../index');

    var filePath = path.resolve(__dirname, 'story.txt');

    var replacements = [
      { search: 'cow', replace: 'dog' },
      { search: 'pig', replace: 'fox' },
      { search: 'hen', replace: 'hog' }
    ];

    fs.createReadStream(filePath)
      .pipe(new Replacer(replacements))
      .pipe(process.stdout);
  });
});
