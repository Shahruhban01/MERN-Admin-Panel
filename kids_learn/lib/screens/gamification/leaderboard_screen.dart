import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/gamification_provider.dart';
import '../../providers/profile_provider.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<GamificationProvider, ProfileProvider>(
      builder: (context, gamificationProvider, profileProvider, _) {
        final leaderboard = gamificationProvider.leaderboard;
        final currentUserName = profileProvider.profile?.name;

        if (leaderboard.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.leaderboard, size: 80, color: Colors.grey),
                SizedBox(height: 16),
                Text(
                  'Leaderboard coming soon!',
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: leaderboard.length + 1,
          itemBuilder: (context, index) {
            if (index == 0) {
              // Top 3 podium
              return _PodiumWidget(
                leaderboard: leaderboard.take(3).toList(),
                currentUserName: currentUserName,
              );
            }

            final entry = leaderboard[index - 1];
            final isCurrentUser = entry.name == currentUserName;

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              color: isCurrentUser ? Colors.blue.shade50 : Colors.white,
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: _getRankColor(entry.rank),
                  child: Text(
                    '${entry.rank}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                title: Row(
                  children: [
                    Expanded(
                      child: Text(
                        entry.name,
                        style: TextStyle(
                          fontWeight: isCurrentUser
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                    if (isCurrentUser)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'You',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 20),
                    const SizedBox(width: 4),
                    Text(
                      '${entry.points}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Color _getRankColor(int rank) {
    switch (rank) {
      case 1:
        return Colors.amber;
      case 2:
        return Colors.grey;
      case 3:
        return Colors.brown;
      default:
        return Colors.blue;
    }
  }
}

class _PodiumWidget extends StatelessWidget {
  final List<LeaderboardEntry> leaderboard;
  final String? currentUserName;

  const _PodiumWidget({
    required this.leaderboard,
    this.currentUserName,
  });

  @override
  Widget build(BuildContext context) {
    if (leaderboard.isEmpty) return const SizedBox.shrink();

    final first = leaderboard.isNotEmpty ? leaderboard[0] : null;
    final second = leaderboard.length > 1 ? leaderboard[1] : null;
    final third = leaderboard.length > 2 ? leaderboard[2] : null;

    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).primaryColor.withOpacity(0.1),
            Theme.of(context).colorScheme.secondary.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          const Text(
            '🏆 Top Learners 🏆',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (second != null)
                _PodiumPlace(
                  entry: second,
                  height: 100,
                  color: Colors.grey,
                  isCurrentUser: second.name == currentUserName,
                ),
              if (first != null)
                _PodiumPlace(
                  entry: first,
                  height: 140,
                  color: Colors.amber,
                  isCurrentUser: first.name == currentUserName,
                ),
              if (third != null)
                _PodiumPlace(
                  entry: third,
                  height: 80,
                  color: Colors.brown,
                  isCurrentUser: third.name == currentUserName,
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PodiumPlace extends StatelessWidget {
  final LeaderboardEntry entry;
  final double height;
  final Color color;
  final bool isCurrentUser;

  const _PodiumPlace({
    required this.entry,
    required this.height,
    required this.color,
    required this.isCurrentUser,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: color.withOpacity(0.3),
              backgroundImage: AssetImage(entry.avatarPath),
              onBackgroundImageError: (_, __) {},
              child: entry.avatarPath.isEmpty
                  ? const Icon(Icons.person, size: 30)
                  : null,
            ),
            if (isCurrentUser)
              Positioned(
                bottom: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    'You',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          entry.name,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 4),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.star, color: Colors.amber, size: 16),
            const SizedBox(width: 4),
            Text(
              '${entry.points}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          width: 80,
          height: height,
          decoration: BoxDecoration(
            color: color.withOpacity(0.8),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
          ),
          alignment: Alignment.topCenter,
          padding: const EdgeInsets.only(top: 8),
          child: Text(
            '${entry.rank}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}
