// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import { processCommand } from './ai/deepseek.js';
import { executeYieldYakTrade } from './protocols/yieldyak.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/execute', async (req, res) => {
    try {
        const { userPrompt } = req.body;
        
        if (!userPrompt) {
            return res.status(400).json({
                success: false,
                error: 'userPrompt is required'
            });
        }

        // 1. Process through Deepseek
        const command = await processCommand(userPrompt);
        
        // 2. Execute the command (this will be handled by the user's wallet)
        const executionData = await executeYieldYakTrade(command);
        
        res.json({
            success: true,
            command,
            executionData,
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