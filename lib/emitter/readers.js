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

module.exports = {
    env,
    str
};
