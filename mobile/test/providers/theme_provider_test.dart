import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:workmatch_mobile/providers/theme_provider.dart';

void main() {
  group('ThemeProvider Tests', () {
    late ThemeProvider themeProvider;

    setUp(() {
      themeProvider = ThemeProvider();
    });

    test('Initial theme should be system', () {
      expect(themeProvider.themeMode, ThemeMode.system);
      expect(themeProvider.isSystemMode, true);
      expect(themeProvider.isDarkMode, false);
      expect(themeProvider.isLightMode, false);
    });

    test('setThemeMode should update theme', () async {
      await themeProvider.setThemeMode(ThemeMode.dark);
      expect(themeProvider.themeMode, ThemeMode.dark);
      expect(themeProvider.isDarkMode, true);
      expect(themeProvider.isLightMode, false);
      expect(themeProvider.isSystemMode, false);

      await themeProvider.setThemeMode(ThemeMode.light);
      expect(themeProvider.themeMode, ThemeMode.light);
      expect(themeProvider.isLightMode, true);
      expect(themeProvider.isDarkMode, false);
    });

    test('toggleTheme should switch between light and dark', () async {
      await themeProvider.setThemeMode(ThemeMode.light);
      expect(themeProvider.isLightMode, true);

      await themeProvider.toggleTheme();
      expect(themeProvider.isDarkMode, true);

      await themeProvider.toggleTheme();
      expect(themeProvider.isLightMode, true);
    });

    test('setSystemTheme should set theme to system', () async {
      await themeProvider.setThemeMode(ThemeMode.dark);
      expect(themeProvider.isSystemMode, false);

      await themeProvider.setSystemTheme();
      expect(themeProvider.isSystemMode, true);
      expect(themeProvider.themeMode, ThemeMode.system);
    });
  });
}
