import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/provider_profile.dart';
import '../services/api_service.dart';

/// Repository for Provider Profile management
/// Implements caching and error handling
class ProfileRepository {
  final ApiService _apiService;
  static const String _cacheKeyProfile = 'cache_provider_profile';

  ProviderProfile? _memoryCache;

  ProfileRepository(this._apiService);

  /// Gets provider profile
  /// Returns cached data if available
  Future<ProviderProfile?> getProviderProfile({bool forceRefresh = false}) async {
    // Check memory cache
    if (!forceRefresh && _memoryCache != null) {
      return _memoryCache;
    }

    try {
      final profileData = await _apiService.getProfile();

      // Extract provider profile if exists
      if (profileData['profile'] != null) {
        final profile = ProviderProfile.fromJson(profileData['profile']);
        _memoryCache = profile;
        await _saveToDiskCache(profile);
        return profile;
      }

      return null;
    } catch (e) {
      // Fallback to cache
      final cachedProfile = await _loadFromDiskCache();
      if (cachedProfile != null) {
        return cachedProfile;
      }
      throw _handleError(e);
    }
  }

  /// Updates provider profile
  /// Invalidates cache after successful update
  Future<ProviderProfile> updateProviderProfile({
    required List<String> services,
    required int radiusKm,
    required double lat,
    required double lon,
  }) async {
    try {
      final profile = await _apiService.updateProviderProfile(
        services: services,
        radiusKm: radiusKm,
        lat: lat,
        lon: lon,
      );

      // Update caches
      _memoryCache = profile;
      await _saveToDiskCache(profile);

      return profile;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Private helpers

  Future<void> _saveToDiskCache(ProviderProfile profile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_cacheKeyProfile, jsonEncode(profile.toJson()));
    } catch (e) {
      print('Profile cache save error: $e');
    }
  }

  Future<ProviderProfile?> _loadFromDiskCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_cacheKeyProfile);
      if (jsonString == null) return null;

      return ProviderProfile.fromJson(jsonDecode(jsonString));
    } catch (e) {
      print('Profile cache load error: $e');
      return null;
    }
  }

  Exception _handleError(dynamic error) {
    if (error is Exception) return error;
    return Exception(error.toString());
  }

  Future<void> clearCache() async {
    _memoryCache = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cacheKeyProfile);
  }
}
