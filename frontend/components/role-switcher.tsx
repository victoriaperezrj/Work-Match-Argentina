'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/lib/stores';

export function RoleSwitcher() {
  const router = useRouter();
  const { user, activeRole, setActiveRole } = useAuthStore();

  // Only show if user has dual roles
  if (!user || !(user.is_demandante && user.is_proveedor)) {
    return null;
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    if (newRole !== activeRole) {
      setActiveRole(newRole);
      router.push(`/${newRole}`);
    }
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800/50">
      <button
        onClick={() => handleRoleSwitch('demandante')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
          activeRole === 'demandante'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-cyan-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Demandante
      </button>
      <button
        onClick={() => handleRoleSwitch('proveedor')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
          activeRole === 'proveedor'
            ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Proveedor
      </button>
    </div>
  );
}
