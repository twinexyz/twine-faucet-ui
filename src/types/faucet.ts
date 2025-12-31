export type ChainKey = 'twine' | 'sepolia' | 'solana';

export interface FaucetRequest {
  chain: ChainKey | string;
  token_address: string;
  wallet_address: string;
}

export interface FaucetClaimRequest extends FaucetRequest {
  turnstile_token: string;
}

export interface FaucetSuccessData {
  message: string;
  chain: string;
  token_address: string;
  wallet_address: string;
  tx_hash?: string;
  amount_base_units?: string;
}

export interface FaucetResponse {
  status: 'success' | 'error';
  data?: FaucetSuccessData;
  error?: string;
  message?: string;
}
