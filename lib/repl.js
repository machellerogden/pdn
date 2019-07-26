'use strict';
const { EOL } = require('os');
const { pipe } = require('./util');
const { read } = require('./reader');

async function getEvalResults(iter) {
    const acc = [];
    for await (const v of iter) {
        acc.push(v);
    }
    return { __eval_results__: acc };
}

function start() {
    return require('repl').start({
        eval: (cmd, context, filename, callback) => {
            pipe(read, getEvalResults)(cmd).then(value => callback(null, value));
        },
        writer: ({ __eval_results__ }) => __eval_results__.map(v => require('util').inspect(v, { depth: null, colors: true })).join(EOL)
    });
}

module.exports = {
    start
};
