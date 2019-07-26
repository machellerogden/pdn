#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { Compiler } = require('./lib/compiler');
const { Reader, read } = require('./lib/reader');

const {
    linebreak,
    intersperse,
    stringify,
    pipe
} = require('./lib/util');

module.exports = {
    Reader,
    read
}

if (require.main === module) {
    const { compile } = Compiler();

    const processInputStream = pipe(compile, stringify, linebreak, streamify);

    if (process.stdin.isTTY) {
        return process.argv[2] == null
            ? require('./lib/repl').start()
            : processInputStream(intersperse(' ', process.argv.slice(2)).values()).pipe(process.stdout);
    }

    try {
        processInputStream(process.stdin).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }
}
