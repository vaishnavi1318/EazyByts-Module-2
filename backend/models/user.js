const db = require('../utils/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 10000] // Starting with $10,000
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, email, balance, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updateBalance(userId, newBalance) {
        await db.execute(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );
    }
}

module.exports = User;