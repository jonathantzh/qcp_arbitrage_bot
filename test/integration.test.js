const assert = require('assert')

const r = require('../functions/retrieve');
const g = require('../functions/general');

//test retrieval functions (may be flaky) outside app context
//could use mock servers to stay within app context
//also test piping results from retrieval functions to logic functions

describe('binance api should work', function() {
	it('should be able to retrieve list of instrument pairs', function(done) {
	r.retrieveBinanceInstruments().then(function(res) {
			assert.equal(res.status, 200);
			// assert.equal(res.data.length, 471);
			done();
		}).catch(function(err) {done(err)});
	}).timeout(3000);
})

describe('kucoin api should work', function() {
	it('should be able to retrieve list of instrument pairs', function(done) {
		r.retrieveKcInstruments().then(function(res) {
			assert.equal(res.code, 200000);
			// assert.equal(res.data.length, 406);
			done();
		}).catch(function(err){done(err)});
	}).timeout(3000)

	it('should be able to retrieve exchange rates for an instrument', function(done) {
		r.retrieveKcInstrumentsTicker('GAS-NEO').then(function(res){
			assert.equal(res.code, 200000);
			done();
		}).catch(function(err){done(err)});
	}).timeout(3000)
})

describe('function to extract mutually traded instrument pairs for binance and kucoin', function() {
	it('should extract 116 mutually traded instrument pairs', function(done) {
		r.retrieveBinanceInstruments().then(function (binRes) {
			r.retrieveKcInstruments().then(function(kcRes){
				g.extractMutualPairs(binRes,kcRes).then(function(mutualPairs) {
					assert.equal(mutualPairs.length, 116);
					done();
				}).catch(function(err){done(err)})
			}).catch(function(err) {done(err)});
		}).catch(function(err) {done(err)});
	}).timeout(3000);
})

describe('function to retrieve exchange rates', function() {
	it('should be able to retrieve exchange rates', function(done) {
		//format: INSTRUMENT1,INSTRUMENT2...
		let testInstrument = 'BTC,ETH,LTC';
		r.retrieveExchangeRates(testInstrument).then(function(res) {
			assert.equal(res.status, 200);
			done();
		}).catch(function(err) {done(err)});
	}).timeout(3000);
})