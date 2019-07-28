'use strict';

const streamify = require('async-stream-generator');
const { Compiler } = require('./compiler');
const {
    linebreak,
    stringify,
    pipe
} = require('./util');

function Reader(opts) {
    const { compile } = Compiler(opts);
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

function read(data = '', opts) {
    const { read } = Reader(opts);
    return read(data);
}

function readToStream(data) {
    return pipe(Compiler().compile, stringify, linebreak, streamify)(data);
}

async function readToArray(data) {
    const results = [];
    for await (const result of read(data)) {
        results.push(result);
    }
    return results;
}

async function readOne(data = '', opts) {
    const { read } = Reader(opts);
    const { value } = await read(data).next();
    return value;
}

module.exports = {
    Reader,
    read,
    readToStream,
    readToArray,
    readOne
};
