import test from 'ava';
import iterate from './../src/index';

const arr = [1, 2, 3];

test('iterate', t => {
    const r = iterate(arr, x => x * 10);
    t.is(r, 30);
});

test('iterate - promise', t => {
    t.plan(1);
    const promisePipe = (v: number) => new Promise<number>((resolve) => {
        setTimeout(() => {
            resolve(v * 10);
        }, 10);
    });
    const promise = iterate(arr, promisePipe);
    return promise!.then(x => t.is(x, 30));
});

test('iterate - tick', t => {
    t.plan(3);
    return iterate(arr, x => x * 10, (next, x) => {
        t.is(typeof x, 'number');
        return next(x);
    });
});

test('.map', t => {
    const r = iterate.map(arr, x => x * 10);
    t.deepEqual(r, [10, 20, 30]);
});

test('.filter', t => {
    const r = iterate.filter(arr, x => x >= 2);
    t.deepEqual(r, [2, 3]);
});

test('.reduce', t => {
    const r = iterate.reduce(arr, (acc, x) => acc + x, 0);
    t.is(r, 6);
});
