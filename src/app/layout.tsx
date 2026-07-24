import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import AppHeader from "@/components/layout/AppHeader";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura — AI Research Mentor",
  description:
    "ResearchPilot: pendamping AI yang membantu mahasiswa menemukan dan menyusun ide penelitian melalui dialog Socratic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <AppProvider>
          <AppHeader />
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
