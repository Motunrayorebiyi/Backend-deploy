import Albums from '../models/Albums.js'

export async function getAllAlbums(req, res) {
  try {
    const filter = {}
    if (req.query.year) {
      filter.year = Number(req.query.year)
    }
    let query = Albums.find(filter)
    if (req.query.sort) {
      query = query.sort(req.query.sort)
    }
    const albums = await query
    res.json(albums)
  } catch (error) {
    res.status(500).json({ error: 'could not load albums ' + error.message })
  }
}

export async function getAlbumById(req, res) {
  try {
    const albums = await Albums.findById(req.params.id)
    console.log(albums)
    res.status(201).json(albums)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load albums' + error })
  }
}

export async function createAlbum(req, res) {
  const { artist, title, year, genre, tracks } = req.body
  try {
    const newAlbum = await Albums.create({
      artist,
      title,
      year,
      genre,
      tracks,
    })
    return res.status(200).json({ message: 'Album Created', newAlbum })
  } catch (error) {
    console.error('FULL ERROR:', error)
    return res.status(500).json({ error: error.message })
  }
}

export async function updateAlbum(req, res) {
  try {
    const updatedAlbum = await Albums.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
    if (!updatedAlbum) {
      return res.status(404).json({ message: 'Album not found' })
    }

    return res.status(201).json({ message: 'Album updated', updatedAlbum })
  } catch (error) {
    console.error('FULL ERROR:', error)

    return res.status(500).json({ error: 'Failed to load albums' })
  }
}

export async function deleteAlbum(req, res) {
  const id = req.params.id
  console.log(id)

  try {
    const updatedAlbum = await Albums.deleteOne({ _id: id })
    if (!updatedAlbum) {
      return res.status(404).json({ message: 'Album not found' })
    }
    return res.status(201).json({ message: 'Album Deleted', updatedAlbum })
  } catch (error) {
    console.error('FULL ERROR:', error)

    return res.status(500).json({ error: 'Failed to load albums' })
  }
}


