import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/service_request.dart';
import '../../providers/rating_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../utils/constants.dart';

/// Rating Screen
/// Allows users to rate after a completed job
/// Both demandantes and providers can rate each other
class RatingScreen extends StatefulWidget {
  final ServiceRequest request;
  final bool isProvider;

  const RatingScreen({
    Key? key,
    required this.request,
    required this.isProvider,
  }) : super(key: key);

  @override
  State<RatingScreen> createState() => _RatingScreenState();
}

class _RatingScreenState extends State<RatingScreen> {
  int _selectedRating = 0;
  final _commentController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_selectedRating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor selecciona una calificacion'),
          backgroundColor: AppColors.warning,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    final ratingProvider = context.read<RatingProvider>();
    final success = await ratingProvider.submitRating(
      requestId: widget.request.id,
      score: _selectedRating,
      comment: _commentController.text.trim().isEmpty
          ? null
          : _commentController.text.trim(),
    );

    if (!mounted) return;

    setState(() {
      _isSubmitting = false;
    });

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Gracias por tu calificacion'),
          backgroundColor: AppColors.success,
        ),
      );
      Navigator.of(context).pop(true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(ratingProvider.error ?? 'Error al enviar calificacion'),
          backgroundColor: AppColors.danger,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calificar Servicio'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            _buildHeader(),

            const SizedBox(height: AppSpacing.xl),

            // Star Rating
            _buildStarRating(),

            const SizedBox(height: AppSpacing.lg),

            // Rating label
            if (_selectedRating > 0)
              Center(
                child: Text(
                  _getRatingLabel(_selectedRating),
                  style: AppTextStyles.heading3.copyWith(
                    color: _getRatingColor(_selectedRating),
                  ),
                ),
              ),

            const SizedBox(height: AppSpacing.xl),

            // Comment field
            CustomTextField(
              label: 'Comentario (opcional)',
              hint: 'Comparte tu experiencia...',
              controller: _commentController,
              maxLines: 4,
            ),

            const SizedBox(height: AppSpacing.xl),

            // Submit button
            CustomButton(
              text: 'Enviar Calificacion',
              onPressed: _handleSubmit,
              isLoading: _isSubmitting,
              fullWidth: true,
            ),

            const SizedBox(height: AppSpacing.md),

            // Skip button
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(
                'Omitir por ahora',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
      ),
      child: Column(
        children: [
          Icon(
            AppConstants.getServiceIcon(widget.request.serviceType),
            size: 48,
            color: AppColors.primary,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            widget.request.serviceType,
            style: AppTextStyles.heading3,
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            widget.isProvider
                ? 'Califica al cliente'
                : 'Califica al proveedor',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStarRating() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        final starNumber = index + 1;
        final isSelected = starNumber <= _selectedRating;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedRating = starNumber;
            });
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
            child: AnimatedScale(
              scale: isSelected ? 1.1 : 1.0,
              duration: const Duration(milliseconds: 150),
              child: Icon(
                isSelected ? Icons.star : Icons.star_border,
                size: 48,
                color: isSelected ? AppColors.warning : AppColors.textSecondary,
              ),
            ),
          ),
        );
      }),
    );
  }

  String _getRatingLabel(int rating) {
    switch (rating) {
      case 1:
        return 'Muy malo';
      case 2:
        return 'Malo';
      case 3:
        return 'Regular';
      case 4:
        return 'Bueno';
      case 5:
        return 'Excelente';
      default:
        return '';
    }
  }

  Color _getRatingColor(int rating) {
    switch (rating) {
      case 1:
      case 2:
        return AppColors.danger;
      case 3:
        return AppColors.warning;
      case 4:
      case 5:
        return AppColors.success;
      default:
        return AppColors.textPrimary;
    }
  }
}
