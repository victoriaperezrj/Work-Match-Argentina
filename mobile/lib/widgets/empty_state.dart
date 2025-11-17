import 'package:flutter/material.dart';
import '../utils/constants.dart';

/// Empty state widget
/// Best practice from Airbnb, Uber: Always show meaningful empty states
/// Never leave users staring at blank screens
class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String message;
  final String? actionText;
  final VoidCallback? onAction;

  const EmptyState({
    Key? key,
    required this.icon,
    required this.title,
    required this.message,
    this.actionText,
    this.onAction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon with subtle animation
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: 1.0),
              duration: const Duration(milliseconds: 600),
              curve: Curves.easeOutBack,
              builder: (context, value, child) {
                return Transform.scale(
                  scale: value,
                  child: child,
                );
              },
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: 60,
                  color: AppColors.primary,
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Title
            Text(
              title,
              style: AppTextStyles.heading2,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.sm),

            // Message
            Text(
              message,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),

            // Action button
            if (actionText != null && onAction != null) ...[
              const SizedBox(height: AppSpacing.xl),
              ElevatedButton(
                onPressed: onAction,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xl,
                    vertical: AppSpacing.md,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppBorderRadius.lg),
                  ),
                ),
                child: Text(actionText!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Pre-built empty states for common scenarios

class NoRequestsEmpty extends StatelessWidget {
  final VoidCallback? onCreateRequest;

  const NoRequestsEmpty({Key? key, this.onCreateRequest}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.work_outline,
      title: 'No tienes solicitudes',
      message: 'Crea tu primera solicitud de servicio para encontrar proveedores calificados.',
      actionText: onCreateRequest != null ? 'Crear Solicitud' : null,
      onAction: onCreateRequest,
    );
  }
}

class NoPendingJobsEmpty extends StatelessWidget {
  final VoidCallback? onRefresh;

  const NoPendingJobsEmpty({Key? key, this.onRefresh}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.search_off,
      title: 'Sin trabajos disponibles',
      message: 'No hay trabajos pendientes que coincidan con tu perfil. Ajusta tu radio de cobertura o servicios.',
      actionText: onRefresh != null ? 'Actualizar' : null,
      onAction: onRefresh,
    );
  }
}

class ProfileIncompleteEmpty extends StatelessWidget {
  final VoidCallback onSetupProfile;

  const ProfileIncompleteEmpty({
    Key? key,
    required this.onSetupProfile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.person_outline,
      title: 'Completa tu perfil',
      message: 'Configura tus servicios y ubicación para empezar a recibir solicitudes de trabajo.',
      actionText: 'Configurar Perfil',
      onAction: onSetupProfile,
    );
  }
}
