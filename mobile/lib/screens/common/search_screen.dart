import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/search_params.dart';
import '../../providers/search_provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/constants.dart';
import '../../widgets/request_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _formKey = GlobalKey<FormState>();

  String? _selectedServiceType;
  String? _selectedStatus;
  double _minPrice = 0;
  double _maxPrice = 100000;
  int _radiusKM = 50;
  String _sortBy = 'created_at';
  String _sortOrder = 'desc';
  bool _showFilters = false;

  final List<String> _serviceTypes = [
    'Plomería',
    'Electricidad',
    'Limpieza',
    'Carpintería',
    'Pintura',
    'Jardinería',
    'Mudanza',
    'Otros',
  ];

  final List<String> _statusOptions = [
    'Pendiente',
    'Asignado',
    'Completado',
  ];

  @override
  void initState() {
    super.initState();
    // Perform initial search with default params
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _performSearch();
    });
  }

  void _performSearch() {
    final searchProvider = Provider.of<SearchProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    final params = SearchParams(
      serviceType: _selectedServiceType,
      status: _selectedStatus,
      minPrice: _minPrice > 0 ? _minPrice : null,
      maxPrice: _maxPrice < 100000 ? _maxPrice : null,
      lat: authProvider.user?.lat,
      lon: authProvider.user?.lon,
      radiusKM: _radiusKM,
      sortBy: _sortBy,
      sortOrder: _sortOrder,
      limit: 50,
    );

    searchProvider.search(params);
  }

  void _resetFilters() {
    setState(() {
      _selectedServiceType = null;
      _selectedStatus = null;
      _minPrice = 0;
      _maxPrice = 100000;
      _radiusKM = 50;
      _sortBy = 'created_at';
      _sortOrder = 'desc';
    });
    _performSearch();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Buscar Servicios'),
        actions: [
          IconButton(
            icon: Icon(_showFilters ? Icons.filter_list_off : Icons.filter_list),
            onPressed: () {
              setState(() {
                _showFilters = !_showFilters;
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          if (_showFilters) _buildFilters(),
          Expanded(child: _buildResults()),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filtros',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Service Type Dropdown
              DropdownButtonFormField<String>(
                value: _selectedServiceType,
                decoration: const InputDecoration(
                  labelText: 'Tipo de Servicio',
                  border: OutlineInputBorder(),
                ),
                items: [
                  const DropdownMenuItem(value: null, child: Text('Todos')),
                  ..._serviceTypes.map((type) => DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  )).toList(),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedServiceType = value;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Status Dropdown
              DropdownButtonFormField<String>(
                value: _selectedStatus,
                decoration: const InputDecoration(
                  labelText: 'Estado',
                  border: OutlineInputBorder(),
                ),
                items: [
                  const DropdownMenuItem(value: null, child: Text('Todos')),
                  ..._statusOptions.map((status) => DropdownMenuItem(
                    value: status,
                    child: Text(status),
                  )).toList(),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedStatus = value;
                  });
                },
              ),
              const SizedBox(height: 16),

              // Price Range
              const Text('Rango de Precio'),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Mínimo',
                        prefixText: '\$',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      initialValue: _minPrice > 0 ? _minPrice.toString() : '',
                      onChanged: (value) {
                        setState(() {
                          _minPrice = double.tryParse(value) ?? 0;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Máximo',
                        prefixText: '\$',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      initialValue: _maxPrice < 100000 ? _maxPrice.toString() : '',
                      onChanged: (value) {
                        setState(() {
                          _maxPrice = double.tryParse(value) ?? 100000;
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Radius Slider
              Text('Radio de búsqueda: $_radiusKM km'),
              Slider(
                value: _radiusKM.toDouble(),
                min: 5,
                max: 100,
                divisions: 19,
                label: '$_radiusKM km',
                onChanged: (value) {
                  setState(() {
                    _radiusKM = value.toInt();
                  });
                },
              ),
              const SizedBox(height: 16),

              // Sort Options
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _sortBy,
                      decoration: const InputDecoration(
                        labelText: 'Ordenar por',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'created_at', child: Text('Fecha')),
                        DropdownMenuItem(value: 'price_quoted', child: Text('Precio')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _sortBy = value!;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _sortOrder,
                      decoration: const InputDecoration(
                        labelText: 'Orden',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'desc', child: Text('Descendente')),
                        DropdownMenuItem(value: 'asc', child: Text('Ascendente')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _sortOrder = value!;
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _resetFilters,
                      child: const Text('Limpiar'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _performSearch,
                      child: const Text('Buscar'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResults() {
    return Consumer<SearchProvider>(
      builder: (context, searchProvider, child) {
        if (searchProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (searchProvider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(searchProvider.error!),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _performSearch,
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          );
        }

        if (searchProvider.searchResults.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
                const SizedBox(height: 16),
                Text(
                  'No se encontraron resultados',
                  style: TextStyle(color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Text(
                  'Prueba ajustando los filtros',
                  style: TextStyle(color: Colors.grey[400], fontSize: 12),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () async {
            _performSearch();
          },
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: searchProvider.searchResults.length,
            itemBuilder: (context, index) {
              return RequestCard(
                request: searchProvider.searchResults[index],
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/request-details',
                    arguments: searchProvider.searchResults[index],
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
