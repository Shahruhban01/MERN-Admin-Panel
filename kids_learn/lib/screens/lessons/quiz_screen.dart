import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:confetti/confetti.dart';
import '../../models/lesson.dart';
import '../../providers/profile_provider.dart';

class QuizScreen extends StatefulWidget {
  final Lesson lesson;

  const QuizScreen({super.key, required this.lesson});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _currentQuestionIndex = 0;
  int? _selectedAnswer;
  bool _showExplanation = false;
  int _score = 0;
  bool _isQuizComplete = false;
  final _confettiController = ConfettiController(duration: const Duration(seconds: 3));

  List<QuizQuestion> get questions => widget.lesson.quizQuestions ?? [];
  QuizQuestion get currentQuestion => questions[_currentQuestionIndex];

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  void _selectAnswer(int index) {
    if (_showExplanation) return;

    setState(() {
      _selectedAnswer = index;
    });
  }

  void _submitAnswer() {
    if (_selectedAnswer == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an answer!')),
      );
      return;
    }

    setState(() {
      _showExplanation = true;
      if (_selectedAnswer == currentQuestion.correctIndex) {
        _score++;
      }
    });
  }

  void _nextQuestion() {
    if (_currentQuestionIndex < questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _selectedAnswer = null;
        _showExplanation = false;
      });
    } else {
      _completeQuiz();
    }
  }

  Future<void> _completeQuiz() async {
    final profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    
    final percentage = (_score / questions.length) * 100;
    final pointsEarned = (percentage / 100 * widget.lesson.pointsReward).round();

    await profileProvider.completeLesson(widget.lesson.id);
    await profileProvider.addPoints(pointsEarned);

    setState(() {
      _isQuizComplete = true;
    });

    _confettiController.play();

    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Icon(
                percentage >= 70 ? Icons.celebration : Icons.emoji_events,
                color: percentage >= 70 ? Colors.orange : Colors.blue,
                size: 32,
              ),
              const SizedBox(width: 12),
              Text(percentage >= 70 ? 'Excellent!' : 'Good Try!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'You scored $_score out of ${questions.length}',
                style: const TextStyle(fontSize: 18),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                '${percentage.toInt()}%',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: percentage >= 70 ? Colors.green : Colors.orange,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Earned $pointsEarned points!',
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 8),
              if (percentage < 70)
                const Text(
                  'Keep practicing! You can retake the quiz.',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
            ],
          ),
          actions: [
            if (percentage < 70)
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  _retakeQuiz();
                },
                child: const Text('Retake Quiz'),
              ),
            ElevatedButton(
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

  void _retakeQuiz() {
    setState(() {
      _currentQuestionIndex = 0;
      _selectedAnswer = null;
      _showExplanation = false;
      _score = 0;
      _isQuizComplete = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz')),
        body: const Center(
          child: Text('No quiz questions available'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Quiz: ${widget.lesson.title}'),
        elevation: 0,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Progress bar
              Container(
                padding: const EdgeInsets.all(16),
                color: Theme.of(context).primaryColor,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Question ${_currentQuestionIndex + 1}/${questions.length}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Score: $_score',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: (_currentQuestionIndex + 1) / questions.length,
                      backgroundColor: Colors.white30,
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ],
                ),
              ),

              // Question and answers
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Question
                      Card(
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Text(
                            currentQuestion.question,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Answer options
                      ...List.generate(
                        currentQuestion.options.length,
                        (index) => _AnswerOption(
                          text: currentQuestion.options[index],
                          isSelected: _selectedAnswer == index,
                          isCorrect: _showExplanation &&
                              index == currentQuestion.correctIndex,
                          isWrong: _showExplanation &&
                              _selectedAnswer == index &&
                              index != currentQuestion.correctIndex,
                          onTap: () => _selectAnswer(index),
                        ),
                      ),

                      // Explanation
                      if (_showExplanation) ...[
                        const SizedBox(height: 24),
                        Card(
                          color: _selectedAnswer == currentQuestion.correctIndex
                              ? Colors.green.shade50
                              : Colors.orange.shade50,
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      _selectedAnswer == currentQuestion.correctIndex
                                          ? Icons.check_circle
                                          : Icons.info,
                                      color: _selectedAnswer == currentQuestion.correctIndex
                                          ? Colors.green
                                          : Colors.orange,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _selectedAnswer == currentQuestion.correctIndex
                                          ? 'Correct!'
                                          : 'Not quite right',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: _selectedAnswer == currentQuestion.correctIndex
                                            ? Colors.green.shade700
                                            : Colors.orange.shade700,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  currentQuestion.explanation,
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              // Action button
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
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _showExplanation ? _nextQuestion : _submitAnswer,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: Text(
                      _showExplanation
                          ? (_currentQuestionIndex < questions.length - 1
                              ? 'Next Question'
                              : 'Finish Quiz')
                          : 'Submit Answer',
                      style: const TextStyle(fontSize: 18),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Confetti
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              numberOfParticles: 30,
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

class _AnswerOption extends StatelessWidget {
  final String text;
  final bool isSelected;
  final bool isCorrect;
  final bool isWrong;
  final VoidCallback onTap;

  const _AnswerOption({
    required this.text,
    required this.isSelected,
    required this.isCorrect,
    required this.isWrong,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Color? backgroundColor;
    Color? borderColor;
    IconData? icon;

    if (isCorrect) {
      backgroundColor = Colors.green.shade50;
      borderColor = Colors.green;
      icon = Icons.check_circle;
    } else if (isWrong) {
      backgroundColor = Colors.red.shade50;
      borderColor = Colors.red;
      icon = Icons.cancel;
    } else if (isSelected) {
      backgroundColor = Theme.of(context).primaryColor.withOpacity(0.1);
      borderColor = Theme.of(context).primaryColor;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(15),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: backgroundColor ?? Colors.white,
            border: Border.all(
              color: borderColor ?? Colors.grey.shade300,
              width: 2,
            ),
            borderRadius: BorderRadius.circular(15),
          ),
          child: Row(
            children: [
              if (icon != null)
                Icon(icon, color: borderColor)
              else
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? Theme.of(context).primaryColor
                          : Colors.grey.shade400,
                      width: 2,
                    ),
                    color: isSelected
                        ? Theme.of(context).primaryColor
                        : Colors.transparent,
                  ),
                  child: isSelected
                      ? const Icon(
                          Icons.check,
                          size: 16,
                          color: Colors.white,
                        )
                      : null,
                ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: isSelected || isCorrect || isWrong
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
