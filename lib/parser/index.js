'use strict';

const {
    isWhitespace,
    isListStart,
    isListEnd,
    isTag
} = require('./predicates');

const initializers = require('./initializers');
const builders = require('./builders');

function Parser(opts = {}) {
    const { argv = false } = opts;

    async function* parse(tokens) {

        try {

            let ast;
            let result;
            let stack = [];
            let lastToken;

            for await (const token of tokens) {
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
                    } else if (isTag(token) || isListStart(token)) {
                        stack.push(node);
                    }

                    if (ast == null) {
                        ast = node;
                    }
                }

                if (ast != null && stack.length === 0) {
                    [ result, ast ] = [ ast, null ];
                    result.validate();
                    stack = [];
                    yield result;
                }

                lastToken = token;
            }

            if (stack.length > 0) throw new SyntaxError(`Syntax Error at ${argv ? 'arg' : 'line'}: ${lastToken.pos.line} col: ${lastToken.pos.col}. Unbalanced ${stack[stack.length - 1].type}.`);

        } catch (e) {
            console.error(e & e.stack || e);
        }
    }

    return { parse };
}

module.exports = { Parser };
