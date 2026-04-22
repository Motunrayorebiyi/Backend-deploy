import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()

  if (!update.password) {
    return
  }

  update.password = await bcrypt.hash(update.password, 10)
})

export default mongoose.model('User', userSchema)