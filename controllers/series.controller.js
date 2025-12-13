const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const Series = require('../models/Series');

// Simple mapping to local demo videos (falls back to 1.mp4)
const VIDEO_BASE_PATH = path.join(__dirname, '..', '..', 'Evozn.ai-Frontend', 'public', 'videos');
const seriesVideoMap = {
  '1': '1.mp4',
  '2': '2.mp4',
  '3': '3.mp4',
  '4': '4.mp4',
  '5': '5.mp4'
};

const buildStreamUrl = (req, seriesId) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/api/series/${seriesId}/stream`;
};

const buildEpisodeStreamUrl = (req, seriesId, episodeId) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/api/series/${seriesId}/episodes/${episodeId}/stream`;
};

const getVideoPathForSeries = (seriesId) => {
  const mapped =
    seriesVideoMap[seriesId] ||
    seriesVideoMap[String(((Number(seriesId) - 1) % 5) + 1)] ||
    seriesVideoMap['1'];
  return path.join(VIDEO_BASE_PATH, mapped);
};

/**
 * Stream series content with HTTP range support
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

/**
 * Stream series content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const streamSeries = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).send('Series ID is required');
    }

    // For demo purposes, we'll stream a local video file
    const videoPath = getVideoPathForSeries(id);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      // Fallback to default video
      const defaultVideoPath = path.join(VIDEO_BASE_PATH, '1.mp4');
      if (!fs.existsSync(defaultVideoPath)) {
        return res.status(404).send('Video not found');
      }
    }

    // Handle range requests for video streaming
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming series:', error);
    res.status(500).send('Error streaming video');
  }
};

/**
 * Stream episode content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const streamEpisode = (req, res) => {
  try {
    const { id, episodeId } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).send('Series ID is required');
    }
    
    if (!episodeId) {
      return res.status(400).send('Episode ID is required');
    }

    // For demo purposes, we'll stream a local video file
    // In a real implementation, you would map episodeId to specific video files
    const videoPath = getVideoPathForSeries(id);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      // Fallback to default video
      const defaultVideoPath = path.join(VIDEO_BASE_PATH, '1.mp4');
      if (!fs.existsSync(defaultVideoPath)) {
        return res.status(404).send('Video not found');
      }
    }

    // Handle range requests for video streaming
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming episode:', error);
    res.status(500).send('Error streaming video');
  }
};

/**
 * Get series by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSeriesByCategory = (req, res) => {
  try {
    const { category, limit = 12 } = req.query;
    
    // Validate inputs
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category code is required"
      });
    }
    
    // Get series by category
    const series = Series.findByCategory(category, parseInt(limit));
    
    // Map series to include proper image fields for frontend
    const formattedSeries = series.map(item => ({
      id: item.id,
      title: item.title,
      genre: item.category,
      duration: item.duration,
      seasons: item.seasons,
      image: item.posterImage || item.thumbnailImage
    }));
    
    return res.status(200).json({
      success: true,
      series: formattedSeries
    });
  } catch (error) {
    console.error("Error fetching series by category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch series"
    });
  }
};

/**
 * Get latest series
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLatestSeries = (req, res) => {
  try {
    const series = Series.findLatest();
    
    if (!series) {
      return res.status(404).json({
        success: false,
        message: "No series found"
      });
    }
    
    // Format series data for frontend
    const formattedSeries = {
      id: series.id,
      title: series.title,
      genre: series.category,
      duration: series.duration,
      seasons: series.seasons,
      image: series.thumbnailImage || series.posterImage,
      thumbnail: series.thumbnailImage,
      videoUrl: buildStreamUrl(req, series.id), // Single URL for video playback
      description: series.description,
      cast: (series.cast || []).map(member => ({
        name: member.name,
        role: member.role,
        img: member.image || member.img
      }))
    };
    
    return res.status(200).json({
      success: true,
      series: formattedSeries
    });
  } catch (error) {
    console.error("Error fetching latest series:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest series"
    });
  }
};

/**
 * Get latest 5 series for header/featured section
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLatestFiveSeries = (req, res) => {
  try {
    const seriesList = Series.findLatestFive();
    
    if (!seriesList || seriesList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No series found"
      });
    }
    
    // Format series data for frontend
    const formattedSeries = seriesList.map(series => ({
      id: series.id,
      title: series.title,
      genre: series.category,
      duration: series.duration,
      seasons: series.seasons,
      image: series.thumbnailImage || series.posterImage,
      thumbnail: series.thumbnailImage,
      videoUrl: buildStreamUrl(req, series.id), // Single URL for video playback
    }));
    
    return res.status(200).json({
      success: true,
      series: formattedSeries
    });
  } catch (error) {
    console.error("Error fetching latest five series:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest series"
    });
  }
};

/**
 * Get series by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSeriesById = (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Series ID is required"
      });
    }
    
    // Get series by ID
    const series = Series.findById(id);
    
    if (!series) {
      return res.status(404).json({
        success: false,
        message: "Series not found"
      });
    }
    
    // Format series data for frontend - simplified to use only stream URL
    const formattedSeries = {
      id: series.id,
      title: series.title,
      genre: series.category,
      duration: series.duration,
      seasons: series.seasons,
      image: series.thumbnailImage || series.posterImage,
      thumbnail: series.thumbnailImage,
      videoUrl: buildStreamUrl(req, series.id), // Single URL for video playback
      description: series.description,
      episodes: series.episodes.map(episode => ({
        ...episode,
        streamUrl: buildEpisodeStreamUrl(req, series.id, episode.id)
      })),
      cast: (series.cast || []).map(member => ({
        name: member.name,
        role: member.role,
        img: member.image || member.img
      })),
      crew: (series.crew || []).map(member => ({
        name: member.name,
        job: member.job,
        img: member.image || member.img
      }))
    };
    
    return res.status(200).json({
      success: true,
      series: formattedSeries
    });
  } catch (error) {
    console.error("Error fetching series by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch series"
    });
  }
};

/**
 * Get series categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSeriesCategories = (req, res) => {
  try {
    const { context, seriesId } = req.query;
    
    let categories;
    
    // Handle different contexts
    if (context === "series" && seriesId) {
      // For series context with specific seriesId, get related categories
      const currentSeries = Series.findById(seriesId);
      if (currentSeries) {
        // Get all categories except the current series's category
        const allCategories = Series.getAllCategories();
        categories = allCategories.filter(cat => 
          cat.code !== currentSeries.category.toLowerCase().replace(/\s+/g, '-')
        );
        // Limit to 3-4 related categories for better UX
        categories = categories.slice(0, 4);
      } else {
        // If series not found, return all categories
        categories = Series.getAllCategories();
      }
    } else if (context === "series") {
      // For general series context, return all categories
      categories = Series.getAllCategories();
    } else if (context === "play" && seriesId) {
      // For play context, get categories excluding the current series's category
      const currentSeries = Series.findById(seriesId);
      if (currentSeries) {
        const allCategories = Series.getAllCategories();
        categories = allCategories.filter(cat => 
          cat.code !== currentSeries.category.toLowerCase().replace(/\s+/g, '-')
        );
        // Limit to 3-4 related categories for better UX
        categories = categories.slice(0, 4);
      } else {
        categories = Series.getAllCategories();
      }
    } else {
      // Default behavior - return all categories
      categories = Series.getAllCategories();
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
    console.error("Error fetching series categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch series categories"
    });
  }
};

/**
 * Get episodes by season for a series
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSeriesEpisodesBySeason = (req, res) => {
  try {
    const { id, season } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Series ID is required"
      });
    }
    
    if (!season) {
      return res.status(400).json({
        success: false,
        message: "Season number is required"
      });
    }
    
    // Get series by ID
    const series = Series.findById(id);
    
    if (!series) {
      return res.status(404).json({
        success: false,
        message: "Series not found"
      });
    }
    
    // Filter episodes by season
    const seasonEpisodes = series.episodes.filter(episode => 
      episode.season === parseInt(season)
    );
    
    // Implement pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedEpisodes = seasonEpisodes.slice(startIndex, endIndex);
    
    // Format episodes data for frontend
    const formattedEpisodes = paginatedEpisodes.map(episode => ({
      id: episode.id,
      title: episode.title,
      episodeNumber: episode.episode,
      season: episode.season,
      duration: episode.duration,
      description: episode.description,
      thumbnail: series.thumbnailImage || series.posterImage,
      streamUrl: buildEpisodeStreamUrl(req, series.id, episode.id)
    }));
    
    return res.status(200).json({
      success: true,
      episodes: formattedEpisodes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(seasonEpisodes.length / parseInt(limit)),
        totalEpisodes: seasonEpisodes.length,
        hasNextPage: endIndex < seasonEpisodes.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error("Error fetching series episodes by season:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch series episodes"
    });
  }
};

module.exports = {
  getSeriesByCategory,
  getLatestSeries,
  getLatestFiveSeries,
  getSeriesById,
  getSeriesCategories,
  getSeriesEpisodesBySeason,
  streamSeries,
  streamEpisode
};