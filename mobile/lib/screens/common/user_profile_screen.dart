import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/rating_provider.dart';
import '../../widgets/user_avatar.dart';
import '../../widgets/rating_display.dart';
import '../../widgets/animated_list_item.dart';
import '../../utils/constants.dart';

/// User Profile Screen
/// Shows user information, stats, and ratings
class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({Key? key}) : super(key: key);

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  @override
  void initState() {
    super.initState();
    // Load user ratings if provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = context.read<AuthProvider>();
      if (authProvider.isProvider && authProvider.user != null) {
        context.read<RatingProvider>().loadUserSummary(authProvider.user!.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;

          return CustomScrollView(
            slivers: [
              // Animated App Bar with Avatar
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppColors.primary,
                          AppColors.primary.withOpacity(0.8),
                        ],
                      ),
                    ),
                    child: SafeArea(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 40),
                          HeroAvatar(
                            heroTag: 'user-avatar',
                            name: user?.email ?? 'Usuario',
                            size: 80,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          Text(
                            user?.email ?? 'usuario@email.com',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.md,
                              vertical: AppSpacing.xs,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(AppBorderRadius.full),
                            ),
                            child: Text(
                              user?.role ?? 'Usuario',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.settings, color: Colors.white),
                    onPressed: () {
                      Navigator.of(context).pushNamed('/settings');
                    },
                  ),
                ],
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stats Cards
                      AnimatedListItem(
                        index: 0,
                        child: _buildStatsSection(authProvider),
                      ),

                      const SizedBox(height: AppSpacing.lg),

                      // Rating Section (for providers)
                      if (authProvider.isProvider)
                        AnimatedListItem(
                          index: 1,
                          child: _buildRatingSection(),
                        ),

                      const SizedBox(height: AppSpacing.lg),

                      // Menu Options
                      AnimatedListItem(
                        index: 2,
                        child: _buildMenuSection(context, authProvider),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatsSection(AuthProvider authProvider) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Estadisticas',
              style: AppTextStyles.heading3,
            ),
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    icon: Icons.check_circle,
                    label: 'Completados',
                    value: '0',
                    color: AppColors.success,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    icon: Icons.pending,
                    label: 'Pendientes',
                    value: '0',
                    color: AppColors.warning,
                  ),
                ),
                if (authProvider.isProvider)
                  Expanded(
                    child: _buildStatItem(
                      icon: Icons.star,
                      label: 'Rating',
                      value: '5.0',
                      color: AppColors.warning,
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(AppSpacing.sm),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          value,
          style: AppTextStyles.heading3,
        ),
        Text(
          label,
          style: AppTextStyles.bodySmall,
        ),
      ],
    );
  }

  Widget _buildRatingSection() {
    return Consumer<RatingProvider>(
      builder: (context, ratingProvider, child) {
        final summary = ratingProvider.userSummary;

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mi Calificacion',
                  style: AppTextStyles.heading3,
                ),
                const SizedBox(height: AppSpacing.md),
                if (summary != null && summary.hasRatings) ...[
                  Row(
                    children: [
                      Text(
                        summary.formattedAverage,
                        style: AppTextStyles.heading1.copyWith(
                          color: AppColors.warning,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          RatingDisplay(
                            rating: summary.averageScore,
                            showCount: false,
                          ),
                          Text(
                            '${summary.totalRatings} calificaciones',
                            style: AppTextStyles.bodySmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                ] else ...[
                  Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.star_border,
                          size: 48,
                          color: AppColors.textSecondary,
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'Sin calificaciones aun',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMenuSection(BuildContext context, AuthProvider authProvider) {
    return Card(
      child: Column(
        children: [
          _buildMenuItem(
            icon: Icons.settings,
            title: 'Configuracion',
            onTap: () => Navigator.of(context).pushNamed('/settings'),
          ),
          const Divider(height: 1),
          if (authProvider.isProvider) ...[
            _buildMenuItem(
              icon: Icons.person,
              title: 'Editar Perfil de Proveedor',
              onTap: () => Navigator.of(context).pushNamed('/proveedor/profile'),
            ),
            const Divider(height: 1),
            _buildMenuItem(
              icon: Icons.history,
              title: 'Historial de Trabajos',
              onTap: () => Navigator.of(context).pushNamed('/proveedor/history'),
            ),
            const Divider(height: 1),
          ],
          _buildMenuItem(
            icon: Icons.help_outline,
            title: 'Ayuda y Soporte',
            onTap: () {
              // TODO: Navigate to help
            },
          ),
          const Divider(height: 1),
          _buildMenuItem(
            icon: Icons.logout,
            title: 'Cerrar Sesion',
            color: AppColors.danger,
            onTap: () => _handleLogout(context),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Color? color,
  }) {
    return ListTile(
      leading: Icon(icon, color: color ?? AppColors.textPrimary),
      title: Text(
        title,
        style: AppTextStyles.bodyMedium.copyWith(
          color: color ?? AppColors.textPrimary,
        ),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: color ?? AppColors.textSecondary,
      ),
      onTap: onTap,
    );
  }

  void _handleLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cerrar Sesion'),
        content: const Text('¿Estas seguro que deseas cerrar sesion?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              context.read<AuthProvider>().logout();
              Navigator.of(context).pushNamedAndRemoveUntil(
                '/login',
                (route) => false,
              );
            },
            child: const Text('Cerrar Sesion'),
          ),
        ],
      ),
    );
  }
}
