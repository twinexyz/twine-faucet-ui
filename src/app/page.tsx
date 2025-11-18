import Image from 'next/image';
import FaucetForm from '@/components/FaucetForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f2a24] via-[#0d1f1a] to-[#0a1410] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
        <Image
          src="/twine_banner.png"
          alt="Twine Banner"
          width={900}
          height={100}
          className="h-20 w-auto object-contain drop-shadow-lg"
          priority
        />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Twine Testnet Faucet
          </h1>
          <p className="text-sm text-emerald-100/80 sm:text-base">
            Quick, wallet-less claims for Sepolia, Twine, and Solana testnets
          </p>
        </div>

        <div className="w-full">
          <FaucetForm />
        </div>
      </div>
    </main>
  );
}
