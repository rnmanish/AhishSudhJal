import type { Metadata } from 'next';
import './globals.css';
import { englishDict, hindiDict } from '../locales';

export const metadata: Metadata = {
  title: `${hindiDict.brand.name} (${englishDict.brand.name}) | ${hindiDict.meta.plantLocation}`,
  description: hindiDict.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
