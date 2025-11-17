'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Demandante' | 'Proveedor'>('Demandante');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.register(email, password, role);

      // Redirect based on user role
      if (response.user.role === 'Demandante') {
        router.push('/demandante');
      } else if (response.user.role === 'Proveedor') {
        router.push('/proveedor');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">WorkMatch Argentina</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Crear Cuenta</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Usuario</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Demandante"
                  checked={role === 'Demandante'}
                  onChange={(e) => setRole(e.target.value as 'Demandante')}
                  className="mr-2"
                />
                Demandante (Busco servicios)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Proveedor"
                  checked={role === 'Proveedor'}
                  onChange={(e) => setRole(e.target.value as 'Proveedor')}
                  className="mr-2"
                />
                Proveedor (Ofrezco servicios)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
