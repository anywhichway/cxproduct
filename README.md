# CXProduct

Very high-speed, low memory Cartesian cross-product as a first class object. Naive cross-products can rapidly consume vast amounts of memory and degrade exponentially in performance. Generator based approaches conserve RAM, but are not performant when non-sequential access is required. `CXProduct` supports virtual Cartesian cross-product creation and use through the use of lazy evaluation, i.e. rows of the cross-product are not created until needed by calling functions.

`CXPProduct` is between 10% and 10x faster than other libraries, depending on the size of the arrays you are combining.

[![Maintainability](https://api.codeclimate.com/v1/badges/5f3da4a0c31e6d0497ea/maintainability)](https://codeclimate.com/github/anywhichway/cxproduct/maintainability)

# Install

```bash
npm install cxproduct
```


# Usage

```javascript
import {CXProduct} from "cxproduct";

const cxproduct = new CXProduct([[1,2],[3,4]]); // [1,3],[1,4],[2,3],[2,4]
cxproduct.forEach((row,i) => console.log(i,row));

for(const row of new CXProduct([[1,2],[3,4]]).asGenerator()) {
    console.log(row) 
}
```

# API

`new CXProduct(arrayOfArrays,{cache}={})` - Creates a virtual Cartesian cross-product based on the arrays. A copy of the top level wrapping array is created, which means the contained arrays are not. This way they can be manipulated (added to, deleted from) by code outside the `CXProduct`. If `cache` is true, then all `get`, `has`, `indexOf` will all cache results. DO NOT modify the arrays with an external program if caching is on unless you call `flush()` each time you make a modification.

The following methods are supported:

`cxproduct.asGenerator()` - Returns a generator equivalent of the CXProduct so you can use `for(item of cxproduct.asGenerator())`. For convenience, the generator also has a `length` property so you can use `const iterable = cxproduct.asGenerator(); for(let i=0;i<iterable.length;i++)`

`cxproduct.asArrayLike()` - Returns a Proxy that behaves like an array of the CXProduct so you can use `const arrayLike = cxproduct.asGnerator(); for(let i=0;i<arrayLike.length;i++)`

`cxproduct.add(array,...)` - Adds the array to the collection of arrays already associated with the CXProduct. Invalidates the cache, if any.

`cxproduct.push(index,element)` - Adds the element to the array at the index in the collection of arrays associated with the CXProduct. Invalidates the cache, if any.

`cxproduct.forEach(callback,{test,cache}={})` - Iterates over the CXProduct and invokes the callback for each row, optionally matching the row against a provided pattern or passing the provided boolean test. The callback takes the signature callback(row,index). The optional `test` has the signature `test(array)` and should return true or false. It is not recommended to loop through the `CXProduct` using get and a counter. The access algorithms are different and the one under `forEach` is optimized for forward moving access rather than random access.

`cxproduct.get(index:number,{test:function,cache:boolean}={})` - Return row as array at index. Allocates memory for the row. Repeated calls will not return the same object. Unless `cache===true` or the `CXProduct` was created with the `cache=true` option.

`cxproduct.has(row:number,{cache:boolean}={})` - Returns `true` if `row` exists and `false` otherwise.

`cxproduct.indexOf(row:number,{cache}={})` - Return index where the row exists, returns -1 if row does not exist

`cxproduct.intersection(cxproduct:CXProduct)` - Returns a new `CXProduct` that is an intersection of the current `CXProduct` with the one provided as an argument

`cxproduct.verify(index:number,row:array,{cache:boolean}={})` - Verifies that the index still contains the row in case the arrays defining the CXProduct have changed.


# Benchmarks

Using a sample size of 100 cycles and a timeout prr cycle of 2000ms:

 - For a 3x3 matrix all tested approaches are within each others +/- range and order of results changes with each full run
 - For a 5x5 matrix `CXProduct` is consistently more than 20% faster than its nearest competitor `fast-cartesion`
 - For a 6x6 matrix `CXProduct` is more that 20% faster than both generator approaches, `@anywhichway/cartesain-product` and `big-cartesian`. The `@anywhichway/cartesain-product` The `naive` and `fast-cartesiona` both timeout.
 - For a 7x7 matrix `CXProduct` is the sole approach that does not timeout when iterating over all combinations.
 - For time to access a combination at a random location in all possible combinations, `CXProduct` is orders of magnitude faster than other solutions at scale.

Matrix sizes:

- 3x3 27
- 5x5 3,125
- 6x6 46,656
- 7x7 823,543

The naive and generator implementations of Cartesian product are below:

```javascript
const naiveCartesian = (arrays) => arrays.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))),[]));

function* generatorCartesian([head, ...tail]) {
  const remainder = tail.length > 0 ? generatorCartesian(tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}
```

The generator version, with a slight enhancement to support the `length` property, is available as [@anywhichway/cartesian-product](https://www.npmjs.com/package/@anywhichway/cartesian-product).

| Basic                                                          | Ops/Sec |    +/- |
|----------------------------------------------------------------|--------:|-------:|
| construct and loop 3x3 naive#                                  |   10182 | 10.80% |
| construct and loop 3x3 @anywhichway/cartesian-product          |   11987 |  4.44% |
| construct and loop 3x3 CXProduct#                              |   12285 |  2.77% |
| construct and loop 3x3 fast-cartesian                          |   11824 |  9.06% |
| construct and loop 3x3 big-cartesian                           |   10593 |  3.51% |
| construct and loop 5x5 naive#                                  |     261 |  1.73% |
| construct and loop 5x5 @anywhichway/cartesian-product          |    2879 |  0.49% |
| construct and loop 5x5 CXProduct#                              |    8461 |  2.62% |
| construct and loop 5x5 fast-cartesian                          |    6451 |  1.39% |
| construct and loop 5x5 big-cartesian                           |    2099 | 20.63% |
| construct and loop 6x6 naive#                                  | Timeout |    N/A |
| construct and loop 6x6 @anywhichway/cartesian-product          |      82 |  3.60% |
| construct and loop 6x6 CXProduct#                              |    1004 |  0.52% |
| construct and loop 6x6 fast-cartesian                          | Timeout |    N/A |
| construct and loop 6x6 big-cartesian                           |      84 |  2.86% |
| construct and loop 7x7 CXProduct#                              |     132 |  1.08% |
| construct and loop 7x7 @anywhichway/cartesian-product          | Timeout |    N/A |
| construct and loop 7x7 big-cartesian                           | Timeout |    N/A |
| construct and random access 6x6 @anywhichway/cartesian-product |     102 | 19.86% |
| construct and random access 6x6 CXProduct#                     |    5559 |  2.35% |
| construct and random access 6x6 big-cartesian                  |     118 | 14.72% |

If you want similar performance for intersection, union, or memoizing also see:

- https://github.com/anywhichway/intersector
- https://github.com/anywhichway/unionizor
- https://github.com/anywhichway/nano-memoize

  For a complete high performance solution to Cartesian product and set operations for Arrays and Sets with a standardized API, plus the addition of the standard map/reduce/find operations to Set see:

- https://github.com/anywhichway/array-set-ops

# Bechmarks Explanation

A naive implementation of Cartesian is O(n) for access to the first combination. It computes the entire set of combinations and then returns the one at the index 0.

Although a generator implementation is fast for access to the first combination since it does not compute all possible combinations, it is O(n) for access to the last combination.

`CXProduct` is O(1) for any specific combination when it is accessed by index; whereas generator functions are O(n), where `n` is the index. This is useful if statistical sampling of the Cartesian product is required. For iterating over all combinations is `CXProduct` is still O(n). However, the function that computes the combination at an index is faster than a generator function, so it still succeeds on a 7x7 matrix with a 2000ms timeout when a generator fails. For small products it seems to be about 10% faster. For large products it seems to be about 10x faster. I think this is because of garbage collection (see below). 

Typically there will be higher performance variability with the generator functions. My hypothesis is this is because they are more likely to use RAM internally and the garbage collector may be invoked between the internal calls to `.next()`. Since the `CXProduct` implementation uses a simple arithmetic function it is unlikely to impact the garbage collector.

# Building & Testing

Building, testing and quality assessment are conducted using Mocha, Chai, Istanbul, Benchtest, Code Climate, and Codacity.

# Updates (reverse chronological order)

2023-04-27 v2.1.4 Documentation enhancements. Fixed potential bug in `asGenerator()` now returns empty iterable if `CXProduct` was created with a zero length array.

2023-02-23 v2.1.3 Documentation updates.

2023-02-15 v2.1.2 Documentation updates.

2023-02-13 v2.1.1 Documentation updates.

2023-02-11 v2.1.0 Added `asGenerator` and `asArrayLike`.

2023-02-11 v2.0.2 Updated documentation.

2023-02-06 v2.0.1 Updated docs. Added `@anywhichway/cartesian-product` as a dev dependency.

2023-02-05 v2.0.0 Switched to module format. Updated performance tests to use `benchtest 3.x`. Corrected issue with undocumented method `intersection`. Added comparisons to `fast-cartesian` and `big-cartesian`.

2020-07-15 v1.0.0 Finally added unit and performance tests! Added caching. Calling interfaces changed to support caching. Added `indexable`.

2020-07-14 v0.0.3 Updated documentation.

2020-06-07 v0.0.2 Updated documentation.

2016-03-30 v0.0.1 First public commit.

# License

This software is provided as-is under the [MIT license](http://opensource.org/licenses/MIT).

# Credits

Credit to Gavin Kistner for the core code: http://phrogz.net/lazy-cartesian-product