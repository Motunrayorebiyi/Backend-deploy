import UnauthorizedError from '../errors/UnauthorizedError.js'

export function ensureAuthenticated(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError('Access denied. Not authenticated')
    }
    next()
  } catch (error) {
    next(error)
  }
}


export function ensureAdmin(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError('Access denied. Not authenticated')
    }

    if (req.user.role !== 'admin') {
      throw new UnauthorizedError('Admin access required')
    }

    next()
  } catch (error) {
    next(error)
  }
}

export function ensureOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        throw new UnauthorizedError('Access denied. Not authenticated')
      }

     
      if (req.user.role === 'admin') {
        return next()
      }

      const ownerId = await getOwnerId(req)

      if (!ownerId) {
        throw new UnauthorizedError('Resource not found')
      }

      if (ownerId.toString() !== req.user._id.toString()) {
        throw new UnauthorizedError('Access denied. Not owner')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}