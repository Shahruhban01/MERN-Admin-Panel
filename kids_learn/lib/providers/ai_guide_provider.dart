import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/chat_message.dart';
import '../services/api_service.dart';
import '../services/tts_service.dart';
import '../utils/demo_data.dart';
import '../config/app_config.dart';

class AIGuideProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final TTSService _ttsService = TTSService();
  final Uuid _uuid = const Uuid();

  List<ChatMessage> _messages = [];
  bool _isTyping = false;
  bool _isSpeaking = false;

  List<ChatMessage> get messages => _messages;
  bool get isTyping => _isTyping;
  bool get isSpeaking => _isSpeaking;

  Future<void> loadChatHistory() async {
    if (AppConfig.useDemoData) {
      _messages = DemoData.getDemoAIChatMessages();
      notifyListeners();
    }
  }

  Future<void> sendMessage(String content, String language) async {
    // Add user message
    final userMessage = ChatMessage(
      id: _uuid.v4(),
      content: content,
      sender: MessageSender.user,
      timestamp: DateTime.now(),
    );

    _messages.add(userMessage);
    notifyListeners();

    // Show typing indicator
    _isTyping = true;
    notifyListeners();

    try {
      String aiResponse;
      
      if (AppConfig.useDemoData) {
        // Demo AI responses
        await Future.delayed(const Duration(seconds: 2));
        aiResponse = _getDemoAIResponse(content, language);
      } else {
        // Real API call
        final response = await _apiService.sendAIChatMessage(content, language);
        aiResponse = response['reply'];
      }

      // Add AI response
      final aiMessage = ChatMessage(
        id: _uuid.v4(),
        content: aiResponse,
        sender: MessageSender.ai,
        timestamp: DateTime.now(),
        hasAudio: true,
      );

      _messages.add(aiMessage);
      _isTyping = false;
      notifyListeners();

      // Auto-speak AI response
      await speakMessage(aiResponse, language);
      
    } catch (e) {
      _isTyping = false;
      notifyListeners();
      debugPrint('Error sending message: $e');
    }
  }

  String _getDemoAIResponse(String userMessage, String language) {
    final lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.contains('hello') || lowerMessage.contains('hi')) {
      return language == 'Hindi' 
          ? 'नमस्ते! मैं आपका AI गाइड हूं। आज हम क्या सीखेंगे?'
          : language == 'Urdu'
              ? 'السلام علیکم! میں آپ کا AI گائیڈ ہوں۔ آج ہم کیا سیکھیں گے؟'
              : 'Hello! I\'m your AI Guide. What would you like to learn today? 🌟';
    } else if (lowerMessage.contains('help') || lowerMessage.contains('hint')) {
      return 'Great question! Let me give you a hint: Think about the main concept we learned. Try breaking it down into smaller steps! 💡';
    } else if (lowerMessage.contains('good morning')) {
      return 'Good morning, superstar! ☀️ Ready to learn something amazing today? Let\'s make it a great day!';
    } else if (lowerMessage.contains('done') || lowerMessage.contains('completed')) {
      return 'Wow! You completed your lesson! 🎉 I\'m so proud of you! Would you like to share this with your parents?';
    } else {
      return 'That\'s interesting! Keep thinking and exploring. You\'re doing great! Remember, every question helps you learn. 🌈';
    }
  }

  Future<void> speakMessage(String text, String language) async {
    _isSpeaking = true;
    notifyListeners();

    await _ttsService.speak(text, language);

    _isSpeaking = false;
    notifyListeners();
  }

  Future<void> stopSpeaking() async {
    await _ttsService.stop();
    _isSpeaking = false;
    notifyListeners();
  }

  void clearChat() {
    _messages.clear();
    notifyListeners();
  }

  // Morning check-in
  Future<void> sendMorningCheckIn(String kidName, String language) async {
    final greeting = language == 'Hindi'
        ? 'सुप्रभात $kidName! आज आप कैसा महसूस कर रहे हैं? 🌅'
        : language == 'Urdu'
            ? 'صبح بخیر $kidName! آج آپ کیسا محسوس کر رہے ہیں؟ 🌅'
            : 'Good morning $kidName! How are you feeling today? 🌅';

    await sendMessage(greeting, language);
  }
}
