'use strict';

const {
    Reader,
    read,
    readToStream,
    readOne
} = require('..');

const data = '[:foo:123,bar:true,baz:nil]';

(async () => {

    // `read` accepts a ReadableStream, an AsyncIterator, an array or a string and returns an AsyncIterator.
    for await (const result of read(data)) {
        console.log(result);
    }

    // `readToStream` accepts a ReadableStream, an array or a string and returns an WritableStream.
    readToStream(data).pipe(process.stdout);

    // `readOne` accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to the first value of the stream.
    console.log(await readOne(data));

})();
