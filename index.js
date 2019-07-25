#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { compile } = require('./lib/compiler');
const { linebreak, intersperse } = require('./lib/util');

if (require.main === module) {
    if (process.stdin.isTTY) {
        if (process.argv[2] == null) {
            return require('repl').start({
                input: streamify(linebreak(compile(process.stdin))),
                output: process.stdout
            });
        } else {
            return streamify(compile(intersperse(' ', process.argv.slice(2)).values())).pipe(process.stdout);
        }
    }

    try {
        streamify(compile(process.stdin)).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }
}
