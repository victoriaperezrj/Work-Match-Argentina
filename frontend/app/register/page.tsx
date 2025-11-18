'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase/auth';
import { SAN_LUIS_LOCATIONS, DEPARTMENTS } from '@/lib/constants/locations';
import { SERVICE_TYPES } from '@/lib/supabase/types';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isDemandante, setIsDemandante] = useState(true);
  const [isProveedor, setIsProveedor] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password || !fullName) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!isDemandante && !isProveedor) {
      setError('Debes seleccionar al menos un tipo de cuenta');
      return;
    }

    if (isProveedor && selectedServices.length === 0) {
      setError('Por favor selecciona al menos un servicio que ofreces');
      return;
    }

    setIsLoading(true);

    const result = await signUp(
      email,
      password,
      fullName,
      isDemandante,
      isProveedor,
      locationId || undefined,
      selectedServices.length > 0 ? selectedServices : undefined
    );

    setIsLoading(false);

    if (!result.success) {
      setError(result.error?.message || 'Error al registrar');
      return;
    }

    if (result.needsVerification) {
      setSuccess(true);
    } else {
      router.push('/login');
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const filteredLocations = selectedDepartment
    ? SAN_LUIS_LOCATIONS.filter(l => l.department === selectedDepartment)
    : SAN_LUIS_LOCATIONS;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-floating" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="w-full max-w-md text-center relative z-10 animate-slideUp">
          <div className="glass p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-adaptive-primary mb-4">Registro Exitoso</h2>
            <p className="text-adaptive-secondary mb-6">
              Te hemos enviado un email de confirmación. Por favor revisa tu bandeja de entrada.
            </p>
            <Link href="/login" className="btn-primary inline-block">
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-floating" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
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

        {/* Registration Form */}
        <div className="glass p-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-adaptive-primary mb-2">Crear Cuenta</h2>
            <p className="text-adaptive-muted">
              Completa tus datos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="juan@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="+54 9 266 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                  Confirmar *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-3">
                Tipo de Cuenta *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={isDemandante}
                    onChange={(e) => setIsDemandante(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-adaptive-primary">Necesito servicios</p>
                    <p className="text-sm text-adaptive-muted">Publicar necesidades y contratar profesionales</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={isProveedor}
                    onChange={(e) => setIsProveedor(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-medium text-adaptive-primary">Soy profesional</p>
                    <p className="text-sm text-adaptive-muted">Encontrar trabajos y clientes</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Provider-specific fields */}
            {isProveedor && (
              <>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                    Tu Ubicación
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setLocationId('');
                      }}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Departamento</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-adaptive-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Localidad</option>
                      {filteredLocations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                    Servicios que Ofreces *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    {SERVICE_TYPES.map(service => (
                      <label
                        key={service}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedServices.includes(service)
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service)}
                          onChange={() => toggleService(service)}
                          className="sr-only"
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                  {selectedServices.length > 0 && (
                    <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                      {selectedServices.length} servicio(s) seleccionado(s)
                    </p>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registrando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" x2="19" y1="8" y2="14"/>
                    <line x1="22" x2="16" y1="11" y2="11"/>
                  </svg>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-adaptive-muted">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 dark:text-cyan-400 hover:underline font-medium">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-adaptive-muted">
            Al registrarte aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}
