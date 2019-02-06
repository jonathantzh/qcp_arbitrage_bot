# QCP Capital Arbitrage Bot
1. Clone the repo: `git clone https://github.com/jonathantzh/qcp_arbitrage_bot.git`
2. Create a `keys` folder in the project root directory, with `keys.js` file inside
3. Export your Kucoin and CoinMarketCap API keys from the `keys.js` file, as shown below:
```
exports.kucoinApiKey = '<MY KUCOIN API KEY>'
exports.kucoinApiSecret = '<MY KUCOIN API SECRET>'
exports.coinmarketcapApiKey = '<MY COINMARKETCAP API KEY>'
```
## Using Docker
4. `sudo docker build -t qcp_arbitrage .`
5. `docker run -p 9500:9500 qcp_arbitrage`
## Using local environment
6. Run `npm install` in project root directory
7. Run `npm start` to start HTTP server on port 9500
## Once server is running
8. `curl http://localhost:9500/arbitrageResults` to retrieve all arbitrage results
9. `curl http://localhost:9500/arbitrageResult?instrument={instrument (e.g. LTC-BTC)}` to retrieve arbitrage result for single instrument
10. If using PowerShell `curl`, you may need to add the flag `-UseBasicParsing`
