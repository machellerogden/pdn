'use strict';

const { tokenize } = require('./tokenizer');
const { parse } = require('./parser');
const { Emitter } = require('./emitter');
const { split } = require('./util');

function Compiler({ readers } = {}) {
    const { emit } = Emitter({ readers });
    const compile = v => emit(parse(tokenize(split(v))));
    return { compile };
}

module.exports = { Compiler };

//leaving this here for now for debugging
//const { split, tap } = require('./util');
//module.exports = { compile: v => emit(tap(parse(tokenize(v)))) };
