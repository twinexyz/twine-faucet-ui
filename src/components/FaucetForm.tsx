'use client';

import { useEffect, useMemo, useState } from 'react';
import { CHAINS, defaultChainKey } from '@/config/chains';
import type { FaucetRequest } from '@/types/faucet';
import { claimFaucet } from '@/lib/api';

const chainExplorers: Record<string, (hash: string) => string> = {
  sepolia: (h) => `https://sepolia.etherscan.io/tx/${h}`,
  twine: (h) => `https://explorer.testnet.twinelabs.xyz/tx/${h}`,
  solana: (h) => `https://explorer.solana.com/tx/${h}?cluster=devnet`,
};

type ClaimFaucetResponse = {
  data?: {
    tx_hash?: string;
    chain?: keyof typeof chainExplorers; // "sepolia" | "twine" | "solana"
  };
};

export default function FaucetForm() {
  const [chainKey, setChainKey] = useState<string>(defaultChainKey);
  const [tokenAddress, setTokenAddress] = useState<string>(
    CHAINS[defaultChainKey].tokens[0].address
  );
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{
    type: 'info' | 'success' | 'error';
    message: string;
    html?: boolean;
  } | null>(null);

  const [lastExplorerUrl, setLastExplorerUrl] = useState<string | null>(null);

  const chains = useMemo(() => Object.values(CHAINS), []);
  const current = CHAINS[chainKey];

  useEffect(() => {
    setTokenAddress(current?.tokens?.[0]?.address ?? '');
    setNotice(null);
    setLastExplorerUrl(null);
  }, [chainKey, current]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!process.env.NEXT_PUBLIC_FAUCET_API_URL) {
      setNotice({
        type: 'error',
        message:
          'Backend URL not set. Define NEXT_PUBLIC_FAUCET_API_URL in .env.local',
      });
      return;
    }
    if (!wallet.trim()) {
      setNotice({ type: 'error', message: 'Please enter a wallet address.' });
      return;
    }
    if (!tokenAddress) {
      setNotice({ type: 'error', message: 'Please select a token.' });
      return;
    }

    const payload: FaucetRequest = {
      chain: String(chainKey),
      token_address: tokenAddress,
      wallet_address: wallet.trim(),
    };

    setLoading(true);
    try {
      const resp = (await claimFaucet(payload)) as ClaimFaucetResponse;

      const tx =
        typeof resp.data?.tx_hash === 'string' ? resp.data.tx_hash : undefined;

      const chain = (resp.data?.chain ??
        chainKey) as keyof typeof chainExplorers;

      const buildExplorer = chainExplorers[chain];

      if (tx && buildExplorer) {
        const link = buildExplorer(tx);
        setLastExplorerUrl(link);
        setNotice({
          type: 'success',
          message: 'Success! Your request was processed.',
        });
      } else {
        setLastExplorerUrl(null);
        setNotice({ type: 'success', message: 'Success!' });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Unknown error';
      setNotice({ type: 'error', message: `❌ ${message}` });
      setLastExplorerUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-xl rounded-2xl border border-emerald-800/40 bg-[#0f1815] p-6 shadow-2xl shadow-black/40 sm:p-7"
    >
      <h2 className="text-xl font-semibold text-white">Request Airdrop</h2>
      <p className="mt-1 text-sm text-emerald-100/80">
        Pick your network, choose the token, paste a wallet, and we&apos;ll send
        testnet funds.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
        <span className="text-lg leading-none">⚠️</span>
        <span>Faucet for testnet use only</span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-emerald-100">
            Network
          </label>
          <select
            className="w-full cursor-pointer rounded-lg border border-emerald-800 bg-gradient-to-r from-emerald-950/80 via-emerald-900/70 to-emerald-950/80 px-3 py-3 text-sm text-emerald-50 shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60 disabled:opacity-70"
            value={chainKey}
            onChange={(e) => setChainKey(e.target.value)}
            disabled={loading}
          >
            {chains.map((c) => (
              <option key={String(c.key)} value={String(c.key)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-emerald-100">
            Token
          </label>
          <select
            className="w-full cursor-pointer rounded-lg border border-emerald-800 bg-gradient-to-r from-emerald-950/80 via-emerald-900/70 to-emerald-950/80 px-3 py-3 text-sm text-emerald-50 shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60 disabled:opacity-70"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            disabled={loading}
          >
            {current?.tokens?.map((t) => (
              <option key={t.address} value={t.address}>
                {t.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-emerald-100">
            Wallet Address
          </label>
          <input
            type="text"
            placeholder={
              current?.chainType === 'EVM' ? '0x2DC...' : 'Wallet address...'
            }
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full rounded-lg border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-50 placeholder:text-emerald-200/60 shadow-inner shadow-black/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60 disabled:opacity-70"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-600 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:shadow-none"
          disabled={loading}
        >
          {loading ? 'Processing…' : 'Request Airdrop'}
        </button>

        {notice && (
          <div
            className={
              'mt-2 rounded-xl p-4 text-sm ' +
              (notice.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-50 ring-1 ring-emerald-500/30'
                : notice.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white')
            }
            role={notice.type === 'error' ? 'alert' : 'status'}
            aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
          >
            {notice.type === 'success' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium">{notice.message}</p>
                </div>

                {lastExplorerUrl && (
                  <a
                    href={lastExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    aria-label="View transaction on block explorer (opens in a new tab)"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M11 3a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 3H11Z" />
                      <path d="M3 5a2 2 0 0 1 2-2h3a1 1 0 1 1 0 2H5v10h10v-3a1 1 0 1 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" />
                    </svg>
                    View on Explorer
                  </a>
                )}
              </div>
            ) : notice.html ? (
              <span dangerouslySetInnerHTML={{ __html: notice.message }} />
            ) : (
              <span>{notice.message}</span>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
