enum LessonType { video, audio, story, quiz, project, religious }

class Lesson {
  final String id;
  final String title;
  final String description;
  final LessonType type;
  final String subject;
  final String? videoUrl;
  final String? audioUrl;
  final String? storyText;
  final List<QuizQuestion>? quizQuestions;
  final String? projectDescription;
  final int ageMin;
  final int ageMax;
  final int pointsReward;
  final String? thumbnailUrl;
  final Duration? duration;
  final String language;

  Lesson({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.subject,
    this.videoUrl,
    this.audioUrl,
    this.storyText,
    this.quizQuestions,
    this.projectDescription,
    required this.ageMin,
    required this.ageMax,
    required this.pointsReward,
    this.thumbnailUrl,
    this.duration,
    required this.language,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) => Lesson(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        type: LessonType.values.byName(json['type']),
        subject: json['subject'],
        videoUrl: json['videoUrl'],
        audioUrl: json['audioUrl'],
        storyText: json['storyText'],
        quizQuestions: json['quizQuestions'] != null
            ? (json['quizQuestions'] as List)
                .map((q) => QuizQuestion.fromJson(q))
                .toList()
            : null,
        projectDescription: json['projectDescription'],
        ageMin: json['ageMin'],
        ageMax: json['ageMax'],
        pointsReward: json['pointsReward'],
        thumbnailUrl: json['thumbnailUrl'],
        duration: json['duration'] != null
            ? Duration(minutes: json['duration'])
            : null,
        language: json['language'],
      );
}

class QuizQuestion {
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  QuizQuestion({
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) => QuizQuestion(
        question: json['question'],
        options: List<String>.from(json['options']),
        correctIndex: json['correctIndex'],
        explanation: json['explanation'],
      );
}
