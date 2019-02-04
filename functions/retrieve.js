const axios = require('axios');

//setup kucoin api
const Kucoin = require('kucoin-api')
const keys = require('../keys/keys');
const kc = new Kucoin(keys.kucoinApiKey, keys.kucoinApiSecret);

exports.retrieveBinanceInstruments = function() {
    return new Promise(function (resolve,reject) {
        axios.get("https://api.binance.com/api/v3/ticker/price").then(function (res) {
            resolve(res);
            done();
        }).catch(function(err) {reject(err)});
    })
}

exports.retrieveKcInstruments = function() {
    return new Promise(function (resolve,reject) {
        kc.getTradingSymbols().then(function(res){
			resolve(res);
			done();
		}).catch(function(err) {reject(err)});
    })
}

exports.retrieveKcInstrumentsTicker = function (pair) {
    return new Promise(function (resolve,reject) {
        kc.getTicker({pair}).then(function(res) {
            resolve(res);
        }).catch(function(err){reject(err)});
    });
}

exports.retrieveKcExchangeRates = function (instruments) {

    let baseInstruments = instruments.map(instrument => instrument.split('-')[0])

    return new Promise(function (resolve,reject) {
        kc.getExchangeRates({symbols: baseInstruments}).then(function(res) {
            resolve(res);
        }).catch(function(err){reject(err)});
    });
}