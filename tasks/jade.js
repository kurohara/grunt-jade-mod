/*
 * grunt-jade-mod
 * https://github.com/kurohara/grunt-jade-mod
 *
 * Copyright (c) 2015 Hiroyoshi Kurohara
 * Licensed under the MIT license.
 */

'use strict';

var restorefuncs = [];

module.exports = function(grunt) {

	var sys = require('sys');
	var jadetask = require('../node_modules/grunt-contrib-jade/tasks/jade');
	jadetask(grunt);

	if (grunt.task.exists('jade')) {
		grunt.task.renameTask('jade', 'jade_orig');
	}

	// register postprocess task.
	grunt.registerMultiTask('jade_post_orig', 'Postprocess to restore original settings.', function() {
		// nothing todo now.
	});

	function callRestore() {
		restorefuncs.forEach(function(f) {
			f();
		});
	}
	// register overwrapping 'jade' task.
	grunt.registerMultiTask('jade', 'Compile jade templates, with modifiers.', function() {

		//
		// 1. Replace 'require' function.
		//
		var yor = require('yorequire');
		yor.setCB(function(name, o_require, data) {
			var obj = o_require(name);

			if (name === 'jade') {
				var jade = obj;
				callRestore();
				restorefuncs = [];
				var modifiers = data['modifiers'];
				if (modifiers) {
					for (var index in modifiers) {
						var modobj = o_require(modifiers[index]);
						//
						// modifiers can, 
						// 1. override prototype functions of jade.(Lexer|Parser|Compiler).
						// or
						// 2. make jade use of your own Parser|Compiler by adding class to options.parser, options.compiler.
						//         (this is not tested yet, even about its feasibility)
						//
						modobj.init(jade);
						restorefuncs.push(modobj.restorefunc());
					}
				}
			}
	
			return obj;
		}, this.options({}));
		yor.enable(true);

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
	}); // end of 'jade' task.
};

