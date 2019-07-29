'use strict';

const isListType = v => v === 'sequence';
const listStartValues = new Set(['[', '{', '(', '[:', '(:']);
const listEndValues = new Set([']', '}', ')']);

exports.isWhitespace = t => [ 'whitespace', 'comment' ].includes(t.type);
exports.isListStart = t => isListType(t.type) && listStartValues.has(t.value);
exports.isListEnd = t => isListType(t.type) && listEndValues.has(t.value);
exports.isTag = t => t.type === 'tag';
