'use strict';

import test from 'ava';
import { read } from '..';

test('works', async t => {
    t.plan(3);
    const expected = [
        'foo',
        'bar',
        'baz'
    ];
    let i = 0;
    for await (const result of read('foo bar baz')) {
        t.deepEqual(result, expected[i++]);
    }
});
