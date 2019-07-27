#!/usr/bin/env node
'use strict';

const { Reader, read, readStream } = require('./lib/reader');
const { intersperse } = require('./lib/util');

module.exports = {
    Reader,
    read,
    readStream
}

if (require.main === module) {
    return process.stdin.isTTY
        ? process.argv[2] == null
            ? require('./lib/repl').start()
            : readStream(intersperse(' ', process.argv.slice(2)).values()).pipe(process.stdout)
        : readStream(process.stdin).pipe(process.stdout);
}
