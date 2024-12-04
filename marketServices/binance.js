const { logMessage } = require('../log');

const Binance = require('binance-api-node').default;

async function createOrder(apiKey, secretKey, amount, symbol, side) {
  try {
   
    const client = Binance({
      apiKey: apiKey,
      apiSecret: secretKey,
      recvWindow: 120000,
    });

    const posSide = side == "BUY" ? "LONG" : "SHORT"
    const order = await client.futuresOrder({
      symbol: symbol,
      side: side,
      type: 'MARKET',
      quantity: amount,
      positionSide: posSide
    });

    logMessage(`Bir kullanıcı tarafından binance üzerinde işlem açıldı ${symbol} ${amount} ${side}`)
    return order

  } catch (error) {
    console.error(`Error in binanceCreateOrder function: ${error}`);
    
    if(error.message.includes("position side does not match user's")) {
      return `hedgeError`
    }

    logMessage(`Error in binanceCreateOrder function ${error}`)
    return error.message
  }
}


async function closePosition(apiKey, secretKey, symbol, quantity, side) {
  try {
    const client = Binance({
      apiKey: apiKey,
      apiSecret: secretKey,
      recvWindow: 120000,
    });

    console.log(side);
    const s = side == "BUY" ? "SELL" : "BUY";
    const posSide = side == "BUY" ? "LONG" : "SHORT"

    const order = await client.futuresOrder({
      symbol: symbol,
      side: s,
      quantity: quantity,
      type: 'MARKET',
      positionSide: posSide,
    });

    return order;
  } catch (error) {
    console.error('Error in binance closePosition function:', error);
    logMessage(`Error in binance closePosition function ${error}`);
    return error.message;
  }
};


async function getCoinPrice(apiKey, secretKey, symbol) {
  try {
    const binance = Binance({
      APIKEY: apiKey,
      APISECRET: secretKey 
    });
    const price = await binance.futuresPrices(symbol);

    return price[symbol];
  } catch (error) {
    console.error('Error in binance getCoinPrice function:', error);
    logMessage(`Error in getCoinPrice function ${error}`)
    throw error;
  }
};


async function getCoins() {
  const binance = Binance({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET
  });

  try {
    const exchangeInfo = await binance.futuresExchangeInfo();
    const symbols = exchangeInfo.symbols;

    const activeSymbols = await symbols
    .filter(symbol => symbol.status === 'TRADING') 
    .map(symbol => {
      return {
        "name": symbol.symbol,
        "quantityPrecision": symbol.quantityPrecision,
        "pricePrecision": symbol.pricePrecision
      };
    });

    return activeSymbols;
  } catch (error) {
    console.error(`Error in get binanceSymbols function ${error}`);
    logMessage(`Error in get binanceSymbols function ${error}`)
    throw error;
  }
}



module.exports = {
  createOrder,
  getCoinPrice,
  getCoins,
  closePosition
}
