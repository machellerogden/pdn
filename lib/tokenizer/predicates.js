'use strict';

const brackets = new Set([ '[', ']' ]);
const braces = new Set([ '{', '}' ]);
const parens = new Set([ '(', ')' ]);
const whitespace = /[\s\,]/;

exports.isBracket = v => brackets.has(v);
exports.isBrace = v => braces.has(v);
exports.isParen = v => parens.has(v);
exports.isWhitespace = v => whitespace.test(v);
exports.isComment = v => v === '^';
exports.isNumeric = v => /[0-9]/.test(v);
exports.isNumericPoint = (value, cur, next) => cur && !value.includes('.') && isNumeric(next);
exports.isSymbol = v => v != null && /^[a-z]/i.test(v); // TODO: support more characters
exports.isSingleQuote = v => v === "'";
exports.isSingleQuoteCont = (cur, prev) => cur !== "'" || prev === '\\';
exports.isDoubleQuote = v => v === '"';
exports.isDoubleQuoteCont = (cur, prev) => cur !== '"' || prev === '\\';
exports.isKeyPrefix = v => v === ':';
exports.isTagPrefix = v => v === '@';
