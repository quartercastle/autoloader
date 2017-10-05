/* eslint-env jest */

import path from 'path'
import Autoloader from '../src/Autoloader'

test('Should include the correct folders and create a namespace module', () => {
  const modules = new Autoloader(path.resolve(__dirname, './modules'))
  expect(modules).toMatchSnapshot()
})

test('Should ignore the folder submodules and file.js', () => {
  const modules = new Autoloader(path.resolve(__dirname, './modules'), {
    ignore: ['submodules', 'file.js']
  })

  expect(modules.submodules).toBe(undefined)
  expect(modules.file).toBe(undefined)
})

test('Should only include json files', () => {
  const modules = new Autoloader(path.resolve(__dirname, './modules'), {
    include: ['json']
  })

  expect(!!modules.submodules.data.data).toBe(true)
  expect(modules.file).toBe(undefined)
})

test(`Should throw an exception if the path doesn't exist`, () => {
  expect(() => new Autoloader('./does-not-exist')).toThrowErrorMatchingSnapshot()
})

test(`Should throw an exection if the first argument isn't a string`, () => {
  expect(() => new Autoloader({})).toThrowErrorMatchingSnapshot()
})
