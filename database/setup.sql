-- Setup script for stock_dashboard

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 10000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    symbol VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    avg_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);