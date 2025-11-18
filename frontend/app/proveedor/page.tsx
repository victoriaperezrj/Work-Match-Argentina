'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocationDisplayName } from '@/lib/constants/locations';

interface ServiceRequest {
  id: number;
  demandante_id: number;
  description: string;
  service_type: string;
  location_id: string;
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
    location_id: 'san-luis-capital',
    status: 'Pendiente',
    price_quoted: 7500,
    created_at: '2024-01-16T14:00:00Z',
  },
  {
    id: 6,
    demandante_id: 2,
    description: 'Cambio de tablero eléctrico completo, casa antigua',
    service_type: 'Electricidad',
    location_id: 'juana-koslay',
    status: 'Pendiente',
    price_quoted: 25000,
    created_at: '2024-01-16T11:30:00Z',
  },
  {
    id: 7,
    demandante_id: 3,
    description: 'Instalación de termo tanque solar 150 litros',
    service_type: 'Plomería',
    location_id: 'potrero-funes',
    status: 'Pendiente',
    price_quoted: 18000,
    created_at: '2024-01-15T16:45:00Z',
  },
  {
    id: 8,
    demandante_id: 4,
    description: 'Pintura exterior de fachada, 2 pisos, 120m2 aprox',
    service_type: 'Pintura',
    location_id: 'la-punta',
    status: 'Pendiente',
    price_quoted: 45000,
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 9,
    demandante_id: 5,
    description: 'Mantenimiento mensual de jardín 200m2',
    service_type: 'Jardinería',
    location_id: 'villa-mercedes',
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
    setAcceptedJobs([...acceptedJobs, requestId]);
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
  };

  const stats = [
    {
      label: 'Disponibles',
      value: pendingRequests.length,
      color: 'from-blue-600 to-cyan-500',
      textColor: 'text-blue-600 dark:text-cyan-400',
    },
    {
      label: 'Aceptados Hoy',
      value: acceptedJobs.length,
      color: 'from-emerald-600 to-green-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Tu Radio',
      value: '15 km',
      color: 'from-amber-600 to-yellow-500',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Premium Navigation */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-adaptive-primary">WorkMatch</h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Proveedor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/proveedor/profile" className="btn-ghost text-sm px-4 py-2">
              Configurar Perfil
            </Link>
            <span className="text-sm text-adaptive-muted">carlos@proveedor.com</span>
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
            <h2 className="text-3xl font-bold text-adaptive-primary mb-2">Trabajos Disponibles</h2>
            <p className="text-adaptive-secondary">{pendingRequests.length} trabajos cerca de tu ubicación</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass p-6 text-center animate-slideUp"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 shadow-lg`}>
                {index === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                )}
                {index === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                )}
                {index === 2 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                )}
              </div>
              <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
              <p className="text-sm text-adaptive-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="glass p-12 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <p className="text-adaptive-secondary mb-6">
              No hay trabajos pendientes que coincidan con tu perfil
            </p>
            <Link href="/proveedor/profile" className="btn-secondary inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Configurar mi perfil
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request, index) => (
              <div
                key={request.id}
                className="glass glass-hover p-6 animate-slideUp"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-adaptive-primary">{request.service_type}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium badge-pending">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-adaptive-secondary">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
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
                    <p className="text-adaptive-muted text-xs mb-1">Publicado</p>
                    <p className="font-medium text-adaptive-secondary">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-adaptive-muted text-xs mb-1">Distancia</p>
                    <p className="font-medium text-blue-600 dark:text-cyan-400">{(Math.random() * 10 + 1).toFixed(1)} km</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
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
