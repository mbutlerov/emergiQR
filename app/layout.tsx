import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'EmergiQR — QR de Emergencia',
  description:
    'Sistema de identificación de emergencia para motociclistas. Datos médicos y contactos accesibles al instante.',
  openGraph: {
    title: 'EmergiQR — QR de Emergencia',
    description: 'Datos médicos accesibles al instante en caso de accidente.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} font-body bg-bg text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
