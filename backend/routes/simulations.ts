// backend/routes/simulations.ts
import express from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { s3 } from '../services/s3.ts';
import { docClient } from '../services/dynamo.ts';

dotenv.config();

const router = express.Router();
const BUCKET = process.env.AWS_S3_BUCKET || 'ai-cfo-docs';
const CHART_PREFIX = 'charts/';

/**
 * POST /api/simulations
 * Body: {
 *   userId?: string,
 *   simulationType: string,
 *   parameters: object,
 *   results: object,
 *   chartImage: string (data:image/png;base64,...)
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, simulationType, parameters, results, chartImage } = req.body;
    if (!simulationType || !parameters || !results || !chartImage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Extract base64 content
    const match = chartImage.match(/^data:image\/png;base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid chartImage format' });
    }
    const buffer = Buffer.from(match[1], 'base64');

    // Upload chart PNG to S3
    const chartKey = `${CHART_PREFIX}${Date.now()}-${uuidv4()}.png`;
    await s3.putObject({
      Bucket: BUCKET,
      Key: chartKey,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
    }).promise();

    // Generate presigned URL for immediate use
    const chartUrl = s3.getSignedUrl('getObject', {
      Bucket: BUCKET,
      Key: chartKey,
      Expires: 3600 // 1 hour
    });

    // Persist metadata in DynamoDB
    const record = {
      id:             uuidv4(),
      userId:         userId || 'anonymous',
      simulationType,
      parameters,
      results,
      chartS3Key:     chartKey,
      chartUrl,
      createdAt:      new Date().toISOString(),
    };

    await docClient.put({
      TableName: 'Simulations',
      Item: record
    }).promise();

    res.json({ message: 'Simulation saved', id: record.id, chartUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save simulation' });
  }
});

/**
 * GET /api/simulations
 * Returns the most recent PNG under charts/ in S3
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const resp = await s3.listObjectsV2({
      Bucket: BUCKET,
      Prefix: CHART_PREFIX,
      MaxKeys: 100
    }).promise();

    const objs = resp.Contents || [];
    // Filter for .png and non-zero size
    const charts = objs
      .filter(o => o.Key && o.Key.endsWith('.png') && o.Size! > 0)
      .sort((a, b) => (b.LastModified!.getTime()) - (a.LastModified!.getTime()));

    if (charts.length === 0) {
      return res.status(404).json({ message: 'No chart PNGs found' });
    }

    const latest = charts[0]!;
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET,
      Key: latest.Key!,
      Expires: 3600
    });

    res.json({
      key: latest.Key,
      url,
      lastModified: latest.LastModified
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest chart' });
  }
});

export default router;
