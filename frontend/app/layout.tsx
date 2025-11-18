import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'WorkMatch Argentina - Conectamos Artesanos con Clientes',
    template: '%s | WorkMatch Argentina',
  },
  description: 'Encuentra artesanos calificados en Argentina. Plomeros, electricistas, pintores, carpinteros y más. Publica tu necesidad y recibe propuestas de profesionales verificados.',
  keywords: [
    'artesanos argentina',
    'plomero buenos aires',
    'electricista caba',
    'servicios del hogar',
    'reparaciones',
    'mantenimiento',
    'profesionales',
    'trabajos manuales',
  ],
  authors: [{ name: 'WorkMatch Argentina' }],
  creator: 'WorkMatch Argentina',
  publisher: 'WorkMatch Argentina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://workmatch.ar'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WorkMatch Argentina - Conectamos Artesanos con Clientes',
    description: 'Encuentra artesanos calificados en Argentina. Publica tu necesidad y recibe propuestas de profesionales verificados.',
    url: '/',
    siteName: 'WorkMatch Argentina',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorkMatch Argentina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkMatch Argentina - Conectamos Artesanos con Clientes',
    description: 'Encuentra artesanos calificados en Argentina.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
