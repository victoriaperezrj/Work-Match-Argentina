'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, requests, SERVICE_TYPES } from '@/lib/api';
import Link from 'next/link';

export default function NewRequestPage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Demandante') {
      router.push('/login');
    }
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      if (isNaN(latNum) || isNaN(lonNum)) {
        throw new Error('Latitud y Longitud deben ser números válidos');
      }

      await requests.create({
        description,
        service_type: serviceType,
        lat: latNum,
        lon: lonNum,
      });

      router.push('/demandante');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/demandante" className="text-primary hover:underline">
            ← Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Nueva Solicitud de Servicio</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Servicio</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="input-field"
                required
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción del Trabajo</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[120px]"
                required
                placeholder="Describe detalladamente el trabajo que necesitas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ubicación del Trabajo</label>
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
                {loading ? 'Creando solicitud...' : 'Crear Solicitud'}
              </button>
              <Link href="/demandante" className="btn-danger">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
