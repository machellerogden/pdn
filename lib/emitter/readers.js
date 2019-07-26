'use strict';

function map(data) {
    if (!Array.isArray(data)) throw new SyntaxError('Invalid value for `@map` reader.');
    return data.reduce((acc, v, i, col) => {
        let k;
        [ k, v ] = i % 2
            ? [ col[i - 1], v ]
            : [ v ];
        acc[k] = v == null ? null : v;
        return acc;
    }, {});
}

function sym(data, { GenerateName }) {
    if (typeof data === 'string') return GenerateName(data).next();
    throw new SyntaxError('Invalid symbol name.');
}

module.exports = {
    map,
    sym,
    ':': map,
    '^': sym
};
