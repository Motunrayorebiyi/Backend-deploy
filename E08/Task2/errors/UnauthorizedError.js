import CustomError from './CustomError.js'

export default class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}