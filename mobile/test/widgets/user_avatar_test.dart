import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:workmatch_mobile/widgets/user_avatar.dart';

void main() {
  group('UserAvatar Widget Tests', () {
    testWidgets('UserAvatar displays initials from name', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: UserAvatar(
              name: 'John Doe',
              size: 48,
            ),
          ),
        ),
      );

      expect(find.text('JD'), findsOneWidget);
    });

    testWidgets('UserAvatar displays single initial for single name', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: UserAvatar(
              name: 'John',
              size: 48,
            ),
          ),
        ),
      );

      expect(find.text('J'), findsOneWidget);
    });

    testWidgets('UserAvatar displays online indicator when isOnline is true', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: UserAvatar(
              name: 'John Doe',
              isOnline: true,
              size: 48,
            ),
          ),
        ),
      );

      // Find the online indicator container
      final containers = tester.widgetList<Container>(find.byType(Container));
      final hasGreenIndicator = containers.any((container) {
        final decoration = container.decoration as BoxDecoration?;
        return decoration?.color?.value == Colors.green.value;
      });

      expect(hasGreenIndicator, true);
    });

    testWidgets('UserAvatar calls onTap when tapped', (WidgetTester tester) async {
      bool wasTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: UserAvatar(
              name: 'John Doe',
              onTap: () {
                wasTapped = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(UserAvatar));
      await tester.pumpAndSettle();

      expect(wasTapped, true);
    });

    testWidgets('UserAvatar has correct size', (WidgetTester tester) async {
      const avatarSize = 80.0;

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: UserAvatar(
              name: 'John Doe',
              size: avatarSize,
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(UserAvatar),
          matching: find.byType(Container),
        ).first,
      );

      expect(container.constraints?.maxWidth, avatarSize);
      expect(container.constraints?.maxHeight, avatarSize);
    });
  });

  group('AvatarGroup Widget Tests', () {
    testWidgets('AvatarGroup displays multiple avatars', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AvatarGroup(
              names: ['John Doe', 'Jane Smith', 'Bob Johnson'],
              maxVisible: 3,
              size: 32,
            ),
          ),
        ),
      );

      expect(find.text('JD'), findsOneWidget);
      expect(find.text('JS'), findsOneWidget);
      expect(find.text('BJ'), findsOneWidget);
    });

    testWidgets('AvatarGroup shows extra count when names exceed maxVisible', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AvatarGroup(
              names: ['John', 'Jane', 'Bob', 'Alice', 'Charlie'],
              maxVisible: 3,
              size: 32,
            ),
          ),
        ),
      );

      expect(find.text('+2'), findsOneWidget);
    });
  });
}
