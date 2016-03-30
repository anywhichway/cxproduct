# CXProduct

Cartesian cross-product as a first class object.

CXProduct supports high-speed, low memory virtual Cartesian cross-product creation and use through the use of lazy evaluation, i.e. rows of the cross-product are not created until needed by calling functions.

# Install

npm install cxproduct

The index.js and package.json files are compatible with https://github.com/anywhichway/node-require so that rule-reactor can be served directly to the browser from the node-modules/jovial directory when using node Express.

Browser code can also be found in the browser directory at https://github.com/anywhichway/browser.

# Documentation

new CXProduct(arrayOfArrays) - Creates a virtual Cartesian cross-product based on the arrays. A copy of the top level wrapping array is created, which means the contained arrays are not. This way they can be manipulated (added to, deleted from) by code outside the CXProduct

The following methods are supported:

.add(array) - Adds the array to the collection of arrays already associated with the CXProduct.

.push(index,element) - Adds the element to the array at the index in the collection of arrays associated with the CXProduct.

.forEach(callback,[pattern,test]) - Iterates over the CXProduct and invokes the callback for each row, optionally matching the row against a provided patter or passing the provided boolean test. The callback takes the signature callback(row,index). The test takes the signature test(array) and should return true or false. It is not recommended to loop through the CXProduct using .get and a counter. The access algorithms are different and the one under forEach is optimized for forward moving access rather than random access.

.get(index) - Return row at index. Allocated memory for the row. Repeated calls will not return the same object. No cache is created with the CXProduct since underlying collections may be changed application code in a manner than changes the nature of the CXProduct. A cache option that copies arrays when added to the CXProduct will be added in the future

.has(row) - Where row is an ordered list of elements.

.indexOf(row) - Return index where the row exists, returns undefined if row does not exist

.intersection(cxproduct) - Returns a new CXProduct that is an intersection of the current CXProduct with the one provided as an argument

.verify(index,row) - Verifies that the index still contains the row in case the arrays defining the CXProduct have changed.


# Building & Testing

Building, testing and quality assessment are conducted using Travis, Mocha, Chai, Istanbul, Code Climate, and Codacity.

For code quality assessment purposes, the cyclomatic complexity threshold is set to 10.

# Notes

Currently in ALPHA due to lack of unit tests and the fact it has just been extracted as stand-alone module. However, the code base has been used extensively in another application.

v0.0.1 No unit tests yet. The test option of .forEach is implemented; however, the pattern matching is not, always pass undefined.

# Updates (reverse chronological order)

2016-03-30 v0.0.1 First public commit.

# License

This software is provided as-is under the [MIT license](http://opensource.org/licenses/MIT).

# Credits

Credit to Gavin Kistner for the core code: http://phrogz.net/lazy-cartesian-product