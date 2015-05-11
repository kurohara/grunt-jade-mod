/*
 * grunt-jade-mod
 * https://github.com/kurohara/grunt-jade-mod
 *
 * Copyright (c) 2015 Hiroyoshi Kurohara
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var sys = require('sys');
  var module = require('../node_modules/grunt-contrib-jade/tasks/jade');
  module(grunt);

  if (grunt.task.exists('jade')) {
    grunt.task.renameTask('jade', 'jade_orig');
  }

  /**
   * Function to restore original functions.
   *
   */
  var clearJadeModifiers = function (obj) {
    if (obj) {
      // write back original functions.
      [ "Parser", "Compiler", "Lexer" ].forEach(function(component) {
        for (var key in obj[component].prototype) {
          if (key.lastIndexOf('ex_', 0) === 0) {
            obj[component].prototype[key.substring(3)] = obj[component].prototype[key];
          }
        }
      });
    }
  };

  // register postprocess task.
  grunt.registerMultiTask('jade_post_orig', 'Postprocess to restore original settings.', function() {
    // nothing todo now.
  });

  // register overwrapping 'jade' task.
  grunt.registerMultiTask('jade', 'Compile jade templates, with modifiers.', function() {

    //
    // 1. Replace 'require' function.
    //
    var Module = require('module');
    if (! Module.prototype.orig_require) {
      Module.prototype.orig_require = Module.prototype.require;
    }

    Module.prototype.require = function (name) {
      var obj = this.orig_require(name);

      if (name === 'jade') {
        clearJadeModifiers(obj);
        var modifiers = this.require_options['modifiers'];
        if (modifiers) {
          for (var index in modifiers) {
            var modobj = this.orig_require(modifiers[index]);
            modobj(obj);
          }
        }
      }

      return obj;
    };
    Module.prototype.require_options = this.options({});


    //
    // 2. Enqueue original 'jade' task and postprocess task.
    //
    var taskq = [];

    // prepare to call 'original jade' task.
    grunt.config.set('jade_orig', grunt.config.getRaw('jade'));
    taskq.push('jade_orig' + ':' + this.target);

    // prepare to call postproc task.
    grunt.config.set('jade_post_orig', { default: {} } );
    taskq.push('jade_post_orig');

    // enqueue task.
    grunt.task.run(taskq);

  });

};
