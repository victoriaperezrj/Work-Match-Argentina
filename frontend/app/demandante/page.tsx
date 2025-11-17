'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, requests } from '@/lib/api';
import Link from 'next/link';

interface ServiceRequest {
  id: number;
  description: string;
  service_type: string;
  lat: number;
  lon: number;
  status: string;
  price_quoted: number | null;
  created_at: string;
  provider_id: number | null;
}

export default function DemandanteDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Demandante') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    try {
      const data = await requests.getMyRequests();
      setMyRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pendiente: 'bg-yellow-100 text-yellow-800',
      Asignado: 'bg-blue-100 text-blue-800',
      Completado: 'bg-green-100 text-green-800',
      Cancelado: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
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
          <h1 className="text-2xl font-bold">WorkMatch - Demandante</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="btn-danger">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Mis Solicitudes</h2>
          <Link href="/demandante/new-request" className="btn-primary">
            + Nueva Solicitud
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No tienes solicitudes aún</p>
            <Link href="/demandante/new-request" className="btn-primary inline-block">
              Crear tu primera solicitud
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {myRequests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{request.service_type}</h3>
                    <p className="text-gray-600">{request.description}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
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
                    <p className="text-gray-500">Fecha de Creación</p>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  {request.provider_id && (
                    <div>
                      <p className="text-gray-500">Proveedor Asignado</p>
                      <p className="font-medium">ID: {request.provider_id}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
