import FaucetForm from "@/components/FaucetForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/favicon.ico" alt="Logo" className="h-10 w-10" />
        </div>
        <FaucetForm />
      </div>
    </main>
  );
}
