import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en WorkMatch Argentina para conectar con artesanos o encontrar trabajos.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">WorkMatch</h1>
          <p className="text-muted-foreground">Argentina</p>
        </div>

        {/* Role Selection Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Selecciona tu rol</CardTitle>
            <CardDescription>
              Elige cómo quieres usar la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Client Option */}
            <Link href="/demandante" className="block">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex items-center justify-between hover:bg-primary hover:text-primary-foreground transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary-foreground/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-primary-foreground">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Necesito un servicio</p>
                    <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">
                      Publicar necesidades y contratar
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </Link>

            {/* Artisan Option */}
            <Link href="/proveedor" className="block">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex items-center justify-between hover:bg-secondary hover:text-secondary-foreground transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary-foreground/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-secondary-foreground">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Soy profesional</p>
                    <p className="text-xs text-muted-foreground group-hover:text-secondary-foreground/80">
                      Encontrar trabajos y clientes
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Modo de prueba - Sin autenticación requerida
        </p>
      </div>
    </div>
  )
}
