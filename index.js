#!/usr/bin/env node
'use strict';

const streamify = require('async-stream-generator');
const { Compiler } = require('./lib/compiler');
const {
    linebreak,
    intersperse,
    stringify,
    pipe
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

    const processInputStream = pipe(compile, stringify, linebreak, streamify);

    if (process.stdin.isTTY) {
        const { EOL } = require('os');

        return process.argv[2] == null
            ? require('repl').start({
                eval: (cmd, context, filename, callback) => {
                    async function expand(iter) {
                        const acc = [];
                        for await (const v of iter) {
                            acc.push(v);
                        }
                        return { __eval_results__: acc };
                    }
                    pipe(read, expand)(cmd).then(value => callback(null, value));
                },
                writer: ({ __eval_results__ }) => __eval_results__.map(v => require('util').inspect(v, { depth: null, colors: true })).join(EOL)
            })
            : processInputStream(intersperse(' ', process.argv.slice(2)).values()).pipe(process.stdout);
    }

    try {
        processInputStream(process.stdin).pipe(process.stdout);
    } catch (e) {
        console.log(e && e.stack || e);
    }
}
