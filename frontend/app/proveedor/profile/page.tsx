'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, profile, SERVICE_TYPES } from '@/lib/api';
import Link from 'next/link';

export default function ProveedorProfilePage() {
  const router = useRouter();
  const [services, setServices] = useState<string[]>([]);
  const [radiusKM, setRadiusKM] = useState('10');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Proveedor') {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const data = await profile.getMe();
      if (data.profile) {
        setServices(data.profile.services || []);
        setRadiusKM(data.profile.radius_km?.toString() || '10');
        setLat(data.profile.lat?.toString() || '');
        setLon(data.profile.lon?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
        },
        (error) => {
          setError('No se pudo obtener tu ubicación. Por favor ingrésala manualmente.');
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

      await profile.updateProviderProfile({
        services,
        radius_km: radius,
        lat: latNum,
        lon: lonNum,
      });

      setSuccess('¡Perfil actualizado exitosamente!');
      setTimeout(() => {
        router.push('/proveedor');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/proveedor" className="text-primary hover:underline">
            ← Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card">
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
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Radio de Cobertura (en kilómetros)
              </label>
              <input
                type="number"
                value={radiusKM}
                onChange={(e) => setRadiusKM(e.target.value)}
                className="input-field"
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
                className="btn-secondary mb-2"
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
                    className="input-field"
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
                    className="input-field"
                    required
                    placeholder="-58.381592"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: Buenos Aires: -34.603722, -58.381592
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Guardando...' : 'Guardar Perfil'}
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
