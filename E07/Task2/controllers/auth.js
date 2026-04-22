import User from '../models/User.js'
import BadRequestError from '../errors/BadRequestError.js'
import UnauthorizedError from '../errors/UnauthorizedError.js'

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, passwordConfirmation, role } = req.body

    if (!name || !email || !password || !passwordConfirmation) {
      throw new BadRequestError(
        'Name, email, password and password confirmation are required',
      )
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestError('Passwords do not match')
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }

    const user = await User.create({
      name,
      email,
      password,
       role: role || 'user',
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export function loginUser(req, res, next) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export function logoutUser(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error)
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError)
      }

      res.clearCookie('connect.sid')
      res.status(200).json({
        message: 'Logout successful',
      })
    })
  })
}

export function getCurrentUser(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedError('Not authenticated')
    }

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}