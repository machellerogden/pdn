'use strict';

const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Emitter } = require('./emitter');
const { split, pipe } = require('./util');

function Compiler(opts) {
    const { emit } = Emitter(opts);
    const { tokenize } = Tokenizer(opts);
    const { parse } = Parser(opts);
    const compile = pipe(split, tokenize, parse, emit);
    return { compile };
}

module.exports = { Compiler };

//leaving this here for now for debugging
//const { split, tap } = require('./util');
//module.exports = { compile: v => emit(tap(parse(tokenize(v)))) };
