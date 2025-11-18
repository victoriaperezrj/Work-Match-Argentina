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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/proveedor" className="text-blue-600 hover:underline">
            ← Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">Configurar Perfil de Proveedor</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Servicios que Ofrezco
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      services.includes(service)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">{service}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Seleccionados: {services.length} servicios
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Radio de Cobertura (en kilómetros)
              </label>
              <input
                type="number"
                value={radiusKM}
                onChange={(e) => setRadiusKM(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Los trabajos dentro de este radio desde tu ubicación aparecerán en tu lista
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mi Ubicación Actual</label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 mb-2"
              >
                📍 Usar mi ubicación actual
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Latitud</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="-34.603722"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Longitud</label>
                  <input
                    type="text"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="-58.381592"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: Buenos Aires: -34.603722, -58.381592
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex-1 font-medium disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Perfil'}
              </button>
              <Link href="/proveedor" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 text-center">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
