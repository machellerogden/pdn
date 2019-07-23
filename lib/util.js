'use strict';

const nil = void 0;

function filterNilKeys(obj) {
    return Object.entries(obj).reduce((acc, [ key, value ]) => {
        if (value != nil) acc[key] = value;
        return acc;
    }, {});
}

function Trampoline(fn) {
    return function trampoline(...args) {
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}

module.exports = {
    nil,
    filterNilKeys,
    Trampoline
};
