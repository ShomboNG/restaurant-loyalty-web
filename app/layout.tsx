import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider, themeInitScript } from '@/lib/theme-context';
import { Navbar } from '@/components/Navbar';
import { BackgroundPattern } from '@/components/BackgroundPattern';

export const metadata: Metadata = {
  title: 'Shombo Rewards',
  description: 'Order. Earn. Climb the board.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the right theme class before paint — avoids a flash of the wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <BackgroundPattern />
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}