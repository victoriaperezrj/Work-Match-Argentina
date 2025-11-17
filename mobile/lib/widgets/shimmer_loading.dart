import 'package:flutter/material.dart';
import '../utils/constants.dart';

/// Shimmer loading effect
/// Used by Meta, Netflix, LinkedIn for skeleton screens
///
/// Provides better perceived performance than spinners
class ShimmerLoading extends StatefulWidget {
  final Widget child;
  final bool isLoading;

  const ShimmerLoading({
    Key? key,
    required this.child,
    required this.isLoading,
  }) : super(key: key);

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();

    _animation = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOutSine),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isLoading) {
      return widget.child;
    }

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: const [
                Color(0xFFEBEBF4),
                Color(0xFFF4F4F4),
                Color(0xFFEBEBF4),
              ],
              stops: [
                _animation.value - 1,
                _animation.value,
                _animation.value + 1,
              ],
              tileMode: TileMode.clamp,
            ).createShader(bounds);
          },
          child: widget.child,
        );
      },
    );
  }
}

/// Shimmer container for skeleton screens
class ShimmerContainer extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const ShimmerContainer({
    Key? key,
    required this.width,
    required this.height,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: borderRadius ?? BorderRadius.circular(AppBorderRadius.md),
      ),
    );
  }
}

/// Request card shimmer for loading state
class RequestCardShimmer extends StatelessWidget {
  const RequestCardShimmer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      isLoading: true,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ShimmerContainer(
                  width: 120,
                  height: 24,
                  borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                ),
                ShimmerContainer(
                  width: 80,
                  height: 24,
                  borderRadius: BorderRadius.circular(AppBorderRadius.full),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),
            ShimmerContainer(
              width: double.infinity,
              height: 16,
              borderRadius: BorderRadius.circular(AppBorderRadius.sm),
            ),
            const SizedBox(height: AppSpacing.sm),
            ShimmerContainer(
              width: 200,
              height: 16,
              borderRadius: BorderRadius.circular(AppBorderRadius.sm),
            ),
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(
                  child: ShimmerContainer(
                    width: double.infinity,
                    height: 14,
                    borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: ShimmerContainer(
                    width: double.infinity,
                    height: 14,
                    borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
