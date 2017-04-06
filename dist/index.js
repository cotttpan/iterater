"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function iterate(iterable, pipe, tick = _.tick, done = _.identity) {
    const iterator = iterable[Symbol.iterator]();
    let index = -1;
    const src = iterable;
    const next = (value) => {
        const ir = iterator.next();
        return ir.done ? done(value) : tick(next, pipe(ir.value, ++index, src));
    };
    return next();
}
exports.iterate = iterate;
(function (iterate) {
    function map(iterable, fn = _.identity, tick = _.tick, done = _.identity) {
        const acc = [];
        const pipe = function () {
            acc.push(fn.apply(null, arguments));
            return acc;
        };
        return iterate(iterable, pipe, tick, done);
    }
    iterate.map = map;
    function filter(iterable, fn = _.constant(true), tick = _.tick, done = _.identity) {
        const acc = [];
        const pipe = function () {
            if (fn.apply(null, arguments))
                acc.push(arguments[0]);
            return acc;
        };
        return iterate(iterable, pipe, tick, done);
    }
    iterate.filter = filter;
    function reduce(iterable, fn, init, tick = _.tick, done = _.identity) {
        let acc = init;
        const pipe = function () {
            acc = fn.apply(null, [acc, ...arguments]);
            return acc;
        };
        return iterate(iterable, pipe, tick, done);
    }
    iterate.reduce = reduce;
})(iterate || (iterate = {}));
exports.iterate = iterate;
var _;
(function (_) {
    function identity(value) {
        return value;
    }
    _.identity = identity;
    function existy(v) {
        return !(v === null || v === undefined);
    }
    _.existy = existy;
    function constant(value) {
        return () => value;
    }
    _.constant = constant;
    function tick(next, callbackResult) {
        if (callbackResult && typeof callbackResult.then === 'function') {
            return callbackResult.then(x => next(x));
        }
        return next(callbackResult);
    }
    _.tick = tick;
})(_ = exports._ || (exports._ = {}));
exports.default = iterate;
//# sourceMappingURL=index.js.map