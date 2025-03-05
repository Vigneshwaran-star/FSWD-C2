const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection failed.",error));

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The movie title"],
  },
  director: {
    type: String,
    required: [true, "Name of the director"],
  },
  genre: {
    type: String,
    required: [true, "Genre of the movie."],
  },
  releaseYear: {
    type: Number,
    required: [true, "Year the movie released"],
  },
  availableCopies: {
    type: Number,
    required: [true, "Number of copies available in the collection"],
  },
});

const movieGenre = mongoose.model("movieGenre", movieSchema);


app.post("/movie", async (req, res) => {
  const { title, director, genre, releaseYear, availableCopies } = req.body;

  if (!title || !director || !genre || !releaseYear || !availableCopies) {
    return res.status(400).json({ error: "The field is required" });
  }

  try {
    const newMovie = new movieGenre({
      title,
      director,
      genre,
      releaseYear,
      availableCopies,
    });
    await movieGenre.save();
    return res
      .status(201)
      .json({
        message: "New Movie created successfully!",
        details: movieGenre,
      });
  } catch (err) {
    res.status(500).json({ error: "Movie not created" });
  }
});

app.get("/movie", async (req, res) => {
  try {
    const movieItems = await movieGenre.find();
    return res.status(201).json(movieItems);
  } catch (err) {
    return res.status(500).json({ error: "Cannot fetch movie." });
  }
});

app.put("movie/:id", async (req, res) => {
  const { id } = req.params;
  const { title, director, genre, releaseYear, availableCopies } = req.body;

  try {
    const updateMovie = await movieGenre.findByIdAndUpdate(
      id,
      { title, director, genre, releaseYear, availableCopies },
      { new: true, runValidators: true }
    );
    if (!updateMovie) {
      return res.status(400).json({ error: "Movie not updated" });
    }
    return res.status(201).json({ message: "Movie updated successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Cannot fetch Movie" });
  }
});

app.delete("movie/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteMovie = await movieGenre.findByIdAndDelete(id);
    if (!deleteMovie) {
      return res.status(404).json({ error: "Cannot find movie" });
    }
    return res.status(201).json({ message: "Movie deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Movie cannot be deleted" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
