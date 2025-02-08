import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processCommand } from './groq.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());      // Allow all origins (dev only pls) frontend requests
app.use(express.json()); // Enable JSON parsing

// API endpoint for chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body; // Get user input from frontend

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received message:', message); // Log the received message

        const aiResponse = await processCommand(message); // Process with DeepSeek AI
        console.log('AI response:', aiResponse); // Log the AI response

        res.json({ reply: aiResponse }); // Send structured response to frontend
    } catch (error) {
        console.error('Error processing command:', error); // Log the error
        res.status(500).json({ error: 'Failed to process command', details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
