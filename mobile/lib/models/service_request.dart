class ServiceRequest {
  final int id;
  final int demandanteId;
  final int? providerId;
  final String description;
  final String serviceType;
  final double lat;
  final double lon;
  final String status; // 'Pendiente', 'Asignado', 'Completado', 'Cancelado'
  final double? priceQuoted;
  final DateTime createdAt;
  final DateTime updatedAt;

  ServiceRequest({
    required this.id,
    required this.demandanteId,
    this.providerId,
    required this.description,
    required this.serviceType,
    required this.lat,
    required this.lon,
    required this.status,
    this.priceQuoted,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ServiceRequest.fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as int,
      demandanteId: json['demandante_id'] as int,
      providerId: json['provider_id'] as int?,
      description: json['description'] as String,
      serviceType: json['service_type'] as String,
      lat: (json['lat'] as num).toDouble(),
      lon: (json['lon'] as num).toDouble(),
      status: json['status'] as String,
      priceQuoted: json['price_quoted'] != null ? (json['price_quoted'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'description': description,
      'service_type': serviceType,
      'lat': lat,
      'lon': lon,
    };
  }

  bool get isPending => status == 'Pendiente';
  bool get isAssigned => status == 'Asignado';
  bool get isCompleted => status == 'Completado';
  bool get isCanceled => status == 'Cancelado';
}
