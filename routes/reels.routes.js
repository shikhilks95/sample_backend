const express = require('express');
const router = express.Router();
const {
  getReelFeed,
  getReelById,
  likeReel,
  unlikeReel,
  checkReelLiked,
  shareReel
} = require('../controllers/reels.controller');

// GET /api/reel/feed?limit=:limit&cursor=:cursor
router.get('/feed', getReelFeed);

// GET /api/reel/:id
router.get('/:id', getReelById);

// POST /api/reel/:id/like
router.post('/:id/like', likeReel);

// DELETE /api/reel/:id/like
router.delete('/:id/like', unlikeReel);

// GET /api/reel/:id/like/check
router.get('/:id/like/check', checkReelLiked);

// POST /api/reel/:id/share
router.post('/:id/share', shareReel);

module.exports = router;