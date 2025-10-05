/**
 * RAJ AI APP BUILDER - Root Layout
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'RAJ AI APP BUILDER | Elite AI-Powered Application Generator',
  description: 'Transform natural language into production-ready React applications with real-time AI streaming. Built with Next.js 14, TypeScript, and Cerebras GPT-OSS-120B.',
  keywords: ['AI', 'code generation', 'React', 'Next.js', 'Cerebras', 'GPT', 'app builder', 'natural language', 'AI-powered', 'developer tools'],
  authors: [{ name: 'Raj Shah', url: 'https://github.com/rajshah9305' }],
  creator: 'Raj Shah',
  publisher: 'Raj Shah',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nlptoapp.vercel.app',
    title: 'RAJ AI APP BUILDER | Elite AI-Powered Application Generator',
    description: 'Transform natural language into production-ready React applications with real-time AI streaming.',
    siteName: 'RAJ AI APP BUILDER',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAJ AI APP BUILDER',
    description: 'Transform natural language into production-ready React applications with AI',
    creator: '@rajshah9305',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RAJ AI APP BUILDER',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="application-name" content="RAJ AI APP BUILDER" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RAJ AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {/* Performance monitoring script placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  const perfData = window.performance.timing;
                  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                  console.log('Page load time:', pageLoadTime + 'ms');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
