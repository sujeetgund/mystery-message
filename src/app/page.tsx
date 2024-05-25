import { Mouse } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-4 p-24">
      <div
        className={`flex flex-col items-center justify-around h-[80vh] w-full space-y-4 p-4 bg-gradient-to-br from-[#f9f871] to-[#f9f871] rounded-3xl shadow-xl`}
      >
        {/* Headlines */}
        <div className="flex flex-col items-center">
          <h3 className="text-center font-semibold text-6xl">
            Send Anonymous{" "}
          </h3>
          <span className="text-9xl font-extrabold filter  hover:blur-none transition duration-700">
            Messages
          </span>{" "}
          <h3 className="text-center font-semibold text-6xl">with</h3>
          <h1 className="text-9xl font-extrabold">Mystery Message</h1>
        </div>

        {/* Mouse Icon */}
        <Mouse className="h-12 w-12 animate-bounce mt-6" />
      </div>
    </main>
  );
}
