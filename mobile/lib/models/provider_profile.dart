class ProviderProfile {
  final int id;
  final int userId;
  final List<String> services;
  final int radiusKm;
  final double lat;
  final double lon;
  final double rating;
  final DateTime createdAt;
  final DateTime updatedAt;

  ProviderProfile({
    required this.id,
    required this.userId,
    required this.services,
    required this.radiusKm,
    required this.lat,
    required this.lon,
    required this.rating,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ProviderProfile.fromJson(Map<String, dynamic> json) {
    return ProviderProfile(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      services: (json['services'] as List<dynamic>).map((e) => e as String).toList(),
      radiusKm: json['radius_km'] as int,
      lat: (json['lat'] as num).toDouble(),
      lon: (json['lon'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'services': services,
      'radius_km': radiusKm,
      'lat': lat,
      'lon': lon,
    };
  }
}
