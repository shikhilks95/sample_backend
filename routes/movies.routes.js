const express = require('express');
const router = express.Router();
const {
  getMoviesByCategory,
  getLatestMovie,
  getMovieById,
  getMovieCategories,
  streamMovie
} = require('../controllers/movies.controller');

// GET /api/movies/categories
router.get('/categories', getMovieCategories);

// GET /api/movies/latest
router.get('/latest', getLatestMovie);

// GET /api/movies/:id/stream
router.get('/:id/stream', streamMovie);

// GET /api/movies?category=:categoryCode&limit=:limit
router.get('/', getMoviesByCategory);

// GET /api/movies/:id
router.get('/:id', getMovieById);

module.exports = router;