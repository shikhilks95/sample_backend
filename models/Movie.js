class Movie {
  constructor(id, title, description, category, posterImage, thumbnailImage, videoUrl, duration, releaseDate, rating, cast, crew) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.posterImage = posterImage; // Vertical image for category cards
    this.thumbnailImage = thumbnailImage; // Landscape image for movie cards and media displays
    this.videoUrl = videoUrl;
    this.duration = duration;
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.cast = cast || [];
    this.crew = crew || [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Get movie by ID
  static findById(id) {
    // In a real app, this would query a database
    return mockMovies.find(movie => movie.id === id) || null;
  }

  // Get movies by category
  static findByCategory(categoryCode, limit = 12) {
    // In a real app, this would query a database
    // Convert category code back to category name for matching
    const categoryName = mockMovies
      .map(movie => movie.category)
      .find(cat => cat.toLowerCase().replace(/\s+/g, '-') === categoryCode);
    
    if (!categoryName) {
      return [];
    }
    
    return mockMovies
      .filter(movie => movie.category === categoryName)
      .slice(0, limit);
  }

  // Get latest movie
  static findLatest() {
    // In a real app, this would query a database
    return mockMovies.reduce((latest, current) => {
      return new Date(current.releaseDate) > new Date(latest.releaseDate) ? current : latest;
    }, mockMovies[0]);
  }

  // Get all categories
  static getAllCategories() {
    // In a real app, this would query a database
    const categories = [...new Set(mockMovies.map(movie => movie.category))];
    return categories.map(category => ({
      code: category.toLowerCase().replace(/\s+/g, '-'),
      name: category
    }));
  }
}

// Extended mock cast data with more members
const mockCast = [
  { name: "Alex Johnson", role: "Lead Actor", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png" },
  { name: "Sam Wilson", role: "Supporting Actor", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png" },
  { name: "Taylor Reed", role: "Supporting Actress", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png" },
  { name: "Jordan Smith", role: "Lead Actress", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png" },
  { name: "Casey Brown", role: "Antagonist", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png" },
  { name: "Morgan Lee", role: "Comic Relief", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png" }
];

// Extended mock crew data with more members
const mockCrew = [
  { name: "Jordan Smith", job: "Director", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png" },
  { name: "Casey Brown", job: "Producer", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png" },
  { name: "Morgan Lee", job: "Screenwriter", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png" },
  { name: "Alex Johnson", job: "Cinematographer", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png" },
  { name: "Sam Wilson", job: "Editor", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png" },
  { name: "Taylor Reed", job: "Costume Designer", image: "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png" }
];

// Mock data for demonstration with proper image types and real URLs
const mockMovies = [
  new Movie("1", "The Adventure Begins",
    "An epic adventure of discovery and courage.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl = "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    "2h 15m","2025-01-15",8.5,mockCast,mockCrew
  ),

  new Movie("2", "Love in Paris",
    "A magical romantic weekend where strangers fall in love.",
    "Romance",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/gndscpysm9gm0feteqgq.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 55m","2025-02-10",7.8,mockCast,mockCrew
  ),

  new Movie("3", "Mystery Mansion",
    "A spine-chilling mystery unfolds inside an abandoned mansion.",
    "Thriller",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/y0upo8myxzfmqekm3zkd.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 5m","2025-03-05",8.2,mockCast,mockCrew
  ),

  new Movie("4", "Comedy Night",
    "A comedian goes viral for all the wrong reasons.",
    "Comedy",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/uytdytpvhqyxzjwumlui.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 35m","2025-01-30",7.5,mockCast,mockCrew
  ),

  new Movie("5", "Sci-Fi Odyssey",
    "A journey through space and human consciousness.",
    "Science Fiction",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/etpqg630dvu0dbwlnk42.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 30m","2025-04-12",9.0,mockCast,mockCrew
  ),

  new Movie("6", "Historical Epic",
    "A warrior’s tale during the rise and fall of an ancient empire.",
    "History",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/qgn587hv2hkq5dzntaga.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 45m","2025-02-28",8.0,mockCast,mockCrew
  ),

  new Movie("7", "Animated Dreams",
    "A girl discovers she can bring drawings to life.",
    "Animation",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/hcmj2mxwf1r348rfqeg2.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 45m","2025-03-22",8.3,mockCast,mockCrew
  ),

  new Movie("8", "Superhero Origins",
    "A group of unlikely heroes unite against an alien invasion.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 20m","2025-05-10",8.7,mockCast,mockCrew
  ),

  new Movie("9", "Indie Romance",
    "Finding love in unexpected places and healing from the past.",
    "Romance",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/gndscpysm9gm0feteqgq.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 30m","2025-04-05",7.9,mockCast,mockCrew
  ),

  new Movie("10", "Cyber City",
    "A hacker uncovers a dangerous secret in a futuristic megacity.",
    "Science Fiction",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 10m","2025-06-01",8.1,mockCast,mockCrew
  ),

  new Movie("11", "Lost in the Desert",
    "A survivalist must escape a deadly desert storm.",
    "Adventure",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/etpqg630dvu0dbwlnk42.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 50m","2025-03-10",7.4,mockCast,mockCrew
  ),

  new Movie("12", "Ghost Town",
    "A detective investigates a town where everyone disappeared overnight.",
    "Thriller",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/y0upo8myxzfmqekm3zkd.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 00m","2025-02-18",8.6,mockCast,mockCrew
  ),

  new Movie("13", "Battle of Legends",
    "Warriors from different kingdoms unite against a dark force.",
    "Fantasy",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/qgn587hv2hkq5dzntaga.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 40m","2025-05-20",8.9,mockCast,mockCrew
  ),

  new Movie("14", "Silent Streets",
    "A crime drama about a journalist uncovering corruption.",
    "Crime",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/uytdytpvhqyxzjwumlui.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 55m","2025-04-30",7.6,mockCast,mockCrew
  ),

  new Movie("15", "Galaxy Rangers",
    "A team of space rangers fights an interstellar threat.",
    "Science Fiction",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/etpqg630dvu0dbwlnk42.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 25m","2025-06-15",8.8,mockCast,mockCrew
  ),

  new Movie("16", "Midnight Secrets",
    "A psychological thriller about hidden identities.",
    "Thriller",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/hcmj2mxwf1r348rfqeg2.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 12m","2025-03-18",8.4,mockCast,mockCrew
  ),

  new Movie("17", "Ocean Mystery",
    "Deep sea divers uncover an underwater civilization.",
    "Adventure",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 48m","2025-07-03",7.7,mockCast,mockCrew
  ),

  new Movie("18", "Dreamwalker",
    "A man enters other people's dreams to solve crimes.",
    "Fantasy",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/y0upo8myxzfmqekm3zkd.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 58m","2025-05-05",8.1,mockCast,mockCrew
  ),

  new Movie("19", "Heart of Steel",
    "A retired soldier is forced back into action.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/qgn587hv2hkq5dzntaga.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"2h 10m","2025-06-25",7.9,mockCast,mockCrew
  ),

  new Movie("20", "Funny Life",
    "A comedy about a man's hilarious attempt to fix his chaotic life.",
    "Comedy",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/uytdytpvhqyxzjwumlui.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl,"1h 40m","2025-07-15",7.2,mockCast,mockCrew
  ),
  new Movie("21", "The Adventure Begins",
    "An epic adventure of discovery and courage.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl = "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    "2h 15m","2025-01-15",8.5,mockCast,mockCrew
  ),
  new Movie("22", "The Adventure Begins",
    "An epic adventure of discovery and courage.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    videoUrl = "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    "2h 15m","2025-01-15",8.5,mockCast,mockCrew
  ),
];


module.exports = Movie;
module.exports.mockMovies = mockMovies;