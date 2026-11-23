import type { Metadata, Viewport } from 'next';
import './globals.css';
import { englishDict, hindiDict } from '../locales';
import { AppProviders } from '../infrastructure/di/AppProviders';

export const viewport: Viewport = {
  themeColor: '#051329',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${hindiDict.brand.name} (${englishDict.brand.name}) | ${hindiDict.meta.plantLocation}`,
  description: hindiDict.meta.description,
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="dark">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
