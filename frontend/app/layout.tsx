import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <LanguageProvider>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                {children}
                <Toaster position="top-right" richColors />
              </ThemeProvider>
            </AuthProvider>
          </LanguageProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
