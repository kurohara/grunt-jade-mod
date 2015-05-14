/**
 * compiler.js
 * part of jade4jsp, the sample modifier for jade.
 * Written by "Hiroyoshi Kurohara<kurohara@yk.rim.or.jp>".
 *
 * This source code is based on 'jade'(http://jade-lang.com) and 'jade-php'.
 * 'jade-php' is written by "Vinicius Wrubleski <vinicius.wrubleski@gmail.com>".
 */

var Modifier = function Modifier() {
};

Modifier.prototype.Modifier = Modifier;

function _backupfuncs(src, dst) {
	dst.Compiler.prototype.visitCode = src.Compiler.prototype.visitCode;
	dst.Lexer.prototype.code = src.Lexer.prototype.code;
};

Modifier.prototype.init = function(jade) {
	this.jade = jade;
	if (! this.ex) {
		this.ex = {
			Compiler: function() {},
			Lexer: function() {}
		};
		_backupfuncs(jade, this.ex);
	}

	// for debug purpose
	var sys = require('sys');

	var isConstant = require('constantinople');
	if (!jade) {
		jade = require('jade');
	}

	var characterParser = require('character-parser');

	function assertExpression(exp) {
		// this verifies that a JavaScript expression is valid
		// Fix this for php
		return true;
	}

	function assertNestingCorrect(exp) {
		//this verifies that code is properly nested, but allows
		//invalid JavaScript such as the contents of `attributes`
		var res = characterParser(exp)
		if (res.isNesting()) {
			throw new Error('Nesting must match on expression `' + exp + '`')
		}
	}
    
	jade.Lexer.prototype.code = function () {
		var captures;
		if (captures = /^(!?=|-)[ \t]*([^\n]+)/.exec(this.input)) {
			this.consume(captures[0].length);
			var flags = captures[1];
			captures[1] = captures[2];
			var tok = this.tok('code', captures[1]);
			tok.flags = flags;
			tok.escape = flags.charAt(0) === '=';
			tok.buffer = flags.charAt(0) === '=' || flags.charAt(1) === '=';
			if (tok.buffer) assertExpression(captures[1])
			return tok;
		}
	};


	jade.Compiler.prototype.visitCode = function (code) {
		var val = code.val;

 		if (this.pp) {
			this.prettyIndent(1, true);
		}
		this.buffer('<% ' + val + ' %>', false);

		if (code.block) {
			if (!code.buffer) this.buf.push('{');
			this.visit(code.block);
			if (!code.buffer) this.buf.push('}');
		}
	};
};

Modifier.prototype.restorefunc = function() {
	return this.restore.bind(this);
};

Modifier.prototype.restore = function() {
	if (this.jade && this.ex) {
		_backupfuncs(this.ex, this.jade);
	}
};

module.exports = new Modifier();
