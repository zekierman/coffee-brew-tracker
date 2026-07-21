import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

// Basliklar icin yuksek kontrastli editoryel serif.
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

// Demleme parametreleri (tik, sicaklik, sure) hizali okunsun diye.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Brew Log — Nitelikli kahve demleme günlüğü",
  description:
    "Çekirdek künyeleri, öğütüm tıkı, su sıcaklığı ve tadım notlarıyla demlemelerini kaydet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
