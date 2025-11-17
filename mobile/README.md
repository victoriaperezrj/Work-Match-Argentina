# WorkMatch Mobile - Flutter App

Aplicación móvil nativa para Android e iOS de la plataforma WorkMatch Argentina.

## Requisitos Previos

### Instalar Flutter

1. **Descarga Flutter SDK**:
   - Ve a [flutter.dev](https://flutter.dev/docs/get-started/install)
   - Descarga para tu sistema operativo (Windows, macOS, Linux)

2. **Añade Flutter a tu PATH**:
   ```bash
   export PATH="$PATH:`pwd`/flutter/bin"
   ```

3. **Verifica la instalación**:
   ```bash
   flutter doctor
   ```

### Android Studio (para desarrollo Android)

1. Descarga [Android Studio](https://developer.android.com/studio)
2. Instala Android SDK (API 33+)
3. Configura un emulador Android o conecta un dispositivo físico

### Xcode (para desarrollo iOS - solo macOS)

1. Descarga Xcode desde App Store
2. Instala Command Line Tools:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   ```

## Configuración del Proyecto

### 1. Instalar Dependencias

```bash
cd mobile
flutter pub get
```

### 2. Configurar el Backend

Edita `lib/services/api_service.dart` y actualiza la URL del backend:

```dart
// Para Android Emulator:
static const String baseUrl = 'http://10.0.2.2:8080';

// Para iOS Simulator:
static const String baseUrl = 'http://localhost:8080';

// Para dispositivo físico (mismo WiFi):
static const String baseUrl = 'http://192.168.1.XXX:8080';

// Para producción:
static const String baseUrl = 'https://your-api.com';
```

## Ejecutar la Aplicación

### Android

```bash
# Listar dispositivos disponibles
flutter devices

# Ejecutar en emulador/dispositivo Android
flutter run
```

### iOS (solo macOS)

```bash
# Abrir simulador iOS
open -a Simulator

# Ejecutar en simulador iOS
flutter run
```

### Modo Debug

```bash
flutter run --debug
```

### Modo Release

```bash
flutter run --release
```

## Estructura del Proyecto

```
mobile/
├── lib/
│   ├── main.dart                    # Punto de entrada
│   ├── models/                      # Modelos de datos
│   │   ├── user.dart
│   │   ├── provider_profile.dart
│   │   └── service_request.dart
│   ├── providers/                   # State management (Provider)
│   │   └── auth_provider.dart
│   ├── screens/                     # Pantallas de la app
│   │   ├── auth/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── demandante/
│   │   └── proveedor/
│   ├── services/                    # API services
│   │   └── api_service.dart
│   ├── widgets/                     # Widgets reutilizables
│   │   ├── custom_button.dart
│   │   └── custom_text_field.dart
│   └── utils/                       # Utilidades y constantes
│       └── constants.dart
├── android/                         # Configuración Android
├── ios/                             # Configuración iOS
├── assets/                          # Recursos (imágenes, fonts)
└── pubspec.yaml                     # Dependencias del proyecto
```

## Dependencias Principales

- **flutter**: SDK de Flutter
- **provider**: State management
- **http/dio**: Peticiones HTTP
- **shared_preferences**: Almacenamiento local
- **flutter_secure_storage**: Almacenamiento seguro (tokens)
- **geolocator**: Servicios de ubicación
- **go_router**: Navegación avanzada

## Características Implementadas

### ✅ Autenticación
- Login con email y contraseña
- Registro con selección de rol (Demandante/Proveedor)
- Almacenamiento seguro de tokens JWT
- Persistencia de sesión

### 🚧 En Desarrollo
- Dashboard Demandante
- Dashboard Proveedor
- Creación de solicitudes de servicio
- Geolocalización
- Perfil de proveedor
- Lista de trabajos pendientes

## Testing

### Ejecutar Tests Unitarios

```bash
flutter test
```

### Ejecutar Tests de Integración

```bash
flutter drive --target=test_driver/app.dart
```

## Build para Producción

### Android APK

```bash
flutter build apk --release
```

El APK se generará en: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (para Google Play)

```bash
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Debugging

### Ver logs en tiempo real

```bash
flutter logs
```

### Análisis de código

```bash
flutter analyze
```

### Hot Reload

Durante el desarrollo, puedes hacer cambios en el código y presionar `r` en la terminal para recargar la app sin reiniciarla.

### Hot Restart

Presiona `R` (mayúscula) para reiniciar completamente la app.

## Roadmap de Desarrollo

### Etapa 1: Fundamentos ✅
- [x] Configuración del proyecto
- [x] Estructura de carpetas
- [x] Modelos de datos
- [x] Servicio de API

### Etapa 2: Autenticación ✅
- [x] Pantalla de login
- [x] Pantalla de registro
- [x] State management con Provider
- [x] Almacenamiento seguro de tokens

### Etapa 3: UI Demandante 🚧
- [ ] Dashboard
- [ ] Crear nueva solicitud
- [ ] Ver solicitudes activas
- [ ] Geolocalización

### Etapa 4: UI Proveedor 🚧
- [ ] Configurar perfil
- [ ] Ver trabajos pendientes
- [ ] Aceptar trabajos
- [ ] Historial

### Etapa 5: Características Avanzadas
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Calificaciones y reviews
- [ ] Pagos integrados

### Etapa 6: Refinamiento
- [ ] Modo oscuro
- [ ] Animaciones
- [ ] Offline mode
- [ ] Tests completos

## Solución de Problemas

### Error: "Unable to connect to backend"

1. Verifica que el backend esté corriendo
2. Verifica la URL en `api_service.dart`
3. Para Android emulator, usa `10.0.2.2` en lugar de `localhost`

### Error: "Location permissions denied"

Asegúrate de que los permisos estén en `AndroidManifest.xml` y en `Info.plist` (iOS)

### Hot Reload no funciona

Presiona `R` (mayúscula) para hacer un hot restart completo

## Recursos

- [Documentación de Flutter](https://flutter.dev/docs)
- [Cookbook de Flutter](https://flutter.dev/docs/cookbook)
- [Dart Language](https://dart.dev/guides)
- [Provider Package](https://pub.dev/packages/provider)

## Licencia

MIT
