'use strict';
const nil = void 0;
const brackets = new Set([ '[', ']' ]);
const braces = new Set([ '{', '}' ]);
const parens = new Set([ '(', ')' ]);
const isBracket = v => brackets.has(v);
const isBrace = v => braces.has(v);
const isParen = v => parens.has(v);
const whitespace = /[\s\,]/;
const isWhiteSpace = v => whitespace.test(v);
const isComment = v => v === '^';
const isNumeric = v => /[0-9]/.test(v);
const isNumericPoint = (value, cur, next) => cur && !value.includes('.') && isNumeric(next);
const isSymbol = v => v != nil && /^[a-z]/i.test(v); // TODO: support more characters
const isSingleQuote = v => v === "'";
const isSingleQuoteCont = (cur, prev) => cur !== "'" || prev === '\\';
const isDoubleQuote = v => v === '"';
const isDoubleQuoteCont = (cur, prev) => cur !== '"' || prev === '\\';
const isKeyPrefix = v => v === ':';
const isTagPrefix = v => v === '@';

async function* tokenize(lines) {

    for await (const line of lines) {

        const chars = line.split('');

        let i = 0;
        while (i < chars.length) {

            if (isBracket(chars[i])) {
                yield { type: 'bracket', value: chars[i++] };
                continue;
            }

            if (isBrace(chars[i])) {
                yield { type: 'brace', value: chars[i++] };
                continue;
            }

            if (isParen(chars[i])) {
                yield { type: 'paren', value: chars[i++] };
                continue;
            }

            if (isWhiteSpace(chars[i])) {
                i++;
                yield { type: 'whitespace' };
                continue;
            }

            if (isComment(chars[i])) {
                let value = '';
                while (chars[i]) {
                    value += chars[i++];
                }
                yield { type: 'comment', value };
                continue;
            }

            if (isNumeric(chars[i])) {
                let value = '';
                while (isNumeric(chars[i]) || isNumericPoint(value, chars[i], chars[i + 1])) {
                    value += chars[i++];
                }
                yield { type: 'number', value: Number(value) };
                continue;
            }

            if (isSingleQuote(chars[i])) {
                i++;
                let value = '';
                while (isSingleQuoteCont(chars[i], chars[i - 1])) value += chars[i++];
                i++;

                yield { type: 'string', value };
                continue;
            }

            if (isDoubleQuote(chars[i])) {
                i++;
                let value = '';
                while (isDoubleQuoteCont(chars[i], chars[i - 1])) value += chars[i++];
                i++;

                yield { type: 'string', value };
                continue;
            }

            if (isKeyPrefix(chars[i])) {
                let value = '';
                i++;
                while (isSymbol(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'key', value };
                continue;
            }

            if (isTagPrefix(chars[i])) {
                let value = '';
                i++;
                while (isSymbol(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'tag', value };
                continue;
            }

            if (isSymbol(chars[i])) {
                let value = '';
                while (isSymbol(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'name', value };
                continue;
            }

            i++;

        }
    }
}

module.exports = { tokenize };
