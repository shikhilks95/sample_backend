class Comment {
  constructor(id, reelId, userId, username, avatar, text, timestamp, likes = 0) {
    this.id = id;
    this.reelId = reelId;
    this.userId = userId;
    this.username = username;
    this.avatar = avatar;
    this.text = text;
    this.timestamp = timestamp;
    this.likes = likes;
  }

  // Static array to store comments in memory (in a real app, this would be a database)
  static comments = [];

  // Get comments for a specific reel
  static getCommentsByReelId(reelId) {
    return this.comments.filter(comment => comment.reelId === reelId);
  }

  // Add a new comment
  static addComment(reelId, userId, username, avatar, text) {
    const newComment = new Comment(
      Date.now().toString(),
      reelId,
      userId,
      username,
      avatar,
      text,
      new Date().toISOString()
    );
    
    this.comments.push(newComment);
    return newComment;
  }

  // Get a comment by ID
  static getCommentById(id) {
    return this.comments.find(comment => comment.id === id);
  }

  // Delete a comment by ID
  static deleteComment(id) {
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      this.comments.splice(index, 1);
      return true;
    }
    return false;
  }

  // Like a comment
  static likeComment(id) {
    const comment = this.getCommentById(id);
    if (comment) {
      comment.likes += 1;
      return true;
    }
    return false;
  }
}

// Add more mock comments for demonstration and testing infinite scroll
Comment.comments = [
  new Comment("1", "1", "user1", "JohnDoe", "https://i.pravatar.cc/40?u=user1", "Great video!", "2023-05-01T10:00:00Z", 5),
  new Comment("2", "1", "user2", "JaneSmith", "https://i.pravatar.cc/40?u=user2", "Love this content!", "2023-05-01T10:05:00Z", 3),
  new Comment("3", "2", "user3", "MikeJohnson", "https://i.pravatar.cc/40?u=user3", "Thanks for sharing", "2023-05-01T10:10:00Z", 2),
  new Comment("4", "1", "user4", "AliceBrown", "https://i.pravatar.cc/40?u=user4", "This is amazing!", "2023-05-01T10:15:00Z", 7),
  new Comment("5", "1", "user5", "BobWilson", "https://i.pravatar.cc/40?u=user5", "Can't stop watching!", "2023-05-01T10:20:00Z", 4),
  new Comment("6", "1", "user6", "CarolDavis", "https://i.pravatar.cc/40?u=user6", "So entertaining!", "2023-05-01T10:25:00Z", 9),
  new Comment("7", "1", "user7", "DavidMiller", "https://i.pravatar.cc/40?u=user7", "Brilliant work!", "2023-05-01T10:30:00Z", 2),
  new Comment("8", "1", "user8", "EmmaTaylor", "https://i.pravatar.cc/40?u=user8", "Keep it up!", "2023-05-01T10:35:00Z", 6),
  new Comment("9", "1", "user9", "FrankAnderson", "https://i.pravatar.cc/40?u=user9", "Mind-blowing!", "2023-05-01T10:40:00Z", 8),
  new Comment("10", "1", "user10", "GraceThomas", "https://i.pravatar.cc/40?u=user10", "Absolutely loved it!", "2023-05-01T10:45:00Z", 3),
  new Comment("11", "1", "user11", "HenryJackson", "https://i.pravatar.cc/40?u=user11", "Fantastic!", "2023-05-01T10:50:00Z", 5),
  new Comment("12", "1", "user12", "IvyWhite", "https://i.pravatar.cc/40?u=user12", "Incredible quality!", "2023-05-01T10:55:00Z", 7),
  new Comment("13", "1", "user13", "JackMoore", "https://i.pravatar.cc/40?u=user13", "So creative!", "2023-05-01T11:00:00Z", 4),
  new Comment("14", "1", "user14", "KarenLee", "https://i.pravatar.cc/40?u=user14", "Best video ever!", "2023-05-01T11:05:00Z", 9),
  new Comment("15", "1", "user15", "LeoKing", "https://i.pravatar.cc/40?u=user15", "Worth watching!", "2023-05-01T11:10:00Z", 2)
];

module.exports = Comment;