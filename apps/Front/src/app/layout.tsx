import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { AuthGate } from '@/components/AuthGate';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chamados | Sistema de Tickets',
  description: 'Sistema de chamados empresarial',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthGate>
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </AuthGate>
      </body>
    </html>
  );
}
