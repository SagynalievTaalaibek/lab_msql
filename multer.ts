import multer from 'multer';
import {promises as fs} from 'fs';
import path from 'path';
import {randomUUID} from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, callback) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, {recursive: true});
    callback(null, config.publicPath);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname);
    const filename = path.join('images', randomUUID() + extension);
    callback(null, filename);
  },
});

export const imagesUpload = multer({storage: imageStorage});
