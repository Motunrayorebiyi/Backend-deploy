import User from '../models/User.js'
import NotFoundError from '../errors/NotFoundError.js'

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      throw new NotFoundError('User not found')
    }

    res.status(200).json({
      message: 'User deleted',
    })
  } catch (error) {
    next(error)
  }
}