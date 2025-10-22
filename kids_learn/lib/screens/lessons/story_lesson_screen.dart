import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/lesson.dart';
import '../../providers/profile_provider.dart';
import '../../services/tts_service.dart';

class StoryLessonScreen extends StatefulWidget {
  final Lesson lesson;

  const StoryLessonScreen({super.key, required this.lesson});

  @override
  State<StoryLessonScreen> createState() => _StoryLessonScreenState();
}

class _StoryLessonScreenState extends State<StoryLessonScreen> {
  final TTSService _ttsService = TTSService();
  bool _isSpeaking = false;
  bool _isCompleted = false;
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _ttsService.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _toggleSpeech() async {
    if (_isSpeaking) {
      await _ttsService.stop();
      setState(() {
        _isSpeaking = false;
      });
    } else {
      setState(() {
        _isSpeaking = true;
      });
      
      final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
      await _ttsService.speak(
        widget.lesson.storyText ?? widget.lesson.description,
        profileProvider.profile?.language ?? 'English',
      );
      
      setState(() {
        _isSpeaking = false;
      });
    }
  }

  Future<void> _completeLesson() async {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    
    await profileProvider.completeLesson(widget.lesson.id);
    await profileProvider.addPoints(widget.lesson.pointsReward);

    setState(() {
      _isCompleted = true;
    });

    if (mounted) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Row(
            children: [
              Icon(Icons.auto_stories, color: Colors.purple, size: 32),
              SizedBox(width: 12),
              Text('Story Complete!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'You earned ${widget.lesson.pointsReward} points!',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 16),
              const Text(
                'Great reading! Would you like to share this story with your parents?',
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Maybe Later'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _shareWithParents();
              },
              child: const Text('Share'),
            ),
          ],
        ),
      );
    }
  }

  void _shareWithParents() {
    // Implement share functionality
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Story shared with parents! 📧'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final storyText = widget.lesson.storyText ?? 
        '''Once upon a time, there was a curious learner just like you!
        
They loved exploring new topics and never gave up when things got challenging.

Every day, they practiced and learned something new. Sometimes it was easy, sometimes it was hard, but they always kept going.

And you know what? That's exactly what makes a great learner - curiosity, practice, and never giving up!

Just like this learner, you're doing an amazing job! Keep it up! 🌟''';

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lesson.title),
        actions: [
          IconButton(
            icon: Icon(_isSpeaking ? Icons.stop : Icons.volume_up),
            onPressed: _toggleSpeech,
            tooltip: _isSpeaking ? 'Stop Reading' : 'Read Aloud',
          ),
        ],
      ),
      body: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).primaryColor,
                  Theme.of(context).colorScheme.secondary,
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      widget.lesson.type == LessonType.religious
                          ? Icons.auto_stories
                          : Icons.menu_book,
                      color: Colors.white,
                      size: 40,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        widget.lesson.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  widget.lesson.subject,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),

          // Story content
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                image: DecorationImage(
                  image: const AssetImage('assets/images/paper_texture.png'),
                  fit: BoxFit.cover,
                  opacity: 0.1,
                  onError: (error, stackTrace) {},
                ),
              ),
              child: SingleChildScrollView(
                controller: _scrollController,
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      storyText,
                      style: const TextStyle(
                        fontSize: 18,
                        height: 1.8,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Reflection prompt
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.psychology,
                                color: Theme.of(context).primaryColor,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Think About It',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'What did you learn from this story? How can you apply it to your life?',
                            style: TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Action buttons
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _toggleSpeech,
                        icon: Icon(_isSpeaking ? Icons.stop : Icons.volume_up),
                        label: Text(_isSpeaking ? 'Stop' : 'Read Aloud'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: _isCompleted ? null : _completeLesson,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        child: Text(
                          _isCompleted ? 'Completed ✓' : 'Finish Story',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
