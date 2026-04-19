import express from 'express'
import { users } from './config/config.js'
import { writeFile, readFile } from 'fs/promises';

const app = express()
const PORT = 3000
app.use(express.static("view"));


app.get('/api/users',async (req,res)=>{
    res.json({
        status: 200,
        user: users
    })
})

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id)
  const user = users.find(u => u.id === userId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

app.get('/api/echo/:message', (req, res) => {
  const msg = req.params.message
console.log(msg)

  res.json({message: msg})
})

app.get('/contact', async (req,res)=>{
 const fileData = await readFile('view/contact.html', 'utf-8');

    res.writeHead(200, { "content-type": "text/html" });
    return res.end(fileData);
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})