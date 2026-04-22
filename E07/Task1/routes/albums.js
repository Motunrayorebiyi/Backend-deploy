import express from 'express'
import * as albumController from '../controllers/albums.js'
import { requireDebug } from '../middleware/middleware.js'
import { ensureAuthenticated } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', albumController.getAllAlbums)
router.get('/:id', albumController.getAlbumById)

router.post('/', ensureAuthenticated, albumController.createAlbum)
router.put('/:id', ensureAuthenticated, albumController.updateAlbum)
router.delete(
  '/:id',
  ensureAuthenticated,
  requireDebug,
  albumController.deleteAlbum,
)

export default router