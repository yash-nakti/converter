import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.join(__dirname, '../downloads');

export function getDownloadFile(conversionId) {
  const filePath = path.join(DOWNLOADS_DIR, `${conversionId}.mp3`);
  
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  
  return null;
}

export function deleteDownloadFile(conversionId) {
  const filePath = path.join(DOWNLOADS_DIR, `${conversionId}.mp3`);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  
  return false;
}
