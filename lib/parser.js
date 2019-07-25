'use strict';

module.exports = { parse };

const initializers = require('./initializers');
const builders = require('./builders');
const isWhiteSpace = t => [ 'whitespace', 'comment' ].includes(t.type);
const listEndTypes = new Set(['bracket', 'brace', 'paren']);
const listEndValues = new Set([']', '}', ')']);
const isListEnd = t => listEndTypes.has(t.type) && listEndValues.has(t.value);

async function* parse(tokens) {

    let ast;
    let stack = [];

    for await (const token of tokens) {

        try {

            if (isWhiteSpace(token)) continue;

            if (isListEnd(token)) {

                stack.pop();

                if (ast != null && stack.length === 0) {
                    let result;
                    [ result, ast ] = [ ast, null ];
                    stack = [];
                    yield result;
                }

                continue;

            }

            let cursor = stack[stack.length - 1];

            let node = typeof initializers[token.type] === 'function'
                ? initializers[token.type](token.value)
                : initializers[token.type][token.value](token.value);

            if (node == null) throw new TypeError(`wtf is a \`${token.type}\``);

            if (cursor && typeof builders[cursor.type] === 'function') {
                builders[cursor.type](node, stack);
            } else if (typeof builders[node.type] !== 'function') {
                yield node;
            }

            if (ast == null) {
                ast = node;
                stack.push(ast);
            }


        } catch (e) {
            console.error('something bad happened', e && e.stack);
        }
    }
}
