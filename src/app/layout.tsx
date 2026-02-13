import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { siteConfig, generateOrganizationSchema, JsonLd } from '@/lib/seo';
import { ThemeProvider } from '@/lib/theme';
import { TransitionProvider } from '@/lib/transition';
import { Preloader } from '@/components/ui/Preloader';
import { PageTransition } from '@/components/ui/PageTransition';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ToastProvider } from '@/components/ui/Toast';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F5F2' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1716' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={generateOrganizationSchema()} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Default to light mode unless explicitly set to dark
                if (localStorage.theme === 'dark') {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
                // Apply style variant (e.g. rose-clay) before hydration
                var sv = localStorage.getItem('style-variant');
                if (sv && sv !== 'default') {
                  document.documentElement.setAttribute('data-style', sv);
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <TransitionProvider>
            <ToastProvider position="bottom-center">
              <Preloader />
              <PageTransition />
              <CustomCursor />
              <ScrollProgress />
              <PWAInstallPrompt />
              {children}
            </ToastProvider>
          </TransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
