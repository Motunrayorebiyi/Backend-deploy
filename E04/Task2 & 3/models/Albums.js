import mongoose from 'mongoose'

const albumSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: [true,' Artist Name Musst Be provided'],
      trim: true,
      minlength: [3,'Minimum length 3'],
      maxlength: [50, 'Maximum length of 50'],
    },
    title: {
      type: String,
      required: [true,' Album Title Musst Be provided'],
      trim: true,
      minlength: [3,'Minimum length 3'],
      maxlength: [50, 'Maximum length of 50'],
    },
    year: {
      type: Number,
      required: true,
      trim: true,
      min:[1990, 'Release year must not be before 1990'],
      max: [
      () => new Date().getFullYear(),
      "Release year cannot be in the future"
    ]
        
    },
    genre: {
      type: String,
      required: true,
      trim: true,
          enum: {
      values: ['Afro', 'Pop', 'Helsinki', 'Espo'],
      message: '{VALUE} not available'
    }
    },
    tracks: {
      type: Number,
      required: true,
      trim: true,
      min: [1, 'Year cannot be less than 1'],
    max: [120, 'Year cannot exceed 120'],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: (props) => `${props.value} must be an integer`,
      },
    },
  },
  { timestamps: true },
)

// Prevent duplicates

export default mongoose.model('Albums', albumSchema)
