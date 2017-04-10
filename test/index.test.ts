import test from 'ava';
import * as i from './../src/index';

const arr = [1, 2, 3];

test('iterate', t => {
    const r = i.iterate(arr, x => x * 10);
    t.is(r, 30);
});

test('iterate - promise', t => {
    t.plan(1);
    const promisePipe = (v: number) => new Promise<number>((resolve) => {
        setTimeout(() => {
            resolve(v * 10);
        }, 10);
    });
    const promise = i.iterate(arr, promisePipe);
    return promise!.then(x => t.is(x, 30));
});

test('iterate - tick', t => {
    t.plan(3);
    return i.iterate(arr, x => x * 10, (next, x) => {
        t.is(typeof x, 'number');
        return next(x);
    });
});

test('iterate - done', t => {
    t.plan(2);
    const pipe = (x: number) => x * 10;
    const done = (x: number) => {
        t.is(x, 30);
        return x;
    };
    const r = i.iterate(arr, pipe, i.tick, done);
    t.is(r, 30);
});

test('.map', t => {
    const r = i.iterate.map(arr, x => x * 10);
    t.deepEqual(r, [10, 20, 30]);
});

test('.filter', t => {
    const r = i.iterate.filter(arr, x => x >= 2);
    t.deepEqual(r, [2, 3]);
});

test('.reduce', t => {
    const r = i.iterate.reduce(arr, (acc, x) => acc + x, 0);
    t.is(r, 6);
});
