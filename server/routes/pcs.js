import express from 'express'
import {
    getPCs,
    getPC,
    createPC,
    updatePC,
    deletePC,
} from '../controllers/pcs.js'

const router = express.Router()

router.get('/', getPCs)
router.get('/:id', getPC)
router.post('/', createPC)
router.patch('/:id', updatePC)
router.delete('/:id', deletePC)

export default router
