const fs = require('fs')
const path = require('path')

class Autoloader {

  /**
   * Create a new instance of the autoloader
   * @param {String} path
   * @param {Object} options
   * @return {Object} modules
   */
  constructor (path, silent = false) {
    this.basePath = path
    this.path = ''
    this.modules = {}

    if (!silent && !this.basePath && typeof path !== 'string') {
      throw new Error('Path should be a string')
    }

    if (!fs.existsSync(this.basePath)) {
      if (silent) {
        return
      }

      throw new Error(`Couldn't find the path ${this.basePath}`)
    }

    this.readDir()
  }

  /**
   * Read the specified directory
   * @private
   */
  readDir () {
    for (let file of fs.readdirSync(path.resolve(this.basePath, this.path))) {
      if (
        fs.lstatSync(path.resolve(this.basePath, this.path, file)).isFile()
      ) {
        this.loadFile(file)
        continue
      }

      this.modules[file] = {}
      this.path = path.join(this.path, file)
      this.readDir()
    }
  }

  /**
   * Load file and create a module object
   * @param {String} file
   * @private
   */
  loadFile (file) {
    file = file.split('.')[0]

    if (this.path === '') {
      this.modules[file] = require(path.resolve(this.basePath, this.path, file))
    }

    let modules = this.modules
    let folders = this.path.split(path.sep)
    for (let i = 0, folder; folder = folders[i]; i++) { // eslint-disable-line
      if (folder === '') {
        modules[file] = () => {}
      }

      if (i === (folders.length - 1)) {
        modules[folder][file] = require(path.resolve(this.basePath, this.path, file))
      } else {
        modules[folder] = {}
        modules = modules[folder]
      }
    }
  }

}

module.exports = Autoloader
