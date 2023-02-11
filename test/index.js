import chai from "chai";
const expect = chai.expect;
import {CXProduct} from "../index.js";
import fastCartesian from "fast-cartesian";
import bigCartesian from "big-cartesian";
import {cartesianProduct} from "@anywhichway/cartesian-product";
import benchtest from "benchtest";

it = benchtest.it(it);
describe = benchtest.describe(describe);

const naive = (arrays) => arrays.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))),[]));

function* generator(head, ...tail) {
  const remainder = tail.length > 0 ? generator(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}

const short = [[1,2,3],["a","b","c"],[true,false],[{i:1},{i:2}]];

const small = [],
	smallDim = 3;
for(let i=0;i<smallDim;i++) {
	const array = [];
	for(let j=0;j<smallDim;j++) {
		array.push(j);
	}
	small.push(array);
}

const medium = [],
	mediumDim = 5;
for(let i=0;i<mediumDim;i++) {
	const array = [];
	for(let j=0;j<mediumDim;j++) {
		array.push(j);
	}
	medium.push(array);
}

const large = [],
	largeDim =  6;
for(let i=0;i<largeDim;i++) {
	const array = [];
	for(let j=0;j<largeDim;j++) {
		array.push(j);
	}
	large.push(array);
}

const xlarge = [],
	xlargeDim = 7;
for(let i=0;i<xlargeDim;i++) {
	const array = [];
	for(let j=0;j<xlargeDim;j++) {
		array.push(j);
	}
	xlarge.push(array);
}



let smallCXProduct,
	smallNaive,
	smallGenerator,
	mediumCXProduct,
	mediumNaive,
	mediumGenerator,
	largeCXProduct,
	largeNaive,
	largeGenerator;

const metrics = {sample:{size:50,performance:true,cpu:true}};

describe("Basic",function() {
	it("construct and forEach verify semantics",  () => {
		const result1 = new CXProduct(short),
			result2 = naive(short),
			result3 = generator(...short);
		expect(result1).to.be.instanceof(CXProduct);
		expect(result1.length).to.equal(result2.length);
		expect(result1).to.be.instanceof(Object);
		result1.forEach((row1) => expect(result2.some((row2) => JSON.stringify(row1)===JSON.stringify(row2))).to.equal(true));
		for (const row of result3) {
			expect(result1.indexOf(row)>=0).to.equal(true);
		}
	});
	it(`construct  ${mediumDim}x${mediumDim}  naive#`,  () => {
		mediumNaive = naive(medium);
		expect(mediumNaive).to.be.instanceof(Array);
	});
	it(`construct  ${mediumDim}x${mediumDim} @anywhichway/cartesian-product#`,  () => {
		mediumGenerator = generator(...medium);
		expect(mediumGenerator).to.be.instanceof(Object);
	});
	it(`construct  ${mediumDim}x${mediumDim} CXProduct#`,  () => {
		mediumCXProduct = new CXProduct(medium);
		expect(mediumCXProduct).to.be.instanceof(CXProduct);
	});
	it("indexable",  () => {
		const proxy = mediumCXProduct.indexable(),
			result = proxy[0];
		expect(Array.isArray(result)).to.equal(true);
		expect(result.every(item => item===0)).to.equal(true);
	});
	it("indexOf",  () => {
		const result = mediumCXProduct.indexOf(mediumNaive[0]);
		expect(result>=0).to.equal(true);
	});
	it("indexOf not cached",  () => {
		expect(mediumCXProduct._cache[0]).to.equal(undefined);
	});
	it("indexOf not found",  () => {
		const result = mediumCXProduct.indexOf([1]);
		expect(result).to.equal(-1);
	});
	it("indexOf cache",  () => {
		const result = mediumCXProduct.indexOf(mediumNaive[0],{cache:true});
		expect(mediumCXProduct._cache[0]).to.not.equal(undefined);
	});
	it("flush cache",  () => {
		const result = mediumCXProduct.flush();
		expect(mediumCXProduct._cache[0]).to.equal(undefined);
	});
	it("get test and cache",  () => {
		const result = mediumCXProduct.get(0,{test:(row) => row.every(item => item===0),cache:true});
		expect(Array.isArray(result)).to.equal(true);
		expect(result.every(item => item===0)).to.equal(true);
		expect(mediumCXProduct._cache[0]).to.not.equal(undefined);
	});
	it(`construct and loop ${smallDim}x${smallDim} naive#`,  () => {
		const smallNaive = naive(small);
		for(var i=0;i<smallNaive.length;i++) { }
		expect(i).to.equal(Math.pow(smallDim,smallDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${smallDim}x${smallDim} fastCartesian#`,  () => {
		const fast = fastCartesian(small);
		for(var i=0;i<fast.length;i++) { }
		expect(i).to.equal(Math.pow(smallDim,smallDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${smallDim}x${smallDim} bigCartesian#`,  () => {
		const fast = bigCartesian(small);
		var i = 0;
		for(const item of fast) { i++ };
		expect(i).to.equal(Math.pow(smallDim,smallDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${smallDim}x${smallDim} @anywhichway/cartesian-product#`,  () => {
		const smallGenerator = cartesianProduct(...small);
		let i = 0;
		for(let item of smallGenerator) { i++ }
		expect(i).to.equal(Math.pow(smallDim,smallDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${smallDim}x${smallDim} CXProduct#`,  () => {
		const smallCXProduct = new CXProduct(small),
			length = smallCXProduct.length;
		for(var i=0;i<length;i++) { }
		expect(i).to.equal(Math.pow(smallDim,smallDim));
	},{metrics});
	it(`construct and loop ${mediumDim}x${mediumDim} naive#`, () => {
		const mediumNaive = naive(medium);
		let i = 0;
		for(;i<mediumNaive.length;i++) { }
		expect(i).to.equal(Math.pow(mediumDim,mediumDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${mediumDim}x${mediumDim} fastCartesian#`,  () => {
		const fast = fastCartesian(medium);
		for(var i=0;i<fast.length;i++) { }
		expect(i).to.equal(Math.pow(mediumDim,mediumDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${mediumDim}x${mediumDim} bigCartesian#`,  () => {
		const fast = bigCartesian(medium);
		var i = 0;
		for(const item of fast) { i++ };
		expect(i).to.equal(Math.pow(mediumDim,mediumDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${mediumDim}x${mediumDim} @anywhichway/cartesian-product#`, () => {
		const mediumGenerator = cartesianProduct(...medium);
		let i = 0;
		for(let item of mediumGenerator) { i++ }
		expect(i).to.equal(Math.pow(mediumDim,mediumDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${mediumDim}x${mediumDim} CXProduct#`, () => {
		const mediumCXProduct = new CXProduct(medium),
			length = mediumCXProduct.length;
		let i = 0;
		for(;i<length;i++) { }
		expect(i).to.equal(Math.pow(mediumDim,mediumDim));
	},{metrics,timeout:2000});

	it(`construct and loop ${largeDim}x${largeDim} fastCartesian#`,  () => {
		const fast = fastCartesian(large);
		for(var i=0;i<fast.length;i++) { }
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} bigCartesian#`,  () => {
		const big = bigCartesian(large);
		var i = 0;
		for(const item of big) { i++ };
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} @anywhichway/cartesian-product#`, () => {
		const largeGenerator = cartesianProduct(...large);
		let i = 0;
		for(let item of largeGenerator) { i++ }
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} CXProduct#`, () => {
		const largeCXProduct = new CXProduct(large),
			length = largeCXProduct.length;
		for(var i=0;i<length;i++) { }
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} bigCartesian#`,  () => {
		const big = bigCartesian(large);
		var i = 0;
		for(const item of big) { i++ };
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} @anywhichway/cartesian-product#`, () => {
		const largeGenerator = cartesianProduct(...large);
		let i = 0;
		for(let item of largeGenerator) { i++ }
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${largeDim}x${largeDim} CXProduct#`, () => {
		const largeCXProduct = new CXProduct(large),
			length = largeCXProduct.length;
		for(var i=0;i<length;i++) { }
		expect(i).to.equal(Math.pow(largeDim,largeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${xlargeDim}x${xlargeDim} bigCartesian#`,  () => {
		const big = bigCartesian(xlarge);
		var i = 0;
		for(const item of big) { i++ };
		expect(i).to.equal(Math.pow(xlargeDim,xlargeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${xlargeDim}x${xlargeDim} @anywhichway/cartesian-product#`, () => {
		const xlargeGenerator = cartesianProduct(...xlarge);
		let i = 0;
		for(let item of xlargeGenerator) { i++ }
		expect(i).to.equal(Math.pow(xlargeDim,xlargeDim));
	},{metrics,timeout:2000});
	it(`construct and loop ${xlargeDim}x${xlargeDim} CXProduct#`, () => {
		const xlargeCXProduct = new CXProduct(xlarge),
			length = xlargeCXProduct.length;
		for(var i=0;i<length;i++) { }
		expect(i).to.equal(Math.pow(xlargeDim,xlargeDim));
	},{metrics,timeout:2000});
	it(`construct and random access ${largeDim}x${largeDim} bigCartesian#`,  () => {
		const big = bigCartesian(large);
		var i = 0;
		const random = Math.round(Math.pow(largeDim,largeDim) * Math.random());
		var item;
		for(item of big) { i++; if(i>=random) break; };
		expect(Array.isArray(item)).to.equal(true);
	},{metrics,timeout:2000});
	it(`construct and random access ${largeDim}x${largeDim} @anywhichway/cartesian-product#`, () => {
		const largeGenerator = cartesianProduct(...large);
		let i = 0;
		const random = Math.round(Math.pow(largeDim,largeDim) * Math.random());
		var item;
		for(item of largeGenerator) { i++; if(i>=random) break; };
		expect(Array.isArray(item)).to.equal(true);
	},{metrics,timeout:2000});
	it(`construct and random access ${largeDim}x${largeDim} CXProduct#`, () => {
		const largeCXProduct = new CXProduct(large);
		const random = Math.round(Math.pow(largeDim,largeDim) * Math.random());
		const item = largeCXProduct.get(random)
		expect(Array.isArray(item)).to.equal(true);
	},{metrics,timeout:2000});
	it(`construct and loop 2x8 fastCartesian#`, () => {
		const fast = fastCartesian([[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2]])
		let i = 0;
		for(let item of fast) { i++ }
		expect(i).to.equal(Math.pow(2,10));
	},{metrics,timeout:2000});
	it(`construct and loop 2x8 bigCartesian#`, () => {
		const fast = bigCartesian([[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2]])
		let i = 0;
		for(let item of fast) { i++ }
		expect(i).to.equal(Math.pow(2,10));
	},{metrics,timeout:2000});
	it(`construct and loop 2x8 @anywhichway/cartesian-product#`, () => {
		const largeGenerator = cartesianProduct([1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2]);
		let i = 0;
		for(let item of largeGenerator) { i++ }
		expect(i).to.equal(Math.pow(2,10));
	},{metrics,timeout:2000});
	it(`construct and loop 2x8 CXProduct#`, () => {
		const largeCXProduct = new CXProduct([[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2],[1,2]])
		var length = largeCXProduct.length;
		for(var i=0;i<length;i++) { }
		expect(i).to.equal(Math.pow(2,10));
	},{metrics,timeout:2000});
	it(`naive  ${mediumDim}x${mediumDim} forEach#`,  () => {
		mediumNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`generator  ${mediumDim}x${mediumDim} forEach#`,  () => {
		for (const item of mediumGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`CXProduct  ${mediumDim}x${mediumDim} forEach#`,  () => {
		mediumCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it("mediumCXProduct add", async () => {
		const length = mediumCXProduct.length;
		mediumCXProduct.add([0,0,0,0,0]);
		expect(mediumCXProduct.length).to.equal(length*5);
	});
	it(`construct and iterate ${smallDim}x${smallDim} naive#`,  () => {
		smallNaive = naive(small);
		smallNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${smallDim}x${smallDim} @anywhichway/cartesian-product#`,  () => {
		smallGenerator = cartesianProduct(...small);
		for (const item of smallGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${smallDim}x${smallDim} CXProduct#`,  () => {
		smallCXProduct = new CXProduct(small);
		smallCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} naive#`,  () => {
		mediumNaive = naive(medium);
		mediumNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} @anywhichway/cartesian-product#`,  () => {
		mediumGenerator = cartesianProduct(...medium);
		for (const item of mediumGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} CXProduct#`,  () => {
		mediumCXProduct = new CXProduct(medium);
		mediumCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${largeDim}x${largeDim} naive#`,  () => {
		largeNaive = naive(large);
		largeNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${largeDim}x${largeDim} @anywhichway/cartesian-product#`,  () => {
		largeGenerator = cartesianProduct(...large);
		for (const item of largeGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${largeDim}x${largeDim} CXProduct#`,  () => {
		largeCXProduct = new CXProduct(large);
		largeCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});;

	after(async () => {
		const metrics = benchtest.metrics(),
			summary = benchtest.summarize(metrics);
		console.log(JSON.stringify(summary,null,2));
	})
});

