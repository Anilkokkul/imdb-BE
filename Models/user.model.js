const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Please provide a Password!"],
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("users", userSchema);
