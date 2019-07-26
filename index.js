#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { Compiler } = require('./lib/compiler');
const {
    linebreak,
    intersperse,
    stringify,
    compose
} = require('./lib/util');

function Reader({ readers } = {}) {
    const { compile } = Compiler({ readers });
    function read(data) {
        const input = data[Symbol.asyncIterator]
            ? input
            : Array.isArray(data)
                ? data.values()
                : [ data ].values();
        return compile(linebreak(input));
    }
    return { read };
}

function read(data = '', { readers } = {}) {
    const { read } = Reader({ readers });
    return read(data);
}

module.exports = {
    Reader,
    read
}

if (require.main === module) {
    const { compile } = Compiler();

    const processInputStream = compose(streamify, linebreak, stringify, compile);

    if (process.stdin.isTTY) {

        return process.argv[2] == null
            ? require('repl').start({
                input: processInputStream(process.stdin),
                output: process.stdout
            })
            : processInputStream(intersperse(' ', process.argv.slice(2)).values()).pipe(process.stdout);
    }

    try {
        processInputStream(process.stdin).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }
}
