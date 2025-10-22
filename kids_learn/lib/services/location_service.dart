import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationService {
  Future<Map<String, dynamic>> getLocationData() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return _getDefaultLocationData();
      }

      // Check permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          return _getDefaultLocationData();
        }
      }

      // Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.low,
      );

      // Get address from coordinates
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        return {
          'country': place.country ?? 'Unknown',
          'city': place.locality ?? 'Unknown',
          'language': _getLanguageFromCountry(place.country ?? ''),
        };
      }
    } catch (e) {
      print('Location error: $e');
    }

    return _getDefaultLocationData();
  }

  Map<String, dynamic> _getDefaultLocationData() {
    return {
      'country': 'India',
      'city': 'Unknown',
      'language': 'English',
    };
  }

  String _getLanguageFromCountry(String country) {
    switch (country.toLowerCase()) {
      case 'india':
        return 'Hindi';
      case 'pakistan':
        return 'Urdu';
      default:
        return 'English';
    }
  }
}
