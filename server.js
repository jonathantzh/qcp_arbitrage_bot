//setup express
const express = require("express");
const cors = require('cors');
var app = express();
app.options('*', cors()) // include before other routes

//setup mongo
const MongoClient = require("mongodb");
const url = "mongodb://localhost:27017";
const dbToUse = "qcpdb"

app.get('/arbitrageResults', cors(), (req,res) => {
    console.log("GET on /arbitrageResults received!");
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
        if (err) {
            console.log(err)
            db.close();
        } else {
            let dbo = db.db(dbToUse);
            dbo.collection("arbitrageResults").find({}).toArray((err,arbResults) => {
                if (err) {
                    console.log("Unable to connect to db!");
                    db.close();
                } else {
                    res.status(200).send(arbResults);
                    db.close();
                }
            });
        }
    });
})

console.log('Arbitrage server listening on 9500!');
app.listen(9500);
