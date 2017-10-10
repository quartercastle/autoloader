import fs from 'fs'
import { join } from 'path'

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

  return createModuleObject(
    path,
    {},
    Object.assign({}, defaultOptions, options)
  )
}

/**
 * Create the module object
 * @param  {String} path
 * @param  {Object} modules
 * @param  {Object} options
 * @param  {Array}  context
 * @return {Object}
 */
function createModuleObject (path, modules, options, context = []) {
  for (const module of fs.readdirSync(path)) {
    if (options.ignore.includes(module)) {
      // ignore files from the ignore option
      continue
    }

    if (module[0] === '.') {
      // ignore hidden files and folders
      continue
    }

    if (fs.lstatSync(join(path, module)).isDirectory()) {
      // create module object for folder
      modules[module] = createModuleObject(
        join(path, module),
        {},
        options,
        context.concat(module)
      )

      continue
    }

    if (options.include.includes(module.split('.').pop())) {
      // Load the module
      modules[module.split('.')[0]] = require(join(path, module))
    }
  }

  return modules
}
