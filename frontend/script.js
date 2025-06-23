// Stock Market Dashboard - Main JavaScript File

// Global Variables
let currentUser = {
    name: "John Doe",
    balance: 50000,
    portfolio: []
};

let watchlist = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
let currentPrices = {};
let chartData = [];

// Sample Stock Data (Mock API Response)
const mockStockData = {
    'AAPL': { price: 175.50, change: +2.30, changePercent: +1.33 },
    'GOOGL': { price: 2750.80, change: -15.20, changePercent: -0.55 },
    'MSFT': { price: 415.25, change: +8.75, changePercent: +2.15 },
    'TSLA': { price: 245.67, change: -5.40, changePercent: -2.15 },
    'AMZN': { price: 3380.50, change: +12.45, changePercent: +0.37 },
    'META': { price: 485.33, change: +18.20, changePercent: +3.90 },
    'NVDA': { price: 875.45, change: +25.80, changePercent: +3.04 }
};

// DOM Elements
const elements = {
    balanceDisplay: null,
    portfolioValue: null,
    gainLoss: null,
    stockList: null,
    portfolioList: null,
    buyForm: null,
    sellForm: null,
    addToWatchlistBtn: null,
    searchInput: null
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadUserData();
    displayStockPrices();
    displayPortfolio();
    updateDashboardStats();
    setupEventListeners();
    startRealTimeUpdates();
});

// Initialize DOM Elements
function initializeElements() {
    elements.balanceDisplay = document.getElementById('balance');
    elements.portfolioValue = document.getElementById('portfolio-value');
    elements.gainLoss = document.getElementById('gain-loss');
    elements.stockList = document.getElementById('stock-list');
    elements.portfolioList = document.getElementById('portfolio-list');
    elements.buyForm = document.getElementById('buy-form');
    elements.sellForm = document.getElementById('sell-form');
    elements.addToWatchlistBtn = document.getElementById('add-watchlist');
    elements.searchInput = document.getElementById('stock-search');
}

// Load User Data from Local Storage
function loadUserData() {
    const savedUser = localStorage.getItem('stockDashboardUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    if (savedWatchlist) {
        watchlist = JSON.parse(savedWatchlist);
    }
}

// Save User Data to Local Storage
function saveUserData() {
    localStorage.setItem('stockDashboardUser', JSON.stringify(currentUser));
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
}

// Display Stock Prices in Watchlist
function displayStockPrices() {
    if (!elements.stockList) return;
    
    elements.stockList.innerHTML = '';
    
    watchlist.forEach(symbol => {
        const stock = mockStockData[symbol];
        if (!stock) return;
        
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item';
        stockItem.innerHTML = `
            <div class="stock-info">
                <span class="stock-symbol">${symbol}</span>
                <span class="stock-price">$${stock.price.toFixed(2)}</span>
            </div>
            <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                <span>${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}</span>
                <span>(${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)</span>
            </div>
            <div class="stock-actions">
                <button onclick="buyStock('${symbol}')" class="btn btn-buy">Buy</button>
                <button onclick="removeFromWatchlist('${symbol}')" class="btn btn-remove">Remove</button>
            </div>
        `;
        
        elements.stockList.appendChild(stockItem);
        currentPrices[symbol] = stock.price;
    });
}

// Display Portfolio Holdings
function displayPortfolio() {
    if (!elements.portfolioList) return;
    
    elements.portfolioList.innerHTML = '';
    
    if (currentUser.portfolio.length === 0) {
        elements.portfolioList.innerHTML = '<p class="no-holdings">No holdings yet. Start trading to build your portfolio!</p>';
        return;
    }
    
    currentUser.portfolio.forEach((holding, index) => {
        const currentPrice = mockStockData[holding.symbol]?.price || holding.avgPrice;
        const totalValue = holding.shares * currentPrice;
        const totalCost = holding.shares * holding.avgPrice;
        const gainLoss = totalValue - totalCost;
        const gainLossPercent = (gainLoss / totalCost) * 100;
        
        const holdingItem = document.createElement('div');
        holdingItem.className = 'portfolio-item';
        holdingItem.innerHTML = `
            <div class="holding-info">
                <span class="holding-symbol">${holding.symbol}</span>
                <span class="holding-shares">${holding.shares} shares</span>
            </div>
            <div class="holding-prices">
                <span>Avg: $${holding.avgPrice.toFixed(2)}</span>
                <span>Current: $${currentPrice.toFixed(2)}</span>
            </div>
            <div class="holding-value">
                <span class="total-value">$${totalValue.toFixed(2)}</span>
                <span class="gain-loss ${gainLoss >= 0 ? 'positive' : 'negative'}">
                    ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLossPercent.toFixed(2)}%)
                </span>
            </div>
            <div class="holding-actions">
                <button onclick="sellStock('${holding.symbol}')" class="btn btn-sell">Sell</button>
            </div>
        `;
        
        elements.portfolioList.appendChild(holdingItem);
    });
}

// Update Dashboard Statistics
function updateDashboardStats() {
    // Update balance
    if (elements.balanceDisplay) {
        elements.balanceDisplay.textContent = `$${currentUser.balance.toLocaleString()}`;
    }
    
    // Calculate portfolio value and gain/loss
    let totalPortfolioValue = 0;
    let totalCost = 0;
    
    currentUser.portfolio.forEach(holding => {
        const currentPrice = mockStockData[holding.symbol]?.price || holding.avgPrice;
        totalPortfolioValue += holding.shares * currentPrice;
        totalCost += holding.shares * holding.avgPrice;
    });
    
    const totalGainLoss = totalPortfolioValue - totalCost;
    
    if (elements.portfolioValue) {
        elements.portfolioValue.textContent = `$${totalPortfolioValue.toLocaleString()}`;
    }
    
    if (elements.gainLoss) {
        elements.gainLoss.textContent = `${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)}`;
        elements.gainLoss.className = totalGainLoss >= 0 ? 'positive' : 'negative';
    }
}

// Buy Stock Function
function buyStock(symbol) {
    const shares = prompt(`How many shares of ${symbol} would you like to buy?`);
    if (!shares || isNaN(shares) || shares <= 0) {
        alert('Please enter a valid number of shares.');
        return;
    }
    
    const numShares = parseInt(shares);
    const stockPrice = mockStockData[symbol].price;
    const totalCost = numShares * stockPrice;
    
    if (totalCost > currentUser.balance) {
        alert('Insufficient funds!');
        return;
    }
    
    // Check if user already owns this stock
    const existingHolding = currentUser.portfolio.find(h => h.symbol === symbol);
    
    if (existingHolding) {
        // Update existing holding with average price
        const totalShares = existingHolding.shares + numShares;
        const totalValue = (existingHolding.shares * existingHolding.avgPrice) + (numShares * stockPrice);
        existingHolding.avgPrice = totalValue / totalShares;
        existingHolding.shares = totalShares;
    } else {
        // Add new holding
        currentUser.portfolio.push({
            symbol: symbol,
            shares: numShares,
            avgPrice: stockPrice,
            purchaseDate: new Date().toISOString()
        });
    }
    
    // Deduct from balance
    currentUser.balance -= totalCost;
    
    // Update displays
    displayPortfolio();
    updateDashboardStats();
    saveUserData();
    
    alert(`Successfully bought ${numShares} shares of ${symbol} for $${totalCost.toFixed(2)}`);
}

// Sell Stock Function
function sellStock(symbol) {
    const holding = currentUser.portfolio.find(h => h.symbol === symbol);
    if (!holding) {
        alert('You do not own this stock.');
        return;
    }
    
    const shares = prompt(`You own ${holding.shares} shares of ${symbol}. How many would you like to sell?`);
    if (!shares || isNaN(shares) || shares <= 0 || shares > holding.shares) {
        alert('Please enter a valid number of shares.');
        return;
    }
    
    const numShares = parseInt(shares);
    const currentPrice = mockStockData[symbol].price;
    const totalValue = numShares * currentPrice;
    
    // Update holding
    holding.shares -= numShares;
    
    // Remove holding if all shares sold
    if (holding.shares === 0) {
        currentUser.portfolio = currentUser.portfolio.filter(h => h.symbol !== symbol);
    }
    
    // Add to balance
    currentUser.balance += totalValue;
    
    // Update displays
    displayPortfolio();
    updateDashboardStats();
    saveUserData();
    
    alert(`Successfully sold ${numShares} shares of ${symbol} for $${totalValue.toFixed(2)}`);
}

// Add Stock to Watchlist
function addToWatchlist() {
    if (!elements.searchInput) return;
    
    const symbol = elements.searchInput.value.toUpperCase().trim();
    if (!symbol) {
        alert('Please enter a stock symbol.');
        return;
    }
    
    if (watchlist.includes(symbol)) {
        alert('Stock is already in your watchlist.');
        return;
    }
    
    if (!mockStockData[symbol]) {
        alert('Stock symbol not found. Available symbols: ' + Object.keys(mockStockData).join(', '));
        return;
    }
    
    watchlist.push(symbol);
    elements.searchInput.value = '';
    displayStockPrices();
    saveUserData();
    alert(`${symbol} added to watchlist!`);
}

// Remove Stock from Watchlist
function removeFromWatchlist(symbol) {
    watchlist = watchlist.filter(s => s !== symbol);
    displayStockPrices();
    saveUserData();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add to watchlist button
    if (elements.addToWatchlistBtn) {
        elements.addToWatchlistBtn.addEventListener('click', addToWatchlist);
    }
    
    // Search input enter key
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addToWatchlist();
            }
        });
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            
            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show Different Sections
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Simulate Real-time Price Updates
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate price changes
        Object.keys(mockStockData).forEach(symbol => {
            const change = (Math.random() - 0.5) * 10; // Random change between -5 and +5
            mockStockData[symbol].price += change;
            mockStockData[symbol].change = change;
            mockStockData[symbol].changePercent = (change / mockStockData[symbol].price) * 100;
        });
        
        // Update displays
        displayStockPrices();
        displayPortfolio();
        updateDashboardStats();
    }, 30000); // Update every 30 seconds
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Reset Portfolio (for testing)
function resetPortfolio() {
    if (confirm('Are you sure you want to reset your portfolio? This cannot be undone.')) {
        currentUser.balance = 50000;
        currentUser.portfolio = [];
        saveUserData();
        displayPortfolio();
        updateDashboardStats();
        alert('Portfolio reset successfully!');
    }
}

// Export functions for use in HTML
window.buyStock = buyStock;
window.sellStock = sellStock;
window.removeFromWatchlist = removeFromWatchlist;
window.resetPortfolio = resetPortfolio;