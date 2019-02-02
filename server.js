//setup express
const express = require("express");
const cors = require('cors');
var app = express();
app.options('*', cors()) // include before other routes

const a = require("./functions/arbitrage");

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

console.log('Arbitrage server listening on 9500!');
app.listen(9500);
