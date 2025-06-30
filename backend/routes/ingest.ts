// backend/routes/ingest.ts
import express from "express";
import { ingestPdfIntoKb } from "../services/kb.ts";

const router = express.Router();

router.post("/", async (req, res) => {
  const key = (req.body.key as string || "").trim();
  if (!key) {
    return res.status(400).json({ error: "Missing required PDF key." });
  }

  try {
    const kbId = await ingestPdfIntoKb(process.env.BUCKET!, key);
    return res.json({ knowledge_base_id: kbId });
  } catch (err: any) {
    console.error("KB ingestion failed:", err);
    return res.status(500).json({ error: err.message || "Ingestion error" });
  }
});

export default router;
