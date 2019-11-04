'use strict';

function env(name) {
    if (typeof name != 'string') throw new SyntaxError('Invalid value for `@env` reader.');
    return process.env[name];
}

function str(data) {
    if (typeof data == 'string') return data;
    if (Array.isArray(data)) return data.join(' ');
    throw new SyntaxError('Invalid value of `@str` reader.');
}

function str0(data) {
    if (typeof data == 'string') return data;
    if (Array.isArray(data)) return data.join('');
    throw new SyntaxError('Invalid value of `@str` reader.');
}

function sq(data) {
    if (typeof data == 'string') return `'${data}'`;
    throw new SyntaxError('Invalid value of `@sq` reader.');
}

function dq(data) {
    if (typeof data == 'string') return `"${data}"`;
    throw new SyntaxError('Invalid value of `@dq` reader.');
}

module.exports = {
    env,
    str,
    str0,
    sq,
    dq
};
