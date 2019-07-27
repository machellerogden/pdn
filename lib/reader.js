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

function readStream(readable) {
    return pipe(Compiler().compile, stringify, linebreak, streamify)(readable);
}

module.exports = {
    Reader,
    read,
    readStream
};
