import express from 'express'
import passport from 'passport'
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/auth.js'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return next(error)

    if (!user) {
      return res.status(401).json({
        error: info.message || 'Invalid email or password',
      })
    }

    req.login(user, (loginError) => {
      if (loginError) return next(loginError)
      return loginUser(req, res, next)
    })
  })(req, res, next)
})

router.post('/logout', logoutUser)
router.get('/me', getCurrentUser)

export default router