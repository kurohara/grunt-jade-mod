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

	my_grunt.registerMultiTask = function(name, desc, func) {
		this.super.registerMultiTask(name, desc + ', with modifiers attached.', function() {
			//
			// 1. Replace 'require' function.
			//
			var yor = require('yorequire');
			yor.setCB(function(name, o_require, data) {
				var obj = o_require(name);
	
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
							//         (this is not tested yet, even about its feasibility)
							//
							modobj.init(jade);
							modifierobjs.push(modobj);
						}
					}
				}
		
				return obj;
			}, this.options({}));
			yor.enable(true);
	
			//
			// 2. call the original 'jade' task.
			func.bind(this)();
	
			//
			// 3. do some postprocess here if needed.
			//
		});
	};
	
	jadetask(my_grunt);

};

