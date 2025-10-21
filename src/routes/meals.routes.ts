import express from 'express';
import {jwtAuth, AuthRequest } from '../middleware/jwtauth.middleware';
import { query } from '../db';


const router = express.Router();


// Create a meal
router.post('/', jwtAuth, async (req: AuthRequest, res) => {
const user = req.user;
const { name, calories, notes } = req.body;
try {
const result = await query(
`INSERT INTO meals (user_id, name, calories, notes)
VALUES ($1, $2, $3, $4)
RETURNING *`,
[user.id, name, calories || null, notes || null]
);
res.status(201).json(result.rows[0]);
} catch (err) {
res.status(500).json({ error: 'DB error', details: err });
}
});


// Get all meals for user
router.get('/', jwtAuth, async (req: AuthRequest, res) => {
const user = req.user;
try {
const result = await query('SELECT * FROM meals WHERE user_id=$1 ORDER BY created_at DESC', [user.id]);
res.json(result.rows);
} catch (err) {
res.status(500).json({ error: 'DB error' });
}
});
// Get a single meal
router.get('/:id', jwtAuth, async (req: AuthRequest, res) => {
const user = req.user;
const id = Number(req.params.id);
try {
const result = await query('SELECT * FROM meals WHERE id=$1 AND user_id=$2', [id, user.id]);
if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
res.json(result.rows[0]);
} catch (err) {
res.status(500).json({ error: 'DB error' });
}
});


// Update a meal
router.put('/:id', jwtAuth, async (req: AuthRequest, res) => {
const user = req.user;
const id = Number(req.params.id);
const { name, calories, notes } = req.body;
try {
const result = await query(
`UPDATE meals SET name=$1, calories=$2, notes=$3 WHERE id=$4 AND user_id=$5 RETURNING *`,
[name, calories, notes, id, user.id]
);
if (result.rows.length === 0) return res.status(404).json({ error: 'Not found or not yours' });
res.json(result.rows[0]);
} catch (err) {
res.status(500).json({ error: 'DB error' });
}
});


// Delete a meal
router.delete('/:id', jwtAuth, async (req: AuthRequest, res) => {
const user = req.user;
const id = Number(req.params.id);
try {
const result = await query('DELETE FROM meals WHERE id=$1 AND user_id=$2 RETURNING *', [id, user.id]);
if (result.rows.length === 0) return res.status(404).json({ error: 'Not found or not yours' });
res.json({ success: true });
} catch (err) {
res.status(500).json({ error: 'DB error' });
}
});

export default router;