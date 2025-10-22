import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/profile_provider.dart';
import '../../services/location_service.dart';
import 'avatar_selection_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  int _age = 8;
  String _grade = 'Grade 3';
  String _language = 'English';
  bool _isLoading = false;

  final List<String> _languages = ['English', 'Hindi', 'Urdu'];
  final List<String> _grades = [
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];

  @override
  void initState() {
    super.initState();
    _detectLocation();
  }

  Future<void> _detectLocation() async {
    setState(() => _isLoading = true);
    
    final locationService = LocationService();
    final locationData = await locationService.getLocationData();
    
    setState(() {
      _language = locationData['language'];
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _continue() {
    if (_formKey.currentState!.validate()) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => AvatarSelectionScreen(
            name: _nameController.text,
            age: _age,
            grade: _grade,
            language: _language,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Your Profile'),
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header
                    const Icon(
                      Icons.person_add,
                      size: 80,
                      color: Colors.deepPurple,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Tell us about yourself!',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 40),

                    // Name field
                    TextFormField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: 'What\'s your name?',
                        prefixIcon: const Icon(Icons.person),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      style: const TextStyle(fontSize: 18),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your name';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 24),

                    // Age slider
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'How old are you? (Age: $_age)',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Slider(
                              value: _age.toDouble(),
                              min: 5,
                              max: 18,
                              divisions: 13,
                              label: _age.toString(),
                              onChanged: (value) {
                                setState(() {
                                  _age = value.toInt();
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Grade dropdown
                    DropdownButtonFormField<String>(
                      value: _grade,
                      decoration: InputDecoration(
                        labelText: 'What grade are you in?',
                        prefixIcon: const Icon(Icons.school),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      items: _grades.map((grade) {
                        return DropdownMenuItem(
                          value: grade,
                          child: Text(grade, style: const TextStyle(fontSize: 18)),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _grade = value!);
                      },
                    ),

                    const SizedBox(height: 24),

                    // Language dropdown
                    DropdownButtonFormField<String>(
                      value: _language,
                      decoration: InputDecoration(
                        labelText: 'Choose your language',
                        prefixIcon: const Icon(Icons.language),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      items: _languages.map((lang) {
                        return DropdownMenuItem(
                          value: lang,
                          child: Text(lang, style: const TextStyle(fontSize: 18)),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _language = value!);
                      },
                    ),

                    const SizedBox(height: 40),

                    // Continue button
                    ElevatedButton(
                      onPressed: _continue,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            'Continue',
                            style: TextStyle(fontSize: 20),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward),
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
