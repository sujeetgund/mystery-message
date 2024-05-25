import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

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
        <body className={poppins.className}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
