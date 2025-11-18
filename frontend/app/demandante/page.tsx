'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Mock data for testing
const mockRequests: ServiceRequest[] = [
  {
    id: 1,
    description: 'Necesito reparar una canilla que gotea en el baño principal',
    service_type: 'Plomería',
    lat: -34.6037,
    lon: -58.3816,
    status: 'Pendiente',
    price_quoted: 4500,
    created_at: '2024-01-15T10:30:00Z',
    provider_id: null,
  },
  {
    id: 2,
    description: 'Instalación de 3 tomas corriente nuevas en living',
    service_type: 'Electricidad',
    lat: -34.6158,
    lon: -58.4333,
    status: 'Asignado',
    price_quoted: 8200,
    created_at: '2024-01-14T15:00:00Z',
    provider_id: 5,
  },
  {
    id: 3,
    description: 'Pintar habitación de 4x4 metros, incluye techo',
    service_type: 'Pintura',
    lat: -34.5875,
    lon: -58.3972,
    status: 'Completado',
    price_quoted: 15000,
    created_at: '2024-01-10T09:00:00Z',
    provider_id: 3,
  },
  {
    id: 4,
    description: 'Cortar césped y podar arbustos del jardín frontal',
    service_type: 'Jardinería',
    lat: -34.6083,
    lon: -58.3712,
    status: 'Pendiente',
    price_quoted: 6000,
    created_at: '2024-01-16T08:00:00Z',
    provider_id: null,
  },
];

export default function DemandanteDashboard() {
  const router = useRouter();
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>(mockRequests);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'assigned' | 'completed'>('all');

  const handleLogout = () => {
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

  const filteredRequests = myRequests.filter((request) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === 'Pendiente';
    if (activeTab === 'assigned') return request.status === 'Asignado';
    if (activeTab === 'completed') return request.status === 'Completado';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Todas', count: myRequests.length },
    { id: 'pending', label: 'Pendientes', count: myRequests.filter(r => r.status === 'Pendiente').length },
    { id: 'assigned', label: 'Asignadas', count: myRequests.filter(r => r.status === 'Asignado').length },
    { id: 'completed', label: 'Completadas', count: myRequests.filter(r => r.status === 'Completado').length },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WorkMatch - Demandante</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">juan@demandante.com</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Mis Solicitudes</h2>
          <Link href="/demandante/new-request" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            + Nueva Solicitud
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No tienes solicitudes en esta categoría</p>
            <Link href="/demandante/new-request" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
              Crear tu primera solicitud
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{request.service_type}</h3>
                    <p className="text-gray-600">{request.description}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                    <p className="text-gray-500">Fecha</p>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  {request.provider_id && (
                    <div>
                      <p className="text-gray-500">Proveedor</p>
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
