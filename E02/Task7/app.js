import express from 'express'
import albumRoutes from './routes/albums.js'
import { requestLogger } from './middleware/middleware.js'

const app = express()

app.use(express.json())
app.use(express.static('public'));
app.use('/albums', albumRoutes)
app.use(requestLogger)

const PORT = 3005
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})