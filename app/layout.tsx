import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeepCrawl SEO AI Agent - Advanced Website Audit',
  description: 'AI-powered deep website crawler for comprehensive SEO audits, technical analysis, content optimization, and auto-fixes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
