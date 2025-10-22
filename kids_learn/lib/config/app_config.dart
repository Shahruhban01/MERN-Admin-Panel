class AppConfig {
  // API Configuration
  static const String baseUrl = 'https://your-backend-api.com/api';
  static const bool useDemoData = true; // Set to false for production
  
  // App Settings
  static const String appName = 'KidsLearn';
  static const int minAge = 5;
  static const int maxAge = 18;
  
  // Supported Languages
  static const List<String> supportedLanguages = ['English', 'Hindi', 'Urdu'];
  
  // Gamification
  static const int pointsPerLesson = 10;
  static const int pointsPerQuiz = 5;
  static const int dailyStreakPoints = 15;
  
  // Avatars
  static const List<String> avatarOptions = [
    'assets/images/avatars/avatar_1.png',
    'assets/images/avatars/avatar_2.png',
    'assets/images/avatars/avatar_3.png',
    'assets/images/avatars/avatar_4.png',
    'assets/images/avatars/avatar_5.png',
    'assets/images/avatars/avatar_6.png',
  ];
}
