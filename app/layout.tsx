import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cody Adventure",
  description: "made by KP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased relative min-h-screen`}
      >
        {children}
        <div className="fixed bottom-4 right-4 text-sm text-gray-600">
          made with ❤️
        </div>
      </body>
    </html>
  );
}
