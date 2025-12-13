const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

// Protected routes (require authentication)
router.post('/:id/follow', authenticateUser, profileController.followUser);
router.delete('/:id/follow', authenticateUser, profileController.unfollowUser);
router.get('/:id/follow/check', authenticateUser, profileController.checkUserFollowing);
router.get('/:id', profileController.getUserProfile);

module.exports = router;