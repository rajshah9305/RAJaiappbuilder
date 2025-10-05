import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAJ AI APP BUILDER - by Raj Shah',
  description: 'Elite AI-powered platform to build React applications with natural language using Cerebras GPT-OSS-120B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
