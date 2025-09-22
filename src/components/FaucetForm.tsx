"use client";

import { useEffect, useMemo, useState } from "react";
import { CHAINS, defaultChainKey } from "@/config/chains";
import type { FaucetRequest } from "@/types/faucet";
import { claimFaucet } from "@/lib/api";

const chainExplorers: Record<string, (hash: string) => string> = {
  sepolia: (h) => `https://sepolia.etherscan.io/tx/${h}`,
  twine: (h) => `https://stage-explorer.twine.limited/tx/${h}`,
  solana: (h) => `https://explorer.solana.com/tx/${h}?cluster=devnet`,
};

export default function FaucetForm() {
  const [chainKey, setChainKey] = useState<string>(defaultChainKey);
  const [tokenAddress, setTokenAddress] = useState<string>(
    CHAINS[defaultChainKey].tokens[0].address
  );
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<
    { type: "info" | "success" | "error"; message: string; html?: boolean } | null
  >(null);

  const [lastExplorerUrl, setLastExplorerUrl] = useState<string | null>(null);

  const chains = useMemo(() => Object.values(CHAINS), []);
  const current = CHAINS[chainKey];

  useEffect(() => {
    setTokenAddress(current?.tokens?.[0]?.address ?? "");
    setNotice(null);
    setLastExplorerUrl(null);
  }, [chainKey, current]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!process.env.NEXT_PUBLIC_FAUCET_API_URL) {
      setNotice({
        type: "error",
        message:
          "Backend URL not set. Define NEXT_PUBLIC_FAUCET_API_URL in .env.local",
      });
      return;
    }
    if (!wallet.trim()) {
      setNotice({ type: "error", message: "Please enter a wallet address." });
      return;
    }
    if (!tokenAddress) {
      setNotice({ type: "error", message: "Please select a token." });
      return;
    }

    const payload: FaucetRequest = {
      chain: String(chainKey),
      token_address: tokenAddress,
      wallet_address: wallet.trim(),
    };

    setLoading(true);
    try {
      const resp = await claimFaucet(payload);
      const tx = resp.data?.tx_hash as string | undefined;
      const chain = String(resp.data?.chain ?? chainKey);
      const buildExplorer = chainExplorers[chain];

      if (tx && buildExplorer) {
        const link = buildExplorer(tx);
        setLastExplorerUrl(link);
        setNotice({
          type: "success",
          message: "Success! Your request was processed.",
        });
      } else {
        setLastExplorerUrl(null);
        setNotice({ type: "success", message: "Success!" });
      }
    } catch (err: any) {
      setNotice({ type: "error", message: `❌ ${err?.message || String(err)}` });
      setLastExplorerUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-6 shadow-xl space-y-4 w-115"
    >
      <h1 className="text-xl font-semibold text-center">Twine Testnet Faucet</h1>

      {/* Disclaimer */}
      <div
        className="flex gap-3 items-start rounded-lg border border-yellow-500/30
                   bg-yellow-50 text-yellow-900 p-3 text-sm leading-6"
        role="note"
        aria-label="Disclaimer"
      >
        <span className="text-lg">⚠️</span>
        <p>
          <strong>Disclaimer:</strong> Testnet tokens are for testing only. They have no
          monetary value and <u>cannot be used on mainnet</u>.
        </p>
      </div>

      <label className="block text-sm font-medium">Network</label>
      <select
        className="w-full p-2 rounded bg-gray-100 border border-gray-600 focus:outline-none"
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

      <label className="block text-sm font-medium">Token</label>
      <select
        className="w-full p-2 rounded bg-gray-100 border border-gray-600 focus:outline-none"
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

      <label className="block text-sm font-medium">Wallet Address</label>
      <input
        type="text"
        placeholder={current?.chainType === "EVM" ? "0x2DC..." : "Wallet address..."}
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 border border-gray-600 focus:outline-none"
        disabled={loading}
      />

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#35c969] hover:bg-[#39bb69] rounded-lg font-medium disabled:bg-gray-600"
        disabled={loading}
      >
        {loading ? "Processing…" : "Request Airdrop"}
      </button>

      {notice && (
        <div
          className={
            "mt-2 p-3 rounded text-sm " +
            (notice.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : notice.type === "error"
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white")
          }
          role={notice.type === "error" ? "alert" : "status"}
          aria-live={notice.type === "error" ? "assertive" : "polite"}
        >
          {notice.type === "success" ? (
            <div className="space-y-2">
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
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
    </form>
  );
}
