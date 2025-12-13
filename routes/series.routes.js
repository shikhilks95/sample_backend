const express = require('express');
const router = express.Router();
const {
  getSeriesByCategory,
  getLatestSeries,
  getLatestFiveSeries,
  getSeriesById,
  getSeriesCategories,
  getSeriesEpisodesBySeason,
  streamSeries,
  streamEpisode
} = require('../controllers/series.controller');

// GET /api/series/categories
router.get('/categories', getSeriesCategories);

// GET /api/series/latest
router.get('/latest', getLatestSeries);

// GET /api/series/latest-five
router.get('/latest-five', getLatestFiveSeries);

// GET /api/series/:id/stream
router.get('/:id/stream', streamSeries);

// GET /api/series/:id/episodes/:episodeId/stream
router.get('/:id/episodes/:episodeId/stream', streamEpisode);

// GET /api/series/:id/seasons/:season/episodes
router.get('/:id/seasons/:season/episodes', getSeriesEpisodesBySeason);

// GET /api/series?category=:categoryCode&limit=:limit
router.get('/', getSeriesByCategory);

// GET /api/series/:id
router.get('/:id', getSeriesById);

module.exports = router;