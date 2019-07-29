'use strict';
const { EOL } = require('os');
const { pipe } = require('./util');
const { read } = require('./reader');
const { inspect } = require('util');

function pprint(v) {
    return inspect(v, { depth: null, colors: true });
}

async function getEvalResults(iter) {
    const acc = [];
    for await (const v of iter) {
        acc.push(v);
    }
    return { __eval_results__: acc };
}

function writer({ __eval_results__ }) {
    return __eval_results__.map(pprint).join(EOL);
}

function _eval(cmd, context, filename, callback) {
    return pipe(read, getEvalResults)(cmd)
        .then(value => callback(null, value));
}

function start() {
    return require('repl').start({
        eval: _eval,
        writer
    });
}

module.exports = {
    start
};
