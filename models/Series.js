class Series {
  constructor(id, title, description, category, posterImage, thumbnailImage, videoUrl, episodes, seasons, duration, releaseDate, rating, cast, crew) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.posterImage = posterImage; // Vertical image for category cards
    this.thumbnailImage = thumbnailImage; // Landscape image for series cards and media displays
    this.videoUrl = videoUrl;
    this.episodes = episodes || [];
    this.seasons = seasons || 1;
    this.duration = duration; // Average duration per episode
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.cast = cast || [];
    this.crew = crew || [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Get series by ID
  static findById(id) {
    // In a real app, this would query a database
    // Using == to handle both string and numeric ID comparisons
    return mockSeries.find(series => series.id == id) || null;
  }

  // Get series by category
  static findByCategory(categoryCode, limit = 12) {
    // In a real app, this would query a database
    // Convert category code back to category name for matching
    const categoryName = mockSeries
      .map(series => series.category)
      .find(cat => cat.toLowerCase().replace(/\s+/g, '-') === categoryCode);
    
    if (!categoryName) {
      return [];
    }
    
    return mockSeries
      .filter(series => series.category === categoryName)
      .slice(0, limit);
  }

  // Get latest series
  static findLatest() {
    // In a real app, this would query a database
    return mockSeries.reduce((latest, current) => {
      return new Date(current.releaseDate) > new Date(latest.releaseDate) ? current : latest;
    }, mockSeries[0]);
  }

  // Get latest 5 series
  static findLatestFive() {
    // In a real app, this would query a database
    // Sort by release date and take the first 5
    return [...mockSeries]
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 5);
  }

  // Get all categories
  static getAllCategories() {
    // In a real app, this would query a database
    const categories = [...new Set(mockSeries.map(series => series.category))];
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

// Enhanced mock episodes data with multiple seasons
const generateMockEpisodes = (seriesId, numSeasons) => {
  const episodes = [];
  const titles = [
    "The Beginning", "Unexpected Turns", "Hidden Truths", "Crossroads", 
    "Revelations", "Into the Fire", "Breaking Point", "New Alliances",
    "Betrayals", "The Return", "Final Preparations", "Endgame"
  ];
  
  for (let season = 1; season <= numSeasons; season++) {
    // Vary number of episodes per season (8-12 episodes)
    const episodesInSeason = 8 + (season % 5);
    
    for (let episode = 1; episode <= episodesInSeason; episode++) {
      const titleIndex = (season + episode - 2) % titles.length;
      episodes.push({
        id: `s${seriesId}-s${season}e${episode}`,
        title: titles[titleIndex],
        season: season,
        episode: episode,
        duration: `${40 + (episode % 15)}m`,
        description: `Episode ${episode} of Season ${season} in ${titles[titleIndex]}. A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.`
      });
    }
  }
  
  return episodes;
};

// Mock data for demonstration with proper image types and real URLs
// Updated to use numeric IDs
const mockSeries = [
  new Series(1, "The Family Man",
    "A working man becomes an intelligence officer for T.I.S.C.",
    "Action",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(1, 2), 2, "45m", "2019-12-15", 8.5, mockCast, mockCrew
  ),

  new Series(2, "Asur",
    "A serial killer thriller based on forensic science.",
    "Thriller",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/gndscpysm9gm0feteqgq.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(2, 2), 2, "50m", "2020-03-10", 8.2, mockCast, mockCrew
  ),

  new Series(3, "Mirzapur",
    "A small town in UP becomes a hub for illegal activities.",
    "Crime",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/y0upo8myxzfmqekm3zkd.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(3, 3), 3, "48m", "2018-10-05", 8.7, mockCast, mockCrew
  ),

  new Series(4, "Panchayat",
    "A group of young engineers working in a village.",
    "Comedy",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/uytdytpvhqyxzjwumlui.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(4, 3), 3, "40m", "2020-04-30", 8.4, mockCast, mockCrew
  ),

  new Series(5, "Sacred Games",
    "A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.A troubled police officer investigates a case involving ancient texts.",
    "Thriller",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/etpqg630dvu0dbwlnk42.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(5, 2), 2, "55m", "2018-07-06", 8.1, mockCast, mockCrew
  ),

  new Series(6, "Scam 1992",
    "The story of Harshad Mehta and the 1992 securities scam.",
    "Biography",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/qgn587hv2hkq5dzntaga.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(6, 1), 1, "45m", "2020-09-09", 8.8, mockCast, mockCrew
  ),

  new Series(7, "Paatal Lok",
    "A cynical inspector investigates a mysterious case.",
    "Crime",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/hcmj2mxwf1r348rfqeg2.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(7, 1), 1, "50m", "2020-05-15", 8.0, mockCast, mockCrew
  ),

  new Series(8, "Made in Heaven",
    "Two wedding planners navigate the complexities of Delhi society.",
    "Drama",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png",
    "https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png",
    "https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4",
    generateMockEpisodes(8, 2), 2, "42m", "2019-03-09", 8.3, mockCast, mockCrew
  )
];

module.exports = Series;
module.exports.mockSeries = mockSeries;