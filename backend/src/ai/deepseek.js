// src/ai/deepseek.js
import fetch from 'node-fetch';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are a DeFi command parser for YieldYak on Avalanche. 
Convert natural language commands into structured operations.
Output should be a JSON object with:
- action: "deposit" | "withdraw" | "harvest"
- token: token address or symbol
- amount: numeric amount
- slippage: optional slippage tolerance

Example output:
{
    "action": "deposit",
    "token": "AVAX",
    "amount": 1.5,
    "slippage": 0.5
}`;

export async function processCommand(userPrompt) {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                model: 'deepseek-chat',
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from Deepseek');
        }

        // Parse the JSON response
        const parsedCommand = JSON.parse(data.choices[0].message.content);
        
        // Validate the parsed command
        validateCommand(parsedCommand);
        
        return parsedCommand;
    } catch (error) {
        throw new Error(`Failed to process command: ${error.message}`);
    }
}

function validateCommand(command) {
    const requiredFields = ['action', 'token', 'amount'];
    for (const field of requiredFields) {
        if (!command[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    if (!['deposit', 'withdraw', 'harvest'].includes(command.action)) {
        throw new Error('Invalid action specified');
    }
}