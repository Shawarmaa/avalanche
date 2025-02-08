import { ethers } from 'ethers';

const YIELDYAK_ABI = [
    "function deposit(uint256 amount) external",
    "function withdraw(uint256 shares) external",
    "function harvest() external"
] as const;

const CONTRACTS = {
    YIELDYAK_VAULT: "0xaAc0F2d0630d1D09ab2B5A400412a4840B866d95",
} as const;

interface ParsedCommand {
    action: 'deposit' | 'withdraw' | 'harvest';
    token: string;
    amount: number;
    slippage: number;
}

export async function executeYieldYakTrade(parsedCommand: ParsedCommand) {
    // Check if MetaMask is installed
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        const userAddress = accounts[0];
        
        // Create provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Verify the signer address matches
        if (await signer.getAddress() !== userAddress) {
            throw new Error('Signer address does not match connected address');
        }

        // Create contract instance
        const contract = new ethers.Contract(
            CONTRACTS.YIELDYAK_VAULT,
            YIELDYAK_ABI,
            signer
        );

        // Execute transaction based on action
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

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        return {
            txHash: receipt.hash,
            status: receipt.status === 1 ? 'success' : 'failed'
        };
        
    } catch (error: any) {
        throw new Error(`Failed to execute YieldYak trade: ${error.message}`);
    }
}