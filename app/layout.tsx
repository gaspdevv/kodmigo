import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "@/components/providers/ClientProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kodmigo.com"),
  title: "Kodmigo — Python öğrenmeye oyun gibi başla",
  description:
    "Kodmigo, sıfırdan başlayanlar için kısa dersler, mini görevler, XP sistemi ve Migo’nun ipuçlarıyla Python öğrenmeyi daha eğlenceli hale getirir.",
  icons: {
    icon: [
      { url: `/favicon.ico?v=${2}`, sizes: "any" },
      {
        url: `/favicon-32x32.png?v=${2}`,
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://kodmigo.com",
    siteName: "Kodmigo",
    title: "Kodmigo — Python öğrenmeye oyun gibi başla",
    description:
      "Kodmigo, sıfırdan başlayanlar için kısa dersler, mini görevler, XP sistemi ve Migo’nun ipuçlarıyla Python öğrenmeyi daha eğlenceli hale getirir.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Kodmigo — Migo ile Python öğren",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodmigo — Python öğrenmeye oyun gibi başla",
    description:
      "Kodmigo, sıfırdan başlayanlar için kısa dersler, mini görevler, XP sistemi ve Migo’nun ipuçlarıyla Python öğrenmeyi daha eğlenceli hale getirir.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
