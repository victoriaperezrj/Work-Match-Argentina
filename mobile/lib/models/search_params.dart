class SearchParams {
  final String? serviceType;
  final String? status;
  final double? minPrice;
  final double? maxPrice;
  final double? lat;
  final double? lon;
  final int? radiusKM;
  final String? sortBy; // 'created_at', 'price', 'distance'
  final String? sortOrder; // 'asc', 'desc'
  final int? limit;
  final int? offset;

  SearchParams({
    this.serviceType,
    this.status,
    this.minPrice,
    this.maxPrice,
    this.lat,
    this.lon,
    this.radiusKM,
    this.sortBy,
    this.sortOrder,
    this.limit,
    this.offset,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = {};

    if (serviceType != null) json['service_type'] = serviceType;
    if (status != null) json['status'] = status;
    if (minPrice != null) json['min_price'] = minPrice;
    if (maxPrice != null) json['max_price'] = maxPrice;
    if (lat != null) json['lat'] = lat;
    if (lon != null) json['lon'] = lon;
    if (radiusKM != null) json['radius_km'] = radiusKM;
    if (sortBy != null) json['sort_by'] = sortBy;
    if (sortOrder != null) json['sort_order'] = sortOrder;
    if (limit != null) json['limit'] = limit;
    if (offset != null) json['offset'] = offset;

    return json;
  }

  SearchParams copyWith({
    String? serviceType,
    String? status,
    double? minPrice,
    double? maxPrice,
    double? lat,
    double? lon,
    int? radiusKM,
    String? sortBy,
    String? sortOrder,
    int? limit,
    int? offset,
  }) {
    return SearchParams(
      serviceType: serviceType ?? this.serviceType,
      status: status ?? this.status,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      lat: lat ?? this.lat,
      lon: lon ?? this.lon,
      radiusKM: radiusKM ?? this.radiusKM,
      sortBy: sortBy ?? this.sortBy,
      sortOrder: sortOrder ?? this.sortOrder,
      limit: limit ?? this.limit,
      offset: offset ?? this.offset,
    );
  }
}
