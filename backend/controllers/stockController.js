const stockAPI = require('../utils/stockAPI');

exports.getStockData = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        // For demo, use mock data
        const mockData = stockAPI.getMockStockData();
        
        if (mockData[symbol]) {
            res.json({
                symbol: symbol,
                ...mockData[symbol]
            });
        } else {
            res.status(404).json({ message: 'Stock not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock data', error: error.message });
    }
};

exports.getAllStocks = (req, res) => {
    try {
        const mockData = stockAPI.getMockStockData();
        const stocks = Object.keys(mockData).map(symbol => ({
            symbol,
            ...mockData[symbol]
        }));
        
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stocks', error: error.message });
    }
};

exports.getStockHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        // Mock historical data
        const mockHistory = generateMockHistory(symbol);
        res.json(mockHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock history', error: error.message });
    }
};

function generateMockHistory(symbol) {
    const history = [];
    const basePrice = 100;
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const variation = (Math.random() - 0.5) * 10;
        const price = basePrice + variation;
        
        history.push({
            date: date.toISOString().split('T')[0],
            price: price.toFixed(2),
            volume: Math.floor(Math.random() * 1000000)
        });
    }
    
    return history;
}