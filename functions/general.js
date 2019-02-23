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
            resolve(mutualPairs);
        } catch (err) {
            reject(err);
        }
    })
}

exports.comparePrices = function(pair, kcPrice, binPrice) {
    let kucoinBuyPrice = applyKucoinTradingFees(parseFloat(kcPrice.bestAsk), 'buy');
    let kucoinSellPrice = applyKucoinTradingFees(parseFloat(kcPrice.bestBid), 'sell');

    let binanceBuyPrice = applyBinanceTradingFees(parseFloat(binPrice), 'buy', pair);
    let binanceSellPrice = applyBinanceTradingFees(parseFloat(binPrice), 'sell', pair);

    if(binanceBuyPrice < kucoinSellPrice) {
        console.log(pair,": Buy BINANCE @", binanceBuyPrice,"and Sell KUCOIN @", kucoinSellPrice, "with size:", kcPrice.bestBidSize);
        return {pair, result: 'binance', size: kcPrice.bestBidSize};
    } else if (kucoinBuyPrice < binanceSellPrice) {
        console.log(pair,": Buy KUCOIN @", kucoinBuyPrice, "and Sell BINANCE @", binanceSellPrice, "with size", kcPrice.bestAskSize);
        return {pair, result: 'kucoin', size: kcPrice.bestAskSize};
    } else {
        console.log(pair,": NEITHER");
        return {pair, result: 'neither'};
    }
}

exports.isInstrumentValid = function(instrument) {
    switch(instrument) {
        case "":
            return false;
        case undefined:
            return false;
        case null:
            return false;
        default:
            if(instrument.split('-').length !== 2)
                return false;
            return true;
    }
}

const applyKucoinTradingFees = function (price, position) {
    //assume kucoin trading fee is 0.1%, since <1000KCS held
    let kucoinTradingFee = 0.001;

    if(position === 'buy') {
        return price * (1+kucoinTradingFee);
    } else if(position === 'sell') {
        return price * (1-kucoinTradingFee);
    } else {
        throw new TypeError('Invalid function call: applyKucoinTradingFees()');
    }
};

const applyBinanceTradingFees = function (price, position, pair) {
    //BNB discount in first year: 50% of trading fee
    //assume binance trading fee is 0.1%, since <100BTC traded

    let binTradingFee = pair.includes('BNB') ? 0.0005 : 0.001;
    if(position === 'buy') {
        return price * (1+binTradingFee);
    } else if(position === 'sell') {
        return price * (1-binTradingFee);
    } else {
        throw new TypeError('Invalid function call: applyBinanceTradingFees()');
    }
}

exports.applyKucoinTradingFees = applyKucoinTradingFees;
exports.applyBinanceTradingFees = applyBinanceTradingFees;