#!/usr/bin/env node
'use strict';

const {
    Reader,
    read,
    readToStream,
    readAll,
    readOne
} = module.exports = require('./lib/reader');

module.exports.GenSym = require('./lib/emitter/name').GenSym;

require('streamface').wrap({ readToStream, readAll, module });
