import 'package:hive/hive.dart';
import 'package:hive_flutter/adapters.dart';
import '../models/kid_profile.dart';

class StorageService {
  static const String profileBoxName = 'profile';
  static const String settingsBoxName = 'settings';

  Future<void> init() async {
    await Hive.initFlutter();
    Hive.registerAdapter(KidProfileAdapter());
    await Hive.openBox<KidProfile>(profileBoxName);
    await Hive.openBox(settingsBoxName);
  }

  // Profile methods
  Future<KidProfile?> getProfile() async {
    final box = Hive.box<KidProfile>(profileBoxName);
    return box.get('current_profile');
  }

  Future<void> saveProfile(KidProfile profile) async {
    final box = Hive.box<KidProfile>(profileBoxName);
    await box.put('current_profile', profile);
  }

  Future<void> clearProfile() async {
    final box = Hive.box<KidProfile>(profileBoxName);
    await box.delete('current_profile');
  }

  // Settings methods
  Future<String?> getSetting(String key) async {
    final box = Hive.box(settingsBoxName);
    return box.get(key);
  }

  Future<void> saveSetting(String key, String value) async {
    final box = Hive.box(settingsBoxName);
    await box.put(key, value);
  }

  // Completed lessons
  Future<List<String>> getCompletedLessons() async {
    final box = Hive.box(settingsBoxName);
    return List<String>.from(box.get('completed_lessons', defaultValue: []));
  }

  Future<void> saveCompletedLesson(String lessonId) async {
    final box = Hive.box(settingsBoxName);
    final completed = await getCompletedLessons();
    if (!completed.contains(lessonId)) {
      completed.add(lessonId);
      await box.put('completed_lessons', completed);
    }
  }
}
