#!/usr/bin/env node
'use strict';

const {
    Reader,
    read,
    readToStream,
    readOne
} = module.exports = require('./lib/reader');

const { intersperse } = require('./lib/util');

if (require.main === module) {
    return process.stdin.isTTY
        ? process.argv[2] == null
            ? require('./lib/repl').start()
            : readToStream(intersperse(' ', process.argv.slice(2)).values()).pipe(process.stdout)
        : readToStream(process.stdin).pipe(process.stdout);
}
