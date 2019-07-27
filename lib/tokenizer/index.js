'use strict';

const {
    isSequence,
    isMapIndicator,
    isWhitespace,
    isComment,
    isNumeric,
    isNumericPoint,
    isSymbolHead,
    isSymbolTail,
    isSingleQuote,
    isSingleQuoteCont,
    isDoubleQuote,
    isDoubleQuoteCont,
    isTagPrefix,
    isGenSymSuffix,
    isReserved,
    isNil,
    isTrue,
    isFalse
} = require('./predicates');

function Tokenizer() {

    async function* tokenize(lines) {

        try {

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
                        while (isSymbolTail(chars[i])) {
                            value += chars[i++];
                        }
                        yield { type: 'tag', value };
                        continue;
                    }

                    if (isSymbolHead(chars[i])) {
                        let value = chars[i++];
                        while (isSymbolTail(chars[i])) {
                            value += chars[i++];
                        }
                        if (isReserved(value)) {
                            if (isNil(value)) {
                                yield { type: 'nil', value: null };
                            } else if (isTrue(value)) {
                                yield { type: 'bool', value: true };
                            } else if (isFalse(value)) {
                                yield { type: 'bool', value: false };
                            }
                        } else if (isGenSymSuffix(chars[i])) {
                            i++;
                            yield { type: 'gensym', value };
                        } else {
                            yield { type: 'name', value };
                        }
                        continue;
                    }

                    throw new SyntaxError(`Unexpected character: '${chars[i]}'`);
                }
            }

        } catch (e) {
            console.error(e.stack);
            process.exit(1);
        }
    }

    return { tokenize };
}

module.exports = { Tokenizer };
