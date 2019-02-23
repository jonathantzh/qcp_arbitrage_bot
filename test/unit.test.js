const assert = require('assert')

const g = require('../functions/general');

//test logic functions

describe('function to apply kucoin trading fees', function() {
	it('should apply 0.1% trading fee', function(done) {
		let testPrice = 1.0000;
		assert.equal(g.applyKucoinTradingFees(testPrice, 'buy'), testPrice*(1+0.001));
		assert.equal(g.applyKucoinTradingFees(testPrice, 'sell'), testPrice*(1-0.001));
		done();
	});

	it('should throw error if invalid', function(done) {
		let testPrice = 1.0000;
		assert.throws(function(){g.applyKucoinTradingFees(testPrice, 'hello')}, TypeError);
		done();
	})
})

describe('function to apply binance trading fees', function() {
	it('should apply 0.1% trading fee without BNB', function(done) {
		let testPrice = 1.0000;
		let testPair = 'LTC-BTC';
		assert.equal(g.applyBinanceTradingFees(testPrice, 'buy', testPair), testPrice*(1+0.001));
		assert.equal(g.applyBinanceTradingFees(testPrice, 'sell', testPair), testPrice*(1-0.001));
		done();
	});

	it('should apply 0.005% trading fee with BNB', function(done) {
		let testPrice = 1.0000;
		let testBNBPair = 'BNB-BTC';
		assert.equal(g.applyBinanceTradingFees(testPrice, 'buy', testBNBPair), testPrice*(1+0.0005));
		assert.equal(g.applyBinanceTradingFees(testPrice, 'sell', testBNBPair), testPrice*(1-0.0005));
		done();
	});

	it('should throw error if invalid', function(done) {
		let testPrice = 1.0000;
		assert.throws(function(){g.applyBinanceTradingFees(testPrice, 'hello')}, TypeError);
		done();
	})
})

describe('function to compare prices', function() {
	let testPair = 'LTC-BTC';
	let testLowerPrice = 1.00000;
	let testHigherPrice = 1.00001;

	it('should return binance object (buy binance, sell kucoin) if binance price lower than kucoin bid', function(done){
		let binancePrice = testLowerPrice-1;
		let kucoinPrice = {bestAsk: testHigherPrice, bestBid: testLowerPrice};
		let expectedResult = {pair: testPair, result: 'binance'};

		assert.deepStrictEqual(g.comparePrices(testPair, kucoinPrice, binancePrice), expectedResult);
		done();
	})

	it('should return kucoin object (buy kucoin, sell binance) if binance price higher than kucoin ask', function(done){
		let binancePrice = testHigherPrice+1;
		let kucoinPrice = {bestAsk: testHigherPrice, bestBid: testLowerPrice};
		let expectedResult = {pair: testPair, result: 'kucoin'};

		assert.deepStrictEqual(g.comparePrices(testPair, kucoinPrice, binancePrice), expectedResult);
		done();
	})

	it('should return pair-neither object if binance price is equal to kucoin ask/bid or within kucoin spread', function(done){
		let binancePriceWithin = (testHigherPrice+testLowerPrice)/2;
		let binancePriceLower = testLowerPrice;
		let binancePriceHigher = testHigherPrice;
		let kucoinPrice = {bestAsk: testHigherPrice, bestBid: testLowerPrice};
		let expectedResult = {pair: testPair, result: 'neither'};

		assert.deepStrictEqual(g.comparePrices(testPair, kucoinPrice, binancePriceWithin), expectedResult);
		assert.deepStrictEqual(g.comparePrices(testPair, kucoinPrice, binancePriceHigher), expectedResult);
		assert.deepStrictEqual(g.comparePrices(testPair, kucoinPrice, binancePriceLower), expectedResult);

		done();
	})

})

describe('function to check if instrument is valid', function() {
	it('should return false for null, undefined or empty inputs', function(done) {
		let nullInstrument = null;
		let undefinedInstrument = undefined;
		let emptyInstrument = "";

		assert.equal(g.isInstrumentValid(nullInstrument),false);
		assert.equal(g.isInstrumentValid(undefinedInstrument),false);
		assert.equal(g.isInstrumentValid(emptyInstrument),false);
		done();
	});

	it('should return false if format of instrument is wrong', function(done) {
		let wrongFormatInstrument1 = 'LTC';
		let wrongFormatInstrument2= 'LTCBTC';

		assert.equal(g.isInstrumentValid(wrongFormatInstrument1),false);
		assert.equal(g.isInstrumentValid(wrongFormatInstrument2),false);
		done();
	});

	it('should return true for valid instruments', function(done) {
		let validInstrument = 'LTC-BTC';
		
		assert.equal(g.isInstrumentValid(validInstrument),true);
		done();
	})
})
