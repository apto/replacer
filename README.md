# replacer

[![Build Status](https://secure.travis-ci.org/apto/replacer.png)](http://travis-ci.org/apto/replacer)

Node.js transform stream that performs text based search and replacements.  It performs correctly over chunk boundaries, and is efficient when performing multiple search / replacements over a stream of text.

## Installation

```shell
npm install replacer
```

## Usage

### Streaming search and replace

Let's say we have the following text file:
```
// story.txt
The cow ate the pig.
The cow ate the hen.
The cow ate the horse.
```

To replace all occurrences of 'cow' with 'dog' we could do this:

```js
var fs = require('fs');
var path = require('path');
var Replacer = require('replacer');

var filePath = path.resolve(__dirname, 'story.txt');
fs.createReadStream(filePath)
  .pipe(new Replacer('cow', 'dog'))
  .pipe(process.stdout);
```

This will print:

```
The dog ate the pig.
The dog ate the hen.
The dog ate the horse.
```

### Multiple replacements

To perform multiple replacements:

```js
var replacements = [
  { search: 'cow', replace: 'dog' },
  { search: 'pig', replace: 'fox' },
  { search: 'hen', replace: 'hog' }
];

fs.createReadStream(filePath)
  .pipe(new Replacer(replacements))
  .pipe(process.stdout);
```

This would print:

```
The dog ate the fox.
The dog ate the hog.
The dog ate the horse.
```

### See Also
Replacer was insipired by
[replacestream](https://github.com/eugeneware/replacestream).
