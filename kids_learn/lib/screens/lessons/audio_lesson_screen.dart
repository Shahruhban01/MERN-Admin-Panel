import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:provider/provider.dart';
import '../../models/lesson.dart';
import '../../providers/profile_provider.dart';

class AudioLessonScreen extends StatefulWidget {
  final Lesson lesson;

  const AudioLessonScreen({super.key, required this.lesson});

  @override
  State<AudioLessonScreen> createState() => _AudioLessonScreenState();
}

class _AudioLessonScreenState extends State<AudioLessonScreen> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  bool _isCompleted = false;

  @override
  void initState() {
    super.initState();
    _initializeAudio();
  }

  Future<void> _initializeAudio() async {
    _audioPlayer.onPlayerStateChanged.listen((state) {
      setState(() {
        _isPlaying = state == PlayerState.playing;
      });
    });

    _audioPlayer.onDurationChanged.listen((duration) {
      setState(() {
        _duration = duration;
      });
    });

    _audioPlayer.onPositionChanged.listen((position) {
      setState(() {
        _position = position;
      });
    });

    _audioPlayer.onPlayerComplete.listen((event) {
      setState(() {
        _isPlaying = false;
        _position = Duration.zero;
      });
    });

    // For demo, we would load the audio here
    // await _audioPlayer.setSourceUrl(widget.lesson.audioUrl!);
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _playPause() async {
    if (_isPlaying) {
      await _audioPlayer.pause();
    } else {
      // For demo purposes - in production, use actual audio URL
      // await _audioPlayer.play(UrlSource(widget.lesson.audioUrl!));
      setState(() {
        _isPlaying = true;
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
              Icon(Icons.celebration, color: Colors.orange, size: 32),
              SizedBox(width: 12),
              Text('Great Listening!'),
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
              const Icon(Icons.headphones, color: Colors.blue, size: 60),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
              child: const Text('Continue'),
            ),
          ],
        ),
      );
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lesson.title),
      ),
      body: Column(
        children: [
          // Audio player UI
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Theme.of(context).primaryColor.withOpacity(0.8),
                    Theme.of(context).colorScheme.secondary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Audio icon animation
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.3),
                    ),
                    child: Center(
                      child: Icon(
                        _isPlaying ? Icons.graphic_eq : Icons.headphones,
                        size: 100,
                        color: Colors.white,
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Title
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Text(
                      widget.lesson.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Progress bar
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        Slider(
                          value: _position.inSeconds.toDouble(),
                          max: _duration.inSeconds.toDouble() > 0
                              ? _duration.inSeconds.toDouble()
                              : 1,
                          activeColor: Colors.white,
                          inactiveColor: Colors.white30,
                          onChanged: (value) async {
                            await _audioPlayer.seek(Duration(seconds: value.toInt()));
                          },
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _formatDuration(_position),
                              style: const TextStyle(color: Colors.white),
                            ),
                            Text(
                              _formatDuration(_duration),
                              style: const TextStyle(color: Colors.white),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Playback controls
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.replay_10),
                        iconSize: 40,
                        color: Colors.white,
                        onPressed: () async {
                          final newPosition = _position - const Duration(seconds: 10);
                          await _audioPlayer.seek(
                            newPosition < Duration.zero ? Duration.zero : newPosition,
                          );
                        },
                      ),
                      const SizedBox(width: 20),
                      Container(
                        width: 80,
                        height: 80,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: Icon(
                            _isPlaying ? Icons.pause : Icons.play_arrow,
                            size: 50,
                          ),
                          color: Theme.of(context).primaryColor,
                          onPressed: _playPause,
                        ),
                      ),
                      const SizedBox(width: 20),
                      IconButton(
                        icon: const Icon(Icons.forward_10),
                        iconSize: 40,
                        color: Colors.white,
                        onPressed: () async {
                          final newPosition = _position + const Duration(seconds: 10);
                          await _audioPlayer.seek(
                            newPosition > _duration ? _duration : newPosition,
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Lesson content
          Container(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'About this lesson:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.lesson.description,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _isCompleted ? null : _completeLesson,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: Text(
                      _isCompleted ? 'Completed ✓' : 'Mark Complete',
                      style: const TextStyle(fontSize: 18),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
