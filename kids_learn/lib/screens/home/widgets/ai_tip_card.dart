import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/ai_guide_provider.dart';
import '../../ai_guide/ai_chat_screen.dart';

class AITipCard extends StatelessWidget {
  const AITipCard({super.key});

  @override
  Widget build(BuildContext context) {
    final tips = [
      '💡 Try breaking big problems into smaller steps!',
      '🌟 Practice makes perfect! Review what you learned today.',
      '🎯 Set a goal for this week and stick to it!',
      '🧠 Take breaks while studying - your brain needs rest too!',
      '📚 Reading 10 minutes daily can improve your skills!',
      '✨ Ask questions! There are no silly questions in learning.',
    ];

    final randomTip = tips[DateTime.now().day % tips.length];

    return Card(
      color: Colors.purple.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.lightbulb, color: Colors.purple.shade700),
                const SizedBox(width: 8),
                Text(
                  'AI Tip of the Day',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.purple.shade700,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              randomTip,
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const AIChatScreen(),
                  ),
                );
              },
              child: const Text('Chat with AI Guide →'),
            ),
          ],
        ),
      ),
    );
  }
}
