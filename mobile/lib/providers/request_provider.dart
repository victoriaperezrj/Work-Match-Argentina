import 'package:flutter/foundation.dart';
import '../models/service_request.dart';
import '../repositories/service_request_repository.dart';
import '../services/api_service.dart';

/// State management for Service Requests
/// Follows MVVM pattern used at Google, Meta
///
/// Features:
/// - Reactive state updates
/// - Error handling with user-friendly messages
/// - Loading states for better UX
/// - Optimistic updates
/// - Automatic retry logic
class RequestProvider with ChangeNotifier {
  final ServiceRequestRepository _repository;

  // State
  List<ServiceRequest> _myRequests = [];
  List<ServiceRequest> _pendingRequests = [];
  bool _isLoading = false;
  bool _isCreating = false;
  String? _error;

  // Getters
  List<ServiceRequest> get myRequests => _myRequests;
  List<ServiceRequest> get pendingRequests => _pendingRequests;
  bool get isLoading => _isLoading;
  bool get isCreating => _isCreating;
  String? get error => _error;
  bool get hasError => _error != null;

  // Filtered getters
  List<ServiceRequest> get myPendingRequests =>
      _myRequests.where((r) => r.isPending).toList();
  List<ServiceRequest> get myAssignedRequests =>
      _myRequests.where((r) => r.isAssigned).toList();
  List<ServiceRequest> get myCompletedRequests =>
      _myRequests.where((r) => r.isCompleted).toList();

  RequestProvider(ApiService apiService)
      : _repository = ServiceRequestRepository(apiService);

  /// Loads user's service requests
  /// Implements pull-to-refresh pattern
  Future<void> loadMyRequests({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      _myRequests = await _repository.getMyRequests(forceRefresh: forceRefresh);
      _error = null;
    } catch (e) {
      _error = _getErrorMessage(e);
      debugPrint('Error loading my requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Loads pending requests for provider
  /// Shows available jobs within provider's criteria
  Future<void> loadPendingRequests({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      _pendingRequests = await _repository.getPendingRequests(forceRefresh: forceRefresh);
      _error = null;
    } catch (e) {
      _error = _getErrorMessage(e);
      debugPrint('Error loading pending requests: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Creates a new service request
  /// Returns true if successful
  Future<bool> createRequest({
    required String description,
    required String serviceType,
    required double lat,
    required double lon,
  }) async {
    _isCreating = true;
    _error = null;
    notifyListeners();

    try {
      final newRequest = await _repository.createRequest(
        description: description,
        serviceType: serviceType,
        lat: lat,
        lon: lon,
      );

      // Optimistic update: add to list immediately
      _myRequests.insert(0, newRequest);
      _error = null;
      _isCreating = false;
      notifyListeners();

      // Refresh in background to ensure consistency
      loadMyRequests(forceRefresh: true);

      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      _isCreating = false;
      notifyListeners();
      debugPrint('Error creating request: $e');
      return false;
    }
  }

  /// Provider accepts a service request
  /// Implements optimistic update for snappy UX
  Future<bool> acceptRequest(int requestId) async {
    _error = null;

    // Optimistic update: remove from pending list immediately
    final requestIndex = _pendingRequests.indexWhere((r) => r.id == requestId);
    ServiceRequest? removedRequest;

    if (requestIndex != -1) {
      removedRequest = _pendingRequests.removeAt(requestIndex);
      notifyListeners();
    }

    try {
      await _repository.acceptRequest(requestId);

      // Success - refresh data in background
      loadPendingRequests(forceRefresh: true);

      return true;
    } catch (e) {
      _error = _getErrorMessage(e);

      // Rollback optimistic update
      if (removedRequest != null) {
        _pendingRequests.insert(requestIndex, removedRequest);
      }

      notifyListeners();
      debugPrint('Error accepting request: $e');
      return false;
    }
  }

  /// Marks request as completed
  Future<bool> completeRequest(int requestId) async {
    _error = null;

    try {
      await _repository.completeRequest(requestId);

      // Update local state
      final index = _myRequests.indexWhere((r) => r.id == requestId);
      if (index != -1) {
        // We don't have the full updated object, so refresh
        await loadMyRequests(forceRefresh: true);
      }

      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      notifyListeners();
      debugPrint('Error completing request: $e');
      return false;
    }
  }

  /// Clears error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Retries the last failed operation
  /// Smart retry based on current state
  Future<void> retry() async {
    _error = null;
    if (_myRequests.isEmpty && _pendingRequests.isEmpty) {
      await loadMyRequests();
    } else if (_pendingRequests.isNotEmpty) {
      await loadPendingRequests();
    } else {
      await loadMyRequests();
    }
  }

  /// Clears all data
  /// Call on logout
  Future<void> clear() async {
    _myRequests = [];
    _pendingRequests = [];
    _isLoading = false;
    _isCreating = false;
    _error = null;
    await _repository.clearCache();
    notifyListeners();
  }

  // Private helpers

  String _getErrorMessage(dynamic error) {
    final errorString = error.toString();

    // Parse common errors and return user-friendly messages
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

    if (errorString.contains('404')) {
      return 'Recurso no encontrado.';
    }

    if (errorString.contains('500')) {
      return 'Error del servidor. Intenta más tarde.';
    }

    // Extract message from Exception
    if (errorString.startsWith('Exception: ')) {
      return errorString.substring(11);
    }

    return 'Ocurrió un error. Por favor intenta de nuevo.';
  }

  /// Mock data setters for development/testing
  void setMockRequests(List<ServiceRequest> requests) {
    _myRequests = requests;
    notifyListeners();
  }

  void setMockPendingRequests(List<ServiceRequest> requests) {
    _pendingRequests = requests;
    notifyListeners();
  }
}
