class Report {
  final int id;
  final int reporterId;
  final int reportedId;
  final int? requestId;
  final String reason;
  final String description;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Report({
    required this.id,
    required this.reporterId,
    required this.reportedId,
    this.requestId,
    required this.reason,
    required this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Report.fromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id'],
      reporterId: json['reporter_id'],
      reportedId: json['reported_id'],
      requestId: json['request_id'],
      reason: json['reason'],
      description: json['description'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reporter_id': reporterId,
      'reported_id': reportedId,
      'request_id': requestId,
      'reason': reason,
      'description': description,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  String get reasonDisplay {
    switch (reason) {
      case 'spam':
        return 'Spam';
      case 'inappropriate':
        return 'Contenido inapropiado';
      case 'fraud':
        return 'Fraude';
      case 'harassment':
        return 'Acoso';
      case 'other':
        return 'Otro';
      default:
        return reason;
    }
  }

  String get statusDisplay {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'reviewed':
        return 'Revisado';
      case 'resolved':
        return 'Resuelto';
      case 'dismissed':
        return 'Descartado';
      default:
        return status;
    }
  }
}

class CreateReportRequest {
  final int reportedId;
  final int? requestId;
  final String reason;
  final String description;

  CreateReportRequest({
    required this.reportedId,
    this.requestId,
    required this.reason,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'reported_id': reportedId,
      if (requestId != null) 'request_id': requestId,
      'reason': reason,
      'description': description,
    };
  }
}
