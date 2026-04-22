import express from 'express'
import { getAllUsers, deleteUser } from '../controllers/users.js'
import { ensureAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', ensureAdmin, getAllUsers)
router.delete('/:id', ensureAdmin, deleteUser)

export default router
