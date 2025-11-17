import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import '../../providers/request_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/error_state.dart';
import '../../utils/constants.dart';

/// New Service Request Screen
/// Production-ready with:
/// - Geolocation with permission handling
/// - Form validation
/// - Loading states
/// - Error handling
/// - Optimistic updates
class NewRequestScreen extends StatefulWidget {
  const NewRequestScreen({Key? key}) : super(key: key);

  @override
  State<NewRequestScreen> createState() => _NewRequestScreenState();
}

class _NewRequestScreenState extends State<NewRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();

  String _selectedServiceType = AppConstants.serviceTypes[0];
  double? _latitude;
  double? _longitude;
  bool _isLoadingLocation = false;
  String? _locationError;

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  /// Gets user's current location
  /// Implements Google's location best practices
  Future<void> _getCurrentLocation() async {
    setState(() {
      _isLoadingLocation = true;
      _locationError = null;
    });

    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Los servicios de ubicación están desactivados.\nActívalos en la configuración.');
      }

      // Check permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Permiso de ubicación denegado');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Permiso de ubicación denegado permanentemente.\nHabílitalo en la configuración de la app.');
      }

      // Get current position
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

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    if (_latitude == null || _longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor obtén tu ubicación primero'),
          backgroundColor: AppColors.danger,
        ),
      );
      return;
    }

    final requestProvider = context.read<RequestProvider>();

    final success = await requestProvider.createRequest(
      description: _descriptionController.text.trim(),
      serviceType: _selectedServiceType,
      lat: _latitude!,
      lon: _longitude!,
    );

    if (!mounted) return;

    if (success) {
      // Success - show confirmation and navigate back
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Solicitud creada exitosamente'),
          backgroundColor: AppColors.success,
        ),
      );

      Navigator.of(context).pop();
    } else {
      // Error - show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(requestProvider.error ?? 'Error al crear solicitud'),
          backgroundColor: AppColors.danger,
          action: SnackBarAction(
            label: 'Reintentar',
            textColor: Colors.white,
            onPressed: _handleSubmit,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nueva Solicitud'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Service Type Selector
              Text(
                'Tipo de Servicio',
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppBorderRadius.lg),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedServiceType,
                    isExpanded: true,
                    items: AppConstants.serviceTypes.map((type) {
                      return DropdownMenuItem(
                        value: type,
                        child: Row(
                          children: [
                            Icon(
                              AppConstants.getServiceIcon(type),
                              size: 20,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Text(type),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedServiceType = value;
                        });
                      }
                    },
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // Description
              CustomTextField(
                label: 'Descripción del Trabajo',
                hint: 'Describe detalladamente el trabajo que necesitas...',
                controller: _descriptionController,
                maxLines: 4,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Por favor describe el trabajo';
                  }
                  if (value.trim().length < 20) {
                    return 'La descripción debe tener al menos 20 caracteres';
                  }
                  return null;
                },
              ),

              const SizedBox(height: AppSpacing.lg),

              // Location Section
              Text(
                'Ubicación del Trabajo',
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Location button
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

              // Location error
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

              // Location coordinates display
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

              // Submit Button
              Consumer<RequestProvider>(
                builder: (context, requestProvider, child) {
                  return CustomButton(
                    text: 'Crear Solicitud',
                    onPressed: _handleSubmit,
                    isLoading: requestProvider.isCreating,
                    fullWidth: true,
                  );
                },
              ),

              const SizedBox(height: AppSpacing.md),

              // Info text
              Text(
                'Un proveedor calificado dentro de tu área recibirá tu solicitud y te contactará pronto.',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
