import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/request_provider.dart';
import '../../widgets/service_request_card.dart';
import '../../widgets/shimmer_loading.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/error_state.dart';
import '../../utils/constants.dart';
import '../common/request_details_screen.dart';

/// Demandante Dashboard
/// Enterprise-grade implementation with:
/// - Pull-to-refresh
/// - Shimmer loading
/// - Empty states
/// - Error handling with retry
/// - Tabs for different request states
/// - Analytics ready
class DemandanteDashboard extends StatefulWidget {
  const DemandanteDashboard({Key? key}) : super(key: key);

  @override
  State<DemandanteDashboard> createState() => _DemandanteDashboardState();
}

class _DemandanteDashboardState extends State<DemandanteDashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Load data on mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RequestProvider>().loadMyRequests();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _handleRefresh() async {
    await context.read<RequestProvider>().loadMyRequests(forceRefresh: true);
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
              Navigator.of(context).pushReplacementNamed('/login');
            },
            child: const Text('Cerrar Sesión'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Solicitudes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
            tooltip: 'Cerrar sesión',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Pendientes'),
            Tab(text: 'Asignados'),
            Tab(text: 'Completados'),
          ],
        ),
      ),
      body: Consumer<RequestProvider>(
        builder: (context, requestProvider, child) {
          // Loading state with shimmer
          if (requestProvider.isLoading) {
            return _buildLoadingState();
          }

          // Error state with retry
          if (requestProvider.hasError) {
            return ErrorState(
              message: requestProvider.error!,
              onRetry: () => requestProvider.loadMyRequests(forceRefresh: true),
            );
          }

          // Content with pull-to-refresh
          return RefreshIndicator(
            onRefresh: _handleRefresh,
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildRequestsList(
                  requests: requestProvider.myPendingRequests,
                  emptyWidget: NoRequestsEmpty(
                    onCreateRequest: () {
                      Navigator.of(context).pushNamed('/demandante/new-request');
                    },
                  ),
                ),
                _buildRequestsList(
                  requests: requestProvider.myAssignedRequests,
                  emptyWidget: const EmptyState(
                    icon: Icons.assignment_outlined,
                    title: 'Sin trabajos asignados',
                    message: 'Tus solicitudes asignadas aparecerán aquí.',
                  ),
                ),
                _buildRequestsList(
                  requests: requestProvider.myCompletedRequests,
                  emptyWidget: const EmptyState(
                    icon: Icons.check_circle_outline,
                    title: 'Sin trabajos completados',
                    message: 'Tu historial de trabajos completados aparecerá aquí.',
                  ),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).pushNamed('/demandante/new-request');
        },
        icon: const Icon(Icons.add),
        label: const Text('Nueva Solicitud'),
        backgroundColor: AppColors.primary,
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

  Widget _buildRequestsList({
    required List requests,
    required Widget emptyWidget,
  }) {
    if (requests.isEmpty) {
      // Empty state - always provide guidance
      return emptyWidget;
    }

    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: requests.length,
      itemBuilder: (context, index) {
        final request = requests[index];

        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: ServiceRequestCard(
            request: request,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => RequestDetailsScreen(
                    request: request,
                    isProvider: false,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
