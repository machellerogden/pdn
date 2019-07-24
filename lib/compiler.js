'use strict';

const { tokenize } = require('./tokenizer');
const { parse } = require('./parser');
const { emit } = require('./emitter');
const { split } = require('./util');
const compile = v => emit(parse(tokenize(split(v))));

module.exports = { compile };

//leaving this here for now for debugging
//const { split, tap } = require('./util');
//module.exports = { compile: v => emit(tap(parse(tokenize(v)))) };
