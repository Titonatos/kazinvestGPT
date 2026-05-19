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
const distPath = path.join(__dirname, '..', 'dist');

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.warn('WARNING: OPENROUTER_API_KEY is not set.');
}

const openrouter = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  : null;
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages[messages.length - 1]?.role !== 'user' ||
      !messages[messages.length - 1]?.content?.trim()
    ) {
      return res.status(400).json({ error: 'Valid messages array with a user message is required.' });
    }

    if (!openrouter) {
      return res
        .status(500)
        .json({ error: 'OpenRouter API key is not configured.' });
    }

    const completion = await openrouter.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || '';
    res.json({ response });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    const status = err.status || 500;
    const error = err.message || 'Failed to get response.';
    res.status(status).json({ error });
  }
});

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
