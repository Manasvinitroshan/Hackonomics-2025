// routes/upload.ts
import express from 'express';
import type { Request, Response } from 'express';
import upload from '../services/s3.ts';
import { s3 } from '../services/s3.ts';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * POST /upload
 * Expects a multipart/form-data request with a single file field named "file".
 * Uses multer-s3 middleware to stream directly to S3.
 */
router.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response): void => {
    // If multer failed to attach req.file, or it's missing expected props, return 400
    if (!req.file || !('location' in req.file) || !('key' in req.file)) {
      res.status(400).json({ error: 'Upload failed' });
      return;
    }

    // At this point, req.file is a multerS3.File with .location and .key
    const { location, key } = req.file as Express.MulterS3.File;
    res.json({
      message: 'File uploaded',
      location,
      key,
    });
  }
);

/**
 * GET /upload/list
 * Returns the most recent PDF upload with presigned URL.
 */
router.get('/list', async (_req: Request, res: Response) => {
  try {
    const resp = await s3
      .listObjectsV2({ Bucket: 'ai-cfo-docs', MaxKeys: 1000 })
      .promise();

    if (!resp.Contents) {
      return res.status(404).json({ message: 'No files found' });
    }

    // Filter to only PDFs
    const pdfs = resp.Contents.filter(obj => obj.Key?.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      return res.status(404).json({ message: 'No PDF files found' });
    }

    // Sort by LastModified descending
    const latestPdf = pdfs.sort(
      (a, b) => (b.LastModified!.getTime()) - (a.LastModified!.getTime())
    )[0]!;

    const key = latestPdf.Key!;
    const url = s3.getSignedUrl('getObject', {
      Bucket: 'ai-cfo-docs',
      Key: key,
      Expires: 15 * 60,
    });

    res.json({ key, url, lastModified: latestPdf.LastModified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list uploads' });
  }
});

export default router;
