import 'package:flutter/material.dart';
import 'package:kids_learn/models/lesson.dart';
import 'package:provider/provider.dart';
import '../../providers/profile_provider.dart';
import '../../providers/lesson_provider.dart';
import '../../providers/gamification_provider.dart';
import '../../providers/ai_guide_provider.dart';
import '../lessons/lesson_detail_screen.dart';
import '../ai_guide/ai_chat_screen.dart';
import '../gamification/rewards_screen.dart';
import '../profile/profile_screen.dart';
import 'widgets/daily_lesson_card.dart';
import 'widgets/streak_widget.dart';
import 'widgets/ai_tip_card.dart';
import 'widgets/weekly_lessons_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    final lessonProvider = Provider.of<LessonProvider>(context, listen: false);
    final gamificationProvider = Provider.of<GamificationProvider>(context, listen: false);
    final aiProvider = Provider.of<AIGuideProvider>(context, listen: false);

    await profileProvider.loadProfile();
    
    if (profileProvider.profile != null) {
      await Future.wait([
        lessonProvider.loadLessons(
          language: profileProvider.profile!.language,
          age: profileProvider.profile!.age,
        ),
        gamificationProvider.loadAchievements(profileProvider.profile!.totalPoints),
        gamificationProvider.loadLeaderboard(),
        aiProvider.loadChatHistory(),
      ]);

      // Send morning check-in if first time today
      final now = DateTime.now();
      final lastActive = profileProvider.profile!.lastActiveDate;
      if (now.day != lastActive.day) {
        await aiProvider.sendMorningCheckIn(
          profileProvider.profile!.name,
          profileProvider.profile!.language,
        );
      }
    }

    setState(() {
      _isLoading = false;
    });
  }

  Widget _getScreen(int index) {
    switch (index) {
      case 0:
        return const _HomeContent();
      case 1:
        return const _LessonsScreen();
      case 2:
        return const AIChatScreen();
      case 3:
        return const RewardsScreen();
      case 4:
        return const ProfileScreen();
      default:
        return const _HomeContent();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      body: _getScreen(_selectedIndex),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Theme.of(context).primaryColor,
          unselectedItemColor: Colors.grey,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.book),
              label: 'Lessons',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.psychology),
              label: 'AI Guide',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.emoji_events),
              label: 'Rewards',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  const _HomeContent();

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        await Provider.of<LessonProvider>(context, listen: false).refreshLessons();
      },
      child: CustomScrollView(
        slivers: [
          // App Bar with greeting
          SliverAppBar(
            expandedHeight: 120,
            floating: false,
            pinned: true,
            backgroundColor: Theme.of(context).primaryColor,
            flexibleSpace: FlexibleSpaceBar(
              title: Consumer<ProfileProvider>(
                builder: (context, provider, _) {
                  return Text(
                    'Hi ${provider.profile?.name ?? "Student"}! 👋',
                    style: const TextStyle(fontSize: 20),
                  );
                },
              ),
              background: Container(
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
              ),
            ),
          ),

          // Content
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Streak widget
                const StreakWidget(),
                const SizedBox(height: 16),

                // Daily lesson card
                const DailyLessonCard(),
                const SizedBox(height: 16),

                // AI Tip of the Day
                const AITipCard(),
                const SizedBox(height: 16),

                // Weekly lessons preview
                const WeeklyLessonsWidget(),
                const SizedBox(height: 24),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _LessonsScreen extends StatelessWidget {
  const _LessonsScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('All Lessons'),
        elevation: 0,
      ),
      body: Consumer2<LessonProvider, ProfileProvider>(
        builder: (context, lessonProvider, profileProvider, _) {
          final lessons = lessonProvider.getLessonsByAge(
            profileProvider.profile?.age ?? 10,
          );

          if (lessons.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.book_outlined, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No lessons available',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: lessons.length,
            itemBuilder: (context, index) {
              final lesson = lessons[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: CircleAvatar(
                    radius: 30,
                    backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                    child: Icon(
                      _getIconForLessonType(lesson.type),
                      color: Theme.of(context).primaryColor,
                      size: 30,
                    ),
                  ),
                  title: Text(
                    lesson.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(lesson.description),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(Icons.star, size: 16, color: Colors.amber),
                            const SizedBox(width: 4),
                            Text('${lesson.pointsReward} points'),
                          ],
                        ),
                      ],
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    lessonProvider.setCurrentLesson(lesson);
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => LessonDetailScreen(lesson: lesson),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }

  IconData _getIconForLessonType(LessonType type) {
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
