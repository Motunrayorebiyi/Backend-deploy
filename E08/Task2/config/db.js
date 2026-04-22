import mongoose from 'mongoose'

const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_TEST_URI
      : process.env.MONGO_URI

  await mongoose.connect(uri)
}

export default connectDB