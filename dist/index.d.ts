declare function iterate<T, R1, R2>(iterable: Iterable<T>, pipe: Pipe<T, R1>, tick: Tick<R1, R2>): R2 | undefined;
declare function iterate<T, R1>(iterable: Iterable<T>, pipe: Pipe<T, R1>, tick?: Tick<R1, R1>): R1 | undefined;
declare namespace iterate {
    function map<T, R1, R2>(iterable: Iterable<T>, fn: Iteratee<T, R1>, tick: Tick<R1[], R2>): R2 | undefined;
    function map<T, R>(iterable: Iterable<T>, fn?: Iteratee<T, R>, tick?: Tick<R[], R[]>): R[] | undefined;
    function filter<T, R>(iterable: Iterable<T>, fn: Iteratee<T, boolean>, tick: Tick<T[], R>): R | undefined;
    function filter<T>(iterable: Iterable<T>, fn?: Iteratee<T, boolean>, tick?: Tick<T[], T[]>): T[] | undefined;
    function reduce<T, R1, R2>(iterable: Iterable<T>, fn: Reducer<R1, T>, init: R1, tick: Tick<R1, R2>): R2 | undefined;
    function reduce<T, R>(iterable: Iterable<T>, fn: Reducer<R, T>, init: R, tick?: Tick<R, R>): R | undefined;
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
