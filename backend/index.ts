// backend/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import uploadRouter  from './routes/upload.ts';
import extractRouter from './routes/extract.ts';
import askRouter     from './routes/ask.ts';
import postsRouter   from './routes/post.ts';
import callRouter    from './routes/call.ts';
import eventsRouter  from './routes/events.ts';
import sendRouter    from './routes/send.ts';
import simulationRouter from './routes/simulations.ts';
import ingestRouter from "./routes/ingest.ts";
import newsRouter from './routes/news.ts';
dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => res.send('AI CFO API is running'));

app.use('/upload',      uploadRouter);
app.use('/api/extract', extractRouter);
app.use('/api/ask',     askRouter);
app.use('/api/posts',   postsRouter);
app.use('/api/call',    callRouter);
app.use('/api/events',  eventsRouter);
app.use('/api/send',    sendRouter);    // ← new email route
app.use('/api/simulations', simulationRouter);
app.use('/api/news', newsRouter);
app.use("/api/ingest", ingestRouter);
const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
