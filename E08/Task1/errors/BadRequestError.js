import CustomError from './CustomError.js'

export default class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}