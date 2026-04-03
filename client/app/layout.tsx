import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rostex = localFont({
  src: "../public/fonts/rostex/Rostex-Regular.ttf",
  variable: "--font-rostex",
});

const xirod = localFont({
  src: "../public/fonts/xirod/Xirod.otf",
  variable: "--font-xirod",
});

export const metadata: Metadata = {
  title: "Cortex | Neural Design Engine",
  description: "TRIBE v2-powered neuro-linter for UI Designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rostex.variable} ${xirod.variable}`}>
      <body className="antialiased font-rostex text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
