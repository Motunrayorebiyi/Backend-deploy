import Albums from '../models/Albums.js'
import NotFoundError from '../errors/NotFoundError.js'

export async function getAllAlbums(req, res, next) {
  try {
    const filter = {}

    if (req.query.year) {
      filter.year = Number(req.query.year)
    } else if (req.query.startYear || req.query.endYear) {
      filter.year = {}

      if (req.query.startYear) {
        filter.year.$gte = Number(req.query.startYear)
      }

      if (req.query.endYear) {
        filter.year.$lte = Number(req.query.endYear)
      }
    }

    if (req.query.search) {
      filter.$or = [
        { artist: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
      ]
    }

    let query = Albums.find(filter).populate('owner', 'name email role')

    if (req.query.sort) {
      query = query.sort(req.query.sort)
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    }

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.max(Number(req.query.limit) || 10, 1)
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const albums = await query
    const total = await Albums.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      metadata: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: albums,
    })
  } catch (error) {
    next(error)
  }
}

export async function getAlbumById(req, res, next) {
  try {
    const album = await Albums.findById(req.params.id).populate(
      'owner',
      'name email role',
    )

    if (!album) {
      throw new NotFoundError('Album not found')
    }

    res.status(200).json(album)
  } catch (error) {
    next(error)
  }
}

export async function createAlbum(req, res, next) {
  try {
    const { artist, title, year, genre, tracks } = req.body

    const newAlbum = await Albums.create({
      artist,
      title,
      year,
      genre,
      tracks,
      owner: req.user._id,
    })

    return res.status(201).json({
      message: 'Album created',
      newAlbum,
    })
  } catch (error) {
    next(error)
  }
}

export async function updateAlbum(req, res, next) {
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
      throw new NotFoundError('Album not found')
    }

    return res.status(200).json({
      message: 'Album updated',
      updatedAlbum,
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteAlbum(req, res, next) {
  try {
    const deletedAlbum = await Albums.findByIdAndDelete(req.params.id)

    if (!deletedAlbum) {
      throw new NotFoundError('Album not found')
    }

    return res.status(200).json({
      message: 'Album deleted',
      deletedAlbum,
    })
  } catch (error) {
    next(error)
  }
}