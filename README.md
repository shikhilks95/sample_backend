# Backend API for Evozn.ai

This is the backend API for the Evozn.ai frontend application, built with Node.js and Express.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
cd backend
npm install
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Movies

#### Get movies by category
```
GET /api/movies?category=:categoryCode&limit=:limit
```
- `category` (required): Category code (e.g., "action", "comedy")
- `limit` (optional): Number of movies to return (default: 12)

Response includes:
- `poster`: Vertical image for category cards
- `thumbnail`: Landscape image for movie cards and media displays

#### Get latest movie
```
GET /api/movies/latest
```

Response includes:
- `poster`: Vertical image for category cards
- `thumbnail`: Landscape image for movie cards and media displays
- `cast`: Array of cast members with names, roles, and images
- `crew`: Array of crew members with names, jobs, and images

#### Get movie by ID
```
GET /api/movies/:id
```
- `id`: Movie ID

Response includes:
- `poster`: Vertical image for category cards
- `thumbnail`: Landscape image for movie cards and media displays
- `cast`: Array of cast members with names, roles, and images
- `crew`: Array of crew members with names, jobs, and images

#### Get movie categories
```
GET /api/movies/categories
```

### Reels

#### Get reel feed
```
GET /api/reel/feed?limit=:limit&cursor=:cursor
```
- `limit` (optional): Number of reels to return (default: 5)
- `cursor` (optional): Pagination cursor

#### Get reel by ID
```
GET /api/reel/:id
```
- `id`: Reel ID

#### Like a reel
```
POST /api/reel/:id/like
```
- `id`: Reel ID

#### Unlike a reel
```
DELETE /api/reel/:id/like
```
- `id`: Reel ID

#### Check if reel is liked
```
GET /api/reel/:id/like/check
```
- `id`: Reel ID

#### Share a reel
```
POST /api/reel/:id/share
```
- `id`: Reel ID

## Image Types

The movie module uses two distinct image types with specific aspect ratios:
1. **Poster Images**: Vertically shaped images used in category cards
2. **Thumbnail Images**: Landscape-oriented images used in movie cards and media displays

These image types are properly applied based on UI context to ensure optimal display across different components.

## Media Assets

The backend uses Cloudinary URLs for all media assets:

### Movie Videos
- Action/Adventure: https://res.cloudinary.com/dda6kb43b/video/upload/v1765258580/zdk5sbvucxrjpolekkzg.mp4

### Movie Posters (Vertical)
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/ucmttmm9luodataw9eno.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/gndscpysm9gm0feteqgq.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/y0upo8myxzfmqekm3zkd.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/uytdytpvhqyxzjwumlui.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/etpqg630dvu0dbwlnk42.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/qgn587hv2hkq5dzntaga.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871245/hcmj2mxwf1r348rfqeg2.png

### Movie Thumbnails (Landscape)
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png

### Cast/Crew Images
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/esjrkffrmmnvxm7gwpuq.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871247/o2qwvlydy4mdmmr2z3ok.png
- https://res.cloudinary.com/dda6kb43b/image/upload/v1764871246/pybk35xlqczll8ewtdi8.png

### Reel Videos
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787475/ipat9ufgnoayirlfwrlj.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787475/t1vg6l3cyos0jqx5nep6.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787474/gy2um6pqckspxvzwmcu6.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787474/v267y6vkdqwlli1jsydl.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/a50e1i8bhmn78dpuwzi7.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/tcppn77dz6fne8xrk3zf.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764787473/qvbaysupqeorftwbwury.mp4
- https://res.cloudinary.com/dda6kb43b/video/upload/v1764786589/qphwtmh2b3ijqsx0i5oz.mp4

## Extended Mock Data

The backend now includes extended mock data with:
- **9 Movies** across various categories (Action, Romance, Thriller, Comedy, Science Fiction, History, Animation)
- **6 Cast Members** per movie with profile images and roles
- **6 Crew Members** per movie with profile images and jobs
- **8 Reels** with videos, avatars, and music images

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000
```