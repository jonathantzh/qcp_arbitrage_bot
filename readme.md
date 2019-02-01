# QCP Capital Arbitrage Bot

Steps to set up project
1. Create a `keys` folder in the project root directory, with `keys.js` file inside.
2. Export your Kucoin API keys from the `keys.js` file, as shown below:
```
exports.kucoinApiKey = '<MY KUCOIN API KEY>'
exports.kucoinApiSecret = '<MY KUCOIN API SECRET>'
```
3. Run `npm install` in project root directory
4. Run `npm run test` to run tests, ensure all are passing
5. Run `node arbitrage.js` to retrieve arbitrage opportunities in real-time
6. Run `node server.js` to start HTTP server to serve arbitrage results as array