'use strict';

const listTypes = new Set(['bracket', 'brace', 'paren']);
const listStartValues = new Set(['[', '{', '(']);
const listEndValues = new Set([']', '}', ')']);

exports.isWhitespace = t => [ 'whitespace', 'comment' ].includes(t.type);
exports.isListStart = t => listTypes.has(t.type) && listStartValues.has(t.value);
exports.isListEnd = t => listTypes.has(t.type) && listEndValues.has(t.value);
