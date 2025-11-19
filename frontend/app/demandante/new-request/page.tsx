'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SAN_LUIS_LOCATIONS, LOCATIONS_BY_DEPARTMENT, DEPARTMENTS, getLocationDisplayName } from '@/lib/constants/locations';
import { useAuthStore, useRequestsStore } from '@/lib/stores';
import { useToast } from '@/components/toast';

const SERVICE_TYPES = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Limpieza',
  'Jardinería',
  'Albañilería',
  'Cerrajería',
  'Gasista',
  'Aire Acondicionado',
];

export default function NewRequestPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const addRequest = useRequestsStore((state) => state.addRequest);
  const toast = useToast();

  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [locationId, setLocationId] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!locationId) {
        throw new Error('Debes seleccionar una ubicación');
      }

      if (!description.trim()) {
        throw new Error('Debes describir el trabajo que necesitas');
      }

      // Create new request
      const newRequest = {
        id: `request-${Date.now()}`,
        demandante_id: user?.id || 'mock-user-1',
        description: description.trim(),
        service_type: serviceType,
        location_id: locationId,
        status: 'Pendiente' as const,
        price_quoted: budget ? parseInt(budget) : null,
        provider_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to store
      addRequest(newRequest);

      setSuccess(true);
      setTimeout(() => {
        router.push('/demandante');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 text-center max-w-md animate-slideUp">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-adaptive-primary mb-2">¡Solicitud Creada!</h2>
          <p className="text-adaptive-secondary mb-4">
            Tu solicitud ha sido publicada. Los proveedores en {getLocationDisplayName(locationId)} serán notificados.
          </p>
          <p className="text-sm text-adaptive-muted">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation - Mobile Optimized */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Link href="/demandante" className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors flex items-center gap-2 text-sm sm:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="glass p-4 sm:p-8 animate-slideUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-adaptive-primary mb-1 sm:mb-2">Nueva Solicitud</h1>
          <p className="text-sm sm:text-base text-adaptive-secondary mb-6 sm:mb-8">Describe el servicio que necesitas</p>

          {error && (
            <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-adaptive-secondary mb-2">Tipo de Servicio</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="input-premium"
                required
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-white dark:bg-gray-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-adaptive-secondary mb-2">Descripción del Trabajo</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-premium min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                required
                placeholder="Describe detalladamente el trabajo que necesitas..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-adaptive-secondary mb-2">Ubicación del Trabajo</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="input-premium"
                required
              >
                <option value="" className="bg-white dark:bg-gray-900">Selecciona una localidad...</option>
                {DEPARTMENTS.map((department) => (
                  <optgroup key={department} label={department} className="bg-white dark:bg-gray-900">
                    {LOCATIONS_BY_DEPARTMENT[department].map((location) => (
                      <option key={location.id} value={location.id} className="bg-white dark:bg-gray-900">
                        {location.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-adaptive-muted mt-2">
                Provincia de San Luis • Pronto más provincias disponibles
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-adaptive-secondary mb-2">
                Presupuesto Estimado (opcional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-adaptive-muted">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="input-premium pl-8 text-sm sm:text-base"
                  placeholder="ej: 5000"
                  min="0"
                />
              </div>
              <p className="text-xs text-adaptive-muted mt-2">
                Define un presupuesto para que los proveedores sepan tu expectativa
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 order-1 sm:order-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : (
                  'Crear Solicitud'
                )}
              </button>
              <Link href="/demandante" className="btn-danger text-center order-2 sm:order-2">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
