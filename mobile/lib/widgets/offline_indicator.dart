import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/connectivity_service.dart';
import '../utils/constants.dart';

/// Offline Indicator Banner
/// Shows when the app is offline
/// Dismissible with retry option
class OfflineIndicator extends StatelessWidget {
  final Widget child;

  const OfflineIndicator({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: ConnectivityService(),
      child: Consumer<ConnectivityService>(
        builder: (context, connectivity, _) {
          return Column(
            children: [
              // Offline banner
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: connectivity.isOffline ? 32 : 0,
                color: AppColors.warning,
                child: connectivity.isOffline
                    ? SafeArea(
                        bottom: false,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.wifi_off,
                              size: 16,
                              color: Colors.white,
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            const Text(
                              'Sin conexion',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.md),
                            GestureDetector(
                              onTap: () => connectivity.forceCheck(),
                              child: const Text(
                                'Reintentar',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : null,
              ),
              // Main content
              Expanded(child: child),
            ],
          );
        },
      ),
    );
  }
}

/// Connection Status Icon
/// Small icon indicator for app bars
class ConnectionStatusIcon extends StatelessWidget {
  const ConnectionStatusIcon({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: ConnectivityService(),
      child: Consumer<ConnectivityService>(
        builder: (context, connectivity, _) {
          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            child: Icon(
              connectivity.isConnected ? Icons.wifi : Icons.wifi_off,
              key: ValueKey(connectivity.isConnected),
              size: 20,
              color: connectivity.isConnected
                  ? AppColors.success
                  : AppColors.warning,
            ),
          );
        },
      ),
    );
  }
}

/// Offline Mode Card
/// Shows when data is from cache
class OfflineModeCard extends StatelessWidget {
  final DateTime? lastSync;

  const OfflineModeCard({
    Key? key,
    this.lastSync,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
        border: Border.all(
          color: AppColors.warning.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.cloud_off,
            color: AppColors.warning,
            size: 24,
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Modo sin conexion',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: AppColors.warning,
                  ),
                ),
                if (lastSync != null)
                  Text(
                    'Ultima sincronizacion: ${_formatTime(lastSync!)}',
                    style: AppTextStyles.bodySmall,
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final diff = now.difference(time);

    if (diff.inMinutes < 1) {
      return 'Ahora';
    } else if (diff.inMinutes < 60) {
      return 'Hace ${diff.inMinutes} min';
    } else if (diff.inHours < 24) {
      return 'Hace ${diff.inHours}h';
    } else {
      return '${time.day}/${time.month} ${time.hour}:${time.minute.toString().padLeft(2, '0')}';
    }
  }
}
