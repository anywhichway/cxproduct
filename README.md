# CXProduct

Cartesian cross-product as a first class object. Naive cross-products can rapidly consume vast amounts of memory and degrade exponentially in performance. Generator based
approaches conserve RAM, but are not typically performant. CXProduct supports high-speed, low memory virtual Cartesian cross-product creation and use through the use of 
lazy evaluation, i.e. rows of the cross-product are not created until needed by calling functions.

# Install

npm install cxproduct

Browser code can also be found in the browser directory at https://github.com/anywhichway/browser.

# Documentation

new CXProduct(arrayOfArrays,{cache}={}) - Creates a virtual Cartesian cross-product based on the arrays. A copy of the top level wrapping array is created, 
which means the contained arrays are not. This way they can be manipulated (added to, deleted from) by code outside the `CXProduct`. If `cache` is true, then
all `get`, `has`, `indexOf` will all cache results. DO NOT modify the arrays with an external program if caching is on unless you call `flush()` each time you
make a modification.

The following methods are supported:

`.add(array,...)` - Adds the array to the collection of arrays already associated with the CXProduct. Invalidates the cache, if any.

`.push(index,element)` - Adds the element to the array at the index in the collection of arrays associated with the CXProduct. Invalidates the cache, if any.

`.forEach(callback,{test,cache}={})` - Iterates over the CXProduct and invokes the callback for each row, optionally matching the row against a provided pattern or passing the provided boolean test.
The callback takes the signature callback(row,index). The optional `test` has the signature `test(array)` and should return true or false. It is not recommended to loop through the `CXProduct` using
get and a counter. The access algorithms are different and the one under `forEach` is optimized for forward moving access rather than random access.

`.get(index,{test,cache}={})` - Return row at index. Allocates memory for the row. Repeated calls will not return the same object. Unless `cache===true` or the `CXProduct` was created with the
 `cache=true` option, no cache is created with the CXProduct since underlying collections may be changed by application code in a manner than changes the nature of the `CXProduct`.

`.has(row,{cache}={})` - Returns `true` if `row` exists and `false` otherwise.

`.indexable()` - Returns a Proxy that can be index accessed like an array. Note, this will be a lot slower than `.forEach` if you are trying to iterate.

`.indexOf(row,{cache}={})` - Return index where the row exists, returns -1 if row does not exist

`.intersection(cxproduct)` - Returns a new CXProduct that is an intersection of the current CXProduct with the one provided as an argument

`.verify(index,row,{cache}={})` - Verifies that the index still contains the row in case the arrays defining the CXProduct have changed.

# Performance

CXProduct is more performant than naive cross-product generation from a memory and speed perspective once the matrix is larger than 5x5. It is more performant than a generator
approach once a matrix is larger than 3x3. At 3x3 performance is almost indistinguishable due to clock timing in JavaScript.

| Basic                                |  Ops/Sec |      +/- |  Min |      Max | Sample |
| ------------------------------------ | --------:| --------:| ----:| --------:| ------:|
| construct  5x5  naive#               |      239 |       24 |   56 | Infinity |    100 |
| construct  5x5 generator#            | Infinity | Infinity | 1786 | Infinity |    100 |
| construct  5x5 CXProduct#            | Infinity | Infinity | 4082 | Infinity |    100 |
| naive  5x5 forEach#                  |      396 |       40 |   40 | Infinity |    100 |
| generator  5x5 forEach#              | Infinity | Infinity |   29 | Infinity |    100 |
| CXProduct  5x5 forEach#              |      372 |       37 |  171 | Infinity |    100 |
| construct and iterate 3x3 naive#     | Infinity | Infinity |  962 | Infinity |    100 |
| construct and iterate 3x3 generator# | Infinity | Infinity | 1923 | Infinity |    100 |
| construct and iterate 3x3 CXProduct# | Infinity | Infinity | 2597 | Infinity |    100 |
| construct and iterate 5x5 naive#     |       26 |        3 |   11 |       41 |    100 |
| construct and iterate 5x5 generator# |       16 |        2 |   13 |       21 |    100 |
| construct and iterate 5x5 CXProduct# |      118 |       12 |   66 | Infinity |    100 |
| construct and iterate 6x6 naive#     |        3 |        0 |    3 |        3 |    100 |
| construct and iterate 6x6 generator# |        5 |        1 |    4 |        6 |    100 |
| construct and iterate 6x6 CXProduct# |       34 |        3 |   28 |       78 |    100 |


# Building & Testing

Building, testing and quality assessment are conducted using Mocha, Chai, Istanbul, Benchtest, Code Climate, and Codacity.

For code quality assessment purposes, the cyclomatic complexity threshold is set to 10.

# Updates (reverse chronological order)

2020-07-15 v1.0.0 Finally added unit and performance tests! Added caching. Calling interfaces changed to support caching. Added `indexable`.

2020-07-14 v0.0.3 Updated documentation.

2020-06-07 v0.0.2 Updated documentation.

2016-03-30 v0.0.1 First public commit.

# License

This software is provided as-is under the [MIT license](http://opensource.org/licenses/MIT).

# Credits

Credit to Gavin Kistner for the core code: http://phrogz.net/lazy-cartesian-product