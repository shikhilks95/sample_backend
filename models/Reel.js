class Reel {
  constructor(id, videoUrl, username, avatar, musicTitle, musicImage, likesCount, commentsCount, sharesCount, liked, description) {
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
    this.description = description;
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
      return true;
    }
    return false;
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
    "Amazing sunset vibes 🌅"
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
    "Dance challenge complete! 💃"
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
    "Epic transition! 🔥"
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
    "Morning routine ✨"
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
    "Behind the scenes 🎬"
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
    "Creating magic 🎨"
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
    "New tech review 📱"
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
    "Daily workout 💪"
  )
];

module.exports = Reel;
module.exports.mockReels = mockReels;