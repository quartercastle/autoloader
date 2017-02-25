const fs = require('fs')
const { resolve, join, sep } = require('path')

class Autoloader {

  /**
   * Create a new instance of the autoloader
   * @param {String} path
   * @param {Object} options
   * @return {Autoloader}
   */
  constructor (path, options = {}) {
    this.basePath = path
    this.modules = {}

    this.ignore = options.ignore || ['node_modules']
    this.includes = options.include || ['json', 'js']

    if (typeof this.basePath !== 'string') {
      throw new Error('First argument should be a path')
    }

    if (!fs.existsSync(this.basePath)) {
      throw new Error(`Couldn't find the path ${this.basePath}`)
    }

    this.readDir()
  }

  /**
   * Read the specified directory
   * @param {String} path path of the directory to scan
   * @private
   */
  readDir (path = '') {
    for (let file of fs.readdirSync(resolve(this.basePath, path))) {
      if (this.ignore.includes(file)) {
        continue // ignore folder
      }

      if (
        fs.lstatSync(resolve(this.basePath, path, file)).isFile()
      ) {
        this.constructModuleNamespace(path, file)
        continue
      }

      if (file[0] === '.') {
        continue // ignore hidden folders
      }

      this.readDir(join(path, file))
    }
  }

  /**
   * Create the module namespace and require the file
   * @param {String} path
   * @param {String} file
   * @private
   */
  constructModuleNamespace (path, file) {
    const filename = file.split('.')
      .filter(ext => !this.includes.includes(ext))
      .join('.')

    const ext = file.split('.')[file.split('.').length - 1]

    if (!this.includes.includes(ext)) {
      return
    }

    if (path === '') {
      this.modules[filename] = this.require(path, file)
      return
    }

    let modules = this.modules
    let folders = path.split(sep)

    for (let i = 0, folder; folder = folders[i]; i++) { // eslint-disable-line
      if (folder === '') {
        modules[folder][filename] = this.require(path, file)
        continue
      }

      if (!modules[folder]) {
        modules[folder] = {}
      }

      if (i === (folders.length - 1)) {
        modules[folder][filename] = this.require(path, file)
        continue
      }

      modules = modules[folder]
    }
  }

  /**
   * Require the file
   * @param {String} path
   * @param {String} file
   * @return {Mixed}
   * @private
   */
  require (path, file) {
    try {
      return require(resolve(this.basePath, path, file))
    } catch (err) {}
  }

}

module.exports = Autoloader
