import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/service_request.dart';
import '../models/rating.dart';

/// Local Cache Service
/// Provides offline data persistence using SharedPreferences
/// Implements cache-first strategy with TTL
class LocalCacheService {
  static final LocalCacheService _instance = LocalCacheService._internal();
  factory LocalCacheService() => _instance;
  LocalCacheService._internal();

  SharedPreferences? _prefs;
  static const Duration _defaultTTL = Duration(hours: 1);

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('LocalCacheService not initialized. Call init() first.');
    }
    return _prefs!;
  }

  // Generic cache methods

  Future<void> setString(String key, String value, {Duration? ttl}) async {
    await prefs.setString(key, value);
    await _setExpiry(key, ttl ?? _defaultTTL);
  }

  String? getString(String key) {
    if (_isExpired(key)) {
      remove(key);
      return null;
    }
    return prefs.getString(key);
  }

  Future<void> setJson(String key, Map<String, dynamic> value, {Duration? ttl}) async {
    await setString(key, jsonEncode(value), ttl: ttl);
  }

  Map<String, dynamic>? getJson(String key) {
    final value = getString(key);
    if (value == null) return null;
    try {
      return jsonDecode(value) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> setList(String key, List<dynamic> value, {Duration? ttl}) async {
    await setString(key, jsonEncode(value), ttl: ttl);
  }

  List<dynamic>? getList(String key) {
    final value = getString(key);
    if (value == null) return null;
    try {
      return jsonDecode(value) as List<dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> remove(String key) async {
    await prefs.remove(key);
    await prefs.remove('${key}_expiry');
  }

  Future<void> clear() async {
    await prefs.clear();
  }

  // TTL management

  Future<void> _setExpiry(String key, Duration ttl) async {
    final expiryTime = DateTime.now().add(ttl).millisecondsSinceEpoch;
    await prefs.setInt('${key}_expiry', expiryTime);
  }

  bool _isExpired(String key) {
    final expiryTime = prefs.getInt('${key}_expiry');
    if (expiryTime == null) return false;
    return DateTime.now().millisecondsSinceEpoch > expiryTime;
  }

  // Domain-specific cache methods

  // Service Requests
  static const String _keyMyRequests = 'cache_my_requests';
  static const String _keyPendingRequests = 'cache_pending_requests';

  Future<void> cacheMyRequests(List<ServiceRequest> requests) async {
    final jsonList = requests.map((r) => _serviceRequestToJson(r)).toList();
    await setList(_keyMyRequests, jsonList, ttl: const Duration(minutes: 15));
  }

  List<ServiceRequest>? getCachedMyRequests() {
    final list = getList(_keyMyRequests);
    if (list == null) return null;
    try {
      return list.map((json) => ServiceRequest.fromJson(json)).toList();
    } catch (_) {
      return null;
    }
  }

  Future<void> cachePendingRequests(List<ServiceRequest> requests) async {
    final jsonList = requests.map((r) => _serviceRequestToJson(r)).toList();
    await setList(_keyPendingRequests, jsonList, ttl: const Duration(minutes: 5));
  }

  List<ServiceRequest>? getCachedPendingRequests() {
    final list = getList(_keyPendingRequests);
    if (list == null) return null;
    try {
      return list.map((json) => ServiceRequest.fromJson(json)).toList();
    } catch (_) {
      return null;
    }
  }

  // User Profile
  static const String _keyUserProfile = 'cache_user_profile';

  Future<void> cacheUserProfile(Map<String, dynamic> profile) async {
    await setJson(_keyUserProfile, profile, ttl: const Duration(hours: 1));
  }

  Map<String, dynamic>? getCachedUserProfile() {
    return getJson(_keyUserProfile);
  }

  // Rating Summary
  static const String _keyRatingSummary = 'cache_rating_summary';

  Future<void> cacheRatingSummary(int userId, RatingSummary summary) async {
    final key = '${_keyRatingSummary}_$userId';
    await setJson(key, {
      'average_score': summary.averageScore,
      'total_ratings': summary.totalRatings,
      'distribution': summary.distribution.map((k, v) => MapEntry(k.toString(), v)),
    }, ttl: const Duration(minutes: 30));
  }

  RatingSummary? getCachedRatingSummary(int userId) {
    final key = '${_keyRatingSummary}_$userId';
    final json = getJson(key);
    if (json == null) return null;
    try {
      return RatingSummary.fromJson(json);
    } catch (_) {
      return null;
    }
  }

  // Pending operations queue (for offline mode)
  static const String _keyPendingOperations = 'pending_operations';

  Future<void> addPendingOperation(Map<String, dynamic> operation) async {
    final list = getList(_keyPendingOperations) ?? [];
    list.add({
      ...operation,
      'timestamp': DateTime.now().toIso8601String(),
    });
    await prefs.setString(_keyPendingOperations, jsonEncode(list));
  }

  List<Map<String, dynamic>> getPendingOperations() {
    final list = getList(_keyPendingOperations);
    if (list == null) return [];
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> clearPendingOperations() async {
    await remove(_keyPendingOperations);
  }

  Future<void> removePendingOperation(int index) async {
    final list = getPendingOperations();
    if (index >= 0 && index < list.length) {
      list.removeAt(index);
      await prefs.setString(_keyPendingOperations, jsonEncode(list));
    }
  }

  // Helper to convert ServiceRequest to JSON
  Map<String, dynamic> _serviceRequestToJson(ServiceRequest request) {
    return {
      'id': request.id,
      'demandante_id': request.demandanteId,
      'provider_id': request.providerId,
      'description': request.description,
      'service_type': request.serviceType,
      'lat': request.lat,
      'lon': request.lon,
      'status': request.status,
      'price_quoted': request.priceQuoted,
      'created_at': request.createdAt.toIso8601String(),
      'updated_at': request.updatedAt.toIso8601String(),
    };
  }

  // Check if we have cached data available
  bool hasCachedData() {
    return getCachedMyRequests() != null || getCachedPendingRequests() != null;
  }

  // Get cache stats
  Map<String, dynamic> getCacheStats() {
    return {
      'has_my_requests': getCachedMyRequests() != null,
      'has_pending_requests': getCachedPendingRequests() != null,
      'has_user_profile': getCachedUserProfile() != null,
      'pending_operations_count': getPendingOperations().length,
    };
  }
}
