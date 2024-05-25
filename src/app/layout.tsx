import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const londrina_solid = Londrina_Solid({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Mystery Message - Send Anonymous Messages to Anyone",
  description:
    "Send anonymous messages to anyone with Mystery Message. Share your thoughts, secrets, or compliments without revealing your identity. Start messaging anonymously today!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${londrina_solid.className} bg-[#e6e6dd] selection:bg-yellow-400`}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
