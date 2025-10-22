import '../models/lesson.dart';
import '../models/achievement.dart';
import '../models/chat_message.dart';
import '../providers/gamification_provider.dart';
import 'package:uuid/uuid.dart';

class DemoData {
  static const _uuid = Uuid();

  // Demo Lessons
  static List<Lesson> getDemoLessons({String? language, int? age}) {
    final allLessons = [
      // Math Lessons
      Lesson(
        id: 'lesson_1',
        title: 'Addition Basics',
        description: 'Learn how to add numbers with fun examples!',
        type: LessonType.video,
        subject: 'Mathematics',
        videoUrl: 'https://example.com/video1.mp4',
        ageMin: 5,
        ageMax: 8,
        pointsReward: 10,
        thumbnailUrl: 'assets/images/lessons/math_thumb.png',
        duration: const Duration(minutes: 5),
        language: 'English',
      ),
      Lesson(
        id: 'lesson_2',
        title: 'Multiplication Tables',
        description: 'Master your times tables with interactive practice',
        type: LessonType.quiz,
        subject: 'Mathematics',
        ageMin: 8,
        ageMax: 12,
        pointsReward: 15,
        language: 'English',
        quizQuestions: [
          QuizQuestion(
            question: 'What is 5 × 6?',
            options: ['25', '30', '35', '40'],
            correctIndex: 1,
            explanation: '5 × 6 = 30. You can think of it as 5 groups of 6!',
          ),
          QuizQuestion(
            question: 'What is 7 × 8?',
            options: ['54', '56', '58', '60'],
            correctIndex: 1,
            explanation: '7 × 8 = 56. Try counting by 7s eight times!',
          ),
          QuizQuestion(
            question: 'What is 9 × 9?',
            options: ['72', '81', '90', '99'],
            correctIndex: 1,
            explanation: '9 × 9 = 81. This is a perfect square!',
          ),
        ],
      ),

      // Science Lessons
      Lesson(
        id: 'lesson_3',
        title: 'The Solar System',
        description: 'Explore the planets and learn about our amazing solar system',
        type: LessonType.story,
        subject: 'Science',
        storyText: '''Welcome to our Solar System! 🌞

Our solar system has 8 amazing planets that orbit around the Sun.

Mercury is the closest planet to the Sun. It's very hot during the day!

Venus is covered in thick clouds and is the hottest planet.

Earth is our home! It's the only planet we know that has life.

Mars is called the Red Planet because of its reddish color.

Jupiter is the biggest planet with a giant red spot!

Saturn has beautiful rings made of ice and rocks.

Uranus spins on its side - how funny!

Neptune is the farthest planet and has strong winds.

Each planet is special and unique, just like you! 🌟''',
        ageMin: 6,
        ageMax: 12,
        pointsReward: 12,
        language: 'English',
      ),

      // English Lessons
      Lesson(
        id: 'lesson_4',
        title: 'Reading Comprehension',
        description: 'Improve your reading skills with engaging stories',
        type: LessonType.audio,
        subject: 'English',
        audioUrl: 'https://example.com/audio1.mp3',
        ageMin: 7,
        ageMax: 10,
        pointsReward: 10,
        language: 'English',
      ),

      // Project Lessons
      Lesson(
        id: 'lesson_5',
        title: 'Build a Bird Feeder',
        description: 'Create your own bird feeder and help local birds!',
        type: LessonType.project,
        subject: 'Science',
        projectDescription: '''Let's build a bird feeder together!

Materials needed:
- Empty plastic bottle
- Two wooden spoons
- String
- Bird seeds

Steps:
1. Clean the bottle thoroughly
2. Make holes for the spoons
3. Fill with bird seeds
4. Hang it outside
5. Watch the birds come!

Remember to refill the seeds regularly and keep it clean! 🐦''',
        ageMin: 8,
        ageMax: 14,
        pointsReward: 20,
        language: 'English',
      ),

      // Religious/Values Lesson
      Lesson(
        id: 'lesson_6',
        title: 'The Value of Kindness',
        description: 'Learn why being kind makes the world better',
        type: LessonType.religious,
        subject: 'Values',
        storyText: '''The Story of the Helping Hand

Once upon a time, there was a little girl named Sara who always helped others.

One day, she saw an old man struggling to carry his groceries. Sara ran to help him, even though she was tired.

The old man smiled and said, "Thank you, kind child. Your help means so much to me."

Sara felt happy inside. She learned that even small acts of kindness can make someone's day better.

Remember: Being kind doesn't cost anything, but it means everything! 💝

How can you show kindness today?''',
        ageMin: 5,
        ageMax: 15,
        pointsReward: 15,
        language: 'English',
      ),
    ];

    // Filter by language and age if provided
    return allLessons.where((lesson) {
      if (language != null && lesson.language != language) return false;
      if (age != null && (age < lesson.ageMin || age > lesson.ageMax)) return false;
      return true;
    }).toList();
  }

  // Demo Achievements
  static List<Achievement> getDemoAchievements() {
    return [
      Achievement(
        id: 'badge_1',
        title: 'First Step',
        description: 'Complete your first lesson',
        iconUrl: 'assets/images/badges/first_step.png',
        pointsRequired: 10,
        isUnlocked: false,
      ),
      Achievement(
        id: 'badge_2',
        title: 'Quick Learner',
        description: 'Earn 50 points',
        iconUrl: 'assets/images/badges/quick_learner.png',
        pointsRequired: 50,
        isUnlocked: false,
      ),
      Achievement(
        id: 'badge_3',
        title: 'Dedicated Student',
        description: 'Maintain a 5-day streak',
        iconUrl: 'assets/images/badges/dedicated.png',
        pointsRequired: 100,
        isUnlocked: false,
      ),
      Achievement(
        id: 'badge_4',
        title: 'Math Wizard',
        description: 'Complete 5 math lessons',
        iconUrl: 'assets/images/badges/math_wizard.png',
        pointsRequired: 75,
        isUnlocked: false,
      ),
      Achievement(
        id: 'badge_5',
        title: 'Science Explorer',
        description: 'Complete 5 science lessons',
        iconUrl: 'assets/images/badges/science.png',
        pointsRequired: 75,
        isUnlocked: false,
      ),
      Achievement(
        id: 'badge_6',
        title: 'Super Star',
        description: 'Earn 200 points',
        iconUrl: 'assets/images/badges/superstar.png',
        pointsRequired: 200,
        isUnlocked: false,
      ),
    ];
  }

  // Demo Leaderboard
  static List<LeaderboardEntry> getDemoLeaderboard() {
    return [
      LeaderboardEntry(
        name: 'Alex',
        points: 250,
        rank: 1,
        avatarPath: 'assets/images/avatars/avatar_1.png',
      ),
      LeaderboardEntry(
        name: 'Maya',
        points: 220,
        rank: 2,
        avatarPath: 'assets/images/avatars/avatar_2.png',
      ),
      LeaderboardEntry(
        name: 'Sam',
        points: 195,
        rank: 3,
        avatarPath: 'assets/images/avatars/avatar_3.png',
      ),
      LeaderboardEntry(
        name: 'Emma',
        points: 180,
        rank: 4,
        avatarPath: 'assets/images/avatars/avatar_4.png',
      ),
      LeaderboardEntry(
        name: 'Noah',
        points: 165,
        rank: 5,
        avatarPath: 'assets/images/avatars/avatar_5.png',
      ),
    ];
  }

  // Demo AI Chat Messages
  static List<ChatMessage> getDemoAIChatMessages() {
    return [
      ChatMessage(
        id: _uuid.v4(),
        content: 'Hello! I\'m your AI Guide. How can I help you learn today? 🌟',
        sender: MessageSender.ai,
        timestamp: DateTime.now().subtract(const Duration(hours: 1)),
        hasAudio: true,
      ),
    ];
  }
}
