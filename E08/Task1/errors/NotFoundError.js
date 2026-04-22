import CustomError from './CustomError.js'

export default class NotFoundError extends CustomError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}