import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../models/provider_profile.dart';
import '../models/service_request.dart';

class ApiService {
  // Cambia esto a tu backend en producción
  static const String baseUrl = 'http://10.0.2.2:8080'; // Android emulator
  // static const String baseUrl = 'http://localhost:8080'; // iOS simulator
  // static const String baseUrl = 'https://your-api.com'; // Production

  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  // Auth endpoints
  Future<AuthResponse> register(String email, String password, String role) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'role': role,
      }),
    );

    if (response.statusCode == 201) {
      final authResponse = AuthResponse.fromJson(jsonDecode(response.body));
      setToken(authResponse.token);
      return authResponse;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al registrarse');
    }
  }

  Future<AuthResponse> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final authResponse = AuthResponse.fromJson(jsonDecode(response.body));
      setToken(authResponse.token);
      return authResponse;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Credenciales inválidas');
    }
  }

  // Profile endpoints
  Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/profile/me'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al obtener perfil');
    }
  }

  Future<ProviderProfile> updateProviderProfile({
    required List<String> services,
    required int radiusKm,
    required double lat,
    required double lon,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/api/v1/profile/provider'),
      headers: _headers,
      body: jsonEncode({
        'services': services,
        'radius_km': radiusKm,
        'lat': lat,
        'lon': lon,
      }),
    );

    if (response.statusCode == 200) {
      return ProviderProfile.fromJson(jsonDecode(response.body));
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al actualizar perfil');
    }
  }

  // Service Request endpoints
  Future<ServiceRequest> createRequest({
    required String description,
    required String serviceType,
    required double lat,
    required double lon,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/requests/create'),
      headers: _headers,
      body: jsonEncode({
        'description': description,
        'service_type': serviceType,
        'lat': lat,
        'lon': lon,
      }),
    );

    if (response.statusCode == 201) {
      return ServiceRequest.fromJson(jsonDecode(response.body));
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al crear solicitud');
    }
  }

  Future<List<ServiceRequest>> getPendingRequests() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/requests/pending'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => ServiceRequest.fromJson(json)).toList();
    } else {
      throw Exception('Error al obtener solicitudes pendientes');
    }
  }

  Future<List<ServiceRequest>> getMyRequests() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/requests/my-requests'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => ServiceRequest.fromJson(json)).toList();
    } else {
      throw Exception('Error al obtener mis solicitudes');
    }
  }

  Future<ServiceRequest> acceptRequest(int requestId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/requests/$requestId/accept'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return ServiceRequest.fromJson(jsonDecode(response.body));
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al aceptar solicitud');
    }
  }

  Future<ServiceRequest> completeRequest(int requestId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/requests/$requestId/complete'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return ServiceRequest.fromJson(jsonDecode(response.body));
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al completar solicitud');
    }
  }
}
