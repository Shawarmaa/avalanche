// src/types/commands.js

// Valid tokens that can be traded
export const TOKENS = {
    // Native and Stables
    AVAX: 'AVAX',
    USDC: 'USDC',
    USDT: 'USDT',
    USDC_e: 'USDC.e',
    DAI: 'DAI',
    FRAX: 'FRAX',
    MIM: 'MIM',

    // Major DeFi
    JOE: 'JOE',
    LINK: 'LINK',
    wBTC: 'wBTC',
    wETH: 'wETH',
    sAVAX: 'sAVAX',
    
    // Liquid Staking
    yyAVAX: 'yyAVAX',
    WAVAX: 'WAVAX',
    BTC_b: 'BTC.b',
    ETH_b: 'ETH.b',

    // GameFi & Others
    GALA: 'GALA',
    GMX: 'GMX',
    SPELL: 'SPELL',
    TIME: 'TIME',
    XAVA: 'XAVA'
};

// Command type definition for swaps
export class SwapCommand {
    constructor(tokenIn, tokenOut, amount, slippage = 0.005) {
        this.tokenIn = tokenIn;
        this.tokenOut = tokenOut;
        this.amount = amount;
        this.slippage = slippage;
    }

    validate() {
        if (!Object.values(TOKENS).includes(this.tokenIn)) {
            throw new Error(`Invalid input token: ${this.tokenIn}`);
        }

        if (!Object.values(TOKENS).includes(this.tokenOut)) {
            throw new Error(`Invalid output token: ${this.tokenOut}`);
        }

        if (this.tokenIn === this.tokenOut) {
            throw new Error('Input and output tokens must be different');
        }

        // Amount should be a string for exact decimal handling
        if (typeof this.amount !== 'string' || !this.amount.match(/^\d*\.?\d+$/)) {
            throw new Error('Amount must be a valid number string');
        }

        // Slippage should be a decimal between 0 and 1
        if (typeof this.slippage !== 'number' || this.slippage <= 0 || this.slippage >= 1) {
            throw new Error('Slippage must be a decimal between 0 and 1');
        }
    }
}

// Parser to convert Groq response to SwapCommand
export function parseGroqResponse(response) {
    try {
        const parsed = JSON.parse(response);
        
        // Convert to proper types
        const command = new SwapCommand(
            parsed.tokenIn,
            parsed.tokenOut,
            parsed.amount.toString(), // Ensure amount is string
            Number(parsed.slippage)
        );

        // Validate the command
        command.validate();
        
        return command;
    } catch (error) {
        throw new Error(`Failed to parse Groq response: ${error.message}`);
    }
}