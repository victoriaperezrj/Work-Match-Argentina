/// Rating model for service reviews
/// Supports ratings from demandantes to providers and vice versa
class Rating {
  final int id;
  final int requestId;
  final int fromUserId;
  final int toUserId;
  final int score; // 1-5 stars
  final String? comment;
  final DateTime createdAt;

  Rating({
    required this.id,
    required this.requestId,
    required this.fromUserId,
    required this.toUserId,
    required this.score,
    this.comment,
    required this.createdAt,
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['id'] as int,
      requestId: json['request_id'] as int,
      fromUserId: json['from_user_id'] as int,
      toUserId: json['to_user_id'] as int,
      score: json['score'] as int,
      comment: json['comment'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'request_id': requestId,
      'to_user_id': toUserId,
      'score': score,
      'comment': comment,
    };
  }

  /// Returns rating as stars string
  String get starsDisplay {
    return List.filled(score, '★').join() +
           List.filled(5 - score, '☆').join();
  }

  /// Returns formatted score text
  String get scoreText {
    return '$score/5';
  }
}

/// User's rating summary
class RatingSummary {
  final double averageScore;
  final int totalRatings;
  final Map<int, int> distribution; // score -> count

  RatingSummary({
    required this.averageScore,
    required this.totalRatings,
    required this.distribution,
  });

  factory RatingSummary.fromJson(Map<String, dynamic> json) {
    final dist = json['distribution'] as Map<String, dynamic>? ?? {};
    return RatingSummary(
      averageScore: (json['average_score'] as num?)?.toDouble() ?? 0.0,
      totalRatings: json['total_ratings'] as int? ?? 0,
      distribution: dist.map((k, v) => MapEntry(int.parse(k), v as int)),
    );
  }

  /// Returns formatted average
  String get formattedAverage {
    return averageScore.toStringAsFixed(1);
  }

  /// Check if user has ratings
  bool get hasRatings => totalRatings > 0;
}
