const Movies = require("../Models/movie.model");
const Actors = require("../Models/actor.model");
const Producers = require("../Models/producer.model");

const updateActor = async (id, movieId) => {
  existingMovie = await Actors.findOne({ _id: id });
  const movieExist = existingMovie.movies.find((movie) => {
    return String(movie._id) == String(movieId);
  });
  if (!movieExist) {
    await Actors.findByIdAndUpdate({ _id: id }, { $push: { movies: movieId } });
  }
};

const updateProducer = async (id, movieId) => {
  existingMovie = await Producers.findOne({ _id: id });
  const movieExist = existingMovie.movies.find((movie) => {
    return String(movie._id) == String(movieId);
  });
  if (!movieExist) {
    await Producers.findByIdAndUpdate(
      { _id: id },
      { $push: { movies: movieId } }
    );
  }
};

//Add movie controller
exports.addMovie = async (req, res) => {
  try {
    const { title, yearOfRelease, genre, plot, actors, producer } = req.body;

    // Check if the movie already exists in the database
    const existingMovie = await Movies.findOne({ title: title });
    if (existingMovie) {
      return res
        .status(409)
        .send({ message: "This Movie is already exist", existingMovie });
    }
    const newMovie = new Movies({
      title,
      yearOfRelease,
      genre,
      plot,
      actors,
      producer,
    })
      .save()
      .then((data) => {
        // Add movie to the Actor's collection
        for (let i of actors) {
          updateActor(i, data._id);
        }
        // Add movie to the Actor's collection
        updateProducer(data.producer, data.id);
        return res
          .status(201)
          .send({ message: "New Movie added successfully", data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occurred while adding movie",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// Get all movies from the database
exports.getAllMovies = async (req, res) => {
  try {
    await Movies.find()
      .populate("actors")
      .populate("producer")
      .then((data) => {
        res.status(200).send({
          message: "Movies data retrieved Successfully",
          movies: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while getting movies",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

//Add actor controller
exports.addActor = async (req, res) => {
  try {
    const { name, dob } = req.body;

    const actorExist = await Actors.findOne({ name: name, dob: dob });
    if (actorExist) {
      return res.status(409).send({
        message: "This Actor details are already exist",
        actorExist,
      });
    }

    const actor = new Actors({ ...req.body })
      .save()
      .then((data) => {
        return res
          .status(201)
          .send({ message: `New Actor added successfully`, data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occurred while adding Actor details",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};
//Add producer controller
exports.addProducer = async (req, res) => {
  try {
    const { name, dob } = req.body;
    const producerExist = await Producers.findOne({ name: name, dob: dob });

    if (producerExist) {
      return res.status(409).send({
        message: "This Producer details are already exist",
        producerExist,
      });
    }
    const producer = new Producers({ ...req.body })
      .save()
      .then((data) => {
        return res
          .status(201)
          .send({ message: `Producer added successfully`, data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occurred while adding Producer details",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

//get movie by id
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    await Movies.findOne({ _id: id })
      .populate("producer")
      .populate("actors")
      .then((data) => {
        return res
          .status(201)
          .send({ message: "Movie retrieved Successfully", data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occurred while getting movie details",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

//get all actors controller
exports.getAllActors = async (req, res) => {
  try {
    await Actors.find()
      .populate("movies")
      .then((data) => {
        res.status(200).send({
          message: "Actors data retrieved Successfully",
          Actors: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while getting Actors data",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

//Get all producers controller
exports.getProducers = async (req, res) => {
  try {
    await Producers.find()
      .populate("movies")
      .then((data) => {
        res.status(200).send({
          message: "Producers data retrieved Successfully",
          Producers: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while getting Producers data",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

//edit movie details
exports.updateMovieDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const { title, yearOfRelease, genre, plot, producer, actors } = req.body;

    const movie = await Movies.findOneAndUpdate(
      { _id: id },
      {
        title,
        yearOfRelease,
        genre,
        plot,
        producer,
        actors,
      },
      {
        new: true,
      }
    )
      .then((data) => {
        for (let i of actors) {
          updateActor(i, data._id);
        }
        // Add movie to the Actor's collection
        updateProducer(data.producer, data.id);
        res.status(200).send({
          message: "Movie details updated Successfully",
          newMovieDetails: data,
        });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error while editing movie details",
          Error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};
