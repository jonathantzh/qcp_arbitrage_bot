//setup mongo
const MongoClient = require("mongodb");
const url = "mongodb://localhost:27017";
const dbToUse = "qcpdb"

const f = require('./functions/general');

console.log('Arbitrage system begin. Press Ctrl+C to stop.');

function saveResult(pair, result) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err)
            db.close();
        } else {
            let dbo = db.db(dbToUse);
            dbo.collection("arbitrageResults").findOneAndUpdate({pair}, {$set:{result}},{upsert: true},(err,res) => {
                if (err) {
                    console.log("Unable to connect to db!");
                }
                db.close();
            });
        }
    });
}

async function comparePrices(pair, kcPrice, binPrice) {
    //price difference must be greater than spread
    if((kcPrice.data.lastDealPrice - (kcPrice.data.sell - kcPrice.data.buy)) > binPrice.price) {
        console.log(pair,": Buy BINANCE, Sell KUCOIN");
        saveResult(pair,'binance');
        return;
    } else if ((kcPrice.data.lastDealPrice + (kcPrice.data.sell - kcPrice.data.buy)) < binPrice.price) {
        console.log(pair,": Buy KUCOIN, Sell BINANCE");
        saveResult(pair,'kucoin');
        return;
    } else {
        console.log(pair,": NEITHER");
        saveResult(pair,'neither');
        return; 
    }
}

async function main() {
    while(true) {
        let binPairs = await f.retrieveBinanceInstruments();
        let kcPairs = await f.retrieveKcInstruments();
        let mutualPairs = await f.extractMutualPairs(binPairs,kcPairs);
        
        for(let i=0; i<mutualPairs.length; i++) {
            console.log("Comparing prices for", mutualPairs[i], "<", i, "of", mutualPairs.length, ">");
            let kcPrice = await f.retrieveKcInstrumentsTicker(mutualPairs[i]);
            let binPrice = binPairs.data.find(pair => pair.symbol === mutualPairs[i].replace("-",""));

            comparePrices(mutualPairs[i], kcPrice, binPrice);
        };

        console.log('Iteration complete. Restarting...')
    }
}

main();