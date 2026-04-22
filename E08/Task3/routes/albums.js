import express from 'express'
import * as albumController from '../controllers/albums.js'
import Albums from '../models/Albums.js'
import {
  ensureAuthenticated,
  ensureOwnerOrAdmin,
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', albumController.getAllAlbums)
router.get('/:id', albumController.getAlbumById)
router.post('/', ensureAuthenticated, albumController.createAlbum)

router.put(
  '/:id',
  ensureOwnerOrAdmin(async (req) => {
    const album = await Albums.findById(req.params.id)
    return album ? album.owner : null
  }),
  albumController.updateAlbum,
)

router.delete(
  '/:id',
  ensureOwnerOrAdmin(async (req) => {
    const album = await Albums.findById(req.params.id)
    return album ? album.owner : null
  }),
  albumController.deleteAlbum,
)

export default router