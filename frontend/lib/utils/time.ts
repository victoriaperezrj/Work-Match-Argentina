/**
 * Format a date as relative time in Spanish
 * e.g., "hace 2 horas", "hace 3 días", "hace 1 semana"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return 'hace un momento';
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'hace 1 minuto' : `hace ${diffInMinutes} minutos`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
  }

  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? 'hace 1 semana' : `hace ${diffInWeeks} semanas`;
  }

  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'hace 1 mes' : `hace ${diffInMonths} meses`;
  }

  // More than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? 'hace 1 año' : `hace ${diffInYears} años`;
}

/**
 * Format a date for display with full date and time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date for display (short format)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
