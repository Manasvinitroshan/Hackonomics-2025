import axios from 'axios';

export const uploadFileToS3 = async (formData: FormData) => {
  const res = await axios.post('http://localhost:3001/api/upload', formData);
  return res.data;
};
