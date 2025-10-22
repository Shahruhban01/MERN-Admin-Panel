import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/lesson.dart';
import '../../providers/profile_provider.dart';

class ProjectScreen extends StatefulWidget {
  final Lesson lesson;

  const ProjectScreen({super.key, required this.lesson});

  @override
  State<ProjectScreen> createState() => _ProjectScreenState();
}

class _ProjectScreenState extends State<ProjectScreen> {
  final TextEditingController _notesController = TextEditingController();
  bool _isCompleted = false;
  final List<bool> _steps = [false, false, false, false];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _toggleStep(int index) {
    setState(() {
      _steps[index] = !_steps[index];
    });
  }

  bool get _allStepsCompleted => _steps.every((step) => step);

  Future<void> _completeProject() async {
    if (!_allStepsCompleted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please complete all steps first!'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

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
              Icon(Icons.construction, color: Colors.orange, size: 32),
              SizedBox(width: 12),
              Text('Project Complete!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.emoji_events, size: 80, color: Colors.amber),
              const SizedBox(height: 16),
              Text(
                'Amazing work! You earned ${widget.lesson.pointsReward} points!',
                style: const TextStyle(fontSize: 18),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Would you like to share your project with parents?',
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Later'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _shareProject();
              },
              child: const Text('Share'),
            ),
          ],
        ),
      );
    }
  }

  void _shareProject() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Project shared with parents! 🎉'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final projectDescription = widget.lesson.projectDescription ??
        '''Create your own mini-project!

Follow these steps:
1. Think about what you learned
2. Plan your project
3. Create something unique
4. Share it with others

Remember: Be creative and have fun! There's no wrong way to express what you've learned.''';

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lesson.title),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.orange,
                    Colors.deepOrange,
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.construction,
                    color: Colors.white,
                    size: 48,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.lesson.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Let\'s build something amazing!',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Project description
                  const Text(
                    'Project Description',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    projectDescription,
                    style: const TextStyle(fontSize: 16, height: 1.6),
                  ),

                  const SizedBox(height: 32),

                  // Project steps
                  const Text(
                    'Project Steps',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  _ProjectStep(
                    number: 1,
                    title: 'Plan Your Project',
                    description: 'Think about what you want to create',
                    isCompleted: _steps[0],
                    onToggle: () => _toggleStep(0),
                  ),
                  _ProjectStep(
                    number: 2,
                    title: 'Gather Materials',
                    description: 'Get everything you need ready',
                    isCompleted: _steps[1],
                    onToggle: () => _toggleStep(1),
                  ),
                  _ProjectStep(
                    number: 3,
                    title: 'Create & Build',
                    description: 'Work on your amazing project!',
                    isCompleted: _steps[2],
                    onToggle: () => _toggleStep(2),
                  ),
                  _ProjectStep(
                    number: 4,
                    title: 'Review & Share',
                    description: 'Check your work and share with others',
                    isCompleted: _steps[3],
                    onToggle: () => _toggleStep(3),
                  ),

                  const SizedBox(height: 32),

                  // Notes section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.note_alt,
                                color: Theme.of(context).primaryColor,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Project Notes',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _notesController,
                            maxLines: 5,
                            decoration: const InputDecoration(
                              hintText: 'Write about your project experience...',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Complete button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isCompleted ? null : _completeProject,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(_isCompleted ? Icons.check_circle : Icons.done_all),
                          const SizedBox(width: 12),
                          Text(
                            _isCompleted ? 'Project Completed! ✓' : 'Complete Project',
                            style: const TextStyle(fontSize: 18),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Progress indicator
                  if (!_allStepsCompleted)
                    Card(
                      color: Colors.orange.shade50,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            const Icon(Icons.info_outline, color: Colors.orange),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Complete all steps to finish the project!',
                                style: TextStyle(color: Colors.orange.shade900),
                              ),
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
}

class _ProjectStep extends StatelessWidget {
  final int number;
  final String title;
  final String description;
  final bool isCompleted;
  final VoidCallback onToggle;

  const _ProjectStep({
    required this.number,
    required this.title,
    required this.description,
    required this.isCompleted,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: isCompleted ? 0 : 2,
      color: isCompleted ? Colors.green.shade50 : Colors.white,
      child: InkWell(
        onTap: onToggle,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Step number/checkmark
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isCompleted ? Colors.green : Colors.grey.shade300,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(Icons.check, color: Colors.white)
                      : Text(
                          '$number',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                ),
              ),
              const SizedBox(width: 16),
              // Step content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        decoration: isCompleted
                            ? TextDecoration.lineThrough
                            : TextDecoration.none,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
