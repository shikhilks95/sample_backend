const express = require('express');
const router = express.Router();
const {
  getReelFeed,
  getReelById,
  likeReel,
  unlikeReel,
  checkReelLiked,
  shareReel,
  getReelInteractions,
  getReelComments,
  addReelComment
} = require('../controllers/reels.controller');

// GET /api/reel?limit=:limit&cursor=:cursor
router.get('/', getReelFeed);

// GET /api/reel/:id
router.get('/:id', getReelById);

// GET /api/reel/:id/interactions
router.get('/:id/interactions', getReelInteractions);

// GET /api/reel/:id/comments
router.get('/:id/comments', getReelComments);

// POST /api/reel/:id/comments
router.post('/:id/comments', addReelComment);

// POST /api/reel/:id/like
router.post('/:id/like', likeReel);

// DELETE /api/reel/:id/like
router.delete('/:id/like', unlikeReel);

// GET /api/reel/:id/like/check
router.get('/:id/like/check', checkReelLiked);

// POST /api/reel/:id/share
router.post('/:id/share', shareReel);

module.exports = router;