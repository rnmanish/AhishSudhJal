import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'आशीष शुद्ध जल (Ashish Sudh Jal) | सरसर, सिवान',
  description: 'सरसर, पुरैना और सिवान के गांवों में 20L आरओ मिनरल वाटर जार और पैकेज्ड ड्रिंकिंग वाटर की विश्वसनीय डोरस्टेप डिलीवरी।',
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
