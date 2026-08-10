import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RentMoto - Website Rental Motor Full-Otomatis',
  description: 'Platform rental motor otomatis dengan sistem verifikasi QR Code instan, verifikasi identitas terenkripsi, dan pembayaran Midtrans.',
  openGraph: {
    title: 'RentMoto - Website Rental Motor Full-Otomatis',
    description: 'Sewa motor matic, maxi, dan sport cepat tanpa ribet.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-indigo-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
