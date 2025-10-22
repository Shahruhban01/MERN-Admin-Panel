import 'package:flutter/material.dart';
import 'package:kids_learn/models/lesson.dart';
import 'package:provider/provider.dart';
import '../../../providers/lesson_provider.dart';
import '../../lessons/lesson_detail_screen.dart';

class WeeklyLessonsWidget extends StatelessWidget {
  const WeeklyLessonsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LessonProvider>(
      builder: (context, provider, _) {
        final weeklyLessons = provider.weeklyLessons;

        if (weeklyLessons.isEmpty) {
          return const SizedBox.shrink();
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'This Week\'s Lessons',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 160,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: weeklyLessons.length,
                itemBuilder: (context, index) {
                  final lesson = weeklyLessons[index];
                  return Container(
                    width: 140,
                    margin: const EdgeInsets.only(right: 12),
                    child: Card(
                      child: InkWell(
                        onTap: () {
                          provider.setCurrentLesson(lesson);
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) =>
                                  LessonDetailScreen(lesson: lesson),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                _getIconForType(lesson.type),
                                color: Theme.of(context).primaryColor,
                                size: 32,
                              ),
                              const Spacer(),
                              Text(
                                lesson.title,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.star,
                                    size: 14,
                                    color: Colors.amber,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${lesson.pointsReward}',
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
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
