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
      { symbol: "FauxCoin", address: "0x28830c181eEE183F415dff35BA42dcF31eba7466" },
      { symbol: "EthSol", address: "0xBb71C01549a21B39490FA7671d5d2ddA3E82518C" },
    ],
  },

  twine: {
    key: "twine",
    name: "Twine",
    chainType: "EVM",

    tokens: [
      { symbol: "Twine", address: "0x0000000000000000000000000000000000000000" },
    ],
  },

  solana: {
    key: "solana",
    name: "Solana Devnet",
    chainType: "Solana",

    tokens: [
      { symbol: "FauxCoin", address: "HPuKHQyYfgmq85qyLd8tFF5VW1bekFBrwUm69QHaTQ2W" },
      { symbol: "SolEth", address: "8cCneWmKWRHcT6gZBB8kEGa7SsVZLKtBMNu6HDVy1wcq" },
    ],
  },
};

export const defaultChainKey: string = "sepolia";
