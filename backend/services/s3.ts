// services/s3.ts
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only
dotenv.config();


AWS.config.update({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const s3v2 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3v2 as any,
    bucket: 'ai-cfo-docs',
    // ↓ Remove the ACL entirely:
    // acl: 'public-read',
    metadata: (_req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

export default upload;
