const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: {
    type: Date,
    default: null,
  },
  bio: {
    type: String,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
    },
  ],
});

module.exports = mongoose.model("actor", actorSchema);
