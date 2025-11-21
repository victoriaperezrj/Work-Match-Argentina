import 'package:flutter_test/flutter_test.dart';
import 'package:workmatch_mobile/providers/auth_provider.dart';
import 'package:workmatch_mobile/models/user.dart';

void main() {
  group('AuthProvider Tests', () {
    late AuthProvider authProvider;

    setUp(() {
      authProvider = AuthProvider();
    });

    test('Initial state should be unauthenticated', () {
      expect(authProvider.isAuthenticated, false);
      expect(authProvider.user, null);
      expect(authProvider.token, null);
    });

    test('setUser should update user and authentication state', () {
      final user = User(
        id: 1,
        email: 'test@test.com',
        role: 'Demandante',
        isVerified: true,
        createdAt: DateTime.now(),
      );
      final token = 'test_token_123';

      authProvider.setUser(user, token);

      expect(authProvider.isAuthenticated, true);
      expect(authProvider.user, user);
      expect(authProvider.token, token);
      expect(authProvider.isDemandante, true);
      expect(authProvider.isProvider, false);
    });

    test('setUser with Provider role should set correct flags', () {
      final user = User(
        id: 2,
        email: 'provider@test.com',
        role: 'Proveedor',
        isVerified: true,
        createdAt: DateTime.now(),
      );
      final token = 'provider_token_456';

      authProvider.setUser(user, token);

      expect(authProvider.isAuthenticated, true);
      expect(authProvider.isDemandante, false);
      expect(authProvider.isProvider, true);
    });

    test('logout should clear all user data', () {
      final user = User(
        id: 1,
        email: 'test@test.com',
        role: 'Demandante',
        isVerified: true,
        createdAt: DateTime.now(),
      );
      final token = 'test_token_123';

      authProvider.setUser(user, token);
      expect(authProvider.isAuthenticated, true);

      authProvider.logout();

      expect(authProvider.isAuthenticated, false);
      expect(authProvider.user, null);
      expect(authProvider.token, null);
    });

    test('setLoading should update loading state', () {
      expect(authProvider.isLoading, false);

      authProvider.setLoading(true);
      expect(authProvider.isLoading, true);

      authProvider.setLoading(false);
      expect(authProvider.isLoading, false);
    });

    test('setError should update error state', () {
      expect(authProvider.error, null);
      expect(authProvider.hasError, false);

      authProvider.setError('Test error');
      expect(authProvider.error, 'Test error');
      expect(authProvider.hasError, true);

      authProvider.clearError();
      expect(authProvider.error, null);
      expect(authProvider.hasError, false);
    });
  });
}
