'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores';

export default function LoginPage() {
  const router = useRouter();
  const mockLogin = useAuthStore((state) => state.mockLogin);

  const handleRoleSelect = (role: 'demandante' | 'proveedor') => {
    mockLogin(role);
    router.push(`/${role}`);
  };

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
            <button
              onClick={() => handleRoleSelect('demandante')}
              className="w-full text-left group card-interactive card-interactive-blue"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors duration-200">
                      Necesito un servicio
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Publicar necesidades y contratar
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>

            {/* Artisan Option */}
            <button
              onClick={() => handleRoleSelect('proveedor')}
              className="w-full text-left group card-interactive card-interactive-green"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-green-300 transition-colors duration-200">
                      Soy profesional
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Encontrar trabajos y clientes
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500 group-hover:text-emerald-500 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-200">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center animate-slideUp space-y-2" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-adaptive-muted">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-600 dark:text-cyan-400 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
          <p className="text-xs text-adaptive-muted">
            Modo de prueba • Sin autenticación requerida
          </p>
        </div>
      </div>
    </div>
  );
}
