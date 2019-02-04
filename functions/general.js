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

exports.comparePrices = async function(pair, kcPrice, binPrice) {
    //price difference must be greater than spread
    let kucoinPrice = kcPrice.data.lastDealPrice;
    let binancePrice = binPrice.price;
    let spread = kcPrice.data.sell - kcPrice.data.buy;
    if(kucoinPrice - binancePrice > spread) {
        console.log(pair,": Buy BINANCE, Sell KUCOIN");
        return {pair, result: 'binance'};
    } else if (binancePrice - kucoinPrice > spread) {
        console.log(pair,": Buy KUCOIN, Sell BINANCE");
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