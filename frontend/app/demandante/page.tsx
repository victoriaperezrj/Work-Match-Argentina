'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocationDisplayName } from '@/lib/constants/locations';

interface ServiceRequest {
  id: number;
  description: string;
  service_type: string;
  location_id: string;
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
    location_id: 'san-luis-capital',
    status: 'Pendiente',
    price_quoted: 4500,
    created_at: '2024-01-15T10:30:00Z',
    provider_id: null,
  },
  {
    id: 2,
    description: 'Instalación de 3 tomas corriente nuevas en living',
    service_type: 'Electricidad',
    location_id: 'villa-mercedes',
    status: 'Asignado',
    price_quoted: 8200,
    created_at: '2024-01-14T15:00:00Z',
    provider_id: 5,
  },
  {
    id: 3,
    description: 'Pintar habitación de 4x4 metros, incluye techo',
    service_type: 'Pintura',
    location_id: 'merlo',
    status: 'Completado',
    price_quoted: 15000,
    created_at: '2024-01-10T09:00:00Z',
    provider_id: 3,
  },
  {
    id: 4,
    description: 'Cortar césped y podar arbustos del jardín frontal',
    service_type: 'Jardinería',
    location_id: 'la-punta',
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
    const styles: Record<string, string> = {
      Pendiente: 'badge-pending',
      Asignado: 'badge-assigned',
      Completado: 'badge-completed',
      Cancelado: 'badge-cancelled',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300'}`}>
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
    <div className="min-h-screen">
      {/* Premium Navigation */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-adaptive-primary">WorkMatch</h1>
              <p className="text-xs text-blue-600 dark:text-cyan-400">Demandante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-adaptive-muted">juan@demandante.com</span>
            <button
              onClick={handleLogout}
              className="btn-ghost text-sm px-4 py-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slideUp">
          <div>
            <h2 className="text-3xl font-bold text-adaptive-primary mb-2">Mis Solicitudes</h2>
            <p className="text-adaptive-secondary">Gestiona tus solicitudes de servicio</p>
          </div>
          <Link href="/demandante/new-request" className="btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Nueva Solicitud
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'glass text-adaptive-secondary hover:text-blue-600 dark:hover:text-cyan-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="glass p-12 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <p className="text-adaptive-secondary mb-6">No tienes solicitudes en esta categoría</p>
            <Link href="/demandante/new-request" className="btn-primary inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              Crear tu primera solicitud
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="glass glass-hover p-6 animate-slideUp"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-adaptive-primary">{request.service_type}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-adaptive-secondary">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-adaptive-muted text-xs mb-1">Ubicación</p>
                    <p className="font-medium text-adaptive-secondary">
                      {getLocationDisplayName(request.location_id)}
                    </p>
                  </div>
                  {request.price_quoted && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-adaptive-muted text-xs mb-1">Precio Estimado</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">
                        ${request.price_quoted.toLocaleString('es-AR')} ARS
                      </p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-adaptive-muted text-xs mb-1">Fecha</p>
                    <p className="font-medium text-adaptive-secondary">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  {request.provider_id && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-adaptive-muted text-xs mb-1">Proveedor</p>
                      <p className="font-medium text-blue-600 dark:text-cyan-400">ID: {request.provider_id}</p>
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
