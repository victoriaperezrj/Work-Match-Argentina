import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/service_request.dart';
import '../services/api_service.dart';

/// Repository pattern implementation for Service Requests
/// Handles data fetching, caching, and business logic
///
/// Best practices from Google, Meta, Netflix:
/// - Single source of truth
/// - Memory + disk caching
/// - Automatic cache invalidation
/// - Network-first strategy with fallback
class ServiceRequestRepository {
  final ApiService _apiService;
  static const String _cacheKeyMyRequests = 'cache_my_requests';
  static const String _cacheKeyPending = 'cache_pending_requests';
  static const Duration _cacheTimeout = Duration(minutes: 5);

  // In-memory cache for fast access
  List<ServiceRequest>? _memoryCache;
  DateTime? _lastCacheTime;

  ServiceRequestRepository(this._apiService);

  /// Creates a new service request
  /// Uses optimistic update pattern for better UX
  Future<ServiceRequest> createRequest({
    required String description,
    required String serviceType,
    required double lat,
    required double lon,
  }) async {
    try {
      final request = await _apiService.createRequest(
        description: description,
        serviceType: serviceType,
        lat: lat,
        lon: lon,
      );

      // Invalidate cache to force refresh
      await _invalidateCache();

      return request;
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Gets user's service requests
  /// Implements cache-first strategy with automatic refresh
  Future<List<ServiceRequest>> getMyRequests({bool forceRefresh = false}) async {
    // Check memory cache first
    if (!forceRefresh && _isMemoryCacheValid()) {
      return _memoryCache!;
    }

    try {
      final requests = await _apiService.getMyRequests();

      // Update memory cache
      _memoryCache = requests;
      _lastCacheTime = DateTime.now();

      // Update disk cache
      await _saveToDiskCache(_cacheKeyMyRequests, requests);

      return requests;
    } catch (e) {
      // Fallback to disk cache if network fails
      final cachedData = await _loadFromDiskCache(_cacheKeyMyRequests);
      if (cachedData != null) {
        return cachedData;
      }
      throw _handleError(e);
    }
  }

  /// Gets pending requests for provider
  /// Used by providers to see available jobs
  Future<List<ServiceRequest>> getPendingRequests({bool forceRefresh = false}) async {
    try {
      final requests = await _apiService.getPendingRequests();

      // Cache pending requests
      await _saveToDiskCache(_cacheKeyPending, requests);

      return requests;
    } catch (e) {
      // Fallback to cache
      final cachedData = await _loadFromDiskCache(_cacheKeyPending);
      if (cachedData != null) {
        return cachedData;
      }
      throw _handleError(e);
    }
  }

  /// Accepts a service request
  /// Returns updated request
  Future<ServiceRequest> acceptRequest(int requestId) async {
    try {
      final request = await _apiService.acceptRequest(requestId);
      await _invalidateCache();
      return request;
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Completes a service request
  Future<ServiceRequest> completeRequest(int requestId) async {
    try {
      final request = await _apiService.completeRequest(requestId);
      await _invalidateCache();
      return request;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Private helper methods

  bool _isMemoryCacheValid() {
    if (_memoryCache == null || _lastCacheTime == null) return false;
    return DateTime.now().difference(_lastCacheTime!) < _cacheTimeout;
  }

  Future<void> _saveToDiskCache(String key, List<ServiceRequest> data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = data.map((r) => r.toJson()).toList();
      await prefs.setString(key, jsonEncode(jsonList));
    } catch (e) {
      // Log error but don't fail
      print('Cache save error: $e');
    }
  }

  Future<List<ServiceRequest>?> _loadFromDiskCache(String key) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(key);
      if (jsonString == null) return null;

      final List<dynamic> jsonList = jsonDecode(jsonString);
      return jsonList.map((json) => ServiceRequest.fromJson(json)).toList();
    } catch (e) {
      print('Cache load error: $e');
      return null;
    }
  }

  Future<void> _invalidateCache() async {
    _memoryCache = null;
    _lastCacheTime = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cacheKeyMyRequests);
    await prefs.remove(_cacheKeyPending);
  }

  Exception _handleError(dynamic error) {
    if (error is Exception) return error;
    return Exception(error.toString());
  }

  /// Clears all caches
  /// Call on logout
  Future<void> clearCache() async {
    await _invalidateCache();
  }
}
