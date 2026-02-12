import ytdlp from "yt-dlp-exec";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export async function convertVideoToAudio(url, id) {
  const tempDir = path.join(process.cwd(), "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const videoPath = path.join(tempDir, `${id}.mp4`);
  const audioPath = path.join(tempDir, `${id}.mp3`);

  // Download video
  await ytdlp(url, {
    output: videoPath,
    format: "best",
  });

  // Convert to mp3 using ffmpeg (Render usually has ffmpeg)
  execSync(`ffmpeg -i "${videoPath}" -vn -ab 192k -ar 44100 -y "${audioPath}"`);

  // Delete video after conversion
  fs.unlinkSync(videoPath);

  return audioPath;
}
