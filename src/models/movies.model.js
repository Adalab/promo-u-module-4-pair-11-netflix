const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moviesSchema = new Schema(
  {
    name: { type: String, require: true },
    genre: { type: String, require: true },
    image: { type: String, require: true },
    category: { type: String, require: true },
    year: { type: Number, min: 0 },
  },
  { collection: 'movies' }
);
const Movie = mongoose.model('movies', moviesSchema);
module.exports = Movie;