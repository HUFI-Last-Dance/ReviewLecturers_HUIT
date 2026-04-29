import type { Metadata } from 'next';
import { Nunito_Sans, Varela_Round } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/components/theme-provider';

import { ComparisonProvider } from '@/contexts/comparison-context';
import { ComparisonBar } from '@/components/comparison/ComparisonBar';

const nunito = Nunito_Sans({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const varelaRound = Varela_Round({
  variable: '--font-varela-round',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'HUIT Review - Cổng thông tin đánh giá giảng viên',
  description: 'Cộng đồng sinh viên HUIT chia sẻ & đánh giá giảng viên văn minh, khách quan. Dự án phi lợi nhuận do sinh viên phát triển.',
  openGraph: {
    title: 'HUIT Review - Cổng thông tin đánh giá giảng viên',
    description: 'Cộng đồng sinh viên HUIT chia sẻ & đánh giá giảng viên văn minh, khách quan.',
    siteName: 'HUIT Review',
    images: [
      {
        url: '/images/social-share-banner.png',
        width: 1200,
        height: 630,
        alt: 'HUIT Review Social Banner',
      },
    ],
    locale: 'vi_VN',
    type: 'website',

  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${varelaRound.variable} font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <LanguageProvider>
            <AuthProvider>
              <ComparisonProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                  {children}
                  <ComparisonBar />
                  <Toaster position="top-right" richColors />
                </ThemeProvider>
              </ComparisonProvider>
            </AuthProvider>
          </LanguageProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

