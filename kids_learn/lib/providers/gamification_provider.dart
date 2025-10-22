import 'package:flutter/foundation.dart';
import '../models/achievement.dart';
import '../utils/demo_data.dart';
import '../config/app_config.dart';

class GamificationProvider with ChangeNotifier {
  List<Achievement> _achievements = [];
  List<LeaderboardEntry> _leaderboard = [];
  bool _showConfetti = false;
  Achievement? _lastUnlockedBadge;

  List<Achievement> get achievements => _achievements;
  List<Achievement> get unlockedAchievements => 
      _achievements.where((a) => a.isUnlocked).toList();
  List<Achievement> get lockedAchievements => 
      _achievements.where((a) => !a.isUnlocked).toList();
  List<LeaderboardEntry> get leaderboard => _leaderboard;
  bool get showConfetti => _showConfetti;
  Achievement? get lastUnlockedBadge => _lastUnlockedBadge;

  Future<void> loadAchievements(int currentPoints) async {
    if (AppConfig.useDemoData) {
      _achievements = DemoData.getDemoAchievements();
      
      // Auto-unlock achievements based on points
      for (var achievement in _achievements) {
        if (currentPoints >= achievement.pointsRequired && !achievement.isUnlocked) {
          unlockAchievement(achievement.id);
        }
      }
    }
    notifyListeners();
  }

  Future<void> loadLeaderboard() async {
    if (AppConfig.useDemoData) {
      _leaderboard = DemoData.getDemoLeaderboard();
    }
    notifyListeners();
  }

  void unlockAchievement(String achievementId) {
    final index = _achievements.indexWhere((a) => a.id == achievementId);
    if (index != -1 && !_achievements[index].isUnlocked) {
      _achievements[index] = Achievement(
        id: _achievements[index].id,
        title: _achievements[index].title,
        description: _achievements[index].description,
        iconUrl: _achievements[index].iconUrl,
        pointsRequired: _achievements[index].pointsRequired,
        isUnlocked: true,
        unlockedDate: DateTime.now(),
      );
      
      _lastUnlockedBadge = _achievements[index];
      _showConfetti = true;
      notifyListeners();
      
      // Auto-hide confetti after 3 seconds
      Future.delayed(const Duration(seconds: 3), () {
        _showConfetti = false;
        _lastUnlockedBadge = null;
        notifyListeners();
      });
    }
  }

  void hideConfetti() {
    _showConfetti = false;
    _lastUnlockedBadge = null;
    notifyListeners();
  }
}

class LeaderboardEntry {
  final String name;
  final int points;
  final int rank;
  final String avatarPath;

  LeaderboardEntry({
    required this.name,
    required this.points,
    required this.rank,
    required this.avatarPath,
  });
}
