import 'package:flutter/material.dart';
import '../../widgets/animated_list_item.dart';
import '../../utils/constants.dart';

/// Help and Support Screen
/// Provides FAQ, contact info, and app information
class HelpScreen extends StatelessWidget {
  const HelpScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ayuda y Soporte'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          // FAQ Section
          AnimatedListItem(
            index: 0,
            child: _buildSectionCard(
              title: 'Preguntas Frecuentes',
              icon: Icons.help_outline,
              children: [
                _buildFAQItem(
                  question: 'Como publico una solicitud de servicio?',
                  answer: 'Desde el dashboard de Demandante, toca el boton "Nueva Solicitud", selecciona el tipo de servicio, describe el trabajo y obtiene tu ubicacion.',
                ),
                _buildFAQItem(
                  question: 'Como acepto un trabajo como proveedor?',
                  answer: 'En el dashboard de Proveedor veras los trabajos disponibles. Toca "Aceptar Trabajo" para tomar una solicitud.',
                ),
                _buildFAQItem(
                  question: 'Como funciona el sistema de calificaciones?',
                  answer: 'Despues de completar un trabajo, tanto el demandante como el proveedor pueden calificarse mutuamente del 1 al 5.',
                ),
                _buildFAQItem(
                  question: 'Puedo usar la app sin conexion?',
                  answer: 'Si, la app guarda datos en cache. Las operaciones pendientes se sincronizan cuando recuperas la conexion.',
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Contact Section
          AnimatedListItem(
            index: 1,
            child: _buildSectionCard(
              title: 'Contacto',
              icon: Icons.contact_support,
              children: [
                _buildContactItem(
                  icon: Icons.email,
                  title: 'Email',
                  subtitle: 'soporte@workmatch.com.ar',
                  onTap: () {
                    // TODO: Launch email
                  },
                ),
                _buildContactItem(
                  icon: Icons.phone,
                  title: 'Telefono',
                  subtitle: '+54 11 1234-5678',
                  onTap: () {
                    // TODO: Launch phone
                  },
                ),
                _buildContactItem(
                  icon: Icons.language,
                  title: 'Sitio Web',
                  subtitle: 'www.workmatch.com.ar',
                  onTap: () {
                    // TODO: Launch browser
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Quick Actions
          AnimatedListItem(
            index: 2,
            child: _buildSectionCard(
              title: 'Acciones Rapidas',
              icon: Icons.flash_on,
              children: [
                _buildActionItem(
                  icon: Icons.bug_report,
                  title: 'Reportar un Problema',
                  onTap: () {
                    _showReportDialog(context);
                  },
                ),
                _buildActionItem(
                  icon: Icons.feedback,
                  title: 'Enviar Sugerencia',
                  onTap: () {
                    _showFeedbackDialog(context);
                  },
                ),
                _buildActionItem(
                  icon: Icons.star_rate,
                  title: 'Calificar la App',
                  onTap: () {
                    // TODO: Launch app store
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // App Info
          AnimatedListItem(
            index: 3,
            child: _buildAppInfoCard(),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                Icon(icon, color: AppColors.primary),
                const SizedBox(width: AppSpacing.sm),
                Text(title, style: AppTextStyles.heading3),
              ],
            ),
          ),
          const Divider(height: 1),
          ...children,
        ],
      ),
    );
  }

  Widget _buildFAQItem({
    required String question,
    required String answer,
  }) {
    return ExpansionTile(
      title: Text(
        question,
        style: AppTextStyles.bodyMedium.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.md,
            0,
            AppSpacing.md,
            AppSpacing.md,
          ),
          child: Text(
            answer,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContactItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  Widget _buildActionItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  Widget _buildAppInfoCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.work,
                color: AppColors.primary,
                size: 40,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            const Text(
              'WorkMatch Argentina',
              style: AppTextStyles.heading3,
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'Version 1.0.0',
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Conectando profesionales con quienes necesitan sus servicios.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              '© 2024 WorkMatch Argentina',
              style: AppTextStyles.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  void _showReportDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reportar Problema'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Describe el problema...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppBorderRadius.md),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Reporte enviado. Gracias!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Enviar'),
          ),
        ],
      ),
    );
  }

  void _showFeedbackDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Enviar Sugerencia'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Tu sugerencia...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppBorderRadius.md),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Sugerencia enviada. Gracias!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Enviar'),
          ),
        ],
      ),
    );
  }
}
