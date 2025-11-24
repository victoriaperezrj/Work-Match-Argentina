import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/theme_provider.dart';
import '../../utils/constants.dart';

/// Settings Screen
/// Allows users to configure app settings including theme
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configuracion'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          // Theme Section
          _buildSectionTitle('Apariencia'),
          _buildThemeSelector(context),

          const SizedBox(height: AppSpacing.lg),

          // About Section
          _buildSectionTitle('Acerca de'),
          _buildAboutCard(),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(
        left: AppSpacing.sm,
        bottom: AppSpacing.sm,
      ),
      child: Text(
        title,
        style: AppTextStyles.heading3,
      ),
    );
  }

  Widget _buildThemeSelector(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return Card(
          child: Column(
            children: [
              RadioListTile<ThemeMode>(
                title: const Text('Sistema'),
                subtitle: const Text('Seguir configuracion del dispositivo'),
                value: ThemeMode.system,
                groupValue: themeProvider.themeMode,
                onChanged: (value) {
                  if (value != null) {
                    themeProvider.setThemeMode(value);
                  }
                },
              ),
              const Divider(height: 1),
              RadioListTile<ThemeMode>(
                title: const Text('Claro'),
                subtitle: const Text('Tema claro'),
                value: ThemeMode.light,
                groupValue: themeProvider.themeMode,
                onChanged: (value) {
                  if (value != null) {
                    themeProvider.setThemeMode(value);
                  }
                },
                secondary: const Icon(Icons.light_mode),
              ),
              const Divider(height: 1),
              RadioListTile<ThemeMode>(
                title: const Text('Oscuro'),
                subtitle: const Text('Tema oscuro'),
                value: ThemeMode.dark,
                groupValue: themeProvider.themeMode,
                onChanged: (value) {
                  if (value != null) {
                    themeProvider.setThemeMode(value);
                  }
                },
                secondary: const Icon(Icons.dark_mode),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAboutCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppBorderRadius.md),
                  ),
                  child: const Icon(
                    Icons.work,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'WorkMatch Argentina',
                      style: AppTextStyles.heading3.copyWith(fontSize: 16),
                    ),
                    Text(
                      'Version 1.0.0',
                      style: AppTextStyles.bodySmall,
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Plataforma de matching de servicios profesionales en Argentina.',
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
