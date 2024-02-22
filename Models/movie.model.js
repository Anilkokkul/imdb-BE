const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  yearOfRelease: {
    type: Number,
  },
  genre: [String],
  plot: {
    type: String,
    trim: true,
  },
  actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "actor",
    },
  ],
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "producers",
  },
});

module.exports = mongoose.model("movie", movieSchema);
