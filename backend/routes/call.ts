import express from "express";
import { retell } from "../services/retell.ts";

const router = express.Router();

router.post("/", async (req, res) => {
  const to  = (req.body.to  as string || "").trim();
  const key = (req.body.key as string || "").trim();

  if (!to) {
    return res.status(400).json({ error: 'Missing required "to" phone number.' });
  }

  const base      = process.env.CALL_FLOW_API_URL!;
  const answerUrl = key
    ? `${base}/call-flow?key=${encodeURIComponent(key)}`
    : `${base}/call-flow`;

  const params = {
    agent_id:    process.env.RETELL_AGENT_ID!,
    from_number: process.env.RETELL_FROM_NUMBER!,
    to_number:   to,
    script_url:  answerUrl,
  };

  try {
    const resp = await retell.call.createPhoneCall(params as any);
    return res.json({ call_id: resp.call_id });
  } catch (err: any) {
    return res
      .status(err.status || 500)
      .json({ error: err.response?.data || err.message });
  }
});

export default router;
