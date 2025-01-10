import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  static const MethodChannel _channel =
      MethodChannel('com.example.app/overlay_permission');

  // Method to request overlay permission
  Future<void> requestOverlayPermission() async {
    try {
      await _channel.invokeMethod('requestOverlayPermission');
      debugPrint("Overlay permission requested.");
    } on PlatformException catch (e) {
      debugPrint("Failed to request overlay permission: ${e.message}");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Overlay Permission Example'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            requestOverlayPermission();
          },
          child: Text('Request Overlay Permission'),
        ),
      ),
    );
  }
}
