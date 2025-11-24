import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/request_provider.dart';
import '../../providers/rating_provider.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({Key? key}) : super(key: key);

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final requestProvider = Provider.of<RequestProvider>(context, listen: false);
    final ratingProvider = Provider.of<RatingProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    await requestProvider.loadMyRequests();

    if (authProvider.user != null) {
      await ratingProvider.loadUserSummary(authProvider.user!.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Estadísticas'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: Consumer3<AuthProvider, RequestProvider, RatingProvider>(
          builder: (context, authProvider, requestProvider, ratingProvider, child) {
            if (requestProvider.isLoading || ratingProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            final isDemandante = authProvider.isDemandante;
            final allRequests = requestProvider.myRequests;

            // Calculate statistics
            final totalRequests = allRequests.length;
            final pendingRequests = allRequests.where((r) => r.status == 'Pendiente').length;
            final assignedRequests = allRequests.where((r) => r.status == 'Asignado').length;
            final completedRequests = allRequests.where((r) => r.status == 'Completado').length;

            final summary = ratingProvider.currentUserSummary;
            final averageRating = summary?.averageScore ?? 0.0;
            final totalRatings = summary?.totalRatings ?? 0;

            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // User type card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Icon(
                          isDemandante ? Icons.person : Icons.work,
                          size: 48,
                          color: Theme.of(context).primaryColor,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isDemandante ? 'Demandante' : 'Proveedor',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          authProvider.user?.email ?? '',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Rating summary
                if (totalRatings > 0)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Calificación',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.star, color: Colors.amber, size: 32),
                              const SizedBox(width: 8),
                              Text(
                                averageRating.toStringAsFixed(1),
                                style: const TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '/ 5.0',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Center(
                            child: Text(
                              '$totalRatings calificaciones',
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 16),

                // Requests statistics
                const Text(
                  'Solicitudes',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),

                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Total',
                        totalRequests.toString(),
                        Icons.list,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildStatCard(
                        'Completados',
                        completedRequests.toString(),
                        Icons.check_circle,
                        Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Pendientes',
                        pendingRequests.toString(),
                        Icons.pending,
                        Colors.orange,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildStatCard(
                        'En Progreso',
                        assignedRequests.toString(),
                        Icons.assignment,
                        Colors.purple,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Completion rate
                if (totalRequests > 0)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Tasa de Completitud',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          LinearProgressIndicator(
                            value: totalRequests > 0 ? completedRequests / totalRequests : 0,
                            minHeight: 8,
                            backgroundColor: Colors.grey[200],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${((completedRequests / totalRequests) * 100).toStringAsFixed(1)}% completado',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
