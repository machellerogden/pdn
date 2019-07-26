#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { Compiler } = require('./lib/compiler');
const { linebreak, intersperse, stringify } = require('./lib/util');

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
    if (process.stdin.isTTY) {
        if (process.argv[2] == null) {
            return require('repl').start({
                input: streamify(linebreak(stringify(compile(process.stdin)))),
                output: process.stdout
            });
        } else {
            // TODO: perf test intersperse vs linebreak
            //return streamify(compile(intersperse(' ', process.argv.slice(2)).values())).pipe(process.stdout);
            return streamify(stringify(compile(linebreak(process.argv.slice(2).values())))).pipe(process.stdout);
        }
    }

    try {
        streamify(stringify(compile(process.stdin))).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }
}
