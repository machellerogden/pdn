'use strict';

function env(name) {
    if (typeof name != 'string') throw new SyntaxError('Invalid value for `@env` reader.');
    return process.env[name];
}

module.exports = {
    env
};
