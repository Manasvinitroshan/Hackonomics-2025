// src/routes/send.ts
import express from 'express';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const router = express.Router();
const ses = new SESClient({ region: process.env.AWS_REGION });

router.post('/', async (req, res) => {
  // now matching exactly what the front end is sending:
  const { toEmail, subject, body } = req.body;
  if (!toEmail || !subject || !body) {
    return res
      .status(400)
      .json({ error: 'Missing `toEmail`, `subject`, or `body` in request' });
  }

  const params = {
    Source:      process.env.SES_FROM_EMAIL!,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: subject },
      Body:    { Text: { Data: body } },
    },
  };

  try {
    await ses.send(new SendEmailCommand(params));
    return res.json({ ok: true, message: 'Email sent' });
  } catch (err) {
    console.error('❌ SES Error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
