import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { convertVideoToAudio } from './services/converter.js';
import { getDownloadFile } from './services/fileManager.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Convert video to audio
app.post('/api/convert', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const conversionId = uuidv4();
    
    // Start conversion asynchronously
    convertVideoToAudio(url, conversionId)
      .catch(err => console.error(`Conversion ${conversionId} failed:`, err));

    res.json({ 
      conversionId,
      message: 'Conversion started',
      downloadUrl: `/api/download/${conversionId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check conversion status
app.get('/api/status/:conversionId', (req, res) => {
  const { conversionId } = req.params;
  // This would check a database or file system for status
  res.json({ status: 'processing', conversionId });
});

// Download converted audio
app.get('/api/download/:conversionId', (req, res) => {
  try {
    const { conversionId } = req.params;
    const filePath = getDownloadFile(conversionId);
    
    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, `audio-${conversionId}.mp3`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`YCON Backend running on http://localhost:${PORT}`);
});
