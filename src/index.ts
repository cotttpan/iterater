function iterate<T, R1, R2>(iterable: Iterable<T>, pipe: Pipe<T, R1>, tick: Tick<R1, R2>): R2 | undefined;
function iterate<T, R1>(iterable: Iterable<T>, pipe: Pipe<T, R1>, tick?: Tick<R1, R1>): R1 | undefined;
function iterate<T>(iterable: Iterable<T>, pipe: Function, tick: Function = _.tick) {
    const iterator = iterable[Symbol.iterator]();
    let index = -1;
    const src = iterable;

    const next = (value?: any) => {
        const ir = iterator.next();
        return ir.done ? value : tick(next, pipe(ir.value, ++index, src));
    };

    return next();
}

namespace iterate {
    export function map<T, R1, R2>(iterable: Iterable<T>, fn: Iteratee<T, R1>, tick: Tick<R1[], R2>): R2 | undefined;
    export function map<T, R>(iterable: Iterable<T>, fn?: Iteratee<T, R>, tick?: Tick<R[], R[]>): R[] | undefined;
    export function map<T>(iterable: Iterable<T>, fn: Function = _.identity, tick: Tick<any, any> = _.tick) {
        const acc: any[] = [];
        const pipe = function () {
            acc.push(fn.apply(null, arguments));
            return acc;
        };
        return iterate(iterable, pipe, tick);
    }


    export function filter<T, R>(iterable: Iterable<T>, fn: Iteratee<T, boolean>, tick: Tick<T[], R>): R | undefined;
    export function filter<T>(iterable: Iterable<T>, fn?: Iteratee<T, boolean>, tick?: Tick<T[], T[]>): T[] | undefined;
    export function filter<T>(iterable: Iterable<T>, fn: Function = _.constant(true), tick: Tick<T[], T[]> = _.tick) {
        const acc: any[] = [];
        const pipe = function () {
            if (fn.apply(null, arguments)) acc.push(arguments[0]);
            return acc;
        };

        return iterate(iterable, pipe, tick);
    }


    export function reduce<T, R1, R2>(iterable: Iterable<T>, fn: Reducer<R1, T>, init: R1, tick: Tick<R1, R2>): R2 | undefined;
    export function reduce<T, R>(iterable: Iterable<T>, fn: Reducer<R, T>, init: R, tick?: Tick<R, R>): R | undefined;
    export function reduce<T>(iterable: Iterable<T>, fn: Function, init: any, tick: Tick<any, any> = _.tick) {
        let acc = init;
        const pipe = function () {
            acc = fn.apply(null, [acc, ...arguments]);
            return acc;
        };
        return iterate(iterable, pipe, tick);
    }

}

namespace _ {
    export function identity<T>(value: T) {
        return value;
    }
    export function existy(v: any) {
        return !(v === null || v === undefined);
    }
    export function constant<T>(value: T) {
        return () => value;
    }
    export function tick<T>(next: Function, callbackResult: T | Promise<T>) {
        if (callbackResult && typeof (callbackResult as any).then === 'function') {
            return (callbackResult as Promise<any>).then(x => next(x));
        }
        return next(callbackResult);
    }
}

export interface Reducer<T, U> {
    (acc: T, value: U, index: number, src: Iterable<U>): T;
}
export interface Iteratee<T, R> {
    (value: T, index: number, src: Iterable<T>): R;
}
export interface Pipe<A, R> {
    (arg: A, index: number, src: Iterable<A>): R;
}
export interface Tick<A, R> {
    (next: <R>(arg: R) => R, arg: A): R | void;
}

export default iterate;
export { iterate };
