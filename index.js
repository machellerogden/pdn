#!/usr/bin/env node
'use strict';

const { EOL } = require('os');
const { nil, Trampoline } = require('./lib/util');
const { SyntaxError } = require('./lib/errors');
const { createNameFactory } = require('./lib/names');

function getArgs(arg, type, args) {
    return !arg.startsWith('@')
        ? [ arg ]
        : [ ...args ];
}

const isDefined = v => v != nil;
const reserved = new Set([EOL, ',', ' ', '[', ']', '(', ')']);
const listStart = new Set(['[', '(']);
const listEnd = new Set([']', ')']);
const isReserved = v => reserved.has(v);
const isListStart = v => listStart.has(v);
const isListEnd = v => listEnd.has(v);
const isWhitespace = v => /[\s\,]/.test(v);

function Reader() {
    const NameFactory = createNameFactory(); 

    const createTokens = Trampoline(function _createTokens(arg) {
        if (Array.isArray(arg)) return arg.map(createTokens);
        if (typeof arg === 'object') return arg;
        const {
            groups: {
                type = 'string',
                raw
            } = {}
        } = arg.match(/^@(?<type>[^\/]+)\/?(?<raw>.+)?/) || {};

        const [
            name = NameFactory(type).next(),
            ...args
        ] = getArgs(arg, type, raw
            ? raw.split(':')
            : []);

        return { name, type, args };
    });

    function read(input) {
        input = Array.isArray(input)
            ? input
            : [ input ]
        const structured = input.reduce((acc, raw) => {
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

            return [ ...acc, ...result ];
        }, []);

        return structured.map(createTokens);
    }

    return { read };
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
            const output = JSON.stringify(Reader().read(args), null, 4);
            if (!isCI) await clipboardy.write(output);
            process.stdout.write(output);
        } catch (e) {
            console.error(e.stack);
        }
    })();
}
