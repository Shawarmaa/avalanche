// src/protocols/yieldyak.js
import { ethers } from 'ethers';

const YIELDYAK_ABI = [
    "function deposit(uint256 amount) external",
    "function withdraw(uint256 shares) external",
    "function harvest() external"
];

const CONTRACTS = {
    YIELDYAK_VAULT: "0xaAc0F2d0630d1D09ab2B5A400412a4840B866d95", // YieldYak vault address
};

export async function executeYieldYakTrade(parsedCommand, userAddress) {
    // This should be injected by the frontend
    if (!window.ethereum) {
        throw new Error('No Web3 provider found. Please install MetaMask.');
    }

    // Get provider from user's Web3 wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get signer from user's wallet
    const signer = await provider.getSigner();
    
    // Verify the signer address matches the provided address
    if (await signer.getAddress() !== userAddress) {
        throw new Error('Signer address does not match provided address');
    }

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