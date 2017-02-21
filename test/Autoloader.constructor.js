/* eslint-env mocha */
const path = require('path')
const { expect } = require('chai')
const Autoloader = require('../lib/Autoloader')

describe('Autoloader.constructor', () => {
  it('Should create a new autoloader instance with default options', () => {
    const { modules } = new Autoloader(path.resolve(__dirname, 'modules'))

    expect(modules).to.be.deep.equal({
      file: {
        key: 'value'
      },
      submodules: {
        file: true
      }
    })
  })

  it('Should throw an exception if no path is specified', () => {
    expect(() => new Autoloader()).to.throw('Path should be a string')
  })

  it(`Should throw an exception if the specified path doesn't exist`, () => {
    expect(() => new Autoloader('not/working')).to.throw(
      'Couldn\'t find the path not/working'
    )
  })
})
