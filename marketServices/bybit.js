const { RestClientV5 } = require('bybit-api');
const axios = require('axios');
const { logMessage } = require('../log');

async function createOrder(key, secret, amount, coin, side) {

    const client = new RestClientV5({
        testnet: false,
        key: key,
        secret: secret,
    });

    try {
        const orderResponse = await client.submitOrder({
            category: 'linear',
            symbol: coin,
            side: side,
            orderType: 'Market',
            qty: `${amount}`,
            timeInForce: 'GTC',
        });

        logMessage(`Bir kullanıcı tarafından bybit üzerinde işlem açıldı ${amount} ${coin} ${side}`)
        return orderResponse

    } catch (error) {
        console.error('Error:', error);
        logMessage(`Error in bybit createOrder function: ${error}`)
    }
}

async function cloderOrderById(key, secret, symbol, side) {
    try {
        const client = new RestClientV5({
            testnet: false,
            key: key,
            secret: secret,
        });

        const s = side == "Buy" ? "Sell" : "Buy"

        const closeOrderResponse = await client.submitOrder({
            category: 'linear',
            symbol: symbol,
            side: s,
            orderType: 'Market',
            qty: `0`,
            reduceOnly: true,
            closeOnTrigger: true,
            timeInForce: 'GTC',
        });


        return closeOrderResponse
    } catch (error) {
        console.error('Error in closeOrderById bybit function:', error);
        logMessage(`Error in bybit close order by id function `, error.message)
    }
}

const endpoint = 'https://api.bybit.com/v5/market/tickers';

async function getCoinPrice(symbol) {
    try {

        const params = {
            category: 'linear',
            symbol: symbol,
        };

        const response = await axios.get(endpoint, { params });
        const ticker = response.data.result.list[0];
        return ticker.lastPrice
    } catch (error) {
        console.error('Fiyat alınırken hata oluştu:', error.message);
        logMessage("Error in bybit getCoinPrice function: ", error.message)
    }
}

async function getCoins() {
    const client = new RestClientV5({
        testnet: false,
    });

    const request = await client.getTickers({
        category: 'linear',
    })
    const list = request.result.list

    const symbols = await list
        .filter(symbol => symbol.symbol.includes("USDT"))
        .map(symbol => ({
            name: symbol.symbol,
            qty_step: null
        }));

    return symbols
}

async function getQty_step(symbol) {
    const client = new RestClientV5({
        testnet: false,
    });

    const request = await client.getInstrumentsInfo({
        category: 'linear',
        symbol: symbol
    })

    return request.result.list[0].lotSizeFilter.qtyStep
    
}


module.exports = {
    createOrder,
    getCoinPrice,
    cloderOrderById,
    getCoins,
    getQty_step
}
