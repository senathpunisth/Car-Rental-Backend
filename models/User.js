import db from '../config/database.js'; // You'll need to set up your MySQL connection

class User {
    // Create a new user
    static async create(userData) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO users (full_name, email, phone, password_hash, role) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    userData.name,
                    userData.email,
                    userData.phone,
                    userData.password,
                    userData.role || 'customer'
                ]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // Find user by ID
    static async findById(user_id) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE user_id = ?',
                [user_id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // Find user by phone
    static async findByPhone(phone) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE phone = ?',
                [phone]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // Update user
    static async update(user_id, updateData) {
        const connection = await db.getConnection();
        try {
            const fields = [];
            const values = [];
            
            // Map the field names to match your table structure
            const fieldMap = {
                name: 'full_name',
                email: 'email',
                phone: 'phone',
                password: 'password_hash',
                role: 'role'
            };
            
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined && fieldMap[key]) {
                    fields.push(`${fieldMap[key]} = ?`);
                    values.push(updateData[key]);
                }
            });
            
            if (fields.length === 0) return null;
            
            values.push(user_id);
            const [result] = await connection.execute(
                `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
                values
            );
            
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    // Delete user
    static async delete(user_id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'DELETE FROM users WHERE user_id = ?',
                [user_id]
            );
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    // Find all users (with optional filters)
    static async findAll(filters = {}) {
        const connection = await db.getConnection();
        try {
            let query = 'SELECT * FROM users';
            const values = [];
            const whereClauses = [];
            
            // Map filter keys to database column names
            const filterMap = {
                name: 'full_name',
                email: 'email',
                phone: 'phone',
                role: 'role'
            };
            
            Object.keys(filters).forEach(key => {
                if (filterMap[key]) {
                    whereClauses.push(`${filterMap[key]} = ?`);
                    values.push(filters[key]);
                }
            });
            
            if (whereClauses.length > 0) {
                query += ` WHERE ${whereClauses.join(' AND ')}`;
            }
            
            query += ' ORDER BY created_at DESC';
            
            const [rows] = await connection.execute(query, values);
            return rows;
        } finally {
            connection.release();
        }
    }

    // Count total users
    static async count() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT COUNT(*) as count FROM users'
            );
            return rows[0].count;
        } finally {
            connection.release();
        }
    }
}

export default User;