import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function registerUser(req, res) {
  try {
    const { name, email, password, passwordConfirmation } = req.body

    if (!name || !email || !password || !passwordConfirmation) {
      return res.status(400).json({
        error: 'Name, email, password and password confirmation are required',
      })
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        error: 'Passwords do not match',
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
      })
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
    res.status(500).json({
      error: 'Registration failed: ' + error.message,
    })
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
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
    res.status(500).json({
      error: 'Login failed: ' + error.message,
    })
  }
}