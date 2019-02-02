# QCP Capital Arbitrage Bot

Steps to set up project

1. Create a `keys` folder in the project root directory, with `keys.js` file inside.
2. Export your Kucoin API keys from the `keys.js` file, as shown below:
```
exports.kucoinApiKey = '<MY KUCOIN API KEY>'
exports.kucoinApiSecret = '<MY KUCOIN API SECRET>'
```
## Using Docker
3. `sudo docker build -t qcp_arbitrage .`
4. `docker run -p 9500:9500 qcp_arbitrage`
## Using local environment
5. Run `npm install` in project root directory
6. Run `npm run test` to run tests, ensure all are passing
7. Run `npm start` to start HTTP server on port 9500
## Once server is running
8. `curl http://localhost:9500/arbitrageResults` to retrieve arbitrage results