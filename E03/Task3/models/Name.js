import mongoose from "mongoose";

const nameSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

// Prevent duplicates
nameSchema.index({ firstname: 1, lastname: 1 }, { unique: true });

export default mongoose.model("Name", nameSchema);