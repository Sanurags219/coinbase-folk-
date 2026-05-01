import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export async function generateMetadata(): Promise<Metadata> {
  const rootUrl = process.env.APP_URL || 'http://localhost:3000';
  return {
    title: 'Folk Wallet',
    description: 'Professional Onchain Wallet for the Folk community',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${rootUrl}/og.png`,
        button: {
          title: 'Launch Folk Wallet',
          action: {
            type: 'launch_miniapp',
            name: 'Folk Wallet',
            url: rootUrl,
            splashImageUrl: `${rootUrl}/splash.png`,
            splashBackgroundColor: '#0A0B0D',
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
