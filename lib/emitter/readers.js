'use strict';

function env(name) {
    if (typeof name != 'string') throw new SyntaxError('Invalid value for `@env` reader.');
    return process.env[name];
}

function str(data) {
    if (typeof data == 'string') return data;
    if (Array.isArray(data)) return data.join('');
    throw new SyntaxError('Invalid value of `@str` reader.');
}

function join(data) {
    if (typeof data == 'string') return data;
    if (Array.isArray(data)) {
        if (Array.isArray(data[1])) return data[1].join(data[0]);
        return data.join(' ');
    }
    throw new SyntaxError('Invalid value of `@join` reader.');
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
    join,
    sq,
    dq
};
