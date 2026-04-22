import User from '../models/User.js'

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