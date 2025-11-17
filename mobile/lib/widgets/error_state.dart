import 'package:flutter/material.dart';
import '../utils/constants.dart';

/// Error state widget with retry capability
/// Standard in production apps: Netflix, Spotify, YouTube
///
/// Always give users a way to recover from errors
class ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  final IconData? icon;

  const ErrorState({
    Key? key,
    required this.message,
    required this.onRetry,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Error icon
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.danger.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon ?? Icons.error_outline,
                size: 50,
                color: AppColors.danger,
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Error message
            Text(
              'Algo salió mal',
              style: AppTextStyles.heading3,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.sm),

            Text(
              message,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: AppSpacing.xl),

            // Retry button
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
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
            ),
          ],
        ),
      ),
    );
  }
}

/// Inline error message (for forms, etc)
class InlineError extends StatelessWidget {
  final String message;
  final VoidCallback? onDismiss;

  const InlineError({
    Key? key,
    required this.message,
    this.onDismiss,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.danger.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
        border: Border.all(
          color: AppColors.danger.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.error_outline,
            color: AppColors.danger,
            size: 20,
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.danger,
              ),
            ),
          ),
          if (onDismiss != null)
            IconButton(
              icon: const Icon(Icons.close, size: 18),
              onPressed: onDismiss,
              color: AppColors.danger,
              constraints: const BoxConstraints(),
              padding: EdgeInsets.zero,
            ),
        ],
      ),
    );
  }
}

/// Network error with specific messaging
class NetworkErrorState extends StatelessWidget {
  final VoidCallback onRetry;

  const NetworkErrorState({Key? key, required this.onRetry}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ErrorState(
      icon: Icons.wifi_off,
      message: 'No hay conexión a Internet.\nVerifica tu red y vuelve a intentar.',
      onRetry: onRetry,
    );
  }
}
