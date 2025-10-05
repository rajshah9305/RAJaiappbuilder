import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAJ AI APP BUILDER - by Raj Shah',
  description: 'Elite AI-powered platform to build React applications with natural language using Cerebras GPT-OSS-120B',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
