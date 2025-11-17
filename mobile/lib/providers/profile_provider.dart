import 'package:flutter/foundation.dart';
import '../models/provider_profile.dart';
import '../repositories/profile_repository.dart';
import '../services/api_service.dart';

/// State management for Provider Profile
/// Enterprise-grade state management pattern
class ProfileProvider with ChangeNotifier {
  final ProfileRepository _repository;

  // State
  ProviderProfile? _profile;
  bool _isLoading = false;
  bool _isUpdating = false;
  String? _error;

  // Getters
  ProviderProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  bool get isUpdating => _isUpdating;
  String? get error => _error;
  bool get hasError => _error != null;
  bool get hasProfile => _profile != null;

  ProfileProvider(ApiService apiService)
      : _repository = ProfileRepository(apiService);

  /// Loads provider profile
  Future<void> loadProfile({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      _profile = await _repository.getProviderProfile(forceRefresh: forceRefresh);
      _error = null;
    } catch (e) {
      _error = _getErrorMessage(e);
      debugPrint('Error loading profile: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Updates provider profile
  /// Returns true if successful
  Future<bool> updateProfile({
    required List<String> services,
    required int radiusKm,
    required double lat,
    required double lon,
  }) async {
    _isUpdating = true;
    _error = null;
    notifyListeners();

    try {
      _profile = await _repository.updateProviderProfile(
        services: services,
        radiusKm: radiusKm,
        lat: lat,
        lon: lon,
      );

      _error = null;
      _isUpdating = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      _isUpdating = false;
      notifyListeners();
      debugPrint('Error updating profile: $e');
      return false;
    }
  }

  /// Checks if profile is complete
  /// Used to determine if provider needs to complete setup
  bool get isProfileComplete {
    if (_profile == null) return false;
    return _profile!.services.isNotEmpty &&
        _profile!.lat != 0 &&
        _profile!.lon != 0;
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<void> clear() async {
    _profile = null;
    _isLoading = false;
    _isUpdating = false;
    _error = null;
    await _repository.clearCache();
    notifyListeners();
  }

  String _getErrorMessage(dynamic error) {
    final errorString = error.toString();

    if (errorString.contains('SocketException') ||
        errorString.contains('Failed host lookup')) {
      return 'Sin conexión a Internet. Verifica tu red.';
    }

    if (errorString.contains('TimeoutException')) {
      return 'La solicitud tardó demasiado. Intenta de nuevo.';
    }

    if (errorString.contains('401') || errorString.contains('Unauthorized')) {
      return 'Sesión expirada. Por favor inicia sesión nuevamente.';
    }

    if (errorString.startsWith('Exception: ')) {
      return errorString.substring(11);
    }

    return 'Ocurrió un error. Por favor intenta de nuevo.';
  }
}
