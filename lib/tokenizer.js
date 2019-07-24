'use strict';
const nil = void 0;
const brackets = new Set([ '[', ']' ]);
const isBracket = v => brackets.has(v);
const whitespace = /[\s\,]/;
const isWhiteSpace = v => whitespace.test(v);
const isComment = v => v === '^';
const isNumeric = v => /[0-9]/.test(v);
const isNumericPoint = (value, cur, next) => cur && !value.includes('.') && isNumeric(next);
const keywords = new Set([ 'obj', 'arr', 'blah' ]); // TODO: stubbing crap in for now
const isKeyword = v => keywords.has(v);
const isSymbol = v => v != nil && /[a-z]/i.test(v);
const isSingleQuote = v => v === "'";
const isSingleQuoted = (cur, prev) => cur !== "'" || prev === '\\';
const isDoubleQuote = v => v === '"';
const isDoubleQuoted = (cur, prev) => cur !== '"' || prev === '\\';

async function* tokenize(lines) {

    for await (const line of lines) {

        const chars = line.split('');

        let i = 0;
        while (i < chars.length) {

            if (isBracket(chars[i])) {
                yield { type: 'bracket', value: chars[i++] };
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
                while (isSingleQuoted(chars[i], chars[i - 1])) value += chars[i++];
                i++;

                yield { type: 'string', value };
                continue;
            }

            if (isDoubleQuote(chars[i])) {
                i++;
                let value = '';
                while (isDoubleQuoted(chars[i], chars[i - 1])) value += chars[i++];
                i++;

                yield { type: 'string', value };
                continue;
            }

            if (chars[i] === '.') {
                let value = '';
                i++;
                while (chars[i] != null && /[a-z]/i.test(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'member', value };
                continue;
            }

            if (chars[i] === ':') {
                let value = '';
                i++;
                while (chars[i] != null && /[a-z]/i.test(chars[i])) {
                    value += chars[i++];
                }
                yield { type: 'key', value };
                continue;
            }

            if (isSymbol(chars[i])) {
                let value = '';
                while (isSymbol(chars[i])) {
                    value += chars[i++];
                }
                if (isKeyword(value)) {
                    yield { type: 'keyword', value };
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

(async () => {
    for await (const token of tokenize([ '[obj foo', 'bar]' ])) {
        console.log(token);
    }
})();
