'use strict';

var assert = require('assert');
var Autoloader = require('../src/Autoloader');

describe('Load files into global namespace', () => {
  new Autoloader([
    'test/controllers',
    'test/models'
  ]).global();

  describe('# Controllers', () => {
    it('Should load the FirstController', () => assert.equal('controllers.FirstController', FirstController()));
    it('Should load the SecondController', () => assert.equal('controllers.SecondController', SecondController()));
    it('Should load the test.TestController', () => assert.equal('controllers.test.TestController', test.TestController()));
  });

  describe('# Models', () => {
    it('Should load the FirstModel', () => assert.equal('models.FirstModel', FirstModel()));
    it('Should load the SecondModel', () => assert.equal('models.SecondModel', SecondModel()));
    it('Should load the first.index', () => assert.equal('models.first.index', first.index()));
    it('Should load the first.test.index', () => assert.equal('models.first.test.index', first.test.index()));
    it('Should load the second.index', () => assert.equal('models.second.index', second.index()));
  });
});

describe('Load files into Namespace var', () => {
  var Namespace = new Autoloader([
    'test/controllers',
    'test/models'
  ]).namespaced();

  describe('# Controllers', () => {
    it('Should load the FirstController', () => {
      assert.equal('controllers.FirstController', Namespace.test.controllers.FirstController())
    });

    it('Should load the SecondController', () => {
      assert.equal('controllers.SecondController', Namespace.test.controllers.SecondController())
    });

    it('Should load the test.TestController', () => {
      assert.equal('controllers.test.TestController', Namespace.test.controllers.test.TestController())
    });
  });

  describe('# Models', () => {
    it('Should load the FirstModel', () =>  {
      assert.equal('models.FirstModel', Namespace.test.models.FirstModel())
    });

    it('Should load the SecondModel', () => {
      assert.equal('models.SecondModel', Namespace.test.models.SecondModel())
    });

    it('Should load the first.index', () => {
      assert.equal('models.first.index', Namespace.test.models.first.index())
    });

    it('Should load the first.test.index', () => {
      assert.equal('models.first.test.index', Namespace.test.models.first.test.index())
    });

    it('Should load the second.index', () => {
      assert.equal('models.second.index', Namespace.test.models.second.index())
    });

  });
});
