/**
 * modifier.js
 * part of jade4jsp, the sample modifier for jade.
 * Written by "Hiroyoshi Kurohara<kurohara@yk.rim.or.jp>".
 *
 */

function inherit(me, parent) {
	for (var key in parent.prototype) {
		me.prototype[key] = parent.prototype[key];
	}
    me.prototype.constructor = me;
    me.prototype.super = parent.prototype;
}

/**
 * make copy of self to temporary parent.
 * then make itself subclass.
 */
function selfsubclass(self, tmpparent) {
	for (var key in self.prototype) {
		tmpparent.prototype[key] = self.prototype[key];
	}
    self.prototype.super = tmpparent.prototype;
}

function hasParent(jade) {
	return jade.Compiler.super;
}

function isParentOurs(jade) {
	return jade.Compiler.super == Compiler.prototype;
}


//
// subclasses for jade classes.
var Compiler = function Compiler() {
};

var Lexer = function Lexer() {
};

var Parser = function Parser() {
};

//
// The Modifier Class.
var Modifier = function Modifier() {
	this.Compiler = Compiler;
	this.Lexer = Lexer;
	this.Parser = Parser;
};

Modifier.prototype.Modifier = Modifier;

Modifier.prototype.override = function(jade) {
	// for debug purpose
	var sys = require('sys');

	var isConstant = require('constantinople');

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

Modifier.prototype.init = function(jade) {
	this.jade = jade;
	if (!hasParent(jade) || !isParentOurs(jade)) {
		selfsubclass(jade.Compiler, Compiler);
		selfsubclass(jade.Lexer, Lexer);
		selfsubclass(jade.Parser, Parser);
	
		this.override(jade);
	}
};

Modifier.prototype.restore = function() {
	[ 'Compiler', 'Lexer', 'Parser' ].forEach(function(objname) {
		for (key in this.jade[objname].prototype) {
			this.jade[objname].prototype[key] = this.jade[objname].prototype.super[key];
		}
	}.bind(this));
};
 
module.exports = new Modifier();
