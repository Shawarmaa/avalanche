// src/ai/groq.js
import fetch from 'node-fetch';
import { parseDeepseekResponse } from '../types/commands.js';

const SYSTEM_PROMPT = `You are a DeFi command parser for YieldYak on Avalanche. 
Convert natural language commands into structured operations.
Output must be a JSON object with:
- action: "deposit" | "withdraw" | "harvest"
- token: token symbol (e.g., "AVAX")
- amount: numeric amount
- slippage: optional slippage tolerance in percent

Example valid outputs:
{"action":"deposit","token":"AVAX","amount":1.5,"slippage":0.5}
{"action":"withdraw","token":"USDC","amount":100}
{"action":"harvest"}`;

export async function processCommand(userPrompt) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not configured');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                model: 'mixtral-8x7b-32768',
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Full error response:', errorText);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;

        if (!aiResponse) {
            throw new Error('Invalid response from Groq');
        }

        // Convert AI response to structured command
        return parseDeepseekResponse(aiResponse);
    } catch (error) {
        throw new Error(`Failed to process command: ${error.message}`);
    }
}