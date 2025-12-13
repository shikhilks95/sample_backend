const Reel = require('../models/Reel');

/**
 * Get reel feed with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReelFeed = (req, res) => {
  try {
    const { limit = 5, cursor = null } = req.query;
    
    // Get reels with pagination
    const result = Reel.getFeed(parseInt(limit), cursor);
    
    // Format reels data for frontend
    const formattedReels = result.reels.map(reel => ({
      id: reel.id,
      videoUrl: reel.videoUrl,
      username: reel.username,
      avatar: reel.avatar, // User profile image
      musicTitle: reel.musicTitle,
      musicImage: reel.musicImage, // Music thumbnail image
      likesCount: reel.likesCount,
      commentsCount: reel.commentsCount,
      sharesCount: reel.sharesCount,
      liked: reel.liked,
      description: reel.description,
      createdAt: reel.createdAt
    }));
    
    return res.status(200).json({
      success: true,
      reels: formattedReels,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error("Error fetching reel feed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reels"
    });
  }
};

/**
 * Get a specific reel by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReelById = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const reel = Reel.findById(id);
    
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    // Format reel data for frontend
    const formattedReel = {
      id: reel.id,
      videoUrl: reel.videoUrl,
      username: reel.username,
      avatar: reel.avatar, // User profile image
      musicTitle: reel.musicTitle,
      musicImage: reel.musicImage, // Music thumbnail image
      likesCount: reel.likesCount,
      commentsCount: reel.commentsCount,
      sharesCount: reel.sharesCount,
      liked: reel.liked,
      description: reel.description,
      createdAt: reel.createdAt
    };
    
    return res.status(200).json({
      success: true,
      reel: formattedReel
    });
  } catch (error) {
    console.error("Error fetching reel by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reel"
    });
  }
};

/**
 * Get interaction counts (likes, comments, shares) for a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReelInteractions = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const reel = Reel.findById(id);
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        likesCount: reel.likesCount || 0,
        commentsCount: reel.commentsCount || 0,
        sharesCount: reel.sharesCount || 0
      }
    });
  } catch (error) {
    console.error("Error fetching reel interactions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reel interactions"
    });
  }
};

/**
 * Get comments for a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReelComments = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    // In a real implementation, you would fetch comments from a database
    // For now, we'll return an empty array as a placeholder
    const comments = [];
    
    return res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error("Error fetching reel comments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reel comments"
    });
  }
};

/**
 * Add a comment to a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addReelComment = (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }
    
    // In a real implementation, you would save the comment to a database
    // For now, we'll simulate adding a comment by incrementing the comment count
    const reel = Reel.findById(id);
    if (reel) {
      reel.commentsCount = (reel.commentsCount || 0) + 1;
    }
    
    // Return a mock comment
    const newComment = {
      id: Date.now().toString(),
      username: "user123",
      avatar: "https://i.pravatar.cc/40",
      text: text.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    return res.status(201).json({
      success: true,
      data: newComment,
      message: "Comment added successfully"
    });
  } catch (error) {
    console.error("Error adding reel comment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add reel comment"
    });
  }
};

/**
 * Like a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const likeReel = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const success = Reel.likeReel(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Reel liked successfully"
    });
  } catch (error) {
    console.error("Error liking reel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to like reel"
    });
  }
};

/**
 * Unlike a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const unlikeReel = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const success = Reel.unlikeReel(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Reel unliked successfully"
    });
  } catch (error) {
    console.error("Error unliking reel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unlike reel"
    });
  }
};

/**
 * Check if a reel is liked
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkReelLiked = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const liked = Reel.checkLiked(id);
    
    return res.status(200).json({
      success: true,
      liked
    });
  } catch (error) {
    console.error("Error checking reel like status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check reel like status"
    });
  }
};

/**
 * Share a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const shareReel = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const success = Reel.shareReel(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Reel shared successfully"
    });
  } catch (error) {
    console.error("Error sharing reel:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to share reel"
    });
  }
};

module.exports = {
  getReelFeed,
  getReelById,
  getReelInteractions,
  getReelComments,
  addReelComment,
  likeReel,
  unlikeReel,
  checkReelLiked,
  shareReel
};