(function (
    modules,
    entry,
    mainEntry,
    parcelRequireName,
    externals,
    distDir,
    publicUrl,
    devServer
  ) {
    var globalObject =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {};
  
    var previousRequire =
      typeof globalObject[parcelRequireName] === 'function' &&
      globalObject[parcelRequireName];
  
    var importMap = previousRequire.i || {};
    var cache = previousRequire.cache || {};
    
    var nodeRequire =
      typeof module !== 'undefined' &&
      typeof module.require === 'function' &&
      module.require.bind(module);
  
    function newRequire(name, jumped) {
      if (!cache[name]) {
        if (!modules[name]) {
          if (externals[name]) {
            return externals[name];
          }
          
          var currentRequire =
            typeof globalObject[parcelRequireName] === 'function' &&
            globalObject[parcelRequireName];
          if (!jumped && currentRequire) {
            return currentRequire(name, true);
          }
  
          if (previousRequire) {
            return previousRequire(name, true);
          }
  
          if (nodeRequire && typeof name === 'string') {
            return nodeRequire(name);
          }
  
          var err = new Error("Cannot find module '" + name + "'");
          err.code = 'MODULE_NOT_FOUND';
          throw err;
        }
  
        localRequire.resolve = resolve;
        localRequire.cache = {};
  
        var module = (cache[name] = new newRequire.Module(name));
  
        modules[name][0].call(
          module.exports,
          localRequire,
          module,
          module.exports,
          globalObject
        );
      }
  
      return cache[name].exports;
  
      function local
  