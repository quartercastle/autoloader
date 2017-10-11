import fs from 'fs'
import { join } from 'path'

/**
 * Default options
 * @type {Object}
 */
const defaultOptions = {
  ignore: ['node_modules'],
  include: ['js', 'json'],
  flatten: false
}

/**
 * The autoloader function
 * @param  {String} path which should be autoloaded
 * @param  {Object} options configure the autoloader
 * @return {Object} generated object with the autoloaded modules
 */
export default function autoloader (path, options) {
  if (typeof path !== 'string') {
    throw new Error('First argument should be a string')
  }

  if (!fs.existsSync(path)) {
    throw new Error(`The path ${path} does not exists`)
  }

  return createModuleObject(path, Object.assign({}, defaultOptions, options))
}

/**
 * Create the module object
 * @param  {String} path
 * @param  {Object} options
 * @return {Object}
 */
function createModuleObject (path, options) {
  const modules = {}

  for (const module of fs.readdirSync(path)) {
    if (
      options.ignore.includes(module) ||
      ignorePath(join(path, module), options.ignore)
    ) {
      // ignore files from the ignore option
      continue
    }

    if (module[0] === '.') {
      // ignore hidden files and folders
      continue
    }

    if (fs.lstatSync(join(path, module)).isDirectory()) {
      // create module object for folder
      modules[module] = createModuleObject(join(path, module), options)
      continue
    }

    if (options.include.includes(module.split('.').pop())) {
      // Load the module
      const moduleName = module.split('.')[0]

      modules[moduleName] = require(join(path, module))

      if (
        typeof modules[moduleName] === 'object' &&
        modules[moduleName].__esModule
      ) {
        modules[moduleName] = convertEsModuleToCommonJS(modules[moduleName])
      }
    }
  }

  return modules
}

/**
 * Test if a path should be ignored
 * @param  {String}   path
 * @param  {Array}    ignore
 * @return {Boolean}
 */
function ignorePath (path, ignore) {
  return ignore.reduce(
    (state, ignorePath) => state || path.includes(ignorePath.replace('./', '')),
    false
  )
}

/**
 * Convert a ES Module to a Commonjs format
 * @param  {Object} esModule
 * @return {Mixed}
 */
function convertEsModuleToCommonJS (esModule) {
  if (esModule.default !== Object(esModule.default)) {
    return esModule.default
  }

  const module = esModule.default

  for (const key in esModule) {
    if (!module[key] && key !== 'default') {
      module[key] = esModule[key]
    }
  }

  return module
}
