const r = require('./retrieve');
const g = require('./general');

async function main() {
    //retrieve crypto pairs on binance and kucoin
    try {
        let binPairs = await r.retrieveBinanceInstruments();
        let kcPairs = await r.retrieveKcInstruments();
        let mutualPairs = await g.extractMutualPairs(binPairs,kcPairs);
        
    // let mutualPairsFirstHundred = mutualPairs.slice(0,100);
    // let baseCurrencyString = mutualPairsFirstHundred.map(pair => pair.split('-')[0]).join();
    // let exchangeRates1 = await r.retrieveExchangeRates(baseCurrencyString);

    // let mutualPairsSecondHundred = mutualPairs.slice(100,);
    // let baseCurrencyString2 = mutualPairsSecondHundred.map(pair => pair.split('-')[0]).join();
    // let exchangeRates2 = await r.retrieveExchangeRates(baseCurrencyString2);

    // console.log(exchangeRates1.data.data);
    // console.log(exchangeRates2.data.data);

    // let exchangeRates = {...exchangeRates1.data.data, ...exchangeRates2.data.data}

    let arbitrageResults = [];

    for(let i=0; i<mutualPairs.length; i++) {
        console.log("Comparing prices for", mutualPairs[i], "<", i+1, "of", mutualPairs.length, ">");

        let kcPrice = await r.retrieveKcInstrumentsTicker(mutualPairs[i]);
        let binPrice = binPairs.data.find(pair => pair.symbol === mutualPairs[i].replace("-",""));

        let result = await g.comparePrices(mutualPairs[i], kcPrice, binPrice);
        arbitrageResults.push(result);
    };
    
    console.log('Arbitrage complete.');

    return arbitrageResults;

    } catch(err) {
        console.log(err);
        return [];
    }

}

async function mainSingle(instrument) {
    let binPairs = await r.retrieveBinanceInstruments();
    let kcPairs = await r.retrieveKcInstruments();
    if(binPairs.data.some(pair => pair.symbol === instrument.replace('-','')) && kcPairs.data.some(pair => pair.symbol === instrument)) {
        console.log("Comparing prices for", instrument);
        let kcPrice = await r.retrieveKcInstrumentsTicker(instrument);
        let binPrice = binPairs.data.find(pair => pair.symbol === instrument.replace("-",""));

        let exchangeRates = await r.retrieveExchangeRates(instrument.split("-")[0]);

        let result = await g.comparePrices(instrument, kcPrice, binPrice, exchangeRates);
        console.log('Arbitrage complete.');

        return result;
    } else {
        if(!binPairs.data.some(pair => pair.symbol === instrument.replace('-','')))
            console.log(instrument, "not a Binance instrument");
        if(!kcPairs.data.some(pair => pair.symbol === instrument))
            console.log(instrument, "not a Kucoin instrument");
        return;
    }
}

exports.run = main;
exports.runSingle = mainSingle;
