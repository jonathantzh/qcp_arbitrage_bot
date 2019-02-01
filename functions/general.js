const axios = require('axios');
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
        kc.getTicker({
            pair
        }).then(function(res) {
            resolve(res);
        }).catch(function(err){reject(err)});
    });
}

exports.extractMutualPairs = function(binRes, kcRes) {
    return new Promise(function (resolve,reject) {
        try {
            binSymbols = binRes.data.map(binObj => binObj.symbol)
            kcSymbols = kcRes.data.map(kcObj => kcObj.symbol);
            kcSymbolsNoDash = kcRes.data.map(kcObj => kcObj.symbol.replace('-',''));
        
            mutualPairs = [];

            binSymbols.forEach(binSymbol => {
                if(kcSymbolsNoDash.indexOf(binSymbol) > -1) {
                    mutualPairs.push(kcSymbols[kcSymbolsNoDash.indexOf(binSymbol)]);
                }
            });
            resolve (mutualPairs);
        } catch (err) {
            reject(err);
        }
    })
}