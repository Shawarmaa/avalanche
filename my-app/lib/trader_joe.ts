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
      // Native and Major Layer 1s
      WAVAX: WNATIVE[CHAIN_ID],
      wBTC: new Token(CHAIN_ID, "0x50b7545627a5162F82A992c33b87aDc75187B218", 8, "wBTC", "Wrapped Bitcoin"),
      wETH: new Token(CHAIN_ID, "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", 18, "wETH", "Wrapped Ether"),
      //BNB: new Token(CHAIN_ID, "0x264c1383EA520f73dd837F915ef3a732e204a493", 18, "BNB", "Binance Coin"),
      //FTM: new Token(CHAIN_ID, "0xc5e2b037d30a390e62180970b3aa4e91868764cd", 18, "FTM", "Fantom"),
      MATIC: new Token(CHAIN_ID, "0x885ca6663E1E19DAD31c1e08D9958a2b8F538D53", 18, "MATIC", "Polygon"),
      SOL: new Token(CHAIN_ID, "0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F", 18, "SOL", "Solana"),
  
      // Stablecoins
      USDC: new Token(CHAIN_ID, "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", 6, "USDC", "USD Coin"),
      USDT: new Token(CHAIN_ID, "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", 6, "USDT", "Tether USD"),
      'USDC.e': new Token(CHAIN_ID, "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", 6, "USDC.e", "USD Coin.e"),
      //DAI: new Token(CHAIN_ID, "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70", 18, "DAI", "Dai Stablecoin"),
      FRAX: new Token(CHAIN_ID, "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64", 18, "FRAX", "Frax"),
      //MIM: new Token(CHAIN_ID, "0x130966628846BFd36ff31a822705796e8cb8C18D", 18, "MIM", "Magic Internet Money"),
  
      // DeFi Blue Chips
      //LINK: new Token(CHAIN_ID, "0x5947BB275c521040051D82396192181b413227A3", 18, "LINK", "ChainLink Token"),
      //AAVE: new Token(CHAIN_ID, "0x63a72806098Bd3D9520cC43356dD78afe5D386D9", 18, "AAVE", "Aave Token"),
      //UNI: new Token(CHAIN_ID, "0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580", 18, "UNI", "Uniswap"),
      //QNT: new Token(CHAIN_ID, "0x4e5A8E6F594d18AD31e68644B38e685F9E49A9dB", 18, "QNT", "Quant"),
  
      // Liquid Staking & Wrapped
      sAVAX: new Token(CHAIN_ID, "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE", 18, "sAVAX", "Staked AVAX"),
      yyAVAX: new Token(CHAIN_ID, "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7", 18, "yyAVAX", "Yield Yak AVAX"),
      'BTC.b': new Token(CHAIN_ID, "0x152b9d0FdC40C096757F570A51E494bd4b943E50", 8, "BTC.b", "Bitcoin bridged"),
      //'ETH.b': new Token(CHAIN_ID, "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", 18, "ETH.b", "Ethereum bridged"),
  
      // Additional Tokens
      GMX: new Token(CHAIN_ID, "0x62edc0692BD897D2295872a9FFCac5425011c661", 18, "GMX", "GMX"),
      JOE: new Token(CHAIN_ID, "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd", 18, "JOE", "JoeToken"),
      //PEPE: new Token(CHAIN_ID, "0x669c00Dc04acc3722C349b1c5B4c3BB4e652c986", 18, "PEPE", "Pepe"),
      //SHIB: new Token(CHAIN_ID, "0x02D980A0D7AF3fb7Cf7Df8cB35d9eDBCF355f665", 18, "SHIB", "Shiba Inu"),
    //   ARB: new Token(CHAIN_ID, "0xB628D41428Cb15F6e752Bb70BBaD45D9cAB92910", 18, "ARB", "Arbitrum"),
    //   FET: new Token(CHAIN_ID, "0x6C7f93C68D92Ac6490A2C2D8F88Eb75ab86D6b0F", 18, "FET", "Fetch.ai"),
    //   RUNE: new Token(CHAIN_ID, "0x8626f88A6D7000e8Df236cF84DE7B3A74d42D639", 18, "RUNE", "THORChain")
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

  interface TradeQuote {
    trade: TradeV2;  // From TraderJoe SDK
    estimatedOutput: string;
    executionPrice: string;
    route: string;
    inputAmount: string;
    inputToken: string;
    outputToken: string;
    slippage: number;
  }
  
 // In trader_joe.ts
 // First, let's separate the quote logic from the execution
 export async function getTradeQuote(params: SwapParams): Promise<TradeQuote>{
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
    }

    try {
        // Create public client
        const publicClient = createPublicClient({
            chain: avalanche,
            transport: http()
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

        return {
            trade: bestTrade,
            estimatedOutput: bestTrade.outputAmount.toSignificant(6),
            executionPrice: bestTrade.executionPrice.toSignificant(6),
            route: bestTrade.route.path.map(token => token.symbol).join(' -> '),
            inputAmount: params.amount,
            inputToken: params.tokenIn,
            outputToken: params.tokenOut,
            slippage: params.slippage
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to get trade quote: ${error.message}`);
        }
        throw new Error('Failed to get trade quote: Unknown error');
    }
}


// Add a new function to execute the trade after user confirmation
export async function executeQuotedTrade(quoteInfo: TradeQuote) {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
    }

    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        }) as `0x${string}`[];
        
        if (!accounts[0]) {
            throw new Error('No wallet connected');
        }

        const publicClient = createPublicClient({
            chain: avalanche,
            transport: http()
        });

        const walletClient = createWalletClient({
            chain: avalanche,
            transport: http(),
            account: accounts[0]
        });

        const slippageTolerance = new Percent(
            (quoteInfo.slippage * 100).toString(),
            "10000"
        );

        const swapOptions: TradeOptions = {
            allowedSlippage: slippageTolerance,
            ttl: 3600,
            recipient: accounts[0],
            feeOnTransfer: false
        };

        const { methodName, args, value } = quoteInfo.trade.swapCallParameters(swapOptions);

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
            estimatedOutput: quoteInfo.estimatedOutput,
            executionPrice: quoteInfo.executionPrice,
            route: quoteInfo.route
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to execute trade: ${error.message}`);
        }
        throw new Error('Failed to execute trade: Unknown error');
    }
}