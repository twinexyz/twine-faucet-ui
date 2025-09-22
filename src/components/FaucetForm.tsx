"use client";

import { useEffect, useMemo, useState } from "react";
import { CHAINS, defaultChainKey } from "@/config/chains";
import type { FaucetRequest } from "@/types/faucet";
import { claimFaucet } from "@/lib/api";

const chainExplorers: Record<string, (hash: string) => string> = {
  sepolia: (h) => `https://sepolia.etherscan.io/tx/${h}`,
  twine: (h) => `https://stage-explorer.twine.limited/tx/${h}`,
  solana: (h) => `https://explorer.solana.com/tx/${h}?cluster=devnet`
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

  const chains = useMemo(() => Object.values(CHAINS), []);
  const current = CHAINS[chainKey];

  useEffect(() => {
    setTokenAddress(current?.tokens?.[0]?.address ?? "");
    setNotice(null);
  }, [chainKey, current]);

  const shorten = (s: string) =>
    (s?.length ?? 0) > 12 ? `${s.slice(0, 6)}...${s.slice(-6)}` : s;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!process.env.NEXT_PUBLIC_FAUCET_API_URL) {
      setNotice({
        type: "error",
        message:
          "Backend URL not set. Define NEXT_PUBLIC_FAUCET_API_URL in .env.local"
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
      wallet_address: wallet.trim()
    };

    setLoading(true);
    try {
      const resp = await claimFaucet(payload);
      const tx = resp.data?.tx_hash;
      const chain = String(resp.data?.chain ?? chainKey);
      const buildExplorer = chainExplorers[chain];

      if (tx && buildExplorer) {
        const link = buildExplorer(tx);
        setNotice({
          type: "success",
          html: true,
          message: `✅ Success! View tx on <a class="underline hover:opacity-80" href="${link}" target="_blank" rel="noopener noreferrer">explorer</a> (${shorten(
            tx
          )})`
        });
      } else if (tx) {
        setNotice({ type: "success", message: `✅ Success! Tx: ${shorten(tx)}` });
      } else {
        setNotice({ type: "success", message: "✅ Success!" });
      }
    } catch (err: any) {
      setNotice({ type: "error", message: `❌ ${err?.message || String(err)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-4"
    >
      <h1 className="text-xl font-semibold text-center">Twine Testnet Faucet</h1>

      <label className="block text-sm font-medium">Network</label>
      <select
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
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
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
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
        placeholder={
          current?.chainType === "EVM" ? "0xABC..." : "Wallet address..."
        }
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        disabled={loading}
      />

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:bg-gray-600"
        disabled={loading}
      >
        {loading ? "Processing…" : "Request Airdrop"}
      </button>

      {notice && (
        <div
          className={
            "mt-2 p-3 rounded text-sm " +
            (notice.type === "success"
              ? "bg-green-600"
              : notice.type === "error"
              ? "bg-red-600"
              : "bg-blue-600")
          }
          role="alert"
        >
          {notice.html ? (
            <span dangerouslySetInnerHTML={{ __html: notice.message }} />
          ) : (
            <span>{notice.message}</span>
          )}
        </div>
      )}


    </form>
  );
}
