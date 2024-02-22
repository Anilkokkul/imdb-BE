const express = require("express");
const {
  addActor,
  addMovie,
  getAllMovies,
  getMovieById,
  addProducer,
  getAllActors,
  getProducers,
  updateMovieDetails,
} = require("../controllers/movie.controllers");
const { isAuth } = require("../utils/authorizarion");
const router = express.Router();

//Add movie in database
router.post("/movie", isAuth, addMovie);

// Add actor to in data
router.post("/actor", isAuth, addActor);

//Add Producer in data
router.post("/producer", isAuth, addProducer);

// Get all actors from the database
router.get("/actor", getAllActors);

//Get all producers from the database
router.get("/producer", getProducers);

//Get all movies from the database
router.get("/movie/all", getAllMovies);

//update movie details
router.put("/movie/:id", isAuth, updateMovieDetails);

// Get a specific movie by its ID
router.get("/movie/:id", getMovieById);

module.exports = router;
