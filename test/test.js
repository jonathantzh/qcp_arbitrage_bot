const assert = require('assert')

const r = require('../functions/retrieve');
const g = require('../functions/general');

//tests
describe('binance api should work', function() {
    it('should be able to retrieve list of 456 instrument pairs', function(done) {
		r.retrieveBinanceInstruments().then(function(res) {
			assert.equal(res.status, 200);
			assert.equal(res.data.length, 456);
			done();
		}).catch(function(err) {done(err)});
    })
})

describe('kucoin api should work', function() {
    it('should be able to retrieve list of 406 instrument pairs', function(done) {
		r.retrieveKcInstruments().then(function(res) {
			assert.equal(res.success, true);
			assert.equal(res.data.length, 406);
			done();
		}).catch(function(err){done(err)});
	})
	
	it('should be able to retrieve exchange rates for an instrument', function(done) {
		r.retrieveKcInstrumentsTicker('GAS-NEO').then(function(res){
			assert.equal(res.success, true);
			done();
		}).catch(function(err){done(err)});
	})
})

describe('function to extract mutually traded instrument pairs for binance and kucoin', function() {
	it('should extract 122 mutually traded instrument pairs', function(done) {
		r.retrieveBinanceInstruments().then(function (binRes) {
			r.retrieveKcInstruments().then(function(kcRes){
				g.extractMutualPairs(binRes,kcRes).then(function(mutualPairs) {
					assert.equal(mutualPairs.length, 122);
					done();
				}).catch(function(err){done(err)})
			}).catch(function(err) {done(err)});
		}).catch(function(err) {done(err)});
	})
})
