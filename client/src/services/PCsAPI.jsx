// All calls go through Vite's proxy: '/api' → http://localhost:3000 (see vite.config.js)
const BASE = '/api'

// --- Parts catalog -------------------------------------------------------
export const getOptions = async () => {
    const res = await fetch(`${BASE}/options`)
    return res.json()
}

// --- PC builds (CRUD) ----------------------------------------------------
export const getAllPCs = async () => {
    const res = await fetch(`${BASE}/pcs`)
    return res.json()
}

export const getPC = async (id) => {
    const res = await fetch(`${BASE}/pcs/${id}`)
    return res.json()
}

export const createPC = async (pc) => {
    const res = await fetch(`${BASE}/pcs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pc),
    })
    return res.json()
}

export const updatePC = async (id, pc) => {
    const res = await fetch(`${BASE}/pcs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pc),
    })
    return res.json()
}

export const deletePC = async (id) => {
    const res = await fetch(`${BASE}/pcs/${id}`, { method: 'DELETE' })
    return res.json()
}

export default { getOptions, getAllPCs, getPC, createPC, updatePC, deletePC }
