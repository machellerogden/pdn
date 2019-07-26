'use strict';

const {
    isSequence,
    isMapIndicator,
    isWhitespace,
    isComment,
    isNumeric,
    isNumericPoint,
    isSymbol,
    isSingleQuote,
    isSingleQuoteCont,
    isDoubleQuote,
    isDoubleQuoteCont,
    isTagPrefix,
    isGenSymSuffix,
    isNil
} = require('./predicates');

async function* tokenize(lines) {

    for await (const line of lines) {

        const chars = line.split('');

        let i = 0;
        while (i < chars.length) {

            if (isSequence(chars[i])) {
                let value = chars[i++];
                if (isMapIndicator(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'sequence', value };
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
                let value = chars[i++];
                while (isSymbol(chars[i])) {
                    value += chars[i++];
                }
                if (isGenSymSuffix(chars[i])) {
                    i++;
                    yield { type: 'gensym', value };
                } else if (isNil(value)) {
                    yield { type: 'nil', value: null };
                } else {
                    yield { type: 'name', value };
                }
                continue;
            }

            i++;

        }
    }
}

module.exports = { tokenize };
