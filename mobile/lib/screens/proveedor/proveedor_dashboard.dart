import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/request_provider.dart';
import '../../providers/profile_provider.dart';
import '../../widgets/service_request_card.dart';
import '../../widgets/shimmer_loading.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/error_state.dart';
import '../../widgets/custom_button.dart';
import '../../utils/constants.dart';

/// Proveedor Dashboard
/// Enterprise implementation with:
/// - Profile completion check
/// - Pull-to-refresh
/// - Shimmer loading
/// - Empty states with actions
/// - Optimistic job acceptance
/// - Error recovery
class ProveedorDashboard extends StatefulWidget {
  const ProveedorDashboard({Key? key}) : super(key: key);

  @override
  State<ProveedorDashboard> createState() => _ProveedorDashboardState();
}

class _ProveedorDashboardState extends State<ProveedorDashboard> {
  @override
  void initState() {
    super.initState();

    // Load data on mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final profileProvider = context.read<ProfileProvider>();
      final requestProvider = context.read<RequestProvider>();

      // Load profile first
      profileProvider.loadProfile().then((_) {
        // Only load requests if profile is complete
        if (profileProvider.isProfileComplete) {
          requestProvider.loadPendingRequests();
        }
      });
    });
  }

  Future<void> _handleRefresh() async {
    await context.read<RequestProvider>().loadPendingRequests(forceRefresh: true);
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cerrar Sesión'),
        content: const Text('¿Estás seguro que deseas cerrar sesión?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              context.read<AuthProvider>().logout();
              context.read<RequestProvider>().clear();
              context.read<ProfileProvider>().clear();
              Navigator.of(context).pushReplacementNamed('/login');
            },
            child: const Text('Cerrar Sesión'),
          ),
        ],
      ),
    );
  }

  Future<void> _handleAcceptJob(int requestId) async {
    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Aceptar Trabajo'),
        content: const Text('¿Deseas aceptar este trabajo?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Aceptar'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    final requestProvider = context.read<RequestProvider>();
    final success = await requestProvider.acceptRequest(requestId);

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Trabajo aceptado exitosamente'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(requestProvider.error ?? 'Error al aceptar trabajo'),
          backgroundColor: AppColors.danger,
          action: SnackBarAction(
            label: 'Reintentar',
            textColor: Colors.white,
            onPressed: () => _handleAcceptJob(requestId),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trabajos Disponibles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () {
              Navigator.of(context).pushNamed('/proveedor/history');
            },
            tooltip: 'Mis trabajos',
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.of(context).pushNamed('/proveedor/profile');
            },
            tooltip: 'Configurar perfil',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
      body: Consumer2<ProfileProvider, RequestProvider>(
        builder: (context, profileProvider, requestProvider, child) {
          // Check if profile is loading
          if (profileProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          // Check if profile is incomplete
          if (!profileProvider.isProfileComplete) {
            return ProfileIncompleteEmpty(
              onSetupProfile: () {
                Navigator.of(context).pushNamed('/proveedor/profile');
              },
            );
          }

          // Loading state
          if (requestProvider.isLoading) {
            return _buildLoadingState();
          }

          // Error state
          if (requestProvider.hasError) {
            return ErrorState(
              message: requestProvider.error!,
              onRetry: () => requestProvider.loadPendingRequests(forceRefresh: true),
            );
          }

          // Content with pull-to-refresh
          return RefreshIndicator(
            onRefresh: _handleRefresh,
            child: requestProvider.pendingRequests.isEmpty
                ? NoPendingJobsEmpty(
                    onRefresh: _handleRefresh,
                  )
                : _buildJobsList(requestProvider.pendingRequests),
          );
        },
      ),
    );
  }

  Widget _buildLoadingState() {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: 3,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: const RequestCardShimmer(),
        );
      },
    );
  }

  Widget _buildJobsList(List requests) {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: requests.length,
      itemBuilder: (context, index) {
        final request = requests[index];

        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: ServiceRequestCard(
            request: request,
            actionButton: CustomButton(
              text: 'Aceptar Trabajo',
              icon: Icons.check,
              onPressed: () => _handleAcceptJob(request.id),
              fullWidth: true,
            ),
          ),
        );
      },
    );
  }
}
