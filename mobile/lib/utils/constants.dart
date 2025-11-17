import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF3B82F6);
  static const Color secondary = Color(0xFF10B981);
  static const Color danger = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color success = Color(0xFF10B981);
  static const Color background = Color(0xFFF3F4F6);
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
}

class AppConstants {
  static const List<String> serviceTypes = [
    'Plomeria',
    'Electricidad',
    'Jardineria',
    'Limpieza',
    'Pintura',
    'Carpinteria',
    'Herreria',
    'Albañileria',
    'Techado',
    'Mudanza',
  ];

  static const Map<String, IconData> serviceIcons = {
    'Plomeria': Icons.plumbing,
    'Electricidad': Icons.electrical_services,
    'Jardineria': Icons.yard,
    'Limpieza': Icons.cleaning_services,
    'Pintura': Icons.format_paint,
    'Carpinteria': Icons.carpenter,
    'Herreria': Icons.construction,
    'Albañileria': Icons.foundation,
    'Techado': Icons.roofing,
    'Mudanza': Icons.local_shipping,
  };

  static IconData getServiceIcon(String serviceType) {
    return serviceIcons[serviceType] ?? Icons.work;
  }
}

class AppTextStyles {
  static const TextStyle heading1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    color: AppColors.textPrimary,
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    color: AppColors.textSecondary,
  );
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppBorderRadius {
  static const double sm = 4.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double full = 999.0;
}
