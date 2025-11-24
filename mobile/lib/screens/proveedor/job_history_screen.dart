import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/request_provider.dart';
import '../../widgets/service_request_card.dart';
import '../../widgets/shimmer_loading.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/error_state.dart';
import '../../widgets/custom_button.dart';
import '../../utils/constants.dart';
import '../common/request_details_screen.dart';

/// Provider Job History Screen
/// Shows assigned and completed jobs for the provider
/// Allows marking jobs as completed
class JobHistoryScreen extends StatefulWidget {
  const JobHistoryScreen({Key? key}) : super(key: key);

  @override
  State<JobHistoryScreen> createState() => _JobHistoryScreenState();
}

class _JobHistoryScreenState extends State<JobHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    // Load data on mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RequestProvider>().loadMyJobs();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _handleRefresh() async {
    await context.read<RequestProvider>().loadMyJobs(forceRefresh: true);
  }

  Future<void> _handleCompleteJob(int requestId) async {
    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Completar Trabajo'),
        content: const Text(
          '¿Confirmas que has completado este trabajo?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Confirmar'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    final requestProvider = context.read<RequestProvider>();
    final success = await requestProvider.completeRequest(requestId);

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Trabajo marcado como completado'),
          backgroundColor: AppColors.success,
        ),
      );
      // Refresh the lists
      requestProvider.loadMyJobs(forceRefresh: true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(requestProvider.error ?? 'Error al completar trabajo'),
          backgroundColor: AppColors.danger,
          action: SnackBarAction(
            label: 'Reintentar',
            textColor: Colors.white,
            onPressed: () => _handleCompleteJob(requestId),
          ),
        ),
      );
    }
  }

  void _navigateToDetails(request, {bool canComplete = false}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RequestDetailsScreen(
          request: request,
          isProvider: true,
          onComplete: canComplete ? () => _handleCompleteJob(request.id) : null,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Trabajos'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'En Progreso'),
            Tab(text: 'Completados'),
          ],
        ),
      ),
      body: Consumer<RequestProvider>(
        builder: (context, requestProvider, child) {
          // Loading state with shimmer
          if (requestProvider.isLoadingJobs) {
            return _buildLoadingState();
          }

          // Error state with retry
          if (requestProvider.hasJobsError) {
            return ErrorState(
              message: requestProvider.jobsError!,
              onRetry: () => requestProvider.loadMyJobs(forceRefresh: true),
            );
          }

          // Content with pull-to-refresh
          return RefreshIndicator(
            onRefresh: _handleRefresh,
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildJobsList(
                  requests: requestProvider.myAssignedJobs,
                  emptyWidget: const EmptyState(
                    icon: Icons.work_outline,
                    title: 'Sin trabajos en progreso',
                    message: 'Los trabajos que aceptes apareceran aqui.',
                  ),
                  canComplete: true,
                ),
                _buildJobsList(
                  requests: requestProvider.myCompletedJobs,
                  emptyWidget: const EmptyState(
                    icon: Icons.history,
                    title: 'Sin historial',
                    message: 'Tu historial de trabajos completados aparecera aqui.',
                  ),
                  canComplete: false,
                ),
              ],
            ),
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

  Widget _buildJobsList({
    required List requests,
    required Widget emptyWidget,
    required bool canComplete,
  }) {
    if (requests.isEmpty) {
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
            onTap: () => _navigateToDetails(request, canComplete: canComplete),
            actionButton: canComplete
                ? CustomButton(
                    text: 'Completar',
                    icon: Icons.done_all,
                    onPressed: () => _handleCompleteJob(request.id),
                    fullWidth: true,
                  )
                : null,
          ),
        );
      },
    );
  }
}
