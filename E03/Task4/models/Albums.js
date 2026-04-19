import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    tracks: {
      type: Number,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      validate: {
        validator: (v) => Number.isInteger(v),
        message: (props) => `${props.value} must be an integer`,
      },
    },
  },
  { timestamps: true }
);

// Prevent duplicates

export default mongoose.model("Albums", albumSchema);
