import axios from 'axios';

export const askQuestion = async (question: string, context: string) => {
  const res = await axios.post('http://localhost:3001/api/ask', { question, context });
  return res.data.answer;
};
