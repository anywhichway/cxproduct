var chai,
	expect,
	fetch;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	fetch = require("node-fetch").fetch;
} else {
	fetch = window.fetch;
	chai = window.chai;
	expect = window.expect;
}

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
	largeDim = 6;
for(let i=0;i<largeDim;i++) {
	const array = [];
	for(let j=0;j<largeDim;j++) {
		array.push(j);
	}
	large.push(array);
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

describe("Basic",function() {
	it("construct and forEach verify semantics", async () => {
		const result1 = new CXProduct(short),
			result2 = naive(short),
			result3 = generator(...short);
		expect(result1).to.be.instanceof(CXProduct);
		expect(result1.length).to.equal(result2.length);
		expect(result1).to.be.instanceof(Object);
		result1.forEach((row1) => expect(result2.some((row2) => JSON.stringify(row1)===JSON.stringify(row2))).to.equal(true));
		for await(const row of result3) {
			expect(result1.indexOf(row)>=0).to.equal(true);
		}
	});
	it(`construct  ${mediumDim}x${mediumDim}  naive#`, async () => {
		mediumNaive = naive(medium);
		expect(mediumNaive).to.be.instanceof(Array);
	});
	it(`construct  ${mediumDim}x${mediumDim} generator#`, async () => {
		mediumGenerator = generator(...medium);
		expect(mediumGenerator).to.be.instanceof(Object);
	});
	it(`construct  ${mediumDim}x${mediumDim} CXProduct#`, async () => {
		mediumCXProduct = new CXProduct(medium);
		expect(mediumCXProduct).to.be.instanceof(CXProduct);
	});
	it("indexable", async () => {
		const proxy = mediumCXProduct.indexable(),
			result = proxy[0];
		expect(Array.isArray(result)).to.equal(true);
		expect(result.every(item => item===0)).to.equal(true);
	});
	it("indexOf", async () => {
		const result = mediumCXProduct.indexOf(mediumNaive[0]);
		expect(result>=0).to.equal(true);
	});
	it("indexOf not cached", async () => {
		expect(mediumCXProduct._cache[0]).to.equal(undefined);
	});
	it("indexOf not found", async () => {
		const result = mediumCXProduct.indexOf([1]);
		expect(result).to.equal(-1);
	});
	it("indexOf cache", async () => {
		const result = mediumCXProduct.indexOf(mediumNaive[0],{cache:true});
		expect(mediumCXProduct._cache[0]).to.not.equal(undefined);
	});
	it("flush cache", async () => {
		const result = mediumCXProduct.flush();
		expect(mediumCXProduct._cache[0]).to.equal(undefined);
	});
	it("get test and cache", async () => {
		const result = mediumCXProduct.get(0,{test:(row) => row.every(item => item===0),cache:true});
		expect(Array.isArray(result)).to.equal(true);
		expect(result.every(item => item===0)).to.equal(true);
		expect(mediumCXProduct._cache[0]).to.not.equal(undefined);
	});
	it(`naive  ${mediumDim}x${mediumDim} forEach#`, async () => {
		mediumNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`generator  ${mediumDim}x${mediumDim} forEach#`, async () => {
		for await(const item of mediumGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`CXProduct  ${mediumDim}x${mediumDim} forEach#`, async () => {
		mediumCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it("mediumCXProduct add", async () => {
		const length = mediumCXProduct.length;
		mediumCXProduct.add([0,0,0,0,0]);
		expect(mediumCXProduct.length).to.equal(length*5);
	});
	it(`construct and iterate ${smallDim}x${smallDim} naive#`, async () => {
		smallNaive = naive(small);
		smallNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${smallDim}x${smallDim} generator#`, async () => {
		smallGenerator = generator(...small);
		for await(const item of smallGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${smallDim}x${smallDim} CXProduct#`, async () => {
		smallCXProduct = new CXProduct(small);
		smallCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} naive#`, async () => {
		mediumNaive = naive(medium);
		mediumNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} generator#`, async () => {
		mediumGenerator = generator(...medium);
		for await(const item of mediumGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${mediumDim}x${mediumDim} CXProduct#`, async () => {
		mediumCXProduct = new CXProduct(medium);
		mediumCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${largeDim}x${largeDim} naive#`, async () => {
		largeNaive = naive(large);
		largeNaive.forEach(item => expect(Array.isArray(item)).to.equal(true))
	});
	it(`construct and iterate ${largeDim}x${largeDim} generator#`, async () => {
		largeGenerator = generator(...large);
		for await(const item of largeGenerator) {
			expect(Array.isArray(item)).to.equal(true)
		}
	});
	it(`construct and iterate ${largeDim}x${largeDim} CXProduct#`, async () => {
		largeCXProduct = new CXProduct(large);
		largeCXProduct.forEach(item => expect(Array.isArray(item)).to.equal(true))
		console.log(large.length);
	});
});

