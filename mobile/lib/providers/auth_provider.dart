import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isDemandante => _user?.isDemandante ?? false;
  bool get isProveedor => _user?.isProveedor ?? false;

  AuthProvider() {
    _loadUserFromStorage();
  }

  Future<void> _loadUserFromStorage() async {
    try {
      final token = await _secureStorage.read(key: 'auth_token');
      final userJson = await _secureStorage.read(key: 'user_data');

      if (token != null && userJson != null) {
        _apiService.setToken(token);
        _user = User.fromJson(jsonDecode(userJson));
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading user from storage: $e');
    }
  }

  Future<void> _saveUserToStorage(String token, User user) async {
    await _secureStorage.write(key: 'auth_token', value: token);
    await _secureStorage.write(key: 'user_data', value: jsonEncode(user.toJson()));
  }

  Future<void> _clearStorage() async {
    await _secureStorage.delete(key: 'auth_token');
    await _secureStorage.delete(key: 'user_data');
  }

  Future<bool> register(String email, String password, String role) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final authResponse = await _apiService.register(email, password, role);
      _user = authResponse.user;
      await _saveUserToStorage(authResponse.token, authResponse.user);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final authResponse = await _apiService.login(email, password);
      _user = authResponse.user;
      await _saveUserToStorage(authResponse.token, authResponse.user);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _user = null;
    await _clearStorage();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
