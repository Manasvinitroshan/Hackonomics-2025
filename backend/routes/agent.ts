// backend/routes/agent.ts
import express from 'express';
import { retell } from '../services/retell.ts';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const agent = await retell.agent.create({
      // pick your model & voice:
      response_engine: { llm_id: 'openai-text-embedding-3-small', type: 'retell-llm' },
      voice_id: '11labs-Adrian',         // or any supported voice
      agent_name: 'MyAI_CFO',            // optional display name
    });
    // save agent.agent_id in your DB or env
    res.json({ agent_id: agent.agent_id });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
