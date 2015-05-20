/*
 * grunt-jade-mod
 * https://github.com/kurohara/grunt-jade-mod
 *
 * Copyright (c) 2015 Hiroyoshi Kurohara
 * Licensed under the MIT license.
 */

'use strict';

var modifierobjs = [];
modifierobjs.callRestore = function() {
	this.forEach(function(obj) {
		obj.restore();
	});
	this.length = 0;
};

function inherit(me, parent) {
    for (var key in parent) {
        me[key] = parent[key];
    }
    me.super = parent;
}

module.exports = function(grunt) {

	var sys = require('sys');
	var jadetask = require('../node_modules/grunt-contrib-jade/tasks/jade');
	var my_grunt = {};
	inherit(my_grunt, grunt);

	//
	// 1. replace original 'registerMultiTask' function.
	my_grunt.registerMultiTask = function(name, desc, func) {
		// 
		// 1.1 call original 'registerMultiTask' function to register my own 'jade' task.
		this.super.registerMultiTask(name, desc + ', with modifiers attached.', function() {
			//
			// 1.1.1. Replace 'require' function.
			//
			var yor = require('yorequire');
			yor.set(function(name, o_require, data) {
				// 1.1.1.1 call original 'require' function to get original module that required.
				var obj = o_require(name);

				// 1.1.1.2 apply modifier if loaded module was 'jade' module.
				if (name === 'jade') {
					var jade = obj;
					modifierobjs.callRestore();
					var modifiers = data['modifiers'];
					if (modifiers) {
						for (var index in modifiers) {
							var modobj = o_require(modifiers[index]);
							//
							// modifiers can, 
							// 1. override prototype functions of jade.(Lexer|Parser|Compiler).
							// or
							// 2. make jade use of your own Parser|Compiler by adding class to options.parser, options.compiler.
							// I choose 1.
							modobj.init(jade);
							// save modifier object for unregister(restore) work.
							modifierobjs.push(modobj);
						}
					}
				}
		
				return obj;
			}, this.options({}));
			yor.enable(true);
	
			//
			// 1.1.2. call the original 'jade' task which had passed from 'grunt-contrib-jade' module.
			func.bind(this)();
	
			//
			// 1.1.3. do some postprocess here if needed.
			//
		});
	};
	
	//
	// 2. setup original 'jade' (grunt-contrib-jade) task with my grunt object.
	jadetask(my_grunt);

};

