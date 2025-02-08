import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processCommand } from './src/ai/deepseek.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:3000", "https://yourfrontend.com"], // Only allow these domains
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
}));      // Allow frontend requests
app.use(express.json()); // Enable JSON parsing

// API endpoint for chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body; // Get user input from frontend

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const aiResponse = await processCommand(message); // Process with DeepSeek AI

        res.json({ reply: aiResponse }); // Send structured response to frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
