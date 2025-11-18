'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">WorkMatch Argentina</h1>
        <p className="text-center text-gray-600 mb-8">
          Selecciona tu rol para continuar
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/demandante')}
            className="btn-primary w-full py-4 text-lg"
          >
            Entrar como Demandante
          </button>

          <button
            onClick={() => router.push('/proveedor')}
            className="w-full py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Entrar como Proveedor
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-gray-500">
          Modo de prueba - Sin autenticación
        </p>
      </div>
    </div>
  );
}
