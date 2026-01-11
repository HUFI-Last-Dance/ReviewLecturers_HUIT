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
  title: 'HUIT REVIEW - Nền tảng Review Giảng viên dành cho sinh viên',
  description: 'Cộng đồng sinh viên chia sẻ & đánh giá giảng viên minh bạch, văn minh.',
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
