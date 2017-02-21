# Specla Autoloader

[![npm version](https://img.shields.io/npm/v/specla-autoloader.svg)](https://www.npmjs.com/package/specla-autoloader)
[![Build Status](https://travis-ci.org/Specla/Autoloader.svg?branch=master)](https://travis-ci.org/Specla/Autoloader)
[![Dependency Status](https://david-dm.org/specla/autoloader.svg)](https://david-dm.org/specla/autoloader)
[![devDependencies Status](https://david-dm.org/specla/autoloader/dev-status.svg)](https://david-dm.org/specla/autoloader?type=dev)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is an autoloader for nodejs.

### Install
```sh
npm install --save specla-autoloader
```

### Usages
```js
const Autoloader = require('specla-autoloader')

const { modules } = new Autoloader(__dirname)
```
