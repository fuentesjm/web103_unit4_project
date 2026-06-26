import express from 'express'
import { getOptions } from '../controllers/pcOptions.js'

const router = express.Router()

router.get('/', getOptions)

export default router
