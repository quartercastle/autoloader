# Specla Autoloader

[![npm version](https://img.shields.io/npm/v/specla-autoloader.svg)](https://www.npmjs.com/package/specla-autoloader)
[![Build Status](https://travis-ci.org/specla/autoloader.svg?branch=master)](https://travis-ci.org/specla/autoloader)
[![Coverage Status](https://coveralls.io/repos/github/specla/autoloader/badge.svg?branch=release-1.0)](https://coveralls.io/github/specla/autoloader?branch=release-1.0)
[![Dependency Status](https://david-dm.org/specla/autoloader.svg)](https://david-dm.org/specla/autoloader)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Autoload `modules` and `json` files with ease. This packages constructs an object
that reflects your folder structure and requires the files within the
specified path.

### Install
```sh
npm install --save @specla/autoloader
```

### Usage
```js
const path = require('path')
const Autoloader = require('specla-autoloader')

const modules = new Autoloader(path.resolve('./modules'))
```

An example of the path `./modules` could look like this.
```
┬ modules
├── some-file.js
├── data.json
├─┬ sub-modules
  ├── other-file.js
```

This will create the following js object when the path is autoloaded.
```js
const modules = {
  'some-file': require('./modules/some-file.js'),
  data: require('./modules/data.json'),
  'sub-modules': {
    'other-file': require('./modules/sub-modules/other-file.js')
  }
}
```

### Options
```js
const modules = new Autoloader(__dirname, {
  include: ['js', 'json'], // specifies which file types to include
  ignore: [
    'node_modules', // ignore folders
    'some-file.js' // ignore specific file
  ]
})
```
