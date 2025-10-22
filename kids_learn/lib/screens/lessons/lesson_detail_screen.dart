import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/lesson.dart';
import '../../providers/profile_provider.dart';
import '../../providers/lesson_provider.dart';
import 'video_lesson_screen.dart';
import 'quiz_screen.dart';
import 'audio_lesson_screen.dart';
import 'story_lesson_screen.dart';
import 'project_screen.dart';

class LessonDetailScreen extends StatelessWidget {
  final Lesson lesson;

  const LessonDetailScreen({super.key, required this.lesson});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(lesson.title),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header with lesson info
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).primaryColor,
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Type badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getIconForType(lesson.type),
                          color: Colors.white,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          lesson.type.name.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Title
                  Text(
                    lesson.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Description
                  Text(
                    lesson.description,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Metadata
                  Row(
                    children: [
                      if (lesson.duration != null) ...[
                        _InfoChip(
                          icon: Icons.access_time,
                          label: '${lesson.duration!.inMinutes} min',
                        ),
                        const SizedBox(width: 12),
                      ],
                      _InfoChip(
                        icon: Icons.star,
                        label: '+${lesson.pointsReward} pts',
                      ),
                      const SizedBox(width: 12),
                      _InfoChip(
                        icon: Icons.school,
                        label: lesson.subject,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Content section
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Start lesson button
                  ElevatedButton(
                    onPressed: () => _startLesson(context),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      elevation: 8,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.play_circle_filled, size: 28),
                        SizedBox(width: 12),
                        Text(
                          'Start Lesson',
                          style: TextStyle(fontSize: 20),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Lesson objectives
                  _SectionHeader(
                    icon: Icons.check_circle_outline,
                    title: 'What You\'ll Learn',
                  ),
                  const SizedBox(height: 12),
                  _ObjectiveItem(
                    text: 'Understand ${lesson.subject} concepts',
                  ),
                  _ObjectiveItem(
                    text: 'Practice with interactive activities',
                  ),
                  _ObjectiveItem(
                    text: 'Earn ${lesson.pointsReward} points on completion',
                  ),

                  const SizedBox(height: 24),

                  // Tips section
                  Card(
                    color: Colors.blue.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.lightbulb_outline,
                                color: Colors.blue.shade700,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Learning Tips',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade700,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            '• Find a quiet place to focus\n'
                            '• Take notes if helpful\n'
                            '• Ask AI Guide if you need help\n'
                            '• Review the lesson if needed',
                            style: TextStyle(fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _startLesson(BuildContext context) {
    final lessonProvider = Provider.of<LessonProvider>(context, listen: false);
    lessonProvider.setCurrentLesson(lesson);

    Widget screen;
    switch (lesson.type) {
      case LessonType.video:
        screen = VideoLessonScreen(lesson: lesson);
        break;
      case LessonType.audio:
        screen = AudioLessonScreen(lesson: lesson);
        break;
      case LessonType.story:
        screen = StoryLessonScreen(lesson: lesson);
        break;
      case LessonType.quiz:
        screen = QuizScreen(lesson: lesson);
        break;
      case LessonType.project:
        screen = ProjectScreen(lesson: lesson);
        break;
      case LessonType.religious:
        screen = StoryLessonScreen(lesson: lesson);
        break;
    }

    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  IconData _getIconForType(LessonType type) {
    switch (type) {
      case LessonType.video:
        return Icons.video_library;
      case LessonType.audio:
        return Icons.audiotrack;
      case LessonType.story:
        return Icons.menu_book;
      case LessonType.quiz:
        return Icons.quiz;
      case LessonType.project:
        return Icons.construction;
      case LessonType.religious:
        return Icons.auto_stories;
    }
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.3),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final String title;

  const _SectionHeader({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: Theme.of(context).primaryColor),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

class _ObjectiveItem extends StatelessWidget {
  final String text;

  const _ObjectiveItem({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.check_circle,
            color: Colors.green,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}
