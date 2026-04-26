const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/trainings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.title,
                t.description,
                t.coach
            FROM trainings t
            ORDER BY t.id
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения тренировок' });
    }
});

router.get('/schedule', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                s.id,
                t.title AS training_title,
                t.coach,
                u.full_name AS client_name,
                s.training_date,
                s.training_time
            FROM schedule s
            JOIN trainings t ON s.training_id = t.id
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.training_date, s.training_time
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения расписания' });
    }
});

module.exports = router;