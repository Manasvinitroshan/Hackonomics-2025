// backend/routes/post.ts

import express from 'express';
import type { Request, Response } from 'express';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!;
if (!TABLE_NAME) throw new Error('DYNAMODB_TABLE_NAME must be set');

AWS.config.update({
  region: process.env.AWS_REGION,
  // credentials via env or ~/.aws/credentials
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const router = express.Router();

/**
 * POST /api/posts
 */
router.post('/', async (req: Request, res: Response) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: 'author & content required' });
  }

  const timestamp = new Date().toISOString();
  const newItem = {
    postId:    uuidv4(),
    author,
    content,
    timestamp,
    replies:   [] as string[],
    likes:     0,
    dislikes:  0,
    // removed likedBy/dislikedBy here
  };

  try {
    await dynamoDb
      .put({
        TableName: TABLE_NAME,
        Item:      newItem
      })
      .promise();

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error saving post:', err);
    res.status(500).json({ error: 'Could not save post' });
  }
});

/**
 * GET /api/posts
 */
router.get('/', async (_req, res) => {
  try {
    const data = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
    const items = (data.Items ?? []) as any[];
    // sort newest-first
    items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    res.json(items);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Could not fetch posts' });
  }
});

/**
 * PATCH /api/posts/:id/like
 */
router.patch('/:id/like', async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { timestamp, user } = req.body;
  if (!timestamp || !user) {
    return res.status(400).json({ error: 'timestamp & user required' });
  }

  const userSet = dynamoDb.createSet([user]);
  try {
    const result = await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key:       { postId, timestamp },
        // add this user to likedBy, remove from dislikedBy
        UpdateExpression: 'ADD likedBy :u DELETE dislikedBy :u',
        ExpressionAttributeValues: { ':u': userSet },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    const attrs = result.Attributes!;
    const likes    = attrs.likedBy?.values.length  ?? 0;
    const dislikes = attrs.dislikedBy?.values.length ?? 0;
    res.json({ ...attrs, likes, dislikes });
  } catch (err) {
    console.error('Error updating like:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

/**
 * PATCH /api/posts/:id/dislike
 */
router.patch('/:id/dislike', async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { timestamp, user } = req.body;
  if (!timestamp || !user) {
    return res.status(400).json({ error: 'timestamp & user required' });
  }

  const userSet = dynamoDb.createSet([user]);
  try {
    const result = await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key:       { postId, timestamp },
        // add to dislikedBy, remove from likedBy
        UpdateExpression: 'ADD dislikedBy :u DELETE likedBy :u',
        ExpressionAttributeValues: { ':u': userSet },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    const attrs = result.Attributes!;
    const likes    = attrs.likedBy?.values.length  ?? 0;
    const dislikes = attrs.dislikedBy?.values.length ?? 0;
    res.json({ ...attrs, likes, dislikes });
  } catch (err) {
    console.error('Error updating dislike:', err);
    res.status(500).json({ error: 'Failed to dislike post' });
  }
});

/**
 * PATCH /api/posts/:id/reply
 */
router.patch('/:id/reply', async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { timestamp, reply } = req.body;
  if (!timestamp || !reply) {
    return res.status(400).json({ error: 'timestamp & reply required' });
  }

  try {
    const result = await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key:       { postId, timestamp },
        UpdateExpression:
          'SET replies = list_append(if_not_exists(replies, :empty), :r)',
        ExpressionAttributeValues: {
          ':r':     [reply],
          ':empty': [],
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    res.json(result.Attributes);
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

export default router;
