import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/request_provider.dart';
import 'providers/profile_provider.dart';
import 'services/api_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/common/role_selector_screen.dart';
import 'screens/demandante/demandante_dashboard.dart';
import 'screens/demandante/new_request_screen.dart';
import 'screens/proveedor/proveedor_dashboard.dart';
import 'screens/proveedor/profile_setup_screen.dart';
import 'screens/proveedor/job_history_screen.dart';
import 'utils/constants.dart';
import 'utils/mock_data.dart';

/// WorkMatch Mobile App
/// Enterprise-grade implementation with:
/// - Multi-provider state management
/// - Dependency injection
/// - Proper routing
/// - Theme configuration
/// - Error handling
/// - Development mode with mock data
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Shared ApiService instance
    final apiService = ApiService();

    return MultiProvider(
      providers: [
        // Auth Provider (no dependencies)
        ChangeNotifierProvider(create: (_) => AuthProvider()),

        // Request Provider (depends on ApiService)
        ChangeNotifierProvider(create: (_) => RequestProvider(apiService)),

        // Profile Provider (depends on ApiService)
        ChangeNotifierProvider(create: (_) => ProfileProvider(apiService)),
      ],
      child: MaterialApp(
        title: 'WorkMatch',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primaryColor: AppColors.primary,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            secondary: AppColors.secondary,
          ),
          scaffoldBackgroundColor: AppColors.background,
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            elevation: 0,
            iconTheme: IconThemeData(color: AppColors.textPrimary),
            titleTextStyle: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppBorderRadius.lg),
            ),
          ),
          useMaterial3: true,
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => MockData.isDevelopmentMode
              ? const RoleSelectorScreen()
              : const AuthChecker(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/role-selector': (context) => const RoleSelectorScreen(),

          // Demandante routes
          '/demandante': (context) => const DemandanteDashboard(),
          '/demandante/new-request': (context) => const NewRequestScreen(),

          // Proveedor routes
          '/proveedor': (context) => const ProveedorDashboard(),
          '/proveedor/profile': (context) => const ProfileSetupScreen(),
          '/proveedor/history': (context) => const JobHistoryScreen(),
        },
      ),
    );
  }
}

/// Auth Checker
/// For production mode - checks authentication and routes accordingly
class AuthChecker extends StatelessWidget {
  const AuthChecker({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        // Authenticated users go to their dashboard
        if (authProvider.isAuthenticated) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (authProvider.isDemandante) {
              Navigator.of(context).pushReplacementNamed('/demandante');
            } else {
              Navigator.of(context).pushReplacementNamed('/proveedor');
            }
          });
        } else {
          // Unauthenticated users go to login
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.of(context).pushReplacementNamed('/login');
          });
        }

        // Show loading while checking auth state
        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      },
    );
  }
}
