/* eslint-env mocha */
const path = require('path')
const { expect } = require('chai')
const Autoloader = require('../lib/Autoloader')

describe('Autoloader.constructor', () => {
  it('Should create a new autoloader instance', () => {
    const autoloader = new Autoloader(path.resolve(__dirname, './modules'))
    expect(autoloader).to.be.instanceOf(Autoloader)
  })

  it('Should include the correct folders and create a namespace module', () => {
    const { modules } = new Autoloader(path.resolve(__dirname, './modules'))
    expect(modules).to.be.deep.equal({
      'other-modules': {
        test: ['other module']
      },
      submodules: {
        data: {
          data: {
            samples: ['test', 'hello']
          }
        },
        module: true
      },
      file: { key: 'value' }
    })
  })

  it('Should ignore the folder submodules and file.js', () => {
    const { modules } = new Autoloader(path.resolve(__dirname, './modules'), {
      ignore: ['submodules', 'file.js']
    })
    expect(modules.submodules).to.be.undefined
    expect(modules.file).to.be.undefined
  })

  it('Should only include json files', () => {
    const { modules } = new Autoloader(path.resolve(__dirname, './modules'), {
      include: ['json']
    })

    expect(modules.submodules.data.data).to.not.be.undefined
    expect(modules.file).to.be.undefined
  })

  it(`Should throw an exception if the path doesn't exist`, () => {
    expect(() => new Autoloader('./does-not-exist')).to.throw(
      `Couldn't find the path ./does-not-exist`
    )
  })

  it(`Should throw an exection if the first argument isn't a string`, () => {
    expect(() => new Autoloader({})).to.throw(
      'First argument should be a path'
    )
  })
})
