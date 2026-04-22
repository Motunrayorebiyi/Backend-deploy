import express from 'express'
import albumRoutes from './routes/albums.js'
import authRoutes from './routes/auth.js'
import { requestLogger } from './middleware/middleware.js'
import connectDB from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(requestLogger)

app.use('/albums', albumRoutes)
app.use('/auth', authRoutes)

const PORT = 3008
try {
  await connectDB()
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`),
  )
} catch (error) {
  console.log(error)
}