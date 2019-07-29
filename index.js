#!/usr/bin/env node
'use strict';

const {
    Reader,
    read,
    readToStream,
    readOne
} = module.exports = require('./lib/reader');

if (require.main === module) {
    return process.stdin.isTTY
        ? process.argv[2] == null
            ? require('./lib/repl').start()
            : readToStream(process.argv.slice(2).join(' ')).pipe(process.stdout)
        : readToStream(process.stdin).pipe(process.stdout);
}
