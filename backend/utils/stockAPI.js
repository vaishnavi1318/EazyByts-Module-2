const axios = require('axios');
const config = require('../config/config');

class StockAPI {
    constructor() {
        this.apiKey = config.stockAPI.key;
        this.baseURL = config.stockAPI.baseURL;
    }

    async getStockPrice(symbol) {
        try {
            const response = await axios.get(`${this.baseURL}`, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            throw error;
        }
    }

    async getStockHistory(symbol) {
        try {
            const response = await axios.get(`${this.baseURL}`, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching stock history:', error);
            throw error;
        }
    }

    // Mock data for demo purposes
    getMockStockData() {
        return {
            'AAPL': { price: 175.43, change: 2.34, changePercent: 1.35 },
            'GOOGL': { price: 2800.50, change: -15.25, changePercent: -0.54 },
            'MSFT': { price: 378.85, change: 5.67, changePercent: 1.52 },
            'AMZN': { price: 3342.88, change: 45.23, changePercent: 1.37 },
            'TSLA': { price: 248.50, change: -12.35, changePercent: -4.73 }
        };
    }
}

module.exports = new StockAPI();