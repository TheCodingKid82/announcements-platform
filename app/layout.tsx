import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["500", "600", "700", "800"]
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Announcements",
  description: "The communication layer for the AI age",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://announcementsapp.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif"
        }}
      >
        <style>{`
          :root {
            --font-sans: var(--font-inter);
            --font-display: var(--font-inter-tight);
            --font-mono: var(--font-jetbrains);
          }
        `}</style>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
