#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { compile } = require('./lib/compiler');
const { linebreak, intersperse, stringify } = require('./lib/util');

if (require.main === module) {
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
