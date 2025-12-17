class Reel {
  constructor(id, videoUrl, username, avatar, musicTitle, musicImage, likesCount, commentsCount, sharesCount, liked, description, userId) {
    this.id = id;
    this.videoUrl = videoUrl;
    this.username = username;
    this.avatar = avatar; // User profile image
    this.musicTitle = musicTitle;
    this.musicImage = musicImage; // Music thumbnail image
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.sharesCount = sharesCount;
    this.liked = liked;
    this.following = false; // Default to not following
    this.description = description;
    this.userId = userId || id; // Use id as userId if not provided
    this.createdAt = new Date().toISOString();
  }

  // Get reels with pagination
  static getFeed(limit = 5, cursor = null) {
    const cursorIndex = cursor ? parseInt(cursor, 10) : 0;
    const startIndex = cursorIndex;
    const endIndex = startIndex + limit;
    const paginatedReels = mockReels.slice(startIndex, endIndex);
    
    const hasMore = endIndex < mockReels.length;
    const nextCursor = hasMore ? endIndex.toString() : null;
    
    return {
      reels: paginatedReels,
      nextCursor,
      hasMore
    };
  }

  // Get reel by ID
  static findById(id) {
    return mockReels.find(reel => reel.id === id) || null;
  }

  // Like a reel
  static likeReel(id) {
    const reel = mockReels.find(r => r.id === id);
    if (reel) {
      reel.likesCount += 1;
      reel.liked = true;
      return true;
    }
    return false;
  }

  // Unlike a reel
  static unlikeReel(id) {
    const reel = mockReels.find(r => r.id === id);
    if (reel && reel.likesCount > 0) {
      reel.likesCount -= 1;
      reel.liked = false;
      return true;
    }
    return false;
  }

  // Check if reel is liked
  static checkLiked(id) {
    const reel = mockReels.find(r => r.id === id);
    return reel ? reel.liked : false;
  }

  // Share a reel
  static shareReel(id) {
    const reel = mockReels.find(r => r.id === id);
    if (reel) {
      reel.sharesCount += 1;
      return {
        success: true,
        sharesCount: reel.sharesCount
      };
    }
    return {
      success: false,
      sharesCount: 0
    };
  }

  // Reshare a reel (check if user has reshared)
  static checkReshared(id, userId) {
    // In a real implementation, this would check a database
    // For demo purposes, we'll simulate with a mock array
    const resharedReels = global.resharedReels || {};
    return resharedReels[userId] ? resharedReels[userId].includes(id) : false;
  }

  // Toggle reshare status for a user
  static toggleReshare(id, userId) {
    // Initialize if not exists
    if (!global.resharedReels) {
      global.resharedReels = {};
    }
    if (!global.resharedReels[userId]) {
      global.resharedReels[userId] = [];
    }

    const userReshares = global.resharedReels[userId];
    const index = userReshares.indexOf(id);

    const reel = mockReels.find(r => r.id === id);
    if (!reel) return false;

    if (index > -1) {
      // Already reshared, so remove (unreshare)
      userReshares.splice(index, 1);
      reel.sharesCount = Math.max(0, (reel.sharesCount || 0) - 1);
      return { reshared: false, sharesCount: reel.sharesCount };
    } else {
      // Not reshared yet, so add
      userReshares.push(id);
      reel.sharesCount = (reel.sharesCount || 0) + 1;
      return { reshared: true, sharesCount: reel.sharesCount };
    }
  }
}

// Mock data for demonstration with proper image types and real URLs
const mockReels = [
  new Reel(
    "1",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764786589/qphwtmh2b3ijqsx0i5oz.mp4",
    "Harryy.__11",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Avatar (profile image)
    "Duet with Steve, Music by Harry...",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Music image (thumbnail)
    999,
    120,
    88,
    false,
    "Amazing sunset vibes 🌅",
    "user1"
  ),
  new Reel(
    "2",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787475/ipat9ufgnoayirlfwrlj.mp4",
    "Sarah.Music",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Avatar (profile image)
    "Original Sound - Sarah",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Music image (thumbnail)
    1200,
    45,
    23,
    false,
    "Dance challenge complete! 💃",
    "user2"
  ),
  new Reel(
    "3",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787475/t1vg6l3cyos0jqx5nep6.mp4",
    "Alex.Creator",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png", // Avatar (profile image)
    "Trending Audio #123",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png", // Music image (thumbnail)
    5600,
    234,
    156,
    true,
    "Epic transition! 🔥",
    "user3"
  ),
  new Reel(
    "4",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787474/gy2um6pqckspxvzwmcu6.mp4",
    "Emma.Vibes",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Avatar (profile image)
    "Chill Beats - Emma",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Music image (thumbnail)
    890,
    67,
    34,
    false,
    "Morning routine ✨",
    "user4"
  ),
  new Reel(
    "5",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787474/v267y6vkdqwlli1jsydl.mp4",
    "Mike.Studio",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Avatar (profile image)
    "Epic Soundtrack",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Music image (thumbnail)
    2300,
    189,
    92,
    false,
    "Behind the scenes 🎬",
    "user5"
  ),
  new Reel(
    "6",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/a50e1i8bhmn78dpuwzi7.mp4",
    "Luna.Art",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png", // Avatar (profile image)
    "Artistic Vibes",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png", // Music image (thumbnail)
    3400,
    156,
    78,
    false,
    "Creating magic 🎨",
    "user6"
  ),
  new Reel(
    "7",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/tcppn77dz6fne8xrk3zf.mp4",
    "Tech.Guru",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Avatar (profile image)
    "Tech Beats",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png", // Music image (thumbnail)
    4500,
    278,
    134,
    true,
    "New tech review 📱",
    "user7"
  ),
  new Reel(
    "8",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/qvbaysupqeorftwbwury.mp4",
    "Fitness.Pro",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Avatar (profile image)
    "Workout Mix",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png", // Music image (thumbnail)
    6700,
    345,
    201,
    false,
    "Daily workout 💪",
    "user8"
  )
];

module.exports = Reel;
module.exports.mockReels = mockReels;