'use strict';

const {
    isSequence,
    isMapIndicator,
    isWhitespace,
    isComment,
    isNumeric,
    isNumericFalsePositive,
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
    isFalse,
    isSigned,
    isNegativeZero,
    isColon,
    isComma,
    isArgvString
} = require('./predicates');

function Tokenizer(opts = {}) {
    const { argv = false } = opts;

    async function* tokenize(lines) {
        let lineNum = 0;

        try {

            for await (const line of lines) {
                lineNum++;

                const chars = line.split('');
                let i = 0;

                const position = () => ({ line: lineNum, col: i });
                const token = (type, value) => ({ type, value, pos: position() });

                while (i < chars.length) {

                    if (isSequence(chars[i])) {
                        let value = chars[i++];
                        if (isMapIndicator(chars[i])) value += chars[i++];
                        yield token('sequence', value);
                        continue;
                    }

                    if (isWhitespace(chars[i])) {
                        let value = chars[i++];
                        yield token('whitespace', value);
                        continue;
                    }

                    if (isComment(chars[i])) {
                        let value = chars[i++];
                        while (chars[i]) value += chars[i++];
                        yield token('comment', value);
                        continue;
                    }

                    if (isNumeric(chars[i]) || (isSigned(chars[i]) && isNumeric(chars[i + 1]))) {
                        let value = chars[i++];
                        if (argv) {
                            while (isArgvString(chars[i])) value += chars[i++];
                            if (isNegativeZero(value)) value = '0';
                            yield isNumericFalsePositive(value)
                                ? token('string', value)
                                : token('number', Number(value));
                            continue;
                        } else {
                            while (isSymbolTail(chars[i])) value += chars[i++];
                        }
                        if (isNegativeZero(value)) value = '0';
                        yield isNumericFalsePositive(value)
                            ? token('string', value)
                            : token('number', Number(value));
                        continue;
                    }

                    if (isSingleQuote(chars[i])) {
                        i++;
                        let value = '';
                        while (isSingleQuoteCont(chars[i], chars[i - 1])) value += chars[i++];
                        i++;
                        yield token('string', value);
                        continue;
                    }

                    if (isDoubleQuote(chars[i])) {
                        i++;
                        let value = '';
                        while (isDoubleQuoteCont(chars[i], chars[i - 1])) value += chars[i++];
                        i++;
                        yield token('string', value);
                        continue;
                    }

                    if (isTagPrefix(chars[i])) {
                        let value = '';
                        i++;
                        while (isSymbolTail(chars[i])) value += chars[i++];
                        yield token('tag', value)
                        continue;
                    }

                    if (isSymbolHead(chars[i])) {
                        let value;
                        value = chars[i++];
                        if (argv) {
                            while (isArgvString(chars[i])) value += chars[i++];
                        } else {
                            while (isSymbolTail(chars[i])) value += chars[i++];
                        }
                        if (value.includes(' ')) {
                            yield token('string', value);
                            continue;
                        }
                        const last = value[value.length - 1];
                        if (isColon(last)) value = value.slice(0, -1);
                        if (isReserved(value)) {
                            if (isNil(value)) {
                                yield token('nil', null);
                            } else if (isTrue(value)) {
                                yield token('bool', true);
                            } else if (isFalse(value)) {
                                yield token('bool', false);
                            }
                        } else if (isGenSymSuffix(last)) {
                            value = value.slice(0, -1);
                            yield token('gensym', value);
                        } else {
                            yield token('name', value);
                        }
                        continue;
                    }

                    const fatalPosition = position();
                    throw new SyntaxError(`Syntax Error at ${argv ? 'arg' : 'line'}: ${fatalPosition.line} col: ${fatalPosition.col}. Unexpected character: '${chars[i]}'`);
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
