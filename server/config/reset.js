import 'dotenv/config'
import { pool } from './database.js'

// ---------------------------------------------------------------------------
// Seed data: the catalog of parts users can choose from.
// `size` is only meaningful for gpu + pc_case (used for the compatibility rule:
// a "full" GPU does not fit inside a "mini" case).
// ---------------------------------------------------------------------------
const pcOptions = [
    // CPUs
    { type: 'cpu', name: 'Intel Core i5-13400F', price: 200, size: null },
    { type: 'cpu', name: 'Intel Core i7-13700K', price: 400, size: null },
    { type: 'cpu', name: 'AMD Ryzen 5 7600X', price: 230, size: null },
    { type: 'cpu', name: 'AMD Ryzen 9 7950X', price: 580, size: null },

    // GPUs
    { type: 'gpu', name: 'NVIDIA RTX 4060 (compact)', price: 300, size: 'mini' },
    { type: 'gpu', name: 'NVIDIA RTX 4070', price: 600, size: 'full' },
    { type: 'gpu', name: 'NVIDIA RTX 4090', price: 1600, size: 'full' },
    { type: 'gpu', name: 'AMD Radeon RX 7600 (compact)', price: 270, size: 'mini' },

    // RAM
    { type: 'ram', name: '16GB DDR5', price: 60, size: null },
    { type: 'ram', name: '32GB DDR5', price: 120, size: null },
    { type: 'ram', name: '64GB DDR5', price: 260, size: null },

    // Storage
    { type: 'storage', name: '500GB NVMe SSD', price: 50, size: null },
    { type: 'storage', name: '1TB NVMe SSD', price: 90, size: null },
    { type: 'storage', name: '2TB NVMe SSD', price: 160, size: null },

    // Cases
    { type: 'pc_case', name: 'Mini-ITX Cube', price: 80, size: 'mini' },
    { type: 'pc_case', name: 'Mid Tower ATX', price: 110, size: 'full' },
    { type: 'pc_case', name: 'Full Tower ATX', price: 180, size: 'full' },
]

const createTables = async () => {
    // Drop in dependency order (pcs references pc_options), then recreate.
    const createTablesQuery = `
        DROP TABLE IF EXISTS pcs;
        DROP TABLE IF EXISTS pc_options;

        CREATE TABLE IF NOT EXISTS pc_options (
            id      SERIAL PRIMARY KEY,
            type    TEXT NOT NULL,
            name    TEXT NOT NULL,
            price   NUMERIC NOT NULL DEFAULT 0,
            size    TEXT
        );

        CREATE TABLE IF NOT EXISTS pcs (
            id          SERIAL PRIMARY KEY,
            name        TEXT NOT NULL,
            cpu         INTEGER REFERENCES pc_options(id),
            gpu         INTEGER REFERENCES pc_options(id),
            ram         INTEGER REFERENCES pc_options(id),
            storage     INTEGER REFERENCES pc_options(id),
            pc_case     INTEGER REFERENCES pc_options(id),
            total_price NUMERIC NOT NULL DEFAULT 0
        );
    `

    try {
        await pool.query(createTablesQuery)
        console.log('🎉 tables created successfully')
    } catch (err) {
        console.error('⚠️ error creating tables', err)
    }
}

const seedOptions = async () => {
    try {
        for (const option of pcOptions) {
            await pool.query(
                'INSERT INTO pc_options (type, name, price, size) VALUES ($1, $2, $3, $4)',
                [option.type, option.name, option.price, option.size]
            )
        }
        console.log('🌱 pc_options seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding pc_options', err)
    }
}

const reset = async () => {
    await createTables()
    await seedOptions()
    await pool.end()
}

reset()
