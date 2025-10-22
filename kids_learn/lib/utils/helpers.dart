class Helpers {
  // Format date
  static String formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays == 0) return 'Today';
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    
    return '${date.day}/${date.month}/${date.year}';
  }

  // Format duration
  static String formatDuration(Duration duration) {
    if (duration.inHours > 0) {
      return '${duration.inHours}h ${duration.inMinutes.remainder(60)}m';
    }
    return '${duration.inMinutes}m';
  }

  // Get greeting based on time
  static String getGreeting() {
    final hour = DateTime.now().hour;
    
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  // Validate email
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  // Get age group label
  static String getAgeGroupLabel(int age) {
    if (age < 6) return 'Pre-School';
    if (age < 9) return 'Early Elementary';
    if (age < 13) return 'Elementary';
    if (age < 16) return 'Middle School';
    return 'High School';
  }
}
