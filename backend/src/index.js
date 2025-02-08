// src/index.js
import express from 'express';
import { processCommand } from './ai/deepseek.js';
import { executeYieldYakTrade } from './protocols/yieldyak.js';

const app = express();
app.use(express.json());

app.post('/api/execute', async (req, res) => {
    try {
        const { userPrompt } = req.body;
        
        // 1. Process the command through Deepseek
        const parsedCommand = await processCommand(userPrompt);
        
        // 2. Execute the trade based on parsed command
        const result = await executeYieldYakTrade(parsedCommand);
        
        res.json({ 
            success: true,
            result,
            originalCommand: userPrompt,
            parsedCommand
        });
    } catch (error) {
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