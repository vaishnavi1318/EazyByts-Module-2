require('dotenv').config();

module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'stock_dashboard'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h'
    },
    stockAPI: {
        key: process.env.STOCK_API_KEY || 'demo',
        baseURL: 'https://www.alphavantage.co/query'
    }
};