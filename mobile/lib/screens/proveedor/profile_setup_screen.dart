import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import '../../providers/profile_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/error_state.dart';
import '../../utils/constants.dart';

/// Provider Profile Setup Screen
/// Production-ready with:
/// - Multi-select for services
/// - Geolocation
/// - Form validation
/// - Loading states
/// - Error handling
class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({Key? key}) : super(key: key);

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();

  Set<String> _selectedServices = {};
  int _radiusKm = 10;
  double? _latitude;
  double? _longitude;
  bool _isLoadingLocation = false;
  String? _locationError;

  @override
  void initState() {
    super.initState();

    // Load existing profile data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final profileProvider = context.read<ProfileProvider>();
      profileProvider.loadProfile().then((_) {
        final profile = profileProvider.profile;
        if (profile != null) {
          setState(() {
            _selectedServices = Set.from(profile.services);
            _radiusKm = profile.radiusKm;
            _latitude = profile.lat != 0 ? profile.lat : null;
            _longitude = profile.lon != 0 ? profile.lon : null;
          });
        }
      });
    });
  }

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isLoadingLocation = true;
      _locationError = null;
    });

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Los servicios de ubicación están desactivados.');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Permiso de ubicación denegado');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Permiso de ubicación denegado permanentemente.');
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _latitude = position.latitude;
        _longitude = position.longitude;
        _isLoadingLocation = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Ubicación obtenida'),
            backgroundColor: AppColors.success,
            duration: Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      setState(() {
        _locationError = e.toString().replaceAll('Exception: ', '');
        _isLoadingLocation = false;
      });
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedServices.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecciona al menos un servicio'),
          backgroundColor: AppColors.danger,
        ),
      );
      return;
    }

    if (_latitude == null || _longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor obtén tu ubicación'),
          backgroundColor: AppColors.danger,
        ),
      );
      return;
    }

    final profileProvider = context.read<ProfileProvider>();

    final success = await profileProvider.updateProfile(
      services: _selectedServices.toList(),
      radiusKm: _radiusKm,
      lat: _latitude!,
      lon: _longitude!,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Perfil actualizado exitosamente'),
          backgroundColor: AppColors.success,
        ),
      );

      Navigator.of(context).pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(profileProvider.error ?? 'Error al actualizar perfil'),
          backgroundColor: AppColors.danger,
          action: SnackBarAction(
            label: 'Reintentar',
            textColor: Colors.white,
            onPressed: _handleSave,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configurar Perfil'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Services Selection
              Text(
                'Servicios que Ofrezco',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Selecciona los servicios que puedes proporcionar',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Services grid
              Wrap(
                spacing: AppSpacing.sm,
                runSpacing: AppSpacing.sm,
                children: AppConstants.serviceTypes.map((service) {
                  final isSelected = _selectedServices.contains(service);

                  return FilterChip(
                    label: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          AppConstants.getServiceIcon(service),
                          size: 16,
                          color: isSelected ? Colors.white : AppColors.primary,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Text(service),
                      ],
                    ),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedServices.add(service);
                        } else {
                          _selectedServices.remove(service);
                        }
                      });
                    },
                    selectedColor: AppColors.primary,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: AppSpacing.xl),

              // Coverage Radius
              Text(
                'Radio de Cobertura',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Distancia máxima para trabajos: $_radiusKm km',
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
              Slider(
                value: _radiusKm.toDouble(),
                min: 1,
                max: 50,
                divisions: 49,
                label: '$_radiusKm km',
                onChanged: (value) {
                  setState(() {
                    _radiusKm = value.round();
                  });
                },
                activeColor: AppColors.primary,
              ),

              const SizedBox(height: AppSpacing.lg),

              // Location Section
              Text(
                'Mi Ubicación Actual',
                style: AppTextStyles.heading3,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Desde aquí calcularemos la distancia a los trabajos',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              CustomButton(
                text: _latitude == null
                    ? 'Obtener Mi Ubicación'
                    : '✓ Ubicación Obtenida',
                icon: Icons.location_on,
                onPressed: _isLoadingLocation ? null : _getCurrentLocation,
                type: _latitude == null ? ButtonType.secondary : ButtonType.primary,
                isLoading: _isLoadingLocation,
                fullWidth: true,
              ),

              if (_locationError != null) ...[
                const SizedBox(height: AppSpacing.sm),
                InlineError(
                  message: _locationError!,
                  onDismiss: () {
                    setState(() {
                      _locationError = null;
                    });
                  },
                ),
              ],

              if (_latitude != null && _longitude != null) ...[
                const SizedBox(height: AppSpacing.sm),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppBorderRadius.md),
                    border: Border.all(
                      color: AppColors.success.withOpacity(0.3),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.check_circle,
                            color: AppColors.success,
                            size: 20,
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Text(
                            'Ubicación confirmada',
                            style: AppTextStyles.bodyMedium.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.success,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'Lat: ${_latitude!.toStringAsFixed(6)}\nLon: ${_longitude!.toStringAsFixed(6)}',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: AppSpacing.xl),

              // Save Button
              Consumer<ProfileProvider>(
                builder: (context, profileProvider, child) {
                  return CustomButton(
                    text: 'Guardar Perfil',
                    onPressed: _handleSave,
                    isLoading: profileProvider.isUpdating,
                    fullWidth: true,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
