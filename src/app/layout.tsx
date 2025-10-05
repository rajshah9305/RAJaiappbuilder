import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI App Factory - by Raj Shah',
  description: 'Generate React apps with natural language using Cerebras GPT-OSS-120B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
