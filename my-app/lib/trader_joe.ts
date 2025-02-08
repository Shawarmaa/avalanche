import {
    ChainId,
    WNATIVE,
    Token,
    TokenAmount,
    Percent
  } from "@traderjoe-xyz/sdk-core";
  import {
    PairV2,
    RouteV2,
    TradeV2,
    TradeOptions,
    LB_ROUTER_V22_ADDRESS,
    jsonAbis
  } from "@traderjoe-xyz/sdk-v2";
  import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
  import { avalanche } from "viem/chains";
  
  const CHAIN_ID = ChainId.AVALANCHE;
  const router = LB_ROUTER_V22_ADDRESS[CHAIN_ID];
  
  // Initialize common tokens
  const WAVAX = WNATIVE[CHAIN_ID];
  const USDC = new Token(
    CHAIN_ID,
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    6,
    "USDC",
    "USD Coin"
  );
  const USDT = new Token(
    CHAIN_ID,
    "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    6,
    "USDT",
    "Tether USD"
  );
  
  // Base tokens used for routing
  const BASES = [WAVAX, USDC, USDT];
  
  // Token mapping for easy lookup
  const TOKENS: { [key: string]: Token } = {
    'AVAX': WAVAX,
    'USDC': USDC,
    'USDT': USDT
  };
  
  interface SwapParams {
    tokenIn: string;
    tokenOut: string;
    amount: string;
    slippage: number;
  }
  
  export async function executeTraderJoeSwap(params: SwapParams) {
      if (typeof window === 'undefined' || !window.ethereum) {
          throw new Error('Please install MetaMask to use this feature');
      }
  
      try {
          // Get connected account
          const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
          }) as `0x${string}`[];
          
          if (!accounts[0]) {
              throw new Error('No wallet connected');
          }
  
          // Create Viem clients
          const publicClient = createPublicClient({
              chain: avalanche,
              transport: http()
          });
  
          const walletClient = createWalletClient({
              chain: avalanche,
              transport: http(),
              account: accounts[0]
          });
  
          // Get input/output tokens
          const inputToken = TOKENS[params.tokenIn];
          const outputToken = TOKENS[params.tokenOut];
          
          if (!inputToken || !outputToken) {
              throw new Error('Invalid token symbol');
          }
  
          // Parse amount with proper decimals
          const parsedAmount = parseUnits(params.amount, inputToken.decimals);
          const tokenAmount = new TokenAmount(inputToken, parsedAmount);
  
          // Generate all possible routes
          const allTokenPairs = PairV2.createAllTokenPairs(
              inputToken,
              outputToken,
              BASES
          );
          const allPairs = PairV2.initPairs(allTokenPairs);
          const allRoutes = RouteV2.createAllRoutes(allPairs, inputToken, outputToken);
  
          // Get best trade
          const isNativeIn = params.tokenIn === 'AVAX';
          const isNativeOut = params.tokenOut === 'AVAX';
  
          const allTrades = await TradeV2.getTradesExactIn(
              allRoutes,
              tokenAmount,
              outputToken,
              isNativeIn,
              isNativeOut,
              publicClient,
              CHAIN_ID
          );
  
          // Filter out undefined trades and assert type
          const validTrades = allTrades.filter((trade): trade is TradeV2 => trade !== undefined);
          
          if (validTrades.length === 0) {
              throw new Error('No valid trades found');
          }
  
          const bestTrade = TradeV2.chooseBestTrade(validTrades, true);
          
          if (!bestTrade) {
              throw new Error('Could not find best trade path');
          }
  
          // Set up swap options
          const slippageTolerance = new Percent(
              (params.slippage * 100).toString(),
              "10000"
          );
  
          const swapOptions: TradeOptions = {
              allowedSlippage: slippageTolerance,
              ttl: 3600, // 1 hour
              recipient: accounts[0],
              feeOnTransfer: false
          };
  
          // Get swap parameters
          const { methodName, args, value } = bestTrade.swapCallParameters(swapOptions);
  
          // Execute the swap
          const { request } = await publicClient.simulateContract({
              address: router,
              abi: jsonAbis.LBRouterV22ABI,
              functionName: methodName,
              args: args,
              account: accounts[0],
              value: BigInt(value)
          });
  
          const hash = await walletClient.writeContract(request);
          
          return {
              txHash: hash,
              status: 'submitted',
              estimatedOutput: bestTrade.outputAmount.toSignificant(6),
              executionPrice: bestTrade.executionPrice.toSignificant(6),
              route: bestTrade.route.path.map(token => token.symbol).join(' -> ')
          };
  
      } catch (error: unknown) {
          if (error instanceof Error) {
              throw new Error(`Failed to execute TraderJoe swap: ${error.message}`);
          }
          throw new Error('Failed to execute TraderJoe swap: Unknown error');
      }
  }