function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "CXProduct", () => $4fa36e821943b400$export$e6364d3a253aa425);
$parcel$export(module.exports, "default", () => $4fa36e821943b400$export$e6364d3a253aa425);
//	portions from http://phrogz.net/lazy-cartesian-product
function $4fa36e821943b400$export$e6364d3a253aa425(collections, options = {}) {
    this.collections = collections ? collections : [];
    Object.defineProperty(this, "length", {
        set: function() {},
        get: function() {
            var size = 1;
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
}
$4fa36e821943b400$export$e6364d3a253aa425.prototype.add = function(...collections) {
    var me = this;
    collections.forEach(function(collection) {
        me.collections.push(collection);
    });
    this.flush();
    return me;
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.push = function(collectionIndex, element) {
    this.collections[collectionIndex].push(element);
    this.flush();
    return this;
};
function $4fa36e821943b400$var$get(n, collections, dm, c) {
    for(var i = collections.length; i--;)c[i] = collections[i][(n / dm[i][0] << 0) % dm[i][1]];
}
$4fa36e821943b400$export$e6364d3a253aa425.prototype.flush = function(index) {
    if (typeof index === "number") delete this._cache[index];
    else Object.defineProperty(this, "_cache", {
        configurable: true,
        value: {}
    });
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.get = function(n, { test: test , cache: cache  } = {}) {
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
    $4fa36e821943b400$var$get(n, me.collections, dm, c);
    value = c.slice(0);
    if (test && !test(c)) return;
    if (cache === true || this._options.cache) this._cache[n] = value;
    return value;
};
$4fa36e821943b400$export$e6364d3a253aa425.has = function(row, { cache: cache  } = {}) {
    return this.get(row, {
        cache: cache
    }) >= 0;
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.indexable = function() {
    return new Proxy(this, {
        get (target, property) {
            var num = parseInt(property);
            if (num >= 0) return target.get(num);
            return target[property];
        }
    });
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.indexOf = function(row, { cache: cache  } = {}) {
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
$4fa36e821943b400$export$e6364d3a253aa425.prototype.intersection = function(cxproduct1) {
    var me = this, collections = [];
    if (me.collections.length !== cxproduct1.collections.length) return new $4fa36e821943b400$export$e6364d3a253aa425([]);
    me.collections.forEach(function(collection, i) {
        collections.push(intersection(collection, cxproduct1.collections[i]));
    });
    return new $4fa36e821943b400$export$e6364d3a253aa425(collections);
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.verify = function(i, row, { cache: cache  } = {}) {
    var me = this;
    var match = me.get(i, {
        cache: cache
    });
    return match && match.every(function(element, i) {
        return element === row[i];
    });
};
function $4fa36e821943b400$var$dive(d, count, collections, lens, p, callback, test, cache, cxproduct1) {
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
        $4fa36e821943b400$var$dive(d + 1, count, collections, lens, p, callback, test, cache, cxproduct1);
    }
    p.pop();
}
$4fa36e821943b400$export$e6364d3a253aa425.prototype.forEach1 = function(callback, { test: test , cache: cache  } = {}) {
    var me = this, p = [], lens = [];
    for(var i = me.collections.length; i--;)lens[i] = me.collections[i].length;
    $4fa36e821943b400$var$dive(0, 0, me.collections, lens, p, callback, test, cache ? this._cache : null, me);
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.forEach2 = function(callback, test) {
    var me = this, i = 0;
    do {
        var value = me.get(i, test);
        if (value !== undefined) callback(value, i, cxproduct);
        i++;
    }while (value !== undefined);
};
$4fa36e821943b400$export$e6364d3a253aa425.prototype.forEach = $4fa36e821943b400$export$e6364d3a253aa425.prototype.forEach1;


//# sourceMappingURL=cxproduct.js.map
