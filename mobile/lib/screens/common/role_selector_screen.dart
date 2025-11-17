import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/request_provider.dart';
import '../../providers/profile_provider.dart';
import '../../utils/constants.dart';
import '../../utils/mock_data.dart';

/// Role Selector Screen - Development Mode
/// Allows testing without login
///
/// This is a common pattern in FAANG companies for:
/// - Local development
/// - UI testing
/// - Demo purposes
class RoleSelectorScreen extends StatelessWidget {
  const RoleSelectorScreen({Key? key}) : super(key: key);

  void _selectRole(BuildContext context, String role) {
    final authProvider = context.read<AuthProvider>();
    final requestProvider = context.read<RequestProvider>();
    final profileProvider = context.read<ProfileProvider>();

    // Set mock user based on role
    if (role == 'Demandante') {
      // Simulate login as Demandante
      authProvider.setMockUser(MockData.mockDemandante, MockData.mockToken);

      // Pre-load mock requests
      requestProvider.setMockRequests(MockData.mockDemandanteRequests);

      // Navigate to Demandante dashboard
      Navigator.of(context).pushReplacementNamed('/demandante');
    } else {
      // Simulate login as Proveedor
      authProvider.setMockUser(MockData.mockProveedor, MockData.mockToken);

      // Pre-load mock profile
      profileProvider.setMockProfile(MockData.mockProviderProfile);

      // Pre-load mock pending requests
      final pendingRequests = MockData.getPendingRequestsForProvider(
        MockData.mockProviderProfile,
      );
      requestProvider.setMockPendingRequests(pendingRequests);

      // Navigate to Proveedor dashboard
      Navigator.of(context).pushReplacementNamed('/proveedor');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.primary.withOpacity(0.1),
              AppColors.background,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo/Icon
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.handyman,
                    size: 60,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Title
                Text(
                  'WorkMatch',
                  style: AppTextStyles.heading1.copyWith(fontSize: 36),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.sm),

                // Subtitle
                Text(
                  'Modo Desarrollo',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: AppSpacing.xxl),

                // Info Card
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppBorderRadius.lg),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: AppColors.primary,
                        size: 24,
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Text(
                          'Selecciona un rol para testear la app con datos de prueba',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.xxl),

                // Demandante Card
                _RoleCard(
                  icon: Icons.person_search,
                  title: 'Demandante',
                  subtitle: 'Busco servicios',
                  description: '• Ver mis solicitudes\n• Crear nuevas solicitudes\n• Geolocalización\n• Precio estimado por IA',
                  color: AppColors.primary,
                  onTap: () => _selectRole(context, 'Demandante'),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Proveedor Card
                _RoleCard(
                  icon: Icons.work,
                  title: 'Proveedor',
                  subtitle: 'Ofrezco servicios',
                  description: '• Ver trabajos disponibles\n• Aceptar trabajos\n• Configurar perfil\n• Radio de cobertura',
                  color: AppColors.secondary,
                  onTap: () => _selectRole(context, 'Proveedor'),
                ),

                const SizedBox(height: AppSpacing.xl),

                // Note
                Text(
                  'Los datos son ficticios y se borrarán al reiniciar la app',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String description;
  final Color color;
  final VoidCallback onTap;

  const _RoleCard({
    Key? key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.color,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Row(
            children: [
              // Icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppBorderRadius.md),
                ),
                child: Icon(
                  icon,
                  size: 32,
                  color: color,
                ),
              ),
              const SizedBox(width: AppSpacing.md),

              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.heading3.copyWith(
                        color: color,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      description,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),

              // Arrow
              Icon(
                Icons.arrow_forward_ios,
                color: color,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
