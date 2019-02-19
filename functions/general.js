exports.extractMutualPairs = function(binRes, kcRes) {
    return new Promise(function (resolve,reject) {
        try {
            binSymbols = binRes.data.map(binObj => binObj.symbol)
            kcSymbols = kcRes.data.map(kcObj => kcObj.symbol);
            kcSymbolsNoDash = kcRes.data.map(kcObj => kcObj.symbol.replace('-',''));
        
            mutualPairs = [];

            binSymbols.forEach(binSymbol => {
                console.log(binSymbol)
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

exports.comparePrices = async function(pair, kcPrice, binPrice) {
    //BNB discount in first year: 50% of trading fee
    //assume binance trading fee is 0.1%, since <100BTC traded
    //assume kucoin trading fee is 0.1%, since <1000KCS held
    let binTradingFee = pair.includes('BNB') ? 0.0005 : 0.001;
    let kcTradingFee = 0.001

    let kucoinBuyPrice = parseFloat(kcPrice.data.bestAsk) * (1+kcTradingFee);
    let kucoinSellPrice = parseFloat(kcPrice.data.bestBid) * (1-kcTradingFee);

    let binanceBuyPrice = parseFloat(binPrice.price) * (1+binTradingFee);
    let binanceSellPrice = parseFloat(binPrice.price) * (1-binTradingFee);

    if(binanceBuyPrice < kucoinSellPrice) {
        console.log(pair,": Buy BINANCE @", binanceBuyPrice,"and Sell KUCOIN @", kucoinSellPrice);
        return {pair, result: 'binance'};
    } else if (kucoinBuyPrice < binanceSellPrice) {
        console.log(pair,": Buy KUCOIN @", kucoinBuyPrice, "and Sell BINANCE @", binanceSellPrice);
        return {pair, result: 'kucoin'};
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
            return true;
    }
}