/* eslint-env jest */

import path from 'path'
import autoloader from '../src/autoloader'

test('Should include the correct folders and create a namespace module', () => {
  const modules = autoloader(path.resolve(__dirname, './modules'))
  expect(modules).toMatchSnapshot()
})

test('Should ignore the folder submodules and file.js', () => {
  const modules = autoloader(path.resolve(__dirname, './modules'), {
    ignore: ['submodules', 'file.js']
  })

  expect(modules.submodules).toBe(undefined)
  expect(modules.file).toBe(undefined)
})

test('Should only include json files', () => {
  const modules = autoloader(path.resolve(__dirname, './modules'), {
    include: ['json']
  })

  expect(modules.submodules.data.data.samples).toMatchSnapshot()
  expect(modules.file).toBe(undefined)
})

test('Should work width ES module', () => {
  const modules = autoloader(path.resolve(__dirname, './modules'))

  expect(modules.submodules.esModule.hello).toBe('world')
  expect(modules.submodules.esModule).toMatchSnapshot()
})

test('ES Module should export primitive', () => {
  const modules = autoloader(path.resolve(__dirname, './modules'))
  expect(modules.submodules.esModulePrimitive).toBe(true)
})

test(`Should throw an exception if the path doesn't exist`, () => {
  expect(() => autoloader('./does-not-exist')).toThrowErrorMatchingSnapshot()
})

test(`Should throw an exection if the first argument isn't a string`, () => {
  expect(() => autoloader({})).toThrowErrorMatchingSnapshot()
})
