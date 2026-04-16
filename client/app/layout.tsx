import type { Metadata } from "next";
import localFont from "next/font/local";
import { Smooch_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";

const smoochSans = Smooch_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-smooch",
  display: "swap",
});

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
    <html lang="en" className={`${smoochSans.variable} ${rostex.variable} ${xirod.variable}`}>
      <body className="antialiased text-foreground bg-background">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
