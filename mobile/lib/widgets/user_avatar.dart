import 'package:flutter/material.dart';
import '../utils/constants.dart';

/// User Avatar Widget
/// Animated avatar with initials or image
/// Supports online status indicator
class UserAvatar extends StatelessWidget {
  final String? name;
  final String? imageUrl;
  final double size;
  final bool isOnline;
  final VoidCallback? onTap;
  final Color? backgroundColor;

  const UserAvatar({
    Key? key,
    this.name,
    this.imageUrl,
    this.size = 48,
    this.isOnline = false,
    this.onTap,
    this.backgroundColor,
  }) : super(key: key);

  String get _initials {
    if (name == null || name!.isEmpty) return '?';

    final parts = name!.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name![0].toUpperCase();
  }

  Color get _backgroundColor {
    if (backgroundColor != null) return backgroundColor!;

    // Generate consistent color from name
    if (name == null || name!.isEmpty) return AppColors.primary;

    final colors = [
      AppColors.primary,
      AppColors.secondary,
      AppColors.warning,
      const Color(0xFF8B5CF6), // Purple
      const Color(0xFFEC4899), // Pink
      const Color(0xFF06B6D4), // Cyan
    ];

    final index = name!.codeUnits.reduce((a, b) => a + b) % colors.length;
    return colors[index];
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        children: [
          // Avatar circle
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: _backgroundColor,
              boxShadow: [
                BoxShadow(
                  color: _backgroundColor.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: imageUrl != null
                ? ClipOval(
                    child: Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildInitials();
                      },
                    ),
                  )
                : _buildInitials(),
          ),

          // Online indicator
          if (isOnline)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                width: size * 0.3,
                height: size * 0.3,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.success,
                  border: Border.all(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    width: 2,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInitials() {
    return Center(
      child: Text(
        _initials,
        style: TextStyle(
          color: Colors.white,
          fontSize: size * 0.4,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

/// Animated avatar with hero support
class HeroAvatar extends StatelessWidget {
  final String heroTag;
  final String? name;
  final String? imageUrl;
  final double size;
  final bool isOnline;
  final VoidCallback? onTap;

  const HeroAvatar({
    Key? key,
    required this.heroTag,
    this.name,
    this.imageUrl,
    this.size = 48,
    this.isOnline = false,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: heroTag,
      child: UserAvatar(
        name: name,
        imageUrl: imageUrl,
        size: size,
        isOnline: isOnline,
        onTap: onTap,
      ),
    );
  }
}

/// Avatar group for showing multiple users
class AvatarGroup extends StatelessWidget {
  final List<String> names;
  final int maxVisible;
  final double size;
  final double overlap;

  const AvatarGroup({
    Key? key,
    required this.names,
    this.maxVisible = 3,
    this.size = 32,
    this.overlap = 8,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final visibleCount = names.length > maxVisible ? maxVisible : names.length;
    final extraCount = names.length - maxVisible;

    return SizedBox(
      width: (size - overlap) * visibleCount + overlap + (extraCount > 0 ? size : 0),
      height: size,
      child: Stack(
        children: [
          // Visible avatars
          for (int i = 0; i < visibleCount; i++)
            Positioned(
              left: (size - overlap) * i,
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    width: 2,
                  ),
                ),
                child: UserAvatar(
                  name: names[i],
                  size: size - 4,
                ),
              ),
            ),

          // Extra count indicator
          if (extraCount > 0)
            Positioned(
              left: (size - overlap) * visibleCount,
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.textSecondary,
                  border: Border.all(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    width: 2,
                  ),
                ),
                child: Center(
                  child: Text(
                    '+$extraCount',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: size * 0.35,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
