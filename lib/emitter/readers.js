'use strict';

function obj(data) {
    if (!Array.isArray(data)) throw new SyntaxError('Invalid value for `@obj` reader.');
    return data.reduce((acc, v, i, col) => {
        let k;
        [ k, v ] = i % 2
            ? [ col[i - 1], v ]
            : [ v ];
        acc[k] = v == null ? null : v;
        return acc;
    }, {});
}

function env(name) {
    if (typeof name != 'string') throw new SyntaxError('Invalid value for `@env` reader.');
    return process.env[name];
}

module.exports = {
    obj,
    env
};
