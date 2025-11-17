import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/service_request.dart';
import '../utils/constants.dart';

/// Service Request Card Widget
/// Reusable, accessible, well-designed
/// Follows Material Design 3 guidelines
class ServiceRequestCard extends StatelessWidget {
  final ServiceRequest request;
  final VoidCallback? onTap;
  final Widget? actionButton;

  const ServiceRequestCard({
    Key? key,
    required this.request,
    this.onTap,
    this.actionButton,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Service type + Status badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Service type with icon
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppSpacing.sm),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(AppBorderRadius.md),
                          ),
                          child: Icon(
                            AppConstants.getServiceIcon(request.serviceType),
                            size: 20,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Text(
                            request.serviceType,
                            style: AppTextStyles.heading3.copyWith(fontSize: 18),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Status badge
                  _buildStatusBadge(request.status),
                ],
              ),

              const SizedBox(height: AppSpacing.md),

              // Description
              Text(
                request.description,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: AppSpacing.md),

              // Details grid
              Row(
                children: [
                  Expanded(
                    child: _buildDetailItem(
                      icon: Icons.location_on_outlined,
                      label: 'Ubicación',
                      value: '${request.lat.toStringAsFixed(4)}, ${request.lon.toStringAsFixed(4)}',
                    ),
                  ),
                  if (request.priceQuoted != null) ...[
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: _buildDetailItem(
                        icon: Icons.attach_money,
                        label: 'Precio estimado',
                        value: '\$${request.priceQuoted!.toStringAsFixed(0)}',
                        valueColor: AppColors.success,
                      ),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: AppSpacing.sm),

              // Date
              _buildDetailItem(
                icon: Icons.calendar_today_outlined,
                label: 'Publicado',
                value: _formatDate(request.createdAt),
              ),

              // Action button
              if (actionButton != null) ...[
                const SizedBox(height: AppSpacing.md),
                actionButton!,
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color backgroundColor;
    Color textColor;

    switch (status) {
      case 'Pendiente':
        backgroundColor = AppColors.warning.withOpacity(0.1);
        textColor = AppColors.warning;
        break;
      case 'Asignado':
        backgroundColor = AppColors.primary.withOpacity(0.1);
        textColor = AppColors.primary;
        break;
      case 'Completado':
        backgroundColor = AppColors.success.withOpacity(0.1);
        textColor = AppColors.success;
        break;
      case 'Cancelado':
        backgroundColor = AppColors.danger.withOpacity(0.1);
        textColor = AppColors.danger;
        break;
      default:
        backgroundColor = Colors.grey.withOpacity(0.1);
        textColor = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppBorderRadius.full),
      ),
      child: Text(
        status,
        style: AppTextStyles.bodySmall.copyWith(
          color: textColor,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildDetailItem({
    required IconData icon,
    required String label,
    required String value,
    Color? valueColor,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          size: 16,
          color: AppColors.textSecondary,
        ),
        const SizedBox(width: AppSpacing.xs),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.bodySmall,
              ),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                  color: valueColor ?? AppColors.textPrimary,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return 'Hace ${difference.inMinutes} min';
      }
      return 'Hace ${difference.inHours}h';
    } else if (difference.inDays < 7) {
      return 'Hace ${difference.inDays}d';
    } else {
      return DateFormat('dd/MM/yyyy').format(date);
    }
  }
}
