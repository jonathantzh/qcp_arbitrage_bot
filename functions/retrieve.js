const axios = require('axios');
const keys = require('../keys/keys');

//setup kucoin api
const Kucoin = require('kucoin-api')
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

exports.retrieveExchangeRates = function (instruments) {
    return new Promise(function (resolve,reject) {
       axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol="+instruments, {headers: {'X-CMC_PRO_API_KEY': keys.coinmarketcapApiKey}}).then(function(res) {
            resolve(res); 
       }).catch(function(err) {reject(err)});
    });
}