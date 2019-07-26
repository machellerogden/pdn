'use strict';

const {
    isBracket,
    isBrace,
    isParen,
    isWhitespace,
    isComment,
    isNumeric,
    isNumericPoint,
    isSymbol,
    isSingleQuote,
    isSingleQuoteCont,
    isDoubleQuote,
    isDoubleQuoteCont,
    isKeyPrefix,
    isTagPrefix
} = require('./predicates');

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

            if (isWhitespace(chars[i])) {
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
