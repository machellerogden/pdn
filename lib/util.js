'use strict';

const { EOL } = require('os');

async function* linebreak(statements) {
    for await (const statement of statements) {
        yield `${statement}${EOL}`;
    }
}

async function* stringify(statements) {
    for await (const statement of statements) {
        yield JSON.stringify(statement);
    }
}

// NB, split has no regard for whether an EOL is inside a quoted string or not.
async function* split(chunks) {
    let previous = '';

    for await (const chunk of chunks) {
        previous += chunk;
        let eolIndex;

        while ((eolIndex = previous.indexOf(EOL)) >= 0) {
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
        console.log(EOL, require('util').inspect(chunk, { depth: null, colors: true }), EOL);
        yield chunk;
    }
}

function filterNilKeys(obj) {
    return Object.entries(obj).reduce((acc, [ key, value ]) => {
        if (value != null) acc[key] = value;
        return acc;
    }, {});
}

function pipe(...fns) {
    return x => fns.reduce((v, f) => f(v), x);
}

module.exports = {
    linebreak,
    split,
    tap,
    filterNilKeys,
    Trampoline,
    intersperse,
    stringify,
    pipe
};


// NB, below are no longer unused ... will likely remove
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
    return arr.reduce((a, v) =>
        [ ...(a.length ? [ ...a, delim, ] : []), v ],
        []);
}
