import 'package:flutter/material.dart';
import '../models/rating.dart';
import '../utils/constants.dart';

/// Rating Display Widget
/// Shows star rating in various formats
class RatingDisplay extends StatelessWidget {
  final double rating;
  final int totalRatings;
  final bool showCount;
  final double size;
  final MainAxisAlignment alignment;

  const RatingDisplay({
    Key? key,
    required this.rating,
    this.totalRatings = 0,
    this.showCount = true,
    this.size = 16,
    this.alignment = MainAxisAlignment.start,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: alignment,
      mainAxisSize: MainAxisSize.min,
      children: [
        ...List.generate(5, (index) {
          final starNumber = index + 1;
          IconData iconData;
          Color color;

          if (rating >= starNumber) {
            iconData = Icons.star;
            color = AppColors.warning;
          } else if (rating >= starNumber - 0.5) {
            iconData = Icons.star_half;
            color = AppColors.warning;
          } else {
            iconData = Icons.star_border;
            color = AppColors.textSecondary;
          }

          return Icon(iconData, size: size, color: color);
        }),
        if (showCount && totalRatings > 0) ...[
          const SizedBox(width: AppSpacing.xs),
          Text(
            '(${totalRatings})',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}

/// Compact rating display with number
class RatingBadge extends StatelessWidget {
  final double rating;
  final int? totalRatings;

  const RatingBadge({
    Key? key,
    required this.rating,
    this.totalRatings,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: _getBackgroundColor(rating),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.star,
            size: 14,
            color: Colors.white,
          ),
          const SizedBox(width: AppSpacing.xs),
          Text(
            rating.toStringAsFixed(1),
            style: AppTextStyles.bodySmall.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          if (totalRatings != null) ...[
            Text(
              ' ($totalRatings)',
              style: AppTextStyles.bodySmall.copyWith(
                color: Colors.white.withOpacity(0.8),
                fontSize: 10,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color _getBackgroundColor(double rating) {
    if (rating >= 4.0) return AppColors.success;
    if (rating >= 3.0) return AppColors.warning;
    return AppColors.danger;
  }
}

/// Rating card for showing individual reviews
class RatingCard extends StatelessWidget {
  final Rating rating;

  const RatingCard({
    Key? key,
    required this.rating,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RatingDisplay(
                rating: rating.score.toDouble(),
                showCount: false,
              ),
              Text(
                _formatDate(rating.createdAt),
                style: AppTextStyles.bodySmall,
              ),
            ],
          ),
          if (rating.comment != null && rating.comment!.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(
              rating.comment!,
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Hoy';
    } else if (difference.inDays < 7) {
      return 'Hace ${difference.inDays}d';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
