// src/ai/groq.js
import fetch from 'node-fetch';

const SYSTEM_PROMPT = `You are a DeFi command parser for TraderJoe on Avalanche.
Convert natural language commands into structured swap operations.
Available tokens: AVAX, USDC, USDT

Output must be a JSON object with:
- tokenIn: input token symbol (one of: AVAX, USDC, USDT)
- tokenOut: output token symbol (one of: AVAX, USDC, USDT)
- amount: amount as string (e.g. "1.5" or "100")
- slippage: slippage tolerance in decimal (e.g. 0.005 for 0.5%)

Example valid outputs:
{"tokenIn":"AVAX","tokenOut":"USDC","amount":"1.5","slippage":0.005}
{"tokenIn":"USDC","tokenOut":"AVAX","amount":"100","slippage":0.01}
{"tokenIn":"USDC","tokenOut":"USDT","amount":"50","slippage":0.005}`;

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

        // Parse and validate the response
        const parsed = JSON.parse(aiResponse);
        
        // Validate tokens
        const validTokens = ['AVAX', 'USDC', 'USDT'];
        if (!validTokens.includes(parsed.tokenIn) || !validTokens.includes(parsed.tokenOut)) {
            throw new Error('Invalid token symbols in AI response');
        }

        // Validate amount is a valid number string
        if (isNaN(parseFloat(parsed.amount))) {
            throw new Error('Invalid amount in AI response');
        }

        // Validate slippage is a number between 0 and 1
        if (typeof parsed.slippage !== 'number' || parsed.slippage <= 0 || parsed.slippage >= 1) {
            throw new Error('Invalid slippage in AI response');
        }

        return parsed;

    } catch (error) {
        throw new Error(`Failed to process command: ${error.message}`);
    }
}