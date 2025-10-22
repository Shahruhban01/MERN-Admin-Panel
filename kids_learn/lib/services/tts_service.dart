import 'package:flutter_tts/flutter_tts.dart';

class TTSService {
  final FlutterTts _flutterTts = FlutterTts();
  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;

    await _flutterTts.setLanguage('en-US');
    await _flutterTts.setSpeechRate(0.5); // Slower for kids
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.2); // Slightly higher pitch for friendliness

    _isInitialized = true;
  }

  Future<void> speak(String text, String language) async {
    await init();

    // Set language based on selection
    if (language == 'Hindi') {
      await _flutterTts.setLanguage('hi-IN');
    } else if (language == 'Urdu') {
      await _flutterTts.setLanguage('ur-PK');
    } else {
      await _flutterTts.setLanguage('en-US');
    }

    await _flutterTts.speak(text);
  }

  Future<void> stop() async {
    await _flutterTts.stop();
  }

  Future<void> pause() async {
    await _flutterTts.pause();
  }

  void dispose() {
    _flutterTts.stop();
  }
}
