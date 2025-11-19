import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';

/// Connectivity Service
/// Monitors network connectivity status
/// Notifies listeners when connectivity changes
class ConnectivityService with ChangeNotifier {
  static final ConnectivityService _instance = ConnectivityService._internal();
  factory ConnectivityService() => _instance;
  ConnectivityService._internal();

  bool _isConnected = true;
  bool _isChecking = false;
  Timer? _periodicCheck;

  bool get isConnected => _isConnected;
  bool get isOffline => !_isConnected;

  /// Initialize connectivity monitoring
  void init() {
    checkConnectivity();
    // Check connectivity every 30 seconds
    _periodicCheck = Timer.periodic(
      const Duration(seconds: 30),
      (_) => checkConnectivity(),
    );
  }

  /// Dispose resources
  void dispose() {
    _periodicCheck?.cancel();
  }

  /// Check current connectivity status
  Future<bool> checkConnectivity() async {
    if (_isChecking) return _isConnected;
    _isChecking = true;

    try {
      // Try to connect to a reliable host
      final result = await InternetAddress.lookup('google.com')
          .timeout(const Duration(seconds: 5));

      final wasConnected = _isConnected;
      _isConnected = result.isNotEmpty && result[0].rawAddress.isNotEmpty;

      // Notify if status changed
      if (wasConnected != _isConnected) {
        notifyListeners();
        debugPrint('Connectivity changed: ${_isConnected ? "Online" : "Offline"}');
      }
    } on SocketException catch (_) {
      if (_isConnected) {
        _isConnected = false;
        notifyListeners();
        debugPrint('Connectivity changed: Offline (SocketException)');
      }
    } on TimeoutException catch (_) {
      if (_isConnected) {
        _isConnected = false;
        notifyListeners();
        debugPrint('Connectivity changed: Offline (Timeout)');
      }
    } catch (e) {
      debugPrint('Connectivity check error: $e');
    } finally {
      _isChecking = false;
    }

    return _isConnected;
  }

  /// Force an immediate connectivity check
  Future<bool> forceCheck() async {
    return await checkConnectivity();
  }
}
