import express from 'express'
import * as albumController from '../controllers/albums.js'
import { requireDebug } from '../middleware/middleware.js'

const router = express.Router()

router.get('/', albumController.getAllAlbums)
router.get('/genre/:genre', albumController.getAlbumsByGenre)
router.get('/classic/:id', albumController.checkIfClassic)
router.get('/:id', albumController.getAlbumById)
router.post('/', albumController.createAlbum)
router.put('/:id', albumController.updateAlbum)
router.delete('/:id', requireDebug, albumController.deleteAlbum)

export default router
