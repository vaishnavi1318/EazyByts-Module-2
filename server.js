const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./backend/routes/auth');
const stockRoutes = require('./backend/routes/stocks');
//const portfolioRoutes = require('./routes/portfolio');
//const tradingRoutes = require('./routes/trading');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
//app.use('/api/portfolio', portfolioRoutes);
//app.use('/api/trading', tradingRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

//app.get('/portfolio', (req, res) => {
 //   res.sendFile(path.join(__dirname, '../frontend/portfolio.html'));
//});

//app.get('/trading', (req, res) => {
 //   res.sendFile(path.join(__dirname, '../frontend/trading.html'));
//});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});