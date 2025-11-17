import '../models/user.dart';
import '../models/service_request.dart';
import '../models/provider_profile.dart';

/// Mock Data for Development & Testing
/// Allows testing UI without backend
///
/// Used by: Google for local development, Meta for E2E tests
class MockData {
  // Environment flag
  static const bool isDevelopmentMode = true; // Set to false for production

  // Mock Users
  static final User mockDemandante = User(
    id: 1,
    email: 'juan@demandante.com',
    role: 'Demandante',
    isVerified: true,
    createdAt: DateTime.now().subtract(const Duration(days: 30)),
  );

  static final User mockProveedor = User(
    id: 2,
    email: 'maria@proveedor.com',
    role: 'Proveedor',
    isVerified: true,
    createdAt: DateTime.now().subtract(const Duration(days: 60)),
  );

  // Mock Provider Profile
  static final ProviderProfile mockProviderProfile = ProviderProfile(
    id: 1,
    userId: 2,
    services: ['Plomeria', 'Electricidad', 'Carpinteria'],
    radiusKm: 15,
    lat: -34.603722,
    lon: -58.381592,
    rating: 4.8,
    createdAt: DateTime.now().subtract(const Duration(days: 60)),
    updatedAt: DateTime.now().subtract(const Duration(days: 1)),
  );

  // Mock Service Requests - Demandante's requests
  static final List<ServiceRequest> mockDemandanteRequests = [
    ServiceRequest(
      id: 1,
      demandanteId: 1,
      providerId: null,
      description: 'Tengo una fuga de agua en la cocina que necesita reparación urgente. El grifo está goteando constantemente.',
      serviceType: 'Plomeria',
      lat: -34.603722,
      lon: -58.381592,
      status: 'Pendiente',
      priceQuoted: 5200.0,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    ServiceRequest(
      id: 2,
      demandanteId: 1,
      providerId: 5,
      description: 'Necesito instalación de una nueva lámpara en el living y arreglar un tomacorriente que no funciona.',
      serviceType: 'Electricidad',
      lat: -34.603722,
      lon: -58.381592,
      status: 'Asignado',
      priceQuoted: 6800.0,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 5)),
    ),
    ServiceRequest(
      id: 3,
      demandanteId: 1,
      providerId: 3,
      description: 'Pintura completa de 2 habitaciones y pasillo. Aproximadamente 40m2.',
      serviceType: 'Pintura',
      lat: -34.603722,
      lon: -58.381592,
      status: 'Completado',
      priceQuoted: 15500.0,
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
      updatedAt: DateTime.now().subtract(const Duration(days: 10)),
    ),
    ServiceRequest(
      id: 4,
      demandanteId: 1,
      providerId: null,
      description: 'Corte de césped y limpieza de jardín trasero. Aproximadamente 50m2.',
      serviceType: 'Jardineria',
      lat: -34.603722,
      lon: -58.381592,
      status: 'Pendiente',
      priceQuoted: 4200.0,
      createdAt: DateTime.now().subtract(const Duration(hours: 6)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 6)),
    ),
  ];

  // Mock Pending Requests for Provider
  static final List<ServiceRequest> mockPendingRequests = [
    ServiceRequest(
      id: 5,
      demandanteId: 10,
      providerId: null,
      description: 'Reparación de canilla que pierde agua en el baño principal.',
      serviceType: 'Plomeria',
      lat: -34.610000,
      lon: -58.385000,
      status: 'Pendiente',
      priceQuoted: 4800.0,
      createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
      updatedAt: DateTime.now().subtract(const Duration(minutes: 30)),
    ),
    ServiceRequest(
      id: 6,
      demandanteId: 11,
      providerId: null,
      description: 'Instalación de ventilador de techo en dormitorio.',
      serviceType: 'Electricidad',
      lat: -34.608000,
      lon: -58.380000,
      status: 'Pendiente',
      priceQuoted: 5500.0,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
    ServiceRequest(
      id: 7,
      demandanteId: 12,
      providerId: null,
      description: 'Construcción de estantería de madera empotrada en living.',
      serviceType: 'Carpinteria',
      lat: -34.605000,
      lon: -58.383000,
      status: 'Pendiente',
      priceQuoted: 12000.0,
      createdAt: DateTime.now().subtract(const Duration(hours: 3)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 3)),
    ),
    ServiceRequest(
      id: 8,
      demandanteId: 13,
      providerId: null,
      description: 'Reparación de cerradura de puerta principal que no cierra bien.',
      serviceType: 'Herreria',
      lat: -34.612000,
      lon: -58.379000,
      status: 'Pendiente',
      priceQuoted: 6200.0,
      createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 5)),
    ),
    ServiceRequest(
      id: 9,
      demandanteId: 14,
      providerId: null,
      description: 'Arreglo de inodoro que no descarga correctamente.',
      serviceType: 'Plomeria',
      lat: -34.607000,
      lon: -58.384000,
      status: 'Pendiente',
      priceQuoted: 5100.0,
      createdAt: DateTime.now().subtract(const Duration(minutes: 45)),
      updatedAt: DateTime.now().subtract(const Duration(minutes: 45)),
    ),
  ];

  // Mock token
  static const String mockToken = 'mock_jwt_token_for_development_only';

  // Helper to get filtered pending requests for provider
  static List<ServiceRequest> getPendingRequestsForProvider(ProviderProfile profile) {
    // Filter by services offered and radius
    return mockPendingRequests.where((request) {
      // Check if service type matches
      if (!profile.services.contains(request.serviceType)) {
        return false;
      }

      // Check if within radius (simplified calculation)
      final distance = _calculateDistance(
        profile.lat,
        profile.lon,
        request.lat,
        request.lon,
      );

      return distance <= profile.radiusKm;
    }).toList();
  }

  // Simple distance calculation
  static double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    // Simplified for mock data - just return a small number
    return 5.0; // Always within 5km for testing
  }
}
