const r = require('./retrieve');
const g = require('./general');

async function main() {
    //retrieve crypto pairs on binance and kucoin
    let binPairs = await r.retrieveBinanceInstruments();
    let kcPairs = await r.retrieveKcInstruments();
    let mutualPairs = await g.extractMutualPairs(binPairs,kcPairs);
    
    //use coinmarketcap api to fetch exchange rates for base currencies
    //remove duplicates of base currencies
    //problem with fetching exchange information for BCHSV (400 Bad Request), so remove that too
    let baseCurrencyArray = mutualPairs.map(pair => pair.split('-')[0]);
    baseCurrencyArray = baseCurrencyArray.filter((instrument, index, array) => array.indexOf(instrument) === index); 
    baseCurrencyArray.splice(baseCurrencyArray.indexOf('BCHSV'),1);
    let baseCurrencyString = baseCurrencyArray.join();
    let exchangeRates = await r.retrieveExchangeRates(baseCurrencyString);

    let arbitrageResults = [];

    for(let i=0; i<mutualPairs.length; i++) {
        console.log("Comparing prices for", mutualPairs[i], "<", i+1, "of", mutualPairs.length, ">");

        let kcPrice = await r.retrieveKcInstrumentsTicker(mutualPairs[i]);
        let binPrice = binPairs.data.find(pair => pair.symbol === mutualPairs[i].replace("-",""));

        let result = await g.comparePrices(mutualPairs[i], kcPrice, binPrice, exchangeRates)
        arbitrageResults.push(result);
    };
    
    console.log('Arbitrage complete.');

    return arbitrageResults;
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
