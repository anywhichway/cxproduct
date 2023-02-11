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
*/
//	portions from http://phrogz.net/lazy-cartesian-product

import {intersector} from "intersector";
const intersection = intersector(true);


	function CXProduct(collections,options={}){ // options = {cache:true||false}
		if(!this || typeof(this)!=="object" || !(this instanceof CXProduct)) {
			return new CXProduct(collections,options);
		}
		this.collections = (collections ? collections : []);
		Object.defineProperty(this,"length",{set:function() {},get:function() { let size = 1; this.collections.forEach(function(collection) { size *= collection.length; }); return size; }});
		Object.defineProperty(this,"size",{set:function() {},get:function() { return this.length; }});
		Object.defineProperty(this,"_options",{value:Object.assign({},options)});
		Object.defineProperty(this,"_cache",{configurable:true,value:{}});
		//createIterable(this);
	}
	CXProduct.prototype.asGenerator = function() {
		const ctx = this,
			generator = (function* generator([head, ...tail]) {
				const remainder = tail.length > 0 ? generator(tail) : [[]];
				for (let r of remainder) for (let h of head) yield [h, ...r];
			})(this.collections);
		Object.defineProperty(generator,"length",{get() { return ctx.length; }});
		return generator;
	}
	CXProduct.prototype.asArrayLike = function() {
		const scope = this;
		return new Proxy([],{
			get(target,key) {
				if(key==="length") {
					return scope.length;
				}
				if(typeof(key)==="number") {
					return scope.get(key)
				}
				return target[key];
			}
		})
	}
	CXProduct.prototype.add = function(...collections) {
		var me = this;
		collections.forEach(function(collection) {
			me.collections.push(collection);
		});
		this.flush();
		return me;
	}
	CXProduct.prototype.push = function(collectionIndex,element) {
		this.collections[collectionIndex].push(element);
		this.flush();
		return this;
	}
	function get(n,collections,dm,c) {
		for (var i=collections.length;i--;)c[i]=collections[i][(n/dm[i][0]<<0)%dm[i][1]];
	}
	CXProduct.prototype.flush = function(index) {
		if(typeof(index)==="number") {
			delete this._cache[index];
		} else {
			Object.defineProperty(this,"_cache",{configurable:true,value:{}});
		}
	}
	CXProduct.prototype.get = function(n,{test,cache}={}){
		var me = this, c = [], size = 1, value = this._cache[n];
		if(value!==undefined) {
			return value;
		}
		for (var dm=[],f=1,l,i=me.collections.length;i--;f*=l){ dm[i]=[f,l=me.collections[i].length]; size*=me.collections[i].length; }
		if(n>=size) {
			return undefined;
		}
		get(n,me.collections,dm,c);
		value = c.slice(0);
		if(test && !test(c)) {
			return;
		}
		if(cache===true || this._options.cache) {
			this._cache[n] = value;
		}
		return value;
	}
	CXProduct.has = function(row,{cache}={}) {
		return this.get(row,{cache})>=0
	}
	CXProduct.prototype.indexable = function() {
		return new Proxy(this,{
			get(target,property) {
				var num = parseInt(property);
				if(num>=0) {
					return target.get(num);
				}
				return target[property];
			}
		})
	}
	CXProduct.prototype.indexOf = function(row,{cache}={}) {
		var me = this, index = 0;
		for (var dm=[],f=1,l,i=me.collections.length;i--;f*=l){ dm[i]=f,l=me.collections[i].length; }
		if(me.collections.every(function(collection,i) {
			var pos = collection.indexOf(row[i]);
			if(pos>=0) {
				index += (pos * dm[i]);
				return true;
			}
			return false;
		})) {
			if(cache===true || this._options.cache) {
				this._cache[index] = row.slice(0);
			}
			return index;
		}
		return -1;
	}
	CXProduct.prototype.intersection = function(cxproduct) {
		var me = this, collections = [];
		if(me.collections.length!==cxproduct.collections.length) {
			return new CXProduct([],this._options);
		}
		me.collections.forEach(function(collection,i) {
			collections.push(intersection(collection,cxproduct.collections[i]));
		});
		return new CXProduct(collections,this._options);
	}
	CXProduct.prototype.verify = function(i,row,{cache}={}) {
		var me = this;
		var match = me.get(i,{cache});
		return match && match.every(function(element,i) { return element===row[i]; });
	}
	function dive(d,count,collections,lens,p,callback,test,cache,cxproduct){
		var a=collections[d], max=collections.length-1,len=lens[d];
		if (d==max) {
			for (var i=0;i<len;++i) { 
				p[d]=a[i]; 
				if(!test || test(p)) {
					var value = p.slice(0);
					!cache || (cache[count] = value);
					callback(value,count,cxproduct); 
				}
				count++;
			}
		} else {
			for (var i=0;i<len;++i) {
				p[d]=a[i];
				dive(d+1,count,collections,lens,p,callback,test,cache,cxproduct);
			}
		}
		p.pop();
	}
	CXProduct.prototype.forEach1 = function(callback,{test,cache}={}) {
		var me = this, p=[],lens=[];
		for (var i=me.collections.length;i--;) lens[i]=me.collections[i].length;
		dive(0,0,me.collections,lens,p,callback,test,cache ? this._cache : null,me);
	}
	CXProduct.prototype.forEach2 = function(callback,test) {
		var me = this, i = 0;
		do {
			var value = me.get(i,test);
			if(value!==undefined) {
				callback(value,i,cxproduct);
			}
			i++;
		} while(value!==undefined);
	}
	CXProduct.prototype.forEach = CXProduct.prototype.forEach1;


export {CXProduct,CXProduct as default}