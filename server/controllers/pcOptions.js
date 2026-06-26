import { pool } from '../config/database.js'

// GET /api/options  → every part in the catalog, ordered so the frontend can
// group them by type (cpu, gpu, ram, storage, pc_case).
export const getOptions = async (req, res) => {
    try {
        const results = await pool.query(
            'SELECT * FROM pc_options ORDER BY type, price'
        )
        res.status(200).json(results.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
