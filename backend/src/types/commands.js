// src/types/commands.js

// Valid actions that can be performed
export const ACTIONS = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    HARVEST: 'harvest'
};

// Command type definition
export class DeFiCommand {
    constructor(action, token, amount, slippage = 0.5) {
        this.action = action;
        this.token = token;
        this.amount = amount;
        this.slippage = slippage;
    }

    validate() {
        if (!Object.values(ACTIONS).includes(this.action)) {
            throw new Error(`Invalid action: ${this.action}`);
        }
        
        if (!this.token) {
            throw new Error('Token is required');
        }

        if (typeof this.amount !== 'number' || this.amount <= 0) {
            throw new Error('Amount must be a positive number');
        }

        if (typeof this.slippage !== 'number' || this.slippage < 0) {
            throw new Error('Slippage must be a non-negative number');
        }
    }
}

// Parser to convert Deepseek response to DeFiCommand
export function parseDeepseekResponse(response) {
    try {
        const parsed = JSON.parse(response);
        return new DeFiCommand(
            parsed.action,
            parsed.token,
            Number(parsed.amount),
            parsed.slippage || 0.5
        );
    } catch (error) {
        throw new Error(`Failed to parse Deepseek response: ${error.message}`);
    }
}