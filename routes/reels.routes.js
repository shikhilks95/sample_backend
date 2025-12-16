const express = require('express');
const router = express.Router();
const {
  getReelsFeed,
  getReelById,
  likeReel,
  unlikeReel,
  checkReelLiked,
  shareReel,
  getReelInteractions,
  getReelComments,
  addReelComment,
  checkReelReshared,
  toggleReelReshare
} = require('../controllers/reels.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
// GET /api/reel?limit=:limit&cursor=:cursor
router.get('/', getReelsFeed);

// GET /api/reel/:id
router.get('/:id', getReelById);

// GET /api/reel/:id/interactions
router.get('/:id/interactions', getReelInteractions);

// GET /api/reel/:id/comments
router.get('/:id/comments', getReelComments);

// POST /api/reel/:id/comments
router.post('/:id/comments', authenticateUser, addReelComment);

// POST /api/reel/:id/like
router.post('/:id/like', authenticateUser, likeReel);

// DELETE /api/reel/:id/like
router.delete('/:id/like', authenticateUser, unlikeReel);

// GET /api/reel/:id/like/check
router.get('/:id/like/check', authenticateUser, checkReelLiked);

// GET /api/reel/:id/reshare/check
router.get('/:id/reshare/check', authenticateUser, checkReelReshared);

// POST /api/reel/:id/reshare/toggle
router.post('/:id/reshare/toggle', authenticateUser, toggleReelReshare);

// POST /api/reel/:id/share
router.post('/:id/share', shareReel);

module.exports = router;