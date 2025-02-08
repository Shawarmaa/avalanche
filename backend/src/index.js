// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import { processCommand } from './ai/groq.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/parse', async (req, res) => {
    try {
        const { userPrompt } = req.body;
        
        if (!userPrompt) {
            return res.status(400).json({
                success: false,
                error: 'userPrompt is required'
            });
        }

        // Process through Groq
        const command = await processCommand(userPrompt);
        
        // Return the parsed command for frontend to handle
        res.json({
            success: true,
            command,
            originalPrompt: userPrompt
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});