import type { ChainKey } from "@/types/faucet";

export type TokenCfg = { symbol: string; address: string };
export type ChainCfg = {
  key: ChainKey | string;
  name: string;
  chainType: "EVM" | "Solana" | "Other";
  tokens: TokenCfg[];
};

export const CHAINS: Record<string, ChainCfg> = {
  sepolia: {
    key: "sepolia",
    name: "Sepolia",
    chainType: "EVM",
    tokens: [
      { symbol: "FauxCoin", address: "0x9A373f4337E0daa17c66f37F3c7640c17C3ebB3F" },
      { symbol: "EthSol", address: "0x6F17B967A77b4c17dd79e3094F3579af8057dF6B" },
      {symbol: "TwineUSD", address: "0x31Cc46593e8b07f09BBDe4cFcA0Ef1361cbFF8B6"},
    ],
  },

  twine: {
    key: "twine",
    name: "Twine",
    chainType: "EVM",

    tokens: [
      { symbol: "Twine", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "ETHToken", address: "0xF64E5449332820DBC53EA079cC4c3F50ED2491Ed" },
      { symbol: "FauxCoin", address: "0xc1E1CdC77B87391E4B7F25b5C3a70E81C55C99A6" },
      { symbol: "SolToken", address: "0x51e69C0381cB2A79EAA0944d3e81c32f2AF0086C" },
      { symbol: "TwineUSD", address: "0x8662be13Fb03D165499c0B11d4A6Ce742B5772Ac" },

    ],
  },

  solana: {
    key: "solana",
    name: "Solana Devnet",
    chainType: "Solana",

    tokens: [
      { symbol: "FauxCoin", address: "HPuKHQyYfgmq85qyLd8tFF5VW1bekFBrwUm69QHaTQ2W" },
      { symbol: "SolEth", address: "8cCneWmKWRHcT6gZBB8kEGa7SsVZLKtBMNu6HDVy1wcq" },
      { symbol: "TwineUSD", address: "J9FFCF8QK8pJySBjoKvPTpi4zm3ST2xFdR2q89YkVVj3" },

    ],
  },
};

export const defaultChainKey: string = "sepolia";
