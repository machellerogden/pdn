'use strict';

const {
    Reader,
    read,
    readToStream,
    readOne,
    readAll
} = require('..');

(async () => {

    /**
     * `read`
     *
     * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns an AsyncIterator.
     */
    for await (const result of read('[:foo:123,bar:true,baz:nil]')) {
        console.log(result);
    }
    // => { foo: 123, bar: true, baz: null }
    //
    for await (const result of read('@join [foo bar baz]', {
        readers: {
            join: el => el.join('-')
        }
    })) {
        console.log(result);
    }
    // => foo-bar-baz

    /**
     * `readOne`
     *
     * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to the first value of the stream.
     */
    console.log(await readOne('[:foo:123,bar:true,baz:nil]'));
    // => { foo: 123, bar: true, baz: null }
    console.log(await readOne('@join [foo bar baz]', {
        readers: {
            join: el => el.join('-')
        }
    }));
    // => foo-bar-baz

    /**
     * `readAll`
     *
     * Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to an array of all values.
     *
     * Note: If a stream or iterator is passed to `readAll` and it does not complete, the Promise returned by this function will never resolve.
     */
    console.log(await readAll('[:foo:123,bar:true,baz:nil]'));
    // => [ { foo: 123, bar: true, baz: null } ]
    console.log(await readAll('@join [foo bar baz]', {
        readers: {
            join: el => el.join('-')
        }
    }));
    // => [ 'foo-bar-baz' ]

    /**
     * `readToStream`
     *
     * Accepts a ReadableStream, an array or a string and returns a WritableStream. Stream output will be utf-8 text. Stream values will be delimited by a system-native newline escape character.
     */
    readToStream('[:foo:123,bar:true,baz:nil]').pipe(process.stdout);
    // => {"foo":123,"bar":true,"baz":null}
    readToStream('@join [foo bar baz]', {
        readers: {
            join: el => el.join('-')
        }
    }).pipe(process.stdout);
    // => "foo-bar-baz"

})();
