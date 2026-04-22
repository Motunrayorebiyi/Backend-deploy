import express from 'express'
import session from 'express-session'
import albumRoutes from './routes/albums.js'
import authRoutes from './routes/auth.js'
import { requestLogger } from './middleware/middleware.js'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import passport from './config/passport.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(requestLogger)

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/albums', albumRoutes)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

if (process.env.NODE_ENV === 'test') {
  await connectDB()
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3008

  try {
    await connectDB()
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`),
    )
  } catch (error) {
    console.log(error)
  }
}

export default app