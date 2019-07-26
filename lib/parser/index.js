'use strict';

module.exports = { parse };

const {
    isWhitespace,
    isListStart,
    isListEnd
} = require('./predicates');

const initializers = require('./initializers');
const builders = require('./builders');

async function* parse(tokens) {

    let ast;
    let result;
    let stack = [];

    for await (const token of tokens) {

        try {

            if (isWhitespace(token)) continue;

            if (isListEnd(token)) {
                stack.pop();
            } else {
                let cursor = stack[stack.length - 1];

                let node = typeof initializers[token.type] === 'function'
                    ? initializers[token.type](token.value)
                    : initializers[token.type][token.value](token.value);

                if (node == null) {
                    throw new SyntaxError(`Unknown token type: \`${token.type}\``);
                }

                if (cursor && typeof builders[cursor.type] === 'function') {
                    builders[cursor.type](node, stack);
                } else if (token.type === 'tag' || isListStart(token)) {
                    stack.push(node);
                }

                if (ast == null) {
                    ast = node;
                }
            }

            if (ast != null && stack.length === 0) {
                [ result, ast ] = [ ast, null ];
                stack = [];
                yield result;
            }

        } catch (e) {
            console.error('Something went wrong', e && e.stack);
        }
    }
}
