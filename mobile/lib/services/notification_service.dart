import 'package:flutter/material.dart';
import '../utils/constants.dart';

/// Notification Service
/// Handles local notifications within the app
/// Can be extended for push notifications later
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  GlobalKey<ScaffoldMessengerState>? _messengerKey;

  /// Initialize with scaffold messenger key
  void init(GlobalKey<ScaffoldMessengerState> key) {
    _messengerKey = key;
  }

  /// Show success notification
  void showSuccess(String message) {
    _showNotification(
      message: message,
      backgroundColor: AppColors.success,
      icon: Icons.check_circle,
    );
  }

  /// Show error notification
  void showError(String message) {
    _showNotification(
      message: message,
      backgroundColor: AppColors.danger,
      icon: Icons.error,
    );
  }

  /// Show warning notification
  void showWarning(String message) {
    _showNotification(
      message: message,
      backgroundColor: AppColors.warning,
      icon: Icons.warning,
    );
  }

  /// Show info notification
  void showInfo(String message) {
    _showNotification(
      message: message,
      backgroundColor: AppColors.primary,
      icon: Icons.info,
    );
  }

  /// Show job accepted notification
  void notifyJobAccepted(String serviceType) {
    showSuccess('Trabajo aceptado: $serviceType');
  }

  /// Show job completed notification
  void notifyJobCompleted(String serviceType) {
    showSuccess('Trabajo completado: $serviceType');
  }

  /// Show new request notification
  void notifyNewRequest(String serviceType) {
    showInfo('Nueva solicitud: $serviceType');
  }

  /// Show rating reminder
  void notifyRatingReminder() {
    showInfo('No olvides calificar tu experiencia');
  }

  void _showNotification({
    required String message,
    required Color backgroundColor,
    required IconData icon,
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    if (_messengerKey?.currentState == null) return;

    _messengerKey!.currentState!.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        duration: duration,
        action: action,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
        ),
        margin: const EdgeInsets.all(AppSpacing.md),
      ),
    );
  }

  /// Show notification with action
  void showWithAction({
    required String message,
    required String actionLabel,
    required VoidCallback onAction,
    Color? backgroundColor,
  }) {
    _showNotification(
      message: message,
      backgroundColor: backgroundColor ?? AppColors.primary,
      icon: Icons.notifications,
      action: SnackBarAction(
        label: actionLabel,
        textColor: Colors.white,
        onPressed: onAction,
      ),
    );
  }
}

/// Notification types for future push notification support
enum NotificationType {
  newRequest,
  requestAccepted,
  requestCompleted,
  newRating,
  reminder,
  system,
}

/// Notification model for push notifications
class AppNotification {
  final String id;
  final NotificationType type;
  final String title;
  final String body;
  final Map<String, dynamic>? data;
  final DateTime createdAt;
  final bool isRead;

  AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    this.data,
    required this.createdAt,
    this.isRead = false,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      type: NotificationType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => NotificationType.system,
      ),
      title: json['title'] as String,
      body: json['body'] as String,
      data: json['data'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['created_at'] as String),
      isRead: json['is_read'] as bool? ?? false,
    );
  }
}
