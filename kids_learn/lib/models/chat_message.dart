enum MessageSender { user, ai }

class ChatMessage {
  final String id;
  final String content;
  final MessageSender sender;
  final DateTime timestamp;
  final bool hasAudio;

  ChatMessage({
    required this.id,
    required this.content,
    required this.sender,
    required this.timestamp,
    this.hasAudio = false,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
        id: json['id'],
        content: json['content'],
        sender: MessageSender.values.byName(json['sender']),
        timestamp: DateTime.parse(json['timestamp']),
        hasAudio: json['hasAudio'] ?? false,
      );
}
