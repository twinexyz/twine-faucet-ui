import type { FaucetRequest, FaucetResponse } from "@/types/faucet";

const API_BASE = process.env.NEXT_PUBLIC_FAUCET_API_URL;

if (!API_BASE) {

  console.warn("NEXT_PUBLIC_FAUCET_API_URL is not set. Define it in .env.local");
}

export async function claimFaucet(body: FaucetRequest): Promise<FaucetResponse> {
  const res = await fetch(`${API_BASE}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  let json: FaucetResponse;
  try {
    json = (await res.json()) as FaucetResponse;
  } catch {
    throw new Error(`Non-JSON response (status ${res.status})`);
  }

  if (!res.ok || json.status !== "success") {
    const msg = json.error || json.message || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return json;
}
