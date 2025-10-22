import 'package:flutter/foundation.dart';
import '../models/lesson.dart';
import '../services/api_service.dart';
import '../utils/demo_data.dart';
import '../config/app_config.dart';

class LessonProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Lesson> _allLessons = [];
  Lesson? _currentLesson;
  bool _isLoading = false;
  String? _error;

  List<Lesson> get allLessons => _allLessons;
  Lesson? get currentLesson => _currentLesson;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get today's lesson
  Lesson? get todaysLesson {
    if (_allLessons.isEmpty) return null;
    final today = DateTime.now().weekday - 1; // Monday = 0
    return _allLessons.isNotEmpty 
        ? _allLessons[today % _allLessons.length] 
        : null;
  }

  // Get weekly lessons preview
  List<Lesson> get weeklyLessons {
    return _allLessons.take(7).toList();
  }

  // Get lessons by age
  List<Lesson> getLessonsByAge(int age) {
    return _allLessons
        .where((lesson) => age >= lesson.ageMin && age <= lesson.ageMax)
        .toList();
  }

  // Get lessons by subject
  List<Lesson> getLessonsBySubject(String subject) {
    return _allLessons
        .where((lesson) => lesson.subject.toLowerCase() == subject.toLowerCase())
        .toList();
  }

  // Get religious lessons
  List<Lesson> get religiousLessons {
    return _allLessons
        .where((lesson) => lesson.type == LessonType.religious)
        .toList();
  }

  Future<void> loadLessons({String? language, int? age}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (AppConfig.useDemoData) {
        // Use demo data
        await Future.delayed(const Duration(seconds: 1)); // Simulate API call
        _allLessons = DemoData.getDemoLessons(language: language, age: age);
      } else {
        // Load from API
        final response = await _apiService.getLessons(
          language: language,
          age: age,
        );
        _allLessons = response;
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  void setCurrentLesson(Lesson lesson) {
    _currentLesson = lesson;
    notifyListeners();
  }

  void clearCurrentLesson() {
    _currentLesson = null;
    notifyListeners();
  }

  Future<void> refreshLessons() async {
    await loadLessons();
  }
}
