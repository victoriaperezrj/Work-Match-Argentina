'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LOCATIONS_BY_DEPARTMENT, DEPARTMENTS, getLocationDisplayName } from '@/lib/constants/locations';

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

export default function ProveedorProfilePage() {
  const router = useRouter();
  const [services, setServices] = useState<string[]>(['Plomería', 'Electricidad']);
  const [radiusKM, setRadiusKM] = useState('15');
  const [locationId, setLocationId] = useState('san-luis-capital');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleServiceToggle = (service: string) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (services.length === 0) {
        throw new Error('Debes seleccionar al menos un servicio');
      }

      if (!locationId) {
        throw new Error('Debes seleccionar tu ubicación');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('¡Perfil actualizado exitosamente!');
      setTimeout(() => {
        router.push('/proveedor');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/proveedor" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="glass p-8 animate-slideUp">
          <h1 className="text-3xl font-bold text-adaptive-primary mb-2">Configurar Perfil</h1>
          <p className="text-adaptive-secondary mb-8">Personaliza tus servicios y área de cobertura</p>

          {error && (
            <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-4">
                Servicios que Ofrezco
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      services.includes(service)
                        ? 'bg-emerald-100 dark:bg-gradient-to-r dark:from-emerald-600/30 dark:to-green-500/30 border border-emerald-300 dark:border-emerald-400/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 text-adaptive-secondary hover:border-emerald-300 dark:hover:border-emerald-400/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                      services.includes(service)
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {services.includes(service) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">{service}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-adaptive-muted mt-3">
                Seleccionados: {services.length} servicios
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-2">
                Radio de Cobertura (km)
              </label>
              <input
                type="number"
                value={radiusKM}
                onChange={(e) => setRadiusKM(e.target.value)}
                className="input-premium"
                required
                min="1"
                max="100"
              />
              <p className="text-xs text-adaptive-muted mt-2">
                Los trabajos dentro de este radio desde tu ubicación aparecerán en tu lista
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-adaptive-secondary mb-2">Mi Ubicación</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="input-premium"
                required
              >
                <option value="" className="bg-white dark:bg-gray-900">Selecciona tu localidad...</option>
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

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  'Guardar Perfil'
                )}
              </button>
              <Link href="/proveedor" className="btn-danger">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
