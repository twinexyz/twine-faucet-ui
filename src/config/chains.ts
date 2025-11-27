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
        address: '0x0B32B7909c214f62F94D147151DaAbA3B371ce71',
      },
      {
        symbol: 'EthSol',
        address: '0x1E168F560B3E97FA7Fe4d53F1D9137Cef24b0DFB',
      },
      {
        symbol: 'TwineUSD',
        address: '0x1C2E8d2f51DbDA7588289Ea80E871380A5d02350',
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
        address: '0xba3225E9A7Da0E5241E3d6aE0Fbd82F6274a6CD7',
      },
      {
        symbol: 'FauxCoin',
        address: '0x5B3d40bb9db78019CEc2b8A13c4977E7063F8f91',
      },
      {
        symbol: 'SolToken',
        address: '0x8E41Dbf726F0F38DD905054797e637d9E3d8B76C',
      },
      {
        symbol: 'TwineUSD',
        address: '0xd02794DE6D81eE1735704414d1A0B269631671dd',
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
