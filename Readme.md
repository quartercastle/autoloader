# Specla Autoloader

[![npm version](https://img.shields.io/npm/v/specla-autoloader.svg)](https://www.npmjs.com/package/specla-autoloader)
[![Build Status](https://travis-ci.org/Specla/Autoloader.svg?branch=master)](https://travis-ci.org/Specla/Autoloader)
[![Dependency Status](https://david-dm.org/specla/autoloader.svg)](https://david-dm.org/specla/autoloader)
[![devDependencies Status](https://david-dm.org/specla/autoloader/dev-status.svg)](https://david-dm.org/specla/autoloader?type=dev)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Autoload `modules` and `json` files with ease. This packages constructs an object
that reflects your folder structure and auto require the files within the
specified path.

### Install
```sh
npm install --save specla-autoloader
```

### Usage
```js
const Autoloader = require('specla-autoloader')

const { modules } = new Autoloader(__dirname)
```

#### Options
```js
const { modules } = new Autoloader(__dirname, {
  include: ['js', 'json'], // specifies which file types to include
  ignore: [
    'node_modules', // ignore folders
    'some-file.js' // ignore specific file
  ]
})
```
