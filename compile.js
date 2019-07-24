#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { compile } = require('./lib/compiler');
const { linebreak } = require('./lib/util');

if (require.main === module) {
    if (process.stdin.isTTY && process.argv[2] == null) {
        return require('repl').start({
            input: streamify(linebreak(compile(process.stdin))),
            output: process.stdout
        });
    }

    try {
        streamify(compile(process.stdin)).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }

}
