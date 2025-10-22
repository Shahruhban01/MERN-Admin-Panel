import 'package:hive/hive.dart';

part 'kid_profile.g.dart';

@HiveType(typeId: 0)
class KidProfile extends HiveObject {
  @HiveField(0)
  String name;

  @HiveField(1)
  int age;

  @HiveField(2)
  String grade;

  @HiveField(3)
  String language;

  @HiveField(4)
  String avatarPath;

  @HiveField(5)
  int totalPoints;

  @HiveField(6)
  int currentStreak;

  @HiveField(7)
  DateTime lastActiveDate;

  @HiveField(8)
  List<String> completedLessons;

  @HiveField(9)
  List<String> earnedBadges;

  KidProfile({
    required this.name,
    required this.age,
    required this.grade,
    required this.language,
    required this.avatarPath,
    this.totalPoints = 0,
    this.currentStreak = 0,
    DateTime? lastActiveDate,
    List<String>? completedLessons,
    List<String>? earnedBadges,
  })  : lastActiveDate = lastActiveDate ?? DateTime.now(),
        completedLessons = completedLessons ?? [],
        earnedBadges = earnedBadges ?? [];

  Map<String, dynamic> toJson() => {
        'name': name,
        'age': age,
        'grade': grade,
        'language': language,
        'avatarPath': avatarPath,
        'totalPoints': totalPoints,
        'currentStreak': currentStreak,
        'lastActiveDate': lastActiveDate.toIso8601String(),
        'completedLessons': completedLessons,
        'earnedBadges': earnedBadges,
      };

  factory KidProfile.fromJson(Map<String, dynamic> json) => KidProfile(
        name: json['name'],
        age: json['age'],
        grade: json['grade'],
        language: json['language'],
        avatarPath: json['avatarPath'],
        totalPoints: json['totalPoints'] ?? 0,
        currentStreak: json['currentStreak'] ?? 0,
        lastActiveDate: DateTime.parse(json['lastActiveDate']),
        completedLessons: List<String>.from(json['completedLessons'] ?? []),
        earnedBadges: List<String>.from(json['earnedBadges'] ?? []),
      );
}
