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