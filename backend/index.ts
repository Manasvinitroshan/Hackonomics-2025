// index.ts
import express from 'express';              // runtime import
import type { Request, Response } from 'express';  // types only
import cors from 'cors';
import dotenv from 'dotenv';

import uploadRouter  from './routes/upload.ts';
import extractRouter from './routes/extract.ts';
import askRouter     from './routes/ask.ts';
import postsRouter   from './routes/post.ts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response): void => {
  res.send('AI CFO API is running');
});

app.use('/upload',    uploadRouter);
app.use('/api/extract', extractRouter);
app.use('/api/ask',     askRouter);
app.use('/api/posts',   postsRouter);

const PORT = process.env.PORT ? +process.env.PORT : 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
