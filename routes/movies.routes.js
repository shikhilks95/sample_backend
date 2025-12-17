const express = require('express');
const router = express.Router();
const {
  getMoviesByCategory,
  getLatestMovie,
  getMovieById,
  getMovieCategories,
  shareMovie,
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

// POST /api/movies/:id/share
router.post('/:id/share', shareMovie);

// GET /api/movies/:id
router.get('/:id', getMovieById);

module.exports = router;