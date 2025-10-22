import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../models/lesson.dart';

class ApiService {
  final String baseUrl = AppConfig.baseUrl;
  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> _headers({bool includeAuth = true}) {
    final headers = {'Content-Type': 'application/json'};
    if (includeAuth && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  // Get lessons
  Future<List<Lesson>> getLessons({String? language, int? age}) async {
    try {
      final queryParams = <String, String>{};
      if (language != null) queryParams['language'] = language;
      if (age != null) queryParams['age'] = age.toString();

      final uri = Uri.parse('$baseUrl/lessons').replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers(includeAuth: false));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['data']['lessons'] as List)
            .map((lesson) => Lesson.fromJson(lesson))
            .toList();
      } else {
        throw Exception('Failed to load lessons');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Submit quiz answer
  Future<Map<String, dynamic>> submitQuizAnswer({
    required String lessonId,
    required String questionId,
    required int selectedAnswer,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/lessons/$lessonId/quiz'),
        headers: _headers(),
        body: json.encode({
          'questionId': questionId,
          'answer': selectedAnswer,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to submit answer');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // AI Chat
  Future<Map<String, dynamic>> sendAIChatMessage(
    String message,
    String language,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/ai-guide/chat'),
        headers: _headers(),
        body: json.encode({
          'message': message,
          'language': language,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to send message');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Save progress
  Future<void> saveProgress({
    required String lessonId,
    required int pointsEarned,
    required bool completed,
  }) async {
    try {
      await http.post(
        Uri.parse('$baseUrl/progress'),
        headers: _headers(),
        body: json.encode({
          'lessonId': lessonId,
          'pointsEarned': pointsEarned,
          'completed': completed,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      );
    } catch (e) {
      throw Exception('Failed to save progress: $e');
    }
  }

  // Get leaderboard
  Future<List<Map<String, dynamic>>> getLeaderboard() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/leaderboard'),
        headers: _headers(),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['data']['leaderboard']);
      } else {
        throw Exception('Failed to load leaderboard');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
