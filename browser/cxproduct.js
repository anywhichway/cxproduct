(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	"use strict";
//	portions from http://phrogz.net/lazy-cartesian-product
	function CXProduct(collections){
		this.collections = (collections ? collections : []);
		Object.defineProperty(this,"length",{set:function() {},get:function() { var size = 1; this.collections.forEach(function(collection) { size *= collection.length; }); return size; }});
		Object.defineProperty(this,"size",{set:function() {},get:function() { return this.length; }});
	}
	CXProduct.prototype.add = function(collections) {
		var me = this;
		collections.forEach(function(collection) {
			me.collections.push(collection);
		});
		return me;
	}
	CXProduct.prototype.push = function(collectionIndex,element) {
		this.collections[collectionIndex].push(element);
		return this;
	}
	function get(n,collections,dm,c) {
		for (var i=collections.length;i--;)c[i]=collections[i][(n/dm[i][0]<<0)%dm[i][1]];
	}
	CXProduct.prototype.get = function(n,pattern){
		var me = this, c = [], size = 1;
		for (var dm=[],f=1,l,i=me.collections.length;i--;f*=l){ dm[i]=[f,l=me.collections[i].length]; size*=me.collections[i].length; }
		if(n>=size) {
			return undefined;
		}
		get(n,me.collections,dm,c);
		if(!pattern || pattern.every(function(value,i) {
			return value===undefined || (typeof(value)==="function" ? value.call(c,c[i],i) : false) || c[i]===value;
		})) {
			return c.slice(0);
		}
	}
	CXProduct.prototype.indexOf = function(row) {
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
			return index;
		}
		return -1;
	}
	CXProduct.prototype.intersection = function(cxproduct) {
		var me = this, collections = [];
		if(me.collections.length!==cxproduct.collections.length) {
			return new CXProduct([]);
		}
		me.collections.forEach(function(collection,i) {
			collections.push(intersection(collection,cxproduct.collections[i]));
		});
		return new CXProduct(collections);
	}
	CXProduct.prototype.verify = function(i,row) {
		var me = this;
		var match = me.get(i);
		return match && match.every(function(element,i) { return element===row[i]; });
	}
	function dive(d,count,collections,lens,p,callback,pattern,test){
		var a=collections[d], max=collections.length-1,len=lens[d];
		if (d==max) {
			for (var i=0;i<len;++i) { 
				p[d]=a[i]; 
				if(!test || test(p)) {
					callback(p.slice(0),count); 
				}
				count++;
			}
		} else {
			for (var i=0;i<len;++i) {
				p[d]=a[i];
				dive(d+1,count,collections,lens,p,callback,pattern,test);
			}
		}
		p.pop();
	}
	CXProduct.prototype.forEach1 = function(callback,pattern,test) {
		var me = this, p=[],lens=[];
		for (var i=me.collections.length;i--;) lens[i]=me.collections[i].length;
		dive(0,0,me.collections,lens,p,callback,pattern,test);
	}
	CXProduct.prototype.forEach2 = function(callback,pattern,test) {
		var me = this, i = 0;
		do {
			var value = me.get(i);
			if(value!==undefined) {
				callback(value);
			}
			i++;
		} while(value!==undefined);
	}
	CXProduct.prototype.forEach = CXProduct.prototype.forEach1;
	
	if (this.exports) {
		this.exports  = CXProduct;
	} else if (typeof define === "function" && define.amd) {
		// Publish as AMD module
		define(function() {return CXProduct;});
	} else {
		this.CXProduct = CXProduct;
	}
}).call((typeof(window)!=="undefined" ? window : (typeof(module)!=="undefined" ? module : null)));
},{}]},{},[1]);
