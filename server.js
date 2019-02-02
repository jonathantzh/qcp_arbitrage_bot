//setup express
const express = require("express");
const cors = require('cors');
var app = express();
app.options('*', cors()) // include before other routes

const a = require("./functions/arbitrage");
const g = require("./functions/general");

app.get('/arbitrageResults', cors(), async (req,res) => {
    console.log("GET on /arbitrageResults received! Getting results...");
    try {
        let arbitrageResults = await a.run();
        res.status(200).send(arbitrageResults);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
})

app.get('/arbitrageResult', cors(), async (req,res) => {
    console.log("GET on /arbitrageResult received! Getting result...");
    try {
        let instrument = req.query.instrument;
        if(g.isInstrumentValid(instrument)){
            let arbitrageResult = await a.runSingle(instrument);
            res.status(200).send(arbitrageResult);
        } else {
            console.log(instrument, "not a valid instrument!");
            res.status(400).send();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
})

console.log('Arbitrage server listening on 9500!');
app.listen(9500);
