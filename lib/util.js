'use strict';

exports.nil = void 0;
exports.linebreak = linebreak;
exports.split = split;
exports.tap = tap;
exports.filterNilKeys = filterNilKeys;
exports.Trampoline = Trampoline;
exports.intersperse = intersperse;
exports.stringify = stringify;

async function* linebreak(statements) {
    for await (const statement of statements) {
        yield `${statement}\n`;
    }
}

async function* stringify(statements) {
    for await (const statement of statements) {
        yield JSON.stringify(statement);
    }
}

async function* split(chunks) {
    let previous = '';

    for await (const chunk of chunks) {
        previous += chunk;
        let eolIndex;

        while ((eolIndex = previous.indexOf('\n')) >= 0) {
            const line = previous.slice(0, eolIndex);
            yield line;
            previous = previous.slice(eolIndex + 1);
        }
    }

    if (previous.length > 0) {
        yield previous;
    }
}

async function* tap(chunks) {
    for await (const chunk of chunks) {
        console.log('\n', require('util').inspect(chunk, { depth: null, colors: true }), '\n');
        yield chunk;
    }
}

function filterNilKeys(obj) {
    return Object.entries(obj).reduce((acc, [ key, value ]) => {
        if (value != exports.nil) acc[key] = value;
        return acc;
    }, {});
}

function Trampoline(fn) {
    return function trampoline(...args) {
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}

function intersperse(delim, arr) {
    return arr.reduce((a, v) => [ ...(a.length ? [ ...a, delim, ] : []), v ], []);
}
