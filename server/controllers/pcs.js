import { pool } from '../config/database.js'

// Sum the prices of the chosen part ids straight from the DB, so the stored
// total can't be faked by the client. Ignores any null selections.
const calcTotal = async (ids) => {
    const chosen = ids.filter((id) => id !== null && id !== undefined && id !== '')
    if (chosen.length === 0) return 0
    const result = await pool.query(
        'SELECT COALESCE(SUM(price), 0) AS total FROM pc_options WHERE id = ANY($1)',
        [chosen]
    )
    return Number(result.rows[0].total)
}

// GET /api/pcs  → list of all saved builds (for the View page)
export const getPCs = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM pcs ORDER BY id')
        res.status(200).json(results.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET /api/pcs/:id  → one build, joined with each part's name for display
export const getPC = async (req, res) => {
    try {
        const { id } = req.params
        const results = await pool.query(
            `SELECT
                pcs.*,
                cpu.name     AS cpu_name,
                gpu.name     AS gpu_name,
                ram.name     AS ram_name,
                storage.name AS storage_name,
                pc_case.name AS pc_case_name
             FROM pcs
             LEFT JOIN pc_options cpu     ON pcs.cpu = cpu.id
             LEFT JOIN pc_options gpu     ON pcs.gpu = gpu.id
             LEFT JOIN pc_options ram     ON pcs.ram = ram.id
             LEFT JOIN pc_options storage ON pcs.storage = storage.id
             LEFT JOIN pc_options pc_case ON pcs.pc_case = pc_case.id
             WHERE pcs.id = $1`,
            [id]
        )
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'PC build not found' })
        }
        res.status(200).json(results.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// POST /api/pcs  → create a new build
export const createPC = async (req, res) => {
    try {
        const { name, cpu, gpu, ram, storage, pc_case } = req.body
        const total_price = await calcTotal([cpu, gpu, ram, storage, pc_case])
        const results = await pool.query(
            `INSERT INTO pcs (name, cpu, gpu, ram, storage, pc_case, total_price)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [name, cpu, gpu, ram, storage, pc_case, total_price]
        )
        res.status(201).json(results.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// PATCH /api/pcs/:id  → update an existing build
export const updatePC = async (req, res) => {
    try {
        const { id } = req.params
        const { name, cpu, gpu, ram, storage, pc_case } = req.body
        const total_price = await calcTotal([cpu, gpu, ram, storage, pc_case])
        const results = await pool.query(
            `UPDATE pcs
             SET name = $1, cpu = $2, gpu = $3, ram = $4, storage = $5,
                 pc_case = $6, total_price = $7
             WHERE id = $8
             RETURNING *`,
            [name, cpu, gpu, ram, storage, pc_case, total_price, id]
        )
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'PC build not found' })
        }
        res.status(200).json(results.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/pcs/:id  → remove a build
export const deletePC = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM pcs WHERE id = $1', [id])
        res.status(200).json({ message: 'PC build deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export default { getPCs, getPC, createPC, updatePC, deletePC }
