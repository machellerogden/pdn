'use strict';

import test from 'ava';
import { read } from '..';

test('works', async t => {
    const input = `
foo
123
123.456
+0
-0
[foo,123,-10.00,true,false,nil,foo^,foo^]
`;
    const expected = [
        'foo',
        123,
        +123.456,
        0,
        0,
        [ 'foo', 123, -10.00, true, false, null, 'foo-1', 'foo-2' ]
    ];
    t.plan(expected.length);
    let i = 0;
    for await (const result of read(input)) {
        t.deepEqual(result, expected[i++]);
    }
});
