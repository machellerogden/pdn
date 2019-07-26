'use strict';

const sequence = new Set([ '[', ']', '{', '}', '(', ')' ]);
const whitespace = /[\s\,]/;

exports.isSequence = v => sequence.has(v);
exports.isMapIndicator = v => v === ':';
exports.isWhitespace = v => whitespace.test(v);
exports.isComment = v => v === '^';
exports.isNumeric = v => /[0-9]/.test(v);
exports.isNumericPoint = (value, cur, next) => cur && !value.includes('.') && isNumeric(next);
exports.isSymbol = v => v != null && /^[a-z]/i.test(v); // TODO: support more characters
exports.isSingleQuote = v => v === "'";
exports.isSingleQuoteCont = (cur, prev) => cur !== "'" || prev === '\\';
exports.isDoubleQuote = v => v === '"';
exports.isDoubleQuoteCont = (cur, prev) => cur !== '"' || prev === '\\';
exports.isTagPrefix = v => v === '@';
exports.isGenSymSuffix = v => v === '^';
exports.isNil = v => v === 'nil';
