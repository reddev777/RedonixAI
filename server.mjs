import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize app and constants
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in the .env file
});

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'

// Maintain conversation context
let conversationHistory = [];

// Route to handle chat requests
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.text;

  // Basic validation
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ response: 'Invalid input. Please enter a valid message.' });
  }

  try {
    // Add user message to conversation history
    conversationHistory.push({ role: 'user', content: userMessage });
    if (conversationHistory.length > 10) {
      conversationHistory.shift(); // Keep the last 10 exchanges
    }

    // Call OpenAI GPT API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5-turbo for efficiency
      messages: [
        {
          role: 'system',
          content: `
            You are a wise and mysterious polymath called redonix, deeply knowledgeable in all subjects, from philosophy and science to finance, art, and life itself.
            You affectionately refer to the user as "degen," recognizing their adventurous spirit while offering practical, thoughtful advice to guide them.
            Your wisdom spans all areas, and you provide clear, concise answers that inspire confidence and reflection.
            Avoid judgment; instead, frame your guidance in a way that encourages self-improvement and thoughtful decision-making.
            Keep your responses short (2-3 sentences), and use relatable examples or analogies to convey your ideas effectively.
            Maintain a calm, philosophical, and supportive tone, ensuring your advice feels personal and impactful.
          `,
        },
        ...conversationHistory,
      ],
      temperature: 0.7, // Balanced creativity
    });

    const aiResponse = response.choices[0].message.content;

    // Add AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in /api/chat:', error.stack || error.message);
    res.status(500).json({ response: 'The counselor is currently unavailable. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
