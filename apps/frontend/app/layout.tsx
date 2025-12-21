import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";


const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volleyball",
  description: "Support Volleyball in India",
  keywords: ["Volleyball", "Volleyball India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`} >
      <body className="antialiased font-bricolage" >
        {children}
      </body>
    </html>
  );
}
