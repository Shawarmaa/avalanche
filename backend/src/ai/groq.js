// src/ai/groq.js
import fetch from 'node-fetch';
import { parseGroqResponse } from '../types/commands.js';

const SYSTEM_PROMPT = `You are a DeFi command parser for TraderJoe on Avalanche.
Convert natural language commands into structured swap operations.
Available tokens: AVAX, USDC, USDT, AVAX, wBTC, wETH, BNB, FTM, MATIC, SOL, USDC, USDT, USDC.e, DAI, FRAX, MIM, LINK, AAVE, UNI, QNT, sAVAX, yyAVAX, WAVAX, BTC.b, ETH.b, GMX, JOE, PEPE, SHIB, ARB, FET, RUNE

Output must be a JSON object with:
- tokenIn: input token symbol
- tokenOut: output token symbol
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

        // Convert AI response to structured command
        return parseGroqResponse(aiResponse);
    } catch (error) {
        throw new Error(`Failed to process command: ${error.message}`);
    }
}