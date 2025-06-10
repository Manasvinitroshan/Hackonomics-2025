// routes/upload.ts
import express from 'express';
import type { Request, Response } from 'express';
import upload from '../services/s3.ts';

const router = express.Router();

router.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response): void => {
    if (!req.file || !('location' in req.file) || !('key' in req.file)) {
      res.status(400).json({ error: 'Upload failed' });
      return;
    }
    const { location, key } = req.file as Express.MulterS3.File;
    res.json({ message: 'File uploaded', location, key });
  }
);

export default router;
