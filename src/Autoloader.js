'use strict';
var fs = require('fs');

class Autoloader {

  constructor(paths){
    this.rootdir = process.cwd();
    this.paths = paths;
    this.namespaces = {};
    this.setGlobal = false;
  }

  setRootDir(path){
    this.rootdir = path;
    return this;
  }

  validatePaths(){
    for(var i = 0, path; path = this.paths[i]; i++){
      if(path[0] != '/'){
        this.paths[i] = '/'+path;
      }
    }
  }


  namespaced(){
    this.validatePaths();
    this.getFiles();

    return this.namespaces;
  }


  global(){
    this.setGlobal = true;

    this.validatePaths();
    this.getFiles();
  }


  getFiles(){
    for(var i = 0, path; path = this.paths[i]; i++){
      var files = fs.readdirSync(this.rootdir+path);
      this.loadFiles(path, files);
    }
  }

  loadFiles(path, files){
    for(var i = 0, file; file = files[i]; i++){
      if(fs.lstatSync(this.rootdir+path+'/'+file).isFile()){
        this.requireFile(path+'/', file);
      } else {
        this.loadFilesInFolder(path+'/'+file);
      }
    }
  }

  loadFilesInFolder(path){
    var files = fs.readdirSync(this.rootdir+path);
    this.loadFiles(path, files);
  }


  requireFile(path, file){
    if(!fs.lstatSync(this.rootdir+path+file).isFile()){
      return false;
    }

    if(this.setGlobal){
      this.createGlobal(path, file);
    } else {
      this.createNamespace(path, file);
    }
  }


  createNamespace(path, file){
    var scopes = path.split('/');
    var filename = file.split('.')[0];
    delete scopes[0];
    delete scopes[scopes.length-1];

    var namespace = this.namespaces;
    for(var i = 1, scope; scope = scopes[i]; i++){
      if(namespace[scope] === undefined){
        namespace[scope] = {};
      }

      namespace = namespace[scope]
    }

    namespace[filename] = require(this.rootdir+path+file);
  }

  createGlobal(path, file){
    var realPath = path;

    for(var i = 0; i < this.paths.length; i++){
      path = path.replace(this.paths[i], '');
    }

    var scopes = path.split('/');
    var filename = file.split('.')[0];
    delete scopes[0];
    delete scopes[scopes.length-1];

    var namespace = global;
    for(var i = 1, scope; scope = scopes[i]; i++){
      if(namespace[scope] === undefined){
        namespace[scope] = {};
      }

      namespace = namespace[scope]
    }

    namespace[filename] = require(this.rootdir+realPath+file);
  }
}

module.exports = Autoloader;
