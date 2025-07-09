import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("✅ Resume Generator API is working");
});

app.post('/generate', async (req, res) => {
  const { name, skills, job } = req.body;
  const prompt = `
Create a professional Resume and Cover Letter in English for:

Name: ${name}
Skills: ${skills}
Job Role: ${job}

Give answer in this format only:
RESUME:
...

COVER LETTER:
...
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);
    const text = await result.response.text();
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
