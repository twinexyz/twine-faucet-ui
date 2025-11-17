import type { ChainKey } from '@/types/faucet';

export type TokenCfg = { symbol: string; address: string };
export type ChainCfg = {
  key: ChainKey | string;
  name: string;
  chainType: 'EVM' | 'Solana' | 'Other';
  tokens: TokenCfg[];
};

export const CHAINS: Record<string, ChainCfg> = {
  sepolia: {
    key: 'sepolia',
    name: 'Sepolia',
    chainType: 'EVM',
    tokens: [
      {
        symbol: 'FauxCoin',
        address: '0xFB2B1F3180a2B6f25b476B0365Cd710964634972',
      },
      {
        symbol: 'EthSol',
        address: '0x91607f93f3F46e05e62AE910FE0d75fB001E74b6',
      },
      {
        symbol: 'TwineUSD',
        address: '0x457BFF07aC42cF92a04c9C551f8A4D4bcffeD6a5',
      },
    ],
  },

  twine: {
    key: 'twine',
    name: 'Twine',
    chainType: 'EVM',

    tokens: [
      {
        symbol: 'Twine',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        symbol: 'ETHToken',
        address: '0xF64E5449332820DBC53EA079cC4c3F50ED2491Ed',
      },
      {
        symbol: 'FauxCoin',
        address: '0xc1E1CdC77B87391E4B7F25b5C3a70E81C55C99A6',
      },
      {
        symbol: 'SolToken',
        address: '0x51e69C0381cB2A79EAA0944d3e81c32f2AF0086C',
      },
      {
        symbol: 'TwineUSD',
        address: '0x2080Af84bF4f4E355dB14393384aAF727EaF917F',
      },
    ],
  },

  solana: {
    key: 'solana',
    name: 'Solana Devnet',
    chainType: 'Solana',

    tokens: [
      {
        symbol: 'FauxCoin',
        address: 'HPuKHQyYfgmq85qyLd8tFF5VW1bekFBrwUm69QHaTQ2W',
      },
      {
        symbol: 'SolEth',
        address: '8cCneWmKWRHcT6gZBB8kEGa7SsVZLKtBMNu6HDVy1wcq',
      },
      {
        symbol: 'TwineUSD',
        address: 'J9FFCF8QK8pJySBjoKvPTpi4zm3ST2xFdR2q89YkVVj3',
      },
    ],
  },
};

export const defaultChainKey: string = 'sepolia';
