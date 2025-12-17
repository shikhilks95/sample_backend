const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const Movie = require('../models/Movie');

// Simple mapping to local demo videos (falls back to 1.mp4)
const VIDEO_BASE_PATH = path.join(__dirname, '..', '..', 'Evozn.ai-Frontend', 'public', 'videos');
const movieVideoMap = {
  '1': '1.mp4',
  '2': '2.mp4',
  '3': '3.mp4',
  '4': '4.mp4',
  '5': '5.mp4'
};

const buildStreamUrl = (req, movieId) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/api/movies/${movieId}/stream`;
};

const getVideoPathForMovie = (movieId) => {
  const mapped =
    movieVideoMap[movieId] ||
    movieVideoMap[String(((Number(movieId) - 1) % 5) + 1)] ||
    movieVideoMap['1'];
  return path.join(VIDEO_BASE_PATH, mapped);
};

/**
 * Get movies by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMoviesByCategory = (req, res) => {
  try {
    const { category, limit = 12 } = req.query;
    
    // Validate inputs
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category code is required"
      });
    }
    
    // Get movies by category
    const movies = Movie.findByCategory(category, parseInt(limit));
    
    // Map movies to include proper image fields for frontend
    const formattedMovies = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      genre: movie.category,
      duration: movie.duration,
      image: movie.posterImage || movie.thumbnailImage
    }));
    
    return res.status(200).json({
      success: true,
      movies: formattedMovies
    });
  } catch (error) {
    console.error("Error fetching movies by category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies"
    });
  }
};

/**
 * Get latest movie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLatestMovie = (req, res) => {
  try {
    const movie = Movie.findLatest();
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "No movies found"
      });
    }
    
    // Format movie data for frontend - simplified to use only stream URL
    const formattedMovie = {
      id: movie.id,
      title: movie.title,
      genre: movie.category,
      duration: movie.duration,
      image: movie.thumbnailImage || movie.posterImage,
      thumbnail: movie.thumbnailImage,
      videoUrl: buildStreamUrl(req, movie.id), // Single URL for video playback
      description: movie.description,
      subtitles: movie.subtitles || [],
      audioTracks: movie.audioTracks || [],
      cast: (movie.cast || []).map(member => ({
        name: member.name,
        role: member.role,
        img: member.image || member.img
      }))
    };
    
    return res.status(200).json({
      success: true,
      movie: formattedMovie
    });
  } catch (error) {
    console.error("Error fetching latest movie:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest movie"
    });
  }
};

/**
 * Get movie by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMovieById = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required"
      });
    }
    
    // Get movie by ID
    const movie = Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    
    // Format movie data for frontend - simplified to use only stream URL
    const formattedMovie = {
      id: movie.id,
      title: movie.title,
      genre: movie.category,
      duration: movie.duration,
      image: movie.thumbnailImage || movie.posterImage,
      thumbnail: movie.thumbnailImage,
      videoUrl: buildStreamUrl(req, movie.id), // Single URL for video playback
      description: movie.description,
      subtitles: movie.subtitles || [],
      audioTracks: movie.audioTracks || [],
      cast: (movie.cast || []).map(member => ({
        name: member.name,
        role: member.role,
        img: member.image || member.img
      }))
    };
    
    return res.status(200).json({
      success: true,
      movie: formattedMovie
    });
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie"
    });
  }
};

/**
 * Get movie categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMovieCategories = (req, res) => {
  try {
    const { context, movieId } = req.query;
    
    let categories;
    
    // Handle different contexts
    if (context === "play" && movieId) {
      // For play context, get the current movie and return related categories
      const currentMovie = Movie.findById(movieId);
      if (currentMovie) {
        // Get all categories except the current movie's category
        const allCategories = Movie.getAllCategories();
        categories = allCategories.filter(cat => 
          cat.code !== currentMovie.category.toLowerCase().replace(/\s+/g, '-')
        );
        // Limit to 3-4 related categories for better UX
        categories = categories.slice(0, 4);
      } else {
        // If movie not found, return all categories
        categories = Movie.getAllCategories();
      }
    } else {
      // Default behavior - return all categories
      categories = Movie.getAllCategories();
    }
    
    // Map to reference shape
    const mappedCategories = categories.map(cat => ({
      title: cat.name || cat.title,
      categoryCode: cat.code || cat.categoryCode
    }));

    return res.status(200).json({
      success: true,
      categories: mappedCategories
    });
  } catch (error) {
    console.error("Error fetching movie categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie categories"
    });
  }
};

/**
 * Stream movie content with HTTP range support
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

    const upstreamReq = client.request(videoUrl, { headers }, (upstreamRes) => {
      // Forward status and key headers
      res.status(upstreamRes.statusCode || 200);
      const forwardHeaders = [
        'content-type',
        'content-length',
        'accept-ranges',
        'content-range',
        'cache-control',
        'last-modified',
      ];
      forwardHeaders.forEach((h) => {
        const val = upstreamRes.headers[h];
        if (val !== undefined) res.setHeader(h, val);
      });

      // CORS/CORP for player
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Range');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range,Accept-Ranges,Content-Length');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      upstreamRes.pipe(res);
    });

    upstreamReq.on('error', (err) => {
      console.error('Remote stream error:', err);
      res.status(502).json({ success: false, message: 'Failed to stream remote video' });
    });

    upstreamReq.end();
  } catch (error) {
    console.error('Error preparing remote stream:', error);
    res.status(500).json({ success: false, message: 'Failed to stream movie' });
  }
};

/**
 * Share a movie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const shareMovie = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required"
      });
    }
    
    // Get movie by ID
    const movie = Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    
    // Generate shareable URL
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const shareableUrl = `${protocol}://${host}/movies/play?id=${id}`;
    
    return res.status(200).json({
      success: true,
      shareableUrl: shareableUrl,
      message: "Movie shared successfully"
    });
  } catch (error) {
    console.error("Error sharing movie:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to share movie"
    });
  }
};

const streamMovie = (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    const movie = Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const videoUrl = movie.videoUrl;

    // If movie has a remote URL, proxy it with range support
    if (videoUrl && /^https?:\/\//i.test(videoUrl)) {
      return streamRemoteVideo(videoUrl, req, res);
    }

    const videoPath = getVideoPathForMovie(id);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ success: false, message: 'Video file not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Ensure cross-origin streaming works (CORP/CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range,Accept-Ranges,Content-Length');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (!range) {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(videoPath).pipe(res);
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 1024 * 1024, fileSize - 1);

    if (start >= fileSize || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
      return;
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    file.pipe(res);
  } catch (error) {
    console.error('Error streaming movie:', error);
    res.status(500).json({ success: false, message: 'Failed to stream movie' });
  }
};

module.exports = {
  getMoviesByCategory,
  getLatestMovie,
  getMovieById,
  getMovieCategories,
  shareMovie,
  streamMovie
};