import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import Albums from '../models/Albums.js'
import User from '../models/User.js'
import data from './data.json' assert { type: 'json' }

beforeEach(async () => {
  await Albums.deleteMany({})
  await User.deleteMany({})

  const testUser = await User.create({
    name: 'Amanda',
    email: 'amanda@email.com',
    password: '1234567',
    role: 'user',
  })

  const albumsWithOwner = data.map((album) => ({
    ...album,
    owner: testUser._id,
  }))

  await Albums.insertMany(albumsWithOwner)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('GET /albums', () => {
  it('returns the same number of albums as in test database', async () => {
    const res = await request(app).get('/albums')

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(data.length)
  })
})

describe('POST /albums', () => {
  it('should create a new album and increase count by one', async () => {
    const agent = request.agent(app)
    const loginRes = await agent.post('/auth/login').send({
      email: 'amanda@email.com',
      password: '1234567',
    })

    expect(loginRes.status).toBe(200)

    const initialAlbums = await Albums.find()

    const newAlbum = {
      artist: 'Taylor Swift',
      title: '1989',
      year: 2014,
      genre: 'Pop',
      tracks: 13,
    }

    const res = await agent.post('/albums').send(newAlbum)

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Album created')
    expect(res.body.newAlbum.artist).toBe('Taylor Swift')
    expect(res.body.newAlbum.title).toBe('1989')
    expect(res.body.newAlbum.year).toBe(2014)
    expect(res.body.newAlbum.genre).toBe('Pop')
    expect(res.body.newAlbum.tracks).toBe(13)

    const finalAlbums = await Albums.find()
    expect(finalAlbums.length).toBe(initialAlbums.length + 1)

    const createdAlbum = finalAlbums.find((album) => album.title === '1989')
    expect(createdAlbum).toBeDefined()
    expect(createdAlbum.artist).toBe('Taylor Swift')
  })
})