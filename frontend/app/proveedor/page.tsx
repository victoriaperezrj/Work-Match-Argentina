'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, requests } from '@/lib/api';
import Link from 'next/link';

interface ServiceRequest {
  id: number;
  demandante_id: number;
  description: string;
  service_type: string;
  lat: number;
  lon: number;
  status: string;
  price_quoted: number | null;
  created_at: string;
}

export default function ProveedorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Proveedor') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    loadPendingRequests();
  }, [router]);

  const loadPendingRequests = async () => {
    try {
      const data = await requests.getPending();
      setPendingRequests(data || []);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await requests.accept(requestId);
      // Reload pending requests
      loadPendingRequests();
      alert('¡Solicitud aceptada exitosamente!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al aceptar solicitud');
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WorkMatch - Proveedor</h1>
          <div className="flex items-center gap-4">
            <Link href="/proveedor/profile" className="btn-secondary">
              ⚙️ Configurar Perfil
            </Link>
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="btn-danger">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Trabajos Pendientes</h2>

        {pendingRequests.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">
              No hay trabajos pendientes que coincidan con tu perfil
            </p>
            <Link href="/proveedor/profile" className="btn-secondary inline-block">
              Configurar mi perfil
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{request.service_type}</h3>
                    <p className="text-gray-600 mb-4">{request.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pendiente
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Ubicación</p>
                    <p className="font-medium">
                      Lat: {request.lat.toFixed(4)}, Lon: {request.lon.toFixed(4)}
                    </p>
                  </div>
                  {request.price_quoted && (
                    <div>
                      <p className="text-gray-500">Precio Estimado</p>
                      <p className="font-medium text-green-600">
                        ${request.price_quoted.toFixed(2)} ARS
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Publicado</p>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="btn-primary w-full"
                >
                  ✓ Aceptar Trabajo
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
