// src/protocols/yieldyak.js
import { ethers } from 'ethers';

// YieldYak ABI - only including necessary functions
const YIELDYAK_ABI = [
    "function deposit(uint256 amount) external",
    "function withdraw(uint256 shares) external",
    "function harvest() external"
];

// You'll want to replace these with actual addresses
const CONTRACTS = {
    YIELDYAK_VAULT: "0x...", // YieldYak vault address
};

export async function executeYieldYakTrade(parsedCommand) {
    const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const contract = new ethers.Contract(
        CONTRACTS.YIELDYAK_VAULT,
        YIELDYAK_ABI,
        signer
    );

    try {
        let tx;
        const amount = ethers.parseEther(parsedCommand.amount.toString());

        switch (parsedCommand.action) {
            case 'deposit':
                tx = await contract.deposit(amount, {
                    gasLimit: 300000
                });
                break;
                
            case 'withdraw':
                tx = await contract.withdraw(amount, {
                    gasLimit: 300000
                });
                break;
                
            case 'harvest':
                tx = await contract.harvest({
                    gasLimit: 300000
                });
                break;
                
            default:
                throw new Error('Unsupported action');
        }

        const receipt = await tx.wait();
        return {
            txHash: receipt.hash,
            status: receipt.status === 1 ? 'success' : 'failed'
        };
        
    } catch (error) {
        throw new Error(`Failed to execute YieldYak trade: ${error.message}`);
    }
}