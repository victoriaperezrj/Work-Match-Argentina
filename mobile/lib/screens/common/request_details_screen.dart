import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/service_request.dart';
import '../../widgets/custom_button.dart';
import '../../utils/constants.dart';

/// Request Details Screen
/// Shows complete information about a service request
/// Accessible by both Demandante and Proveedor
class RequestDetailsScreen extends StatelessWidget {
  final ServiceRequest request;
  final bool isProvider;
  final VoidCallback? onAccept;
  final VoidCallback? onComplete;
  final VoidCallback? onCancel;

  const RequestDetailsScreen({
    Key? key,
    required this.request,
    this.isProvider = false,
    this.onAccept,
    this.onComplete,
    this.onCancel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalles de Solicitud'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Service Type Header
            _buildServiceHeader(),

            const SizedBox(height: AppSpacing.lg),

            // Status Badge
            _buildStatusSection(),

            const SizedBox(height: AppSpacing.lg),

            // Description
            _buildDescriptionSection(),

            const SizedBox(height: AppSpacing.lg),

            // Price Info
            if (request.priceQuoted != null) ...[
              _buildPriceSection(),
              const SizedBox(height: AppSpacing.lg),
            ],

            // Location
            _buildLocationSection(),

            const SizedBox(height: AppSpacing.lg),

            // Dates
            _buildDatesSection(),

            const SizedBox(height: AppSpacing.xl),

            // Action Buttons
            _buildActionButtons(context),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(AppBorderRadius.md),
            ),
            child: Icon(
              AppConstants.getServiceIcon(request.serviceType),
              color: Colors.white,
              size: 32,
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  request.serviceType,
                  style: AppTextStyles.heading3,
                ),
                Text(
                  'Solicitud #${request.id}',
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusSection() {
    Color statusColor;
    String statusText;
    IconData statusIcon;

    switch (request.status) {
      case 'Pendiente':
        statusColor = AppColors.warning;
        statusText = 'Pendiente';
        statusIcon = Icons.hourglass_empty;
        break;
      case 'Asignado':
        statusColor = AppColors.primary;
        statusText = 'Asignado';
        statusIcon = Icons.assignment_ind;
        break;
      case 'Completado':
        statusColor = AppColors.success;
        statusText = 'Completado';
        statusIcon = Icons.check_circle;
        break;
      case 'Cancelado':
        statusColor = AppColors.danger;
        statusText = 'Cancelado';
        statusIcon = Icons.cancel;
        break;
      default:
        statusColor = AppColors.textSecondary;
        statusText = request.status;
        statusIcon = Icons.info;
    }

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
        border: Border.all(color: statusColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(statusIcon, color: statusColor),
          const SizedBox(width: AppSpacing.sm),
          Text(
            'Estado: $statusText',
            style: AppTextStyles.bodyMedium.copyWith(
              fontWeight: FontWeight.w600,
              color: statusColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescriptionSection() {
    return _buildInfoCard(
      title: 'Descripcion del Trabajo',
      icon: Icons.description,
      child: Text(
        request.description,
        style: AppTextStyles.bodyMedium,
      ),
    );
  }

  Widget _buildPriceSection() {
    final formatter = NumberFormat.currency(
      locale: 'es_AR',
      symbol: '\$',
      decimalDigits: 0,
    );

    return _buildInfoCard(
      title: 'Precio Cotizado',
      icon: Icons.attach_money,
      child: Text(
        formatter.format(request.priceQuoted),
        style: AppTextStyles.heading2.copyWith(
          color: AppColors.success,
        ),
      ),
    );
  }

  Widget _buildLocationSection() {
    return _buildInfoCard(
      title: 'Ubicacion',
      icon: Icons.location_on,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Latitud: ${request.lat.toStringAsFixed(6)}',
            style: AppTextStyles.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Longitud: ${request.lon.toStringAsFixed(6)}',
            style: AppTextStyles.bodyMedium,
          ),
          const SizedBox(height: AppSpacing.md),
          CustomButton(
            text: 'Ver en Mapa',
            icon: Icons.map,
            type: ButtonType.secondary,
            onPressed: () {
              // TODO: Open map with location
            },
            fullWidth: true,
          ),
        ],
      ),
    );
  }

  Widget _buildDatesSection() {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm', 'es_AR');

    return _buildInfoCard(
      title: 'Fechas',
      icon: Icons.calendar_today,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDateRow('Creado', dateFormat.format(request.createdAt)),
          const SizedBox(height: AppSpacing.sm),
          _buildDateRow('Actualizado', dateFormat.format(request.updatedAt)),
        ],
      ),
    );
  }

  Widget _buildDateRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTextStyles.bodySmall,
        ),
        Text(
          value,
          style: AppTextStyles.bodyMedium.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard({
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: AppColors.primary),
              const SizedBox(width: AppSpacing.sm),
              Text(
                title,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.lg),
          child,
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    List<Widget> buttons = [];

    if (isProvider) {
      // Provider actions
      if (request.isPending && onAccept != null) {
        buttons.add(
          CustomButton(
            text: 'Aceptar Trabajo',
            icon: Icons.check,
            onPressed: () {
              Navigator.pop(context);
              onAccept!();
            },
            fullWidth: true,
          ),
        );
      } else if (request.isAssigned && onComplete != null) {
        buttons.add(
          CustomButton(
            text: 'Marcar como Completado',
            icon: Icons.done_all,
            onPressed: () {
              Navigator.pop(context);
              onComplete!();
            },
            fullWidth: true,
          ),
        );
      }
    } else {
      // Demandante actions
      if (request.isPending && onCancel != null) {
        buttons.add(
          CustomButton(
            text: 'Cancelar Solicitud',
            icon: Icons.cancel,
            type: ButtonType.danger,
            onPressed: () {
              Navigator.pop(context);
              onCancel!();
            },
            fullWidth: true,
          ),
        );
      }
    }

    if (buttons.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      children: buttons,
    );
  }
}
