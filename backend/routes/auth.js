const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/register', async (req, res) => {
    try {
        const { full_name, email, login, password, role } = req.body;

        const check = await pool.query('SELECT id FROM users WHERE login = $1 OR email = $2', [login, email]);
        
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        await pool.query(
            'INSERT INTO users (full_name, email, login, password, role) VALUES ($1, $2, $3, $4, $5)',
            [full_name, email, login, password, role || 'client']
        );

        res.json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        const result = await pool.query(
            'SELECT id, full_name, email, role FROM users WHERE login = $1 AND password = $2',
            [login, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        const user = result.rows[0];

        res.json({
            message: 'Успешный вход',
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка авторизации' });
    }
});

module.exports = router;