class Achievement {
  final String id;
  final String title;
  final String description;
  final String iconUrl;
  final int pointsRequired;
  final bool isUnlocked;
  final DateTime? unlockedDate;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.iconUrl,
    required this.pointsRequired,
    this.isUnlocked = false,
    this.unlockedDate,
  });

  factory Achievement.fromJson(Map<String, dynamic> json) => Achievement(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        iconUrl: json['iconUrl'],
        pointsRequired: json['pointsRequired'],
        isUnlocked: json['isUnlocked'] ?? false,
        unlockedDate: json['unlockedDate'] != null
            ? DateTime.parse(json['unlockedDate'])
            : null,
      );
}
