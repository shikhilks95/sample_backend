const Reel = require('../models/Reel');
const Comment = require('../models/Comment');

/**
 * Get reels feed with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReelsFeed = async (req, res) => {
  try {
    const { limit = 5, cursor = null } = req.query;
    const userId = req.user?.id || "anonymous"; // Get current user ID from authenticated request
    
    const result = Reel.getFeed(parseInt(limit), cursor);
    
    // Format reels data for frontend
    const formattedReels = await Promise.all(result.reels.map(async (reel) => {
      // Check if current user is following the reel creator
      let following = false;
      if (global.followedUsers && global.followedUsers[userId]) {
        following = global.followedUsers[userId].includes(reel.userId || reel.creatorId || reel.user?.id);
      }
      
      return {
        id: reel.id,
        videoUrl: reel.videoUrl,
        username: reel.username,
        userId: reel.userId || reel.creatorId || reel.user?.id,
        avatar: reel.avatar, // User profile image
        musicTitle: reel.musicTitle,
        musicImage: reel.musicImage, // Music thumbnail image
        likesCount: reel.likesCount,
        commentsCount: reel.commentsCount,
        sharesCount: reel.sharesCount,
        liked: reel.liked,
        following: following,
        description: reel.description,
        createdAt: reel.createdAt
      };
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
const getReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "anonymous"; // Get current user ID from authenticated request
    
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
    
    // Check if current user is following the reel creator
    let following = false;
    if (global.followedUsers && global.followedUsers[userId]) {
      following = global.followedUsers[userId].includes(reel.userId || reel.creatorId || reel.user?.id);
    }
    
    // Format reel data for frontend
    const formattedReel = {
      id: reel.id,
      videoUrl: reel.videoUrl,
      username: reel.username,
      userId: reel.userId || reel.creatorId || reel.user?.id,
      avatar: reel.avatar, // User profile image
      musicTitle: reel.musicTitle,
      musicImage: reel.musicImage, // Music thumbnail image
      likesCount: reel.likesCount,
      commentsCount: reel.commentsCount,
      sharesCount: reel.sharesCount,
      liked: reel.liked,
      following: following,
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
    
    // Get comments for the reel
    const comments = Comment.getCommentsByReelId(id);
    
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
    const { text, userId, username, avatar } = req.body;
    
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
    
    // Set default values for user data if not provided
    const commentUserId = userId || "anonymous";
    const commentUsername = username || "Anonymous";
    const commentAvatar = avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous";
    
    // Add the comment
    const newComment = Comment.addComment(
      id, 
      commentUserId, 
      commentUsername, 
      commentAvatar, 
      text.trim()
    );
    
    // Increment the comment count for the reel
    const reel = Reel.findById(id);
    if (reel) {
      reel.commentsCount = (reel.commentsCount || 0) + 1;
    }
    
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

/**
 * Check if a reel is reshared by the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkReelReshared = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from authenticated request
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const reshared = Reel.checkReshared(id, userId);
    
    return res.status(200).json({
      success: true,
      reshared
    });
  } catch (error) {
    console.error("Error checking reel reshare status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check reel reshare status"
    });
  }
};

/**
 * Toggle reshare status for a reel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const toggleReelReshare = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from authenticated request
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reel ID is required"
      });
    }
    
    const result = Reel.toggleReshare(id, userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Reel not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      reshared: result.reshared,
      sharesCount: result.sharesCount,
      message: result.reshared 
        ? "Reel reshared successfully" 
        : "Reel unreshared successfully"
    });
  } catch (error) {
    console.error("Error toggling reel reshare:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle reel reshare"
    });
  }
};

/**
 * Stream reel video content with HTTP range support
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const streamReel = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).send('Reel ID is required');
    }

    // Find the reel by ID
    const reel = Reel.findById(id);
    if (!reel) {
      return res.status(404).send('Reel not found');
    }

    // Extract the video URL
    const videoUrl = reel.videoUrl;
    
    // Check if it's a remote URL (Cloudinary in our case)
    if (videoUrl.startsWith('http')) {
      // For remote URLs, we'll proxy the stream with range support
      streamRemoteVideo(videoUrl, req, res);
    } else {
      // For local files, we would serve them directly
      // This is just a fallback and won't be used with our Cloudinary setup
      res.redirect(videoUrl);
    }
  } catch (error) {
    console.error('Error streaming reel:', error);
    res.status(500).send('Error streaming video');
  }
};

/**
 * Stream remote video content with HTTP range support
 * @param {string} videoUrl - The URL of the video to stream
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const streamRemoteVideo = (videoUrl, req, res) => {
  try {
    const urlObj = new URL(videoUrl);
    const client = urlObj.protocol === 'http:' ? http : https;

    const headers = {};
    if (req.headers.range) {
      headers.Range = req.headers.range;
    }

    const proxyReq = client.request(urlObj, { headers }, (proxyRes) => {
      // Set CORS headers for video streaming with credentials
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Accept-Ranges, Content-Range');
      
      // Copy relevant headers
      const headersToCopy = ['Content-Type', 'Content-Length', 'Accept-Ranges', 'Content-Range'];
      headersToCopy.forEach(header => {
        if (proxyRes.headers[header]) {
          res.setHeader(header, proxyRes.headers[header]);
        }
      });

      // Set status code (206 for partial content, 200 for full content)
      res.status(proxyRes.statusCode);

      // Pipe the response
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.status(500).send('Error streaming video');
    });

    proxyReq.end();
  } catch (error) {
    console.error('Error in streamRemoteVideo:', error);
    res.status(500).send('Error streaming video');
  }
};

module.exports = {
  getReelsFeed,
  getReelById,
  getReelInteractions,
  getReelComments,
  addReelComment,
  likeReel,
  unlikeReel,
  checkReelLiked,
  shareReel,
  checkReelReshared,
  toggleReelReshare
};