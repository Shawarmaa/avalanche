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
  
  // Initialize tokens
  const TOKENS_CONFIG = {
      // Native and Stables
      WAVAX: WNATIVE[CHAIN_ID],
      USDC: new Token(CHAIN_ID, "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", 6, "USDC", "USD Coin"),
      USDT: new Token(CHAIN_ID, "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", 6, "USDT", "Tether USD"),
      'USDC.e': new Token(CHAIN_ID, "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", 6, "USDC.e", "USD Coin.e"),
      DAI: new Token(CHAIN_ID, "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70", 18, "DAI", "Dai Stablecoin"),
      FRAX: new Token(CHAIN_ID, "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64", 18, "FRAX", "Frax"),
      MIM: new Token(CHAIN_ID, "0x130966628846BFd36ff31a822705796e8cb8C18D", 18, "MIM", "Magic Internet Money"),
  
      // Major DeFi
      JOE: new Token(CHAIN_ID, "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd", 18, "JOE", "JoeToken"),
      LINK: new Token(CHAIN_ID, "0x5947BB275c521040051D82396192181b413227A3", 18, "LINK", "ChainLink Token"),
      wBTC: new Token(CHAIN_ID, "0x50b7545627a5162F82A992c33b87aDc75187B218", 8, "wBTC", "Wrapped Bitcoin"),
      wETH: new Token(CHAIN_ID, "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", 18, "wETH", "Wrapped Ether"),
      sAVAX: new Token(CHAIN_ID, "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE", 18, "sAVAX", "Staked AVAX"),
  
      // Liquid Staking
      yyAVAX: new Token(CHAIN_ID, "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7", 18, "yyAVAX", "Yield Yak AVAX"),
      'BTC.b': new Token(CHAIN_ID, "0x152b9d0FdC40C096757F570A51E494bd4b943E50", 8, "BTC.b", "Bitcoin bridged"),
      'ETH.b': new Token(CHAIN_ID, "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", 18, "ETH.b", "Ethereum bridged"),
  
      // GameFi & Others
      GALA: new Token(CHAIN_ID, "0x63B23D5eC35Bab6550B166FE3567e9D7eDD3d3a6", 8, "GALA", "Gala"),
      GMX: new Token(CHAIN_ID, "0x62edc0692BD897D2295872a9FFCac5425011c661", 18, "GMX", "GMX"),
      SPELL: new Token(CHAIN_ID, "0xCE1bFFBD5374Dac86a2893119683F4911a2F7814", 18, "SPELL", "Spell Token"),
      TIME: new Token(CHAIN_ID, "0xb54f16fB19478766A268F172C9480f8da1a7c9C3", 9, "TIME", "Time"),
      XAVA: new Token(CHAIN_ID, "0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4", 18, "XAVA", "Avalaunch")
  };
  
  // Base tokens used for routing (most liquid pairs)
  const BASES = [
      TOKENS_CONFIG.WAVAX,
      TOKENS_CONFIG.USDC,
      TOKENS_CONFIG.USDT,
      TOKENS_CONFIG['USDC.e'],
      TOKENS_CONFIG.wETH,
      TOKENS_CONFIG.wBTC
  ];
  
  // Token mapping for easy lookup
  const TOKENS: { [key: string]: Token } = {
      ...TOKENS_CONFIG,
      'AVAX': TOKENS_CONFIG.WAVAX  // Special case for native AVAX
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