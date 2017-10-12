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
    throw new Error(`The path ${path} does not exist`)
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
      continue
    }

    if (module[0] === '.') {
      continue
    }

    if (fs.lstatSync(join(path, module)).isDirectory()) {
      modules[module] = createModuleObject(join(path, module), options)
      continue
    }

    if (options.include.includes(module.split('.').pop())) {
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

  if (options.flatten) {
    const flattenModules = {}
    flatten(flattenModules, modules)
    return flattenModules
  }

  return modules
}

/**
 * Flatten autoloaded module object
 * @param  {Object} flatten
 * @param  {Object} module
 * @param  {Array}  context
 * @return {Object}
 */
function flatten (flatten, module, context = []) {
  if (typeof module === 'object' && !Array.isArray(module)) {
    return flattenObject(flatten, module, context)
  }

  return (flatten[context.join('.')] = module)
}

/**
 * Flatten object within the autoloaded module object
 * @param  {Object} module
 * @param  {Array}  context
 * @return {Object}
 */
function flattenObject (flattenObj, module, context) {
  for (const key in module) {
    flatten(flattenObj, module[key], context.concat(key))
  }
}

/**
 * Test if a path should be ignored
 * @param  {String}   path
 * @param  {Array}    ignore
 * @return {Boolean}
 */
function ignorePath (path, ignore) {
  for (const ignorePath of ignore) {
    if (path.includes(ignorePath)) return true
  }

  return false
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
