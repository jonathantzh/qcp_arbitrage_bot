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
    if((kcPrice.data.lastDealPrice - (kcPrice.data.sell - kcPrice.data.buy)) > binPrice.price) {
        console.log(pair,": Buy BINANCE, Sell KUCOIN");
        // saveResult(pair,'binance');
        return {pair, result: 'binance'};
    } else if ((kcPrice.data.lastDealPrice + (kcPrice.data.sell - kcPrice.data.buy)) < binPrice.price) {
        console.log(pair,": Buy KUCOIN, Sell BINANCE");
        // saveResult(pair,'kucoin');
        return {pair, result: 'kucoin'};;
    } else {
        console.log(pair,": NEITHER");
        // saveResult(pair,'neither');
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