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