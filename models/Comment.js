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

// Add some mock comments for demonstration
Comment.comments = [
  new Comment("1", "1", "user1", "JohnDoe", "https://i.pravatar.cc/40?u=user1", "Great video!", "2023-05-01T10:00:00Z", 5),
  new Comment("2", "1", "user2", "JaneSmith", "https://i.pravatar.cc/40?u=user2", "Love this content!", "2023-05-01T10:05:00Z", 3),
  new Comment("3", "2", "user3", "MikeJohnson", "https://i.pravatar.cc/40?u=user3", "Thanks for sharing", "2023-05-01T10:10:00Z", 2)
];

module.exports = Comment;