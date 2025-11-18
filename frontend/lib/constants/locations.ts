// San Luis Province Locations
// Will be expanded to other provinces later

export interface Location {
  id: string;
  name: string;
  department: string;
  province: string;
}

export const SAN_LUIS_LOCATIONS: Location[] = [
  // Departamento La Capital
  { id: 'san-luis-capital', name: 'San Luis (Capital)', department: 'La Capital', province: 'San Luis' },
  { id: 'juana-koslay', name: 'Juana Koslay', department: 'La Capital', province: 'San Luis' },
  { id: 'potrero-funes', name: 'Potrero de los Funes', department: 'La Capital', province: 'San Luis' },
  { id: 'el-volcan', name: 'El Volcán', department: 'La Capital', province: 'San Luis' },
  { id: 'la-punta', name: 'La Punta', department: 'La Capital', province: 'San Luis' },
  { id: 'estancia-grande', name: 'Estancia Grande', department: 'La Capital', province: 'San Luis' },

  // Departamento General Pedernera
  { id: 'villa-mercedes', name: 'Villa Mercedes', department: 'General Pedernera', province: 'San Luis' },
  { id: 'justo-daract', name: 'Justo Daract', department: 'General Pedernera', province: 'San Luis' },
  { id: 'la-pedrera', name: 'La Pedrera', department: 'General Pedernera', province: 'San Luis' },

  // Departamento Junín
  { id: 'merlo', name: 'Merlo', department: 'Junín', province: 'San Luis' },
  { id: 'santa-rosa-conlara', name: 'Santa Rosa del Conlara', department: 'Junín', province: 'San Luis' },
  { id: 'carpinteria', name: 'Carpintería', department: 'Junín', province: 'San Luis' },
  { id: 'los-molles', name: 'Los Molles', department: 'Junín', province: 'San Luis' },
  { id: 'cortaderas', name: 'Cortaderas', department: 'Junín', province: 'San Luis' },

  // Departamento Chacabuco
  { id: 'concarán', name: 'Concarán', department: 'Chacabuco', province: 'San Luis' },
  { id: 'tilisarao', name: 'Tilisarao', department: 'Chacabuco', province: 'San Luis' },
  { id: 'naschel', name: 'Naschel', department: 'Chacabuco', province: 'San Luis' },

  // Departamento Coronel Pringles
  { id: 'la-toma', name: 'La Toma', department: 'Coronel Pringles', province: 'San Luis' },
  { id: 'fraga', name: 'Fraga', department: 'Coronel Pringles', province: 'San Luis' },

  // Departamento Ayacucho
  { id: 'quines', name: 'Quines', department: 'Ayacucho', province: 'San Luis' },
  { id: 'candelaria', name: 'Candelaria', department: 'Ayacucho', province: 'San Luis' },
  { id: 'lujan', name: 'Luján', department: 'Ayacucho', province: 'San Luis' },

  // Departamento Belgrano
  { id: 'villa-general-roca', name: 'Villa General Roca', department: 'Belgrano', province: 'San Luis' },

  // Departamento Gobernador Dupuy
  { id: 'buena-esperanza', name: 'Buena Esperanza', department: 'Gobernador Dupuy', province: 'San Luis' },
  { id: 'union', name: 'Unión', department: 'Gobernador Dupuy', province: 'San Luis' },
  { id: 'fortuna', name: 'Fortuna', department: 'Gobernador Dupuy', province: 'San Luis' },
  { id: 'nueva-galia', name: 'Nueva Galia', department: 'Gobernador Dupuy', province: 'San Luis' },
  { id: 'arizona', name: 'Arizona', department: 'Gobernador Dupuy', province: 'San Luis' },

  // Departamento Libertador General San Martín
  { id: 'san-martin', name: 'San Martín', department: 'Libertador General San Martín', province: 'San Luis' },
  { id: 'villa-praga', name: 'Villa Praga', department: 'Libertador General San Martín', province: 'San Luis' },

  // Departamento San Martín (otro)
  { id: 'san-francisco', name: 'San Francisco del Monte de Oro', department: 'San Martín', province: 'San Luis' },
];

// Group locations by department for better UX
export const LOCATIONS_BY_DEPARTMENT = SAN_LUIS_LOCATIONS.reduce((acc, location) => {
  if (!acc[location.department]) {
    acc[location.department] = [];
  }
  acc[location.department].push(location);
  return acc;
}, {} as Record<string, Location[]>);

// Get all unique departments
export const DEPARTMENTS = [...new Set(SAN_LUIS_LOCATIONS.map(l => l.department))].sort();

// Helper to get location by ID
export function getLocationById(id: string): Location | undefined {
  return SAN_LUIS_LOCATIONS.find(l => l.id === id);
}

// Helper to get location display name
export function getLocationDisplayName(id: string): string {
  const location = getLocationById(id);
  return location ? `${location.name}, ${location.department}` : id;
}
