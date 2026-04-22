import express from 'express'
import * as albumController from '../controllers/albums.js'
import { requireDebug } from '../middleware/middleware.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', albumController.getAllAlbums)
router.get('/:id', albumController.getAlbumById)

router.post('/', authenticateToken, albumController.createAlbum)
router.put('/:id', authenticateToken, albumController.updateAlbum)
router.delete(
  '/:id',
  authenticateToken,
  requireDebug,
  albumController.deleteAlbum,
)

export default router