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

/**
 * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns an AsyncIterator.
 *
 * @function read
 * @param {ReadableStream|AsyncIterator|Array|string} input Raw input data
 * @returns {AsyncIterator} Returns an AsyncIterator which yields Promises which resolve to parsed data.
 * @example
 *
 * for await (const result of read('[:foo:123,bar:true,baz:nil]')) {
 *     console.log(result);
 * }
 * // => { foo: 123, bar: true, baz: null }
 *
 */
function read(data = '', opts) {
    const { read } = Reader(opts);
    return read(data);
}

/**
 * Accepts a ReadableStream, an array or a string and returns a WritableStream. Stream output will be utf-8 text. Stream values will be delimited by a system-native newline escape character.
 *
 * @function readToStream
 * @param {ReadableStream|AsyncIterator|Array|string} input Raw input data
 * @returns {WritableStream} Returns a WritableStream Stream output will be utf-8 text. Stream values will be delimited by a system-native newline escape character.
 * @example
 *
 * readToStream('[:foo:123,bar:true,baz:nil]').pipe(process.stdout);
 * // => "{\"foo\":123,\"bar\":true,\"baz\":null}"
 *
 */
function readToStream(data) {
    return pipe(Compiler().compile, stringify, linebreak, streamify)(data);
}

/**
 * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to the first value of the stream.
 *
 * @function readOne
 * @param {ReadableStream|AsyncIterator|Array|string} input Raw input data
 * @returns {WritableStream} Returns a Promise which resolves to the first value of the stream.
 * @example
 *
 * console.log(await readOne('[:foo:123,bar:true,baz:nil]'));
 * // => { foo: 123, bar: true, baz: null }
 */
async function readOne(data = '', opts) {
    const { read } = Reader(opts);
    const { value } = await read(data).next();
    return value;
}

/**
 * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to an array of all values.
 *
 * Note: If a stream or iterator is passed to `readAll` and it does not complete, the Promise returned by this function will never resolve.
 *
 * @function readAll
 * @param {ReadableStream|AsyncIterator|Array|string} input Raw input data
 * @returns {WritableStream} Returns a Promise which resolves to an array of all values.
 * @example
 *
 * console.log(await readAll('[:foo:123,bar:true,baz:nil]'));
 * // => [ { foo: 123, bar: true, baz: null } ]
 */
async function readAll(data) {
    const results = [];
    for await (const result of read(data)) {
        results.push(result);
    }
    return results;
}

module.exports = {
    Reader,
    read,
    readToStream,
    readOne,
    readAll
};
