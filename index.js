#!/usr/bin/env node
'use strict';

const { EOL } = require('os');
const { nil, Trampoline } = require('./lib/util');
const { SyntaxError } = require('./lib/errors');

const primitives = new Set([ 'string', 'number', 'boolean' ]);
const builtInTypes = {
    obj(...args) {
        return args.reduce((acc, v, i, col) => {
            if (i % 2) acc[col[i - 1]] = v;
            return acc;
        }, {});
    },
    str(arg) {
        return arg;
    }

};

const isDefined = v => v != nil;
const reserved = new Set([EOL, ',', ' ', '[', ']', '(', ')']);
const listStart = new Set(['[', '(']);
const listEnd = new Set([']', ')']);
const isReserved = v => reserved.has(v);
const isListStart = v => listStart.has(v);
const isListEnd = v => listEnd.has(v);
const isWhitespace = v => /[\s\,]/.test(v);

function tokenize(input) {
    const raw = Array.isArray(input)
        ? input.join(' ')
        : raw;

    const chars = raw.split('');
    const result = [];
    let i = 0;
    const drop = () => chars.splice(i, 1);
    const next = () => i++;
    const stack = [ result ];
    const current = () => stack[stack.length - 1];
    const add = (v) => (current().push(v), v);
    const enter = (v) => (next(), stack.push(add(v)), v);
    const exit = () => (next(), stack.pop());

    while (i < chars.length) {

        if (isListStart(chars[i])) {
            enter([]);
            continue;
        }

        if (isListEnd(chars[i])) {
            exit();
            continue;
        }

        if (isWhitespace(chars[i])) {
            drop();
            continue;
        }

        if (isDefined(chars[i]) && !isReserved(chars[i])) {
            let value = '';
            while (isDefined(chars[i]) && !isReserved(chars[i])) value += chars[next()];
            add(value);
            continue;
        }

        add(chars[next()]);

    }

    return result;
}

function Reader({ types:customTypes = {} } = {}) {

    const types = {
        ...builtInTypes,
        ...customTypes
    };


    const parse = Trampoline(function _parse(tokens) {
        return tokens.reduce((acc, token, i, col) => {
            if (Array.isArray(token)) return [ ...acc, parse(token) ];
            const { type, args } = token;
            return [ ...acc, types[type](...args) ];
        }, []);
    });

    function read(input) {
        return parse(tokenize(input));
    }

    return read;
}

module.exports = { Reader };

if (require.main === module) {
    if (process.stdin.isTTY && process.argv[2] == null) return require('./lib/repl').start();
    const data = !process.stdin.isTTY
        ? require('fs').readFileSync(0, 'utf8')
        : null;
    const isCI = require('is-ci')
    const clipboardy = require('clipboardy');
    (async () => {
        try {
            const args = data != null
                ? data
                : process.argv.slice(2).filter(v => /^[^\-]/.test(v));
            const output = JSON.stringify(Reader()(args), null, 4);
            if (!isCI) await clipboardy.write(output);
            process.stdout.write(output);
        } catch (e) {
            console.error(e.stack);
        }
    })();
}
