import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import BadRequestError from '../errors/BadRequestError.js'
import UnauthorizedError from '../errors/UnauthorizedError.js'

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, passwordConfirmation } = req.body

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

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError('Email and password are required')
    }

    const user = await User.findOne({ email })

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    res.status(200).json({
      message: 'Login successful',
      token,
    })
  } catch (error) {
    next(error)
  }
}