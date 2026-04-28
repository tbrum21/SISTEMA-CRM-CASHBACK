import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EloBonus — Cashback e CRM para o Varejo | Fidelize seus Clientes',
  description: 'Sistema de Cashback e CRM multi-tenant definitivo para o varejo. Aumente o LTV, recupere clientes inativos e tenha controle total da sua base.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
