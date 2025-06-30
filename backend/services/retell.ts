// backend/services/retell.ts
import Retell from 'retell-sdk';

export const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY!,    // from your .env
});
