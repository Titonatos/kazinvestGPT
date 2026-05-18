import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: OPENAI_API_KEY is not set.');
}

const openai = apiKey ? new OpenAI({ apiKey }) : null;
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!openai) {
      return res
        .status(500)
        .json({ error: 'OpenAI API key is not configured.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || '';
    res.json({ response });
  } catch (err) {
    console.error('OpenAI API error:', err);
    const status = err.status || 500;
    const error = err.message || 'Failed to get response.';
    res.status(status).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
