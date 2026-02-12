# YCON Audio Converter Backend

Backend API for converting YouTube and Instagram videos to MP3 audio files.

## Prerequisites

- Node.js (v16+)
- FFmpeg (for audio conversion)
- yt-dlp (for video downloading)

### Install FFmpeg

**Windows:**
```bash
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Install yt-dlp

**Windows:**
```bash
choco install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
sudo apt-get install yt-dlp
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/convert
Convert a video URL to MP3

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "conversionId": "uuid",
  "message": "Conversion started",
  "downloadUrl": "/api/download/uuid"
}
```

### GET /api/download/:conversionId
Download the converted MP3 file

### GET /api/health
Health check endpoint

## Frontend Integration

Update your frontend's `App.tsx` to call the backend:

```typescript
const handleConvert = async () => {
  setIsConverting(true);
  try {
    const response = await fetch('http://localhost:5000/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    setConversionId(data.conversionId);
    // Poll for completion or use WebSocket
  } catch (error) {
    setError(error.message);
  } finally {
    setIsConverting(false);
  }
};
```

## Supported Platforms

- YouTube
- Instagram
- Facebook
- TikTok
- And many more (via yt-dlp)

## File Structure

```
backend/
├── server.js              # Main Express server
├── services/
│   ├── converter.js       # Video to audio conversion logic
│   └── fileManager.js     # File operations
├── downloads/             # Converted audio files
├── temp/                  # Temporary video files
├── package.json
├── .env
└── .gitignore
```
