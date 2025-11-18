import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en WorkMatch Argentina para conectar con artesanos o encontrar trabajos.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-floating" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center space-y-3 animate-slideUp">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-adaptive-primary">
            WorkMatch
          </h1>
          <p className="text-blue-600 dark:text-cyan-400 font-medium tracking-wider text-sm">ARGENTINA</p>
        </div>

        {/* Role Selection Card - Glassmorphism */}
        <div className="glass p-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-adaptive-primary mb-2">Selecciona tu rol</h2>
            <p className="text-adaptive-muted">
              Elige cómo quieres usar la plataforma
            </p>
          </div>

          <div className="space-y-4">
            {/* Client Option */}
            <Link href="/demandante" className="block group">
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-gradient-to-br dark:from-blue-600/20 dark:to-cyan-500/20 group-hover:bg-blue-200 dark:group-hover:from-blue-600/40 dark:group-hover:to-cyan-500/40 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-cyan-400 transition-colors">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-adaptive-primary group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                        Necesito un servicio
                      </p>
                      <p className="text-sm text-adaptive-muted group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        Publicar necesidades y contratar
                      </p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>

            {/* Artisan Option */}
            <Link href="/proveedor" className="block group">
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-gradient-to-br dark:from-emerald-600/20 dark:to-green-500/20 group-hover:bg-emerald-200 dark:group-hover:from-emerald-600/40 dark:group-hover:to-green-500/40 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-green-300 transition-colors">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-adaptive-primary group-hover:text-emerald-600 dark:group-hover:text-green-300 transition-colors">
                        Soy profesional
                      </p>
                      <p className="text-sm text-adaptive-muted group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        Encontrar trabajos y clientes
                      </p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-adaptive-muted">
            Modo de prueba • Sin autenticación requerida
          </p>
        </div>
      </div>
    </div>
  )
}
