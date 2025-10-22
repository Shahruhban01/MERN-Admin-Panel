import 'package:flutter/foundation.dart';
import 'package:hive/hive.dart';
import '../models/kid_profile.dart';
import '../services/storage_service.dart';

class ProfileProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  KidProfile? _profile;
  bool _isLoading = false;

  KidProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  bool get hasProfile => _profile != null;

  Future<void> loadProfile() async {
    _isLoading = true;
    notifyListeners();

    _profile = await _storageService.getProfile();
    
    // Update streak if needed
    if (_profile != null) {
      _updateStreak();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> createProfile({
    required String name,
    required int age,
    required String grade,
    required String language,
    required String avatarPath,
  }) async {
    _profile = KidProfile(
      name: name,
      age: age,
      grade: grade,
      language: language,
      avatarPath: avatarPath,
      lastActiveDate: DateTime.now(),
    );

    await _storageService.saveProfile(_profile!);
    notifyListeners();
  }

  void _updateStreak() {
    if (_profile == null) return;

    final now = DateTime.now();
    final lastActive = _profile!.lastActiveDate;
    final difference = now.difference(lastActive).inDays;

    if (difference == 0) {
      // Same day, no change
    } else if (difference == 1) {
      // Consecutive day, increase streak
      _profile!.currentStreak++;
      _profile!.lastActiveDate = now;
      _storageService.saveProfile(_profile!);
    } else {
      // Streak broken
      _profile!.currentStreak = 1;
      _profile!.lastActiveDate = now;
      _storageService.saveProfile(_profile!);
    }
  }

  Future<void> addPoints(int points) async {
    if (_profile == null) return;

    _profile!.totalPoints += points;
    await _storageService.saveProfile(_profile!);
    notifyListeners();
  }

  Future<void> completeLesson(String lessonId) async {
    if (_profile == null) return;

    if (!_profile!.completedLessons.contains(lessonId)) {
      _profile!.completedLessons.add(lessonId);
      await _storageService.saveProfile(_profile!);
      notifyListeners();
    }
  }

  Future<void> earnBadge(String badgeId) async {
    if (_profile == null) return;

    if (!_profile!.earnedBadges.contains(badgeId)) {
      _profile!.earnedBadges.add(badgeId);
      await _storageService.saveProfile(_profile!);
      notifyListeners();
    }
  }

  Future<void> updateLanguage(String language) async {
    if (_profile == null) return;

    _profile!.language = language;
    await _storageService.saveProfile(_profile!);
    notifyListeners();
  }

  Future<void> clearProfile() async {
    _profile = null;
    await _storageService.clearProfile();
    notifyListeners();
  }
}
