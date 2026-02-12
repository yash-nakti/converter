import { execSync } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.join(__dirname, '../downloads');
const TEMP_DIR = path.join(__dirname, '../temp');

[DOWNLOADS_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export async function convertVideoToAudio(videoUrl, conversionId) {
  const tempVideoPath = path.join(TEMP_DIR, `${conversionId}.mp4`);
  const audioPath = path.join(DOWNLOADS_DIR, `${conversionId}.mp3`);

  try {
    console.log(`Downloading video: ${videoUrl}`);
    execSync(`yt-dlp -f best[ext=mp4] -o "${tempVideoPath}" "${videoUrl}"`, { stdio: 'inherit' });

    console.log(`Converting to MP3: ${conversionId}`);
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .toFormat('mp3')
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .on('end', resolve)
        .on('error', reject)
        .save(audioPath);
    });

    fs.unlinkSync(tempVideoPath);
    console.log(`Conversion complete: ${conversionId}`);

  } catch (error) {
    console.error(`Conversion failed for ${conversionId}:`, error);
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    throw error;
  }
}
