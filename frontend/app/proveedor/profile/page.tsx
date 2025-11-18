'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [lat, setLat] = useState('-34.6037');
  const [lon, setLon] = useState('-58.3816');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
        },
        (error) => {
          setError('No se pudo obtener tu ubicación. Usando Buenos Aires por defecto.');
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización');
    }
  };

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
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const radius = parseInt(radiusKM);

      if (isNaN(latNum) || isNaN(lonNum)) {
        throw new Error('Latitud y Longitud deben ser números válidos');
      }

      if (services.length === 0) {
        throw new Error('Debes seleccionar al menos un servicio');
      }

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
      <nav className="glass border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/proveedor" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="glass p-8 animate-slideUp">
          <h1 className="text-3xl font-bold text-white mb-2">Configurar Perfil</h1>
          <p className="text-gray-400 mb-8">Personaliza tus servicios y área de cobertura</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Servicios que Ofrezco
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      services.includes(service)
                        ? 'bg-gradient-to-r from-emerald-600/30 to-green-500/30 border border-emerald-400/50 text-emerald-300'
                        : 'bg-gray-900/50 border border-gray-700/50 text-gray-400 hover:border-emerald-400/30'
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
                        : 'border-gray-600'
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
              <p className="text-xs text-gray-500 mt-3">
                Seleccionados: {services.length} servicios
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <p className="text-xs text-gray-500 mt-2">
                Los trabajos dentro de este radio desde tu ubicación aparecerán en tu lista
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mi Ubicación</label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn-ghost text-sm mb-4 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Usar mi ubicación actual
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitud</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="input-premium"
                    required
                    placeholder="-34.603722"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitud</label>
                  <input
                    type="text"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="input-premium"
                    required
                    placeholder="-58.381592"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ejemplo: Buenos Aires: -34.603722, -58.381592
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
