import {intersector as $l7i9T$intersector} from "intersector";

/*
MIT License

Copyright (c) 2016-2023 Simon Y. Blackwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/ //	portions from http://phrogz.net/lazy-cartesian-product

const $cf838c15c8b009ba$var$intersection = (0, $l7i9T$intersector)(true);
function $cf838c15c8b009ba$export$e6364d3a253aa425(collections, options = {}) {
    if (!this || typeof this !== "object" || !(this instanceof $cf838c15c8b009ba$export$e6364d3a253aa425)) return new $cf838c15c8b009ba$export$e6364d3a253aa425(collections, options);
    this.collections = collections ? collections : [];
    Object.defineProperty(this, "length", {
        set: function() {},
        get: function() {
            let size = 1;
            this.collections.forEach(function(collection) {
                size *= collection.length;
            });
            return size;
        }
    });
    Object.defineProperty(this, "size", {
        set: function() {},
        get: function() {
            return this.length;
        }
    });
    Object.defineProperty(this, "_options", {
        value: Object.assign({}, options)
    });
    Object.defineProperty(this, "_cache", {
        configurable: true,
        value: {}
    });
//createIterable(this);
}
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.asGenerator = function() {
    const ctx = this, generator = function* generator([head, ...tail]) {
        if (head === undefined) return;
        const remainder = tail.length > 0 ? generator(tail) : [
            []
        ];
        for (let r of remainder)for (let h of head)yield [
            h,
            ...r
        ];
    }(this.collections);
    Object.defineProperty(generator, "length", {
        get () {
            return ctx.length;
        }
    });
    return generator;
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.asArrayLike = function() {
    const scope = this;
    return new Proxy([], {
        get (target, key) {
            if (key === "length") return scope.length;
            if (typeof key === "number") return scope.get(key);
            return target[key];
        }
    });
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.add = function(...collections) {
    var me = this;
    collections.forEach(function(collection) {
        me.collections.push(collection);
    });
    this.flush();
    return me;
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.push = function(collectionIndex, element) {
    this.collections[collectionIndex].push(element);
    this.flush();
    return this;
};
function $cf838c15c8b009ba$var$get(n, collections, dm, c) {
    for(var i = collections.length; i--;)c[i] = collections[i][(n / dm[i][0] << 0) % dm[i][1]];
}
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.flush = function(index) {
    if (typeof index === "number") delete this._cache[index];
    else Object.defineProperty(this, "_cache", {
        configurable: true,
        value: {}
    });
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.get = function(n, { test: test , cache: cache  } = {}) {
    var me = this, c = [], size = 1, value = this._cache[n];
    if (value !== undefined) return value;
    for(var dm = [], f = 1, l, i = me.collections.length; i--; f *= l){
        dm[i] = [
            f,
            l = me.collections[i].length
        ];
        size *= me.collections[i].length;
    }
    if (n >= size) return undefined;
    $cf838c15c8b009ba$var$get(n, me.collections, dm, c);
    value = c.slice(0);
    if (test && !test(c)) return;
    if (cache === true || this._options.cache) this._cache[n] = value;
    return value;
};
$cf838c15c8b009ba$export$e6364d3a253aa425.has = function(row, { cache: cache  } = {}) {
    return this.get(row, {
        cache: cache
    }) >= 0;
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.indexable = function() {
    return new Proxy(this, {
        get (target, property) {
            var num = parseInt(property);
            if (num >= 0) return target.get(num);
            return target[property];
        }
    });
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.indexOf = function(row, { cache: cache  } = {}) {
    var me = this, index = 0;
    for(var dm = [], f = 1, l, i = me.collections.length; i--; f *= l)dm[i] = f, l = me.collections[i].length;
    if (me.collections.every(function(collection, i) {
        var pos = collection.indexOf(row[i]);
        if (pos >= 0) {
            index += pos * dm[i];
            return true;
        }
        return false;
    })) {
        if (cache === true || this._options.cache) this._cache[index] = row.slice(0);
        return index;
    }
    return -1;
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.intersection = function(cxproduct1) {
    var me = this, collections = [];
    if (me.collections.length !== cxproduct1.collections.length) return new $cf838c15c8b009ba$export$e6364d3a253aa425([], this._options);
    me.collections.forEach(function(collection, i) {
        collections.push($cf838c15c8b009ba$var$intersection(collection, cxproduct1.collections[i]));
    });
    return new $cf838c15c8b009ba$export$e6364d3a253aa425(collections, this._options);
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.verify = function(i, row, { cache: cache  } = {}) {
    var me = this;
    var match = me.get(i, {
        cache: cache
    });
    return match && match.every(function(element, i) {
        return element === row[i];
    });
};
function $cf838c15c8b009ba$var$dive(d, count, collections, lens, p, callback, test, cache, cxproduct1) {
    var a = collections[d], max = collections.length - 1, len = lens[d];
    if (d == max) for(var i = 0; i < len; ++i){
        p[d] = a[i];
        if (!test || test(p)) {
            var value = p.slice(0);
            !cache || (cache[count] = value);
            callback(value, count, cxproduct1);
        }
        count++;
    }
    else for(var i = 0; i < len; ++i){
        p[d] = a[i];
        $cf838c15c8b009ba$var$dive(d + 1, count, collections, lens, p, callback, test, cache, cxproduct1);
    }
    p.pop();
}
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.forEach1 = function(callback, { test: test , cache: cache  } = {}) {
    var me = this, p = [], lens = [];
    for(var i = me.collections.length; i--;)lens[i] = me.collections[i].length;
    $cf838c15c8b009ba$var$dive(0, 0, me.collections, lens, p, callback, test, cache ? this._cache : null, me);
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.forEach2 = function(callback, test) {
    var me = this, i = 0;
    do {
        var value = me.get(i, test);
        if (value !== undefined) callback(value, i, cxproduct);
        i++;
    }while (value !== undefined);
};
$cf838c15c8b009ba$export$e6364d3a253aa425.prototype.forEach = $cf838c15c8b009ba$export$e6364d3a253aa425.prototype.forEach1;


export {$cf838c15c8b009ba$export$e6364d3a253aa425 as CXProduct, $cf838c15c8b009ba$export$e6364d3a253aa425 as default};
//# sourceMappingURL=index.js.map
