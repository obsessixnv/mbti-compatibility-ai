import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MBTI Compatibility | Unlock Personality Dynamics",
  description: "Discover deep insights about your MBTI compatibility with friends, partners, and colleagues. Premium personality matching tool.",
  keywords: "MBTI, personality match, compatibility, relationships, INTJ, ENFP, personality types",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <main className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
