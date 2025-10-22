import 'package:flutter/material.dart';
import 'package:kids_learn/models/achievement.dart';
import 'package:provider/provider.dart';
import 'package:confetti/confetti.dart';
import '../../providers/profile_provider.dart';
import '../../providers/gamification_provider.dart';
import 'leaderboard_screen.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _confettiController = ConfettiController(duration: const Duration(seconds: 3));

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    
    // Show confetti if new badge unlocked
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final gamificationProvider = Provider.of<GamificationProvider>(context, listen: false);
      if (gamificationProvider.showConfetti) {
        _confettiController.play();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Badges', icon: Icon(Icons.emoji_events)),
            Tab(text: 'Leaderboard', icon: Icon(Icons.leaderboard)),
          ],
        ),
      ),
      body: Stack(
        children: [
          TabBarView(
            controller: _tabController,
            children: const [
              _BadgesTab(),
              LeaderboardScreen(),
            ],
          ),
          
          // Confetti overlay
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              numberOfParticles: 50,
              colors: const [
                Colors.green,
                Colors.blue,
                Colors.pink,
                Colors.orange,
                Colors.purple,
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BadgesTab extends StatelessWidget {
  const _BadgesTab();

  @override
  Widget build(BuildContext context) {
    return Consumer2<ProfileProvider, GamificationProvider>(
      builder: (context, profileProvider, gamificationProvider, _) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats card
              Card(
                elevation: 4,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).primaryColor,
                        Theme.of(context).colorScheme.secondary,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatItem(
                        icon: Icons.star,
                        label: 'Points',
                        value: '${profileProvider.profile?.totalPoints ?? 0}',
                        color: Colors.amber,
                      ),
                      _StatItem(
                        icon: Icons.local_fire_department,
                        label: 'Streak',
                        value: '${profileProvider.profile?.currentStreak ?? 0}',
                        color: Colors.orange,
                      ),
                      _StatItem(
                        icon: Icons.emoji_events,
                        label: 'Badges',
                        value: '${gamificationProvider.unlockedAchievements.length}',
                        color: Colors.green,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Unlocked badges
              if (gamificationProvider.unlockedAchievements.isNotEmpty) ...[
                const Text(
                  'Your Badges',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.8,
                  ),
                  itemCount: gamificationProvider.unlockedAchievements.length,
                  itemBuilder: (context, index) {
                    final achievement = gamificationProvider.unlockedAchievements[index];
                    return _BadgeCard(achievement: achievement, isUnlocked: true);
                  },
                ),
                const SizedBox(height: 24),
              ],

              // Locked badges
              if (gamificationProvider.lockedAchievements.isNotEmpty) ...[
                const Text(
                  'Locked Badges',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.8,
                  ),
                  itemCount: gamificationProvider.lockedAchievements.length,
                  itemBuilder: (context, index) {
                    final achievement = gamificationProvider.lockedAchievements[index];
                    return _BadgeCard(achievement: achievement, isUnlocked: false);
                  },
                ),
              ],

              if (gamificationProvider.achievements.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(40),
                    child: Column(
                      children: const [
                        Icon(Icons.emoji_events, size: 80, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'Keep learning to earn badges!',
                          style: TextStyle(fontSize: 18, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}

class _BadgeCard extends StatelessWidget {
  final Achievement achievement;
  final bool isUnlocked;

  const _BadgeCard({
    required this.achievement,
    required this.isUnlocked,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isUnlocked ? 4 : 1,
      child: InkWell(
        onTap: () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.emoji_events,
                    size: 80,
                    color: isUnlocked ? Colors.amber : Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    achievement.title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    achievement.description,
                    style: const TextStyle(fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (!isUnlocked)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.orange.shade100,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Earn ${achievement.pointsRequired} points to unlock',
                        style: TextStyle(
                          color: Colors.orange.shade900,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  if (isUnlocked && achievement.unlockedDate != null)
                    Text(
                      'Unlocked on ${_formatDate(achievement.unlockedDate!)}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close'),
                ),
              ],
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.emoji_events,
                size: 50,
                color: isUnlocked ? Colors.amber : Colors.grey.shade400,
              ),
              const SizedBox(height: 8),
              Text(
                achievement.title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: isUnlocked ? Colors.black87 : Colors.grey,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              if (!isUnlocked) ...[
                const SizedBox(height: 4),
                Text(
                  '${achievement.pointsRequired} pts',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
