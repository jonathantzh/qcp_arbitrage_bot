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

exports.comparePrices = async function(pair, kcPrice, binPrice, exchangeRates) {
    //binance api only provides price (X)
    let kucoinPrice = parseFloat(kcPrice.data.lastDealPrice);
    let binancePrice = parseFloat(binPrice.price);
    let spread = parseFloat(kcPrice.data.sell) - parseFloat(kcPrice.data.buy);

    //get exchange rate of base instrument to USD (Y)
    //e.g. (base instrument is ETH) ETH-BTC = X, ETH-USD = Y, USD/BTC = X/Y => 1 USD is able to buy X/Y BTC
    if(exchangeRates.data.data[pair.split('-')[0]] !== undefined) {
        let baseCurrInUsd = exchangeRates.data.data[pair.split('-')[0]].quote.USD.price;
        let binPriceInUsd = binancePrice/baseCurrInUsd;
        let kcPriceInUsd = kucoinPrice/baseCurrInUsd;

        //price difference must be greater than spread
        if(kucoinPrice - binancePrice > spread) {
            console.log(pair,": Buy BINANCE @", binPriceInUsd,"and Sell KUCOIN @", kcPriceInUsd);
            return {pair, result: 'binance'};
        } else if (binancePrice - kucoinPrice > spread) {
            console.log(pair,": Buy KUCOIN @", kcPriceInUsd, "and Sell BINANCE @", binPriceInUsd);
            return {pair, result: 'kucoin'};
        } else {
            console.log(pair,": NEITHER");
            return {pair, result: 'neither'};
        }
    } else {
        console.log("Exchange information not found for", pair.split('-')[0], "which is required for", pair);
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