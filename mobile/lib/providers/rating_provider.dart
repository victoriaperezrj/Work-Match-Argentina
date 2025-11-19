import 'package:flutter/foundation.dart';
import '../models/rating.dart';
import '../services/api_service.dart';

/// State management for Ratings
/// Handles rating submission and retrieval
class RatingProvider with ChangeNotifier {
  final ApiService _apiService;

  // State
  List<Rating> _ratings = [];
  RatingSummary? _userSummary;
  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _error;

  // Getters
  List<Rating> get ratings => _ratings;
  RatingSummary? get userSummary => _userSummary;
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get error => _error;
  bool get hasError => _error != null;

  RatingProvider(this._apiService);

  /// Submits a rating for a completed request
  Future<bool> submitRating({
    required int requestId,
    required int score,
    String? comment,
  }) async {
    _isSubmitting = true;
    _error = null;
    notifyListeners();

    try {
      final rating = await _apiService.submitRating(
        requestId: requestId,
        score: score,
        comment: comment,
      );

      // Add to local list
      _ratings.insert(0, rating);
      _error = null;
      _isSubmitting = false;
      notifyListeners();

      return true;
    } catch (e) {
      _error = _getErrorMessage(e);
      _isSubmitting = false;
      notifyListeners();
      debugPrint('Error submitting rating: $e');
      return false;
    }
  }

  /// Loads ratings for a specific user
  Future<void> loadUserRatings(int userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _ratings = await _apiService.getUserRatings(userId);
      _error = null;
    } catch (e) {
      _error = _getErrorMessage(e);
      debugPrint('Error loading ratings: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Loads rating summary for a user
  Future<void> loadUserSummary(int userId) async {
    try {
      _userSummary = await _apiService.getUserRatingSummary(userId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading rating summary: $e');
    }
  }

  /// Clears error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Clears all data
  Future<void> clear() async {
    _ratings = [];
    _userSummary = null;
    _isLoading = false;
    _isSubmitting = false;
    _error = null;
    notifyListeners();
  }

  // Private helpers

  String _getErrorMessage(dynamic error) {
    final errorString = error.toString();

    if (errorString.contains('SocketException') ||
        errorString.contains('Failed host lookup')) {
      return 'Sin conexion a Internet. Verifica tu red.';
    }

    if (errorString.contains('TimeoutException')) {
      return 'La solicitud tardo demasiado. Intenta de nuevo.';
    }

    if (errorString.contains('401') || errorString.contains('Unauthorized')) {
      return 'Sesion expirada. Por favor inicia sesion nuevamente.';
    }

    if (errorString.contains('already rated')) {
      return 'Ya has calificado este servicio.';
    }

    if (errorString.startsWith('Exception: ')) {
      return errorString.substring(11);
    }

    return 'Ocurrio un error. Por favor intenta de nuevo.';
  }
}
