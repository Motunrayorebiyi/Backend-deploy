import express from 'express'
import { users } from './config/config.js'
import { writeFile, readFile } from 'fs/promises';

const app = express()
const PORT = 3001
app.use(express.json())
app.use(express.static("public"))

app.get('/',(req,res)=>{
    console.log("Hi")
    res.send("Hello Worldd")
})

app.post('/api/users', (req,res)=>{
    const {name, email} = req.body

    if(!name || !email){
        return res.status(400).json({error: " Name and email are required"})
    }

    const newUser = {
        id: Math.max(...users.map(u=> u.id)) + 1,
        name,
        email
    }

    users.push(newUser)
    res.status(201).json(users)
})

app.get("/api/users",(req,res)=>{
    res.json(users)
    
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})