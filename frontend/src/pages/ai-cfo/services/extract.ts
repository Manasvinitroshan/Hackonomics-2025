import axios from 'axios';

export const extractText = async (bucket: string, key: string) => {
  const res = await axios.post('http://localhost:3001/api/extract', { bucket, key });
  return res.data.text;
};
