'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Mock data for testing
const mockPendingRequests: ServiceRequest[] = [
  {
    id: 5,
    demandante_id: 1,
    description: 'Arreglo urgente de cañería rota en cocina, hay pérdida de agua',
    service_type: 'Plomería',
    lat: -34.6091,
    lon: -58.3820,
    status: 'Pendiente',
    price_quoted: 7500,
    created_at: '2024-01-16T14:00:00Z',
  },
  {
    id: 6,
    demandante_id: 2,
    description: 'Cambio de tablero eléctrico completo, casa antigua',
    service_type: 'Electricidad',
    lat: -34.5995,
    lon: -58.3750,
    status: 'Pendiente',
    price_quoted: 25000,
    created_at: '2024-01-16T11:30:00Z',
  },
  {
    id: 7,
    demandante_id: 3,
    description: 'Instalación de termo tanque solar 150 litros',
    service_type: 'Plomería',
    lat: -34.6120,
    lon: -58.4100,
    status: 'Pendiente',
    price_quoted: 18000,
    created_at: '2024-01-15T16:45:00Z',
  },
  {
    id: 8,
    demandante_id: 4,
    description: 'Pintura exterior de fachada, 2 pisos, 120m2 aprox',
    service_type: 'Pintura',
    lat: -34.5850,
    lon: -58.4200,
    status: 'Pendiente',
    price_quoted: 45000,
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 9,
    demandante_id: 5,
    description: 'Mantenimiento mensual de jardín 200m2',
    service_type: 'Jardinería',
    lat: -34.6200,
    lon: -58.3650,
    status: 'Pendiente',
    price_quoted: 12000,
    created_at: '2024-01-14T13:20:00Z',
  },
];

export default function ProveedorDashboard() {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<ServiceRequest[]>(mockPendingRequests);
  const [acceptedJobs, setAcceptedJobs] = useState<number[]>([]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleAcceptRequest = (requestId: number) => {
    // Simulate accepting a request
    setAcceptedJobs([...acceptedJobs, requestId]);
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    alert('¡Trabajo aceptado exitosamente! El demandante será notificado.');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WorkMatch - Proveedor</h1>
          <div className="flex items-center gap-4">
            <Link href="/proveedor/profile" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Configurar Perfil
            </Link>
            <span className="text-sm text-gray-600">carlos@proveedor.com</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Trabajos Disponibles</h2>
          <div className="text-sm text-gray-600">
            {pendingRequests.length} trabajos cerca de tu ubicación
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{pendingRequests.length}</p>
            <p className="text-sm text-gray-600">Disponibles</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{acceptedJobs.length}</p>
            <p className="text-sm text-gray-600">Aceptados Hoy</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">15 km</p>
            <p className="text-sm text-gray-600">Tu Radio</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">
              No hay trabajos pendientes que coincidan con tu perfil
            </p>
            <Link href="/proveedor/profile" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 inline-block">
              Configurar mi perfil
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{request.service_type}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-gray-600">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Ubicación</p>
                    <p className="font-medium">
                      {request.lat.toFixed(4)}, {request.lon.toFixed(4)}
                    </p>
                  </div>
                  {request.price_quoted && (
                    <div>
                      <p className="text-gray-500">Precio Estimado</p>
                      <p className="font-medium text-green-600">
                        ${request.price_quoted.toLocaleString('es-AR')} ARS
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Publicado</p>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Distancia</p>
                    <p className="font-medium">{(Math.random() * 10 + 1).toFixed(1)} km</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full font-medium"
                >
                  Aceptar Trabajo
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
