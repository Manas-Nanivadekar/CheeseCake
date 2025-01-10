import 'package:flutter/services.dart';

class UsageTracker {
  static const platform = MethodChannel('com.example.app/usage_tracker');

  Future<void> trackInstagramUsage() async {
    try {
      final String result = await platform.invokeMethod('trackUsage');
      print("Usage Data: $result");
    } on PlatformException catch (e) {
      print("Failed to get usage stats: ${e.message}");
    }
  }
}
