import 'dart:async';
import 'package:flutter/foundation.dart';
import 'connectivity_service.dart';
import 'local_cache_service.dart';
import 'api_service.dart';

/// Sync Service
/// Handles data synchronization between local cache and server
/// Processes pending operations when connection is restored
class SyncService with ChangeNotifier {
  final ApiService _apiService;
  final LocalCacheService _cacheService;
  final ConnectivityService _connectivity;

  bool _isSyncing = false;
  DateTime? _lastSyncTime;
  String? _lastSyncError;
  int _pendingCount = 0;

  bool get isSyncing => _isSyncing;
  DateTime? get lastSyncTime => _lastSyncTime;
  String? get lastSyncError => _lastSyncError;
  int get pendingCount => _pendingCount;
  bool get hasPendingOperations => _pendingCount > 0;

  SyncService(this._apiService, this._cacheService, this._connectivity) {
    // Listen for connectivity changes
    _connectivity.addListener(_onConnectivityChanged);
    _updatePendingCount();
  }

  void _onConnectivityChanged() {
    if (_connectivity.isConnected && hasPendingOperations) {
      // Auto-sync when connection is restored
      syncPendingOperations();
    }
  }

  void _updatePendingCount() {
    _pendingCount = _cacheService.getPendingOperations().length;
    notifyListeners();
  }

  /// Queue an operation for later sync
  Future<void> queueOperation({
    required String type,
    required Map<String, dynamic> data,
  }) async {
    await _cacheService.addPendingOperation({
      'type': type,
      'data': data,
    });
    _updatePendingCount();
    debugPrint('Operation queued: $type');
  }

  /// Sync all pending operations
  Future<bool> syncPendingOperations() async {
    if (_isSyncing) return false;
    if (!_connectivity.isConnected) return false;

    final operations = _cacheService.getPendingOperations();
    if (operations.isEmpty) return true;

    _isSyncing = true;
    _lastSyncError = null;
    notifyListeners();

    debugPrint('Syncing ${operations.length} pending operations...');

    int successCount = 0;
    int errorCount = 0;

    for (int i = 0; i < operations.length; i++) {
      final operation = operations[i];
      final type = operation['type'] as String;
      final data = operation['data'] as Map<String, dynamic>;

      try {
        final success = await _processOperation(type, data);
        if (success) {
          await _cacheService.removePendingOperation(i - successCount);
          successCount++;
        } else {
          errorCount++;
        }
      } catch (e) {
        debugPrint('Sync error for operation $type: $e');
        errorCount++;
      }
    }

    _isSyncing = false;
    _lastSyncTime = DateTime.now();
    _updatePendingCount();

    if (errorCount > 0) {
      _lastSyncError = '$errorCount operaciones fallaron';
    }

    debugPrint('Sync completed: $successCount success, $errorCount errors');
    notifyListeners();

    return errorCount == 0;
  }

  /// Process a single operation
  Future<bool> _processOperation(String type, Map<String, dynamic> data) async {
    switch (type) {
      case 'create_request':
        await _apiService.createRequest(
          description: data['description'],
          serviceType: data['service_type'],
          lat: data['lat'],
          lon: data['lon'],
        );
        return true;

      case 'accept_request':
        await _apiService.acceptRequest(data['request_id']);
        return true;

      case 'complete_request':
        await _apiService.completeRequest(data['request_id']);
        return true;

      case 'submit_rating':
        await _apiService.submitRating(
          requestId: data['request_id'],
          score: data['score'],
          comment: data['comment'],
        );
        return true;

      case 'update_profile':
        await _apiService.updateProviderProfile(
          services: List<String>.from(data['services']),
          radiusKm: data['radius_km'],
          lat: data['lat'],
          lon: data['lon'],
        );
        return true;

      default:
        debugPrint('Unknown operation type: $type');
        return false;
    }
  }

  /// Clear all pending operations
  Future<void> clearPendingOperations() async {
    await _cacheService.clearPendingOperations();
    _updatePendingCount();
  }

  /// Force a full data refresh
  Future<void> forceFullSync() async {
    if (!_connectivity.isConnected) return;

    _isSyncing = true;
    notifyListeners();

    try {
      // Sync pending operations first
      await syncPendingOperations();

      // Then refresh all cached data
      final myRequests = await _apiService.getMyRequests();
      await _cacheService.cacheMyRequests(myRequests);

      final pendingRequests = await _apiService.getPendingRequests();
      await _cacheService.cachePendingRequests(pendingRequests);

      _lastSyncTime = DateTime.now();
      _lastSyncError = null;
    } catch (e) {
      _lastSyncError = e.toString();
      debugPrint('Full sync error: $e');
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _connectivity.removeListener(_onConnectivityChanged);
    super.dispose();
  }
}
