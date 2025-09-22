import Image from "next/image";
import FaucetForm from "@/components/FaucetForm";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-[#c2ffc0]"
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/twine_banner.png"
            alt="Twine Banner"
            width={1200}
            height={128}
            className="h-24 w-auto object-contain"
            priority
          />
        </div>
        <FaucetForm />
      </div>
    </main>
  );
}
