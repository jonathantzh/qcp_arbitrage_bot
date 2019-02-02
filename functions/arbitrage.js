const r = require('./retrieve');
const g = require('./general');

async function main() {
    let binPairs = await r.retrieveBinanceInstruments();
    let kcPairs = await r.retrieveKcInstruments();
    let mutualPairs = await g.extractMutualPairs(binPairs,kcPairs);
    
    let arbitrageResults = [];

    for(let i=0; i<mutualPairs.length; i++) {
        console.log("Comparing prices for", mutualPairs[i], "<", i, "of", mutualPairs.length, ">");
        let kcPrice = await r.retrieveKcInstrumentsTicker(mutualPairs[i]);
        let binPrice = binPairs.data.find(pair => pair.symbol === mutualPairs[i].replace("-",""));
        let result = await g.comparePrices(mutualPairs[i], kcPrice, binPrice)
        arbitrageResults.push(result);
    };
    
    console.log('Arbitrage complete.');

    return arbitrageResults;
}

exports.run = main;
