# WorkMatch Argentina

Plataforma de matching de servicios con arquitectura de microservicios que conecta demandantes de servicios con proveedores calificados.

## Arquitectura

```
Work-Match-Argentina/
├── frontend/                 # Next.js + TypeScript + Tailwind CSS (Web)
├── mobile/                   # Flutter - App móvil Android/iOS 📱
├── microservices/
│   ├── api-core/            # Go API - Lógica de negocio principal
│   └── api-ia/              # Python FastAPI - Servicio de IA para pricing
└── infra/                   # Docker Compose para desarrollo local
```

## Plataformas

Esta es una solución **multiplataforma** al estilo Mercado Libre:
- 💻 **Web Responsive** (Next.js) - Acceso desde navegador en PC/móvil
- 📱 **App Móvil Nativa** (Flutter) - Experiencia optimizada para Android/iOS
- 🔗 **Mismo Backend** - Ambas plataformas se conectan a la misma API

## Tecnologías

### Frontend Web
- **Framework**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Deploy**: Vercel

### Mobile App
- **Framework**: Flutter (Dart)
- **State Management**: Provider
- **HTTP Client**: Dio/HTTP
- **Storage**: SharedPreferences, Flutter Secure Storage
- **Plataformas**: Android & iOS

### Backend
- **API Core**: Go 1.21, Gorilla Mux, PostgreSQL, JWT, bcrypt
- **API IA**: Python 3.11, FastAPI, Uvicorn
- **Base de Datos**: PostgreSQL 15
- **Infraestructura**: Docker, Docker Compose

## Características

### Para Demandantes
- Registro y autenticación con JWT
- Creación de solicitudes de servicio
- Ubicación geográfica del trabajo
- Precio dinámico generado por IA
- Dashboard con estado de solicitudes

### Para Proveedores
- Registro y autenticación con JWT
- Configuración de perfil (servicios, radio de cobertura, ubicación)
- Visualización de trabajos pendientes filtrados por:
  - Tipo de servicio ofrecido
  - Radio de cobertura (cálculo geográfico con Haversine)
- Aceptación de trabajos
- Dashboard con trabajos activos

### Sistema de IA
- Predicción de precios basada en:
  - Tipo de servicio
  - Complejidad (análisis de descripción)
  - Variación de mercado simulada
- Endpoint `/api/v1/predict_price`

## Instalación y Ejecución

### Prerequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local del frontend web)
- Go 1.21+ (para desarrollo local del backend)
- Python 3.11+ (para desarrollo local del servicio IA)
- Flutter SDK (para desarrollo de la app móvil)

### Ejecución con Docker Compose

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd Work-Match-Argentina
```

2. Levantar los servicios:
```bash
cd infra
docker-compose up --build
```

Esto levantará:
- **PostgreSQL**: `localhost:5432`
- **API Core (Go)**: `localhost:8080`
- **API IA (Python)**: `localhost:8081`

3. Para el frontend web (en desarrollo local):
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Ejecución de la App Móvil

1. Instalar Flutter SDK:
   - Descarga desde [flutter.dev](https://flutter.dev/docs/get-started/install)
   - Verifica: `flutter doctor`

2. Instalar dependencias:
```bash
cd mobile
flutter pub get
```

3. Ejecutar en emulador/dispositivo:
```bash
# Android
flutter run

# iOS (solo macOS)
flutter run
```

📱 **Documentación completa**: Ver [mobile/README.md](./mobile/README.md)

### Variables de Entorno

**API Core (Go)**:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Secreto para firma de tokens JWT
- `PORT`: Puerto del servidor (default: 8080)
- `AI_SERVICE_URL`: URL del servicio de IA

**API IA (Python)**:
- `PORT`: Puerto del servidor (default: 8081)

**Frontend (Next.js)**:
- `NEXT_PUBLIC_API_URL`: URL de la API Core (default: http://localhost:8080)

## Endpoints de la API

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login

### Perfil (requiere autenticación)
- `GET /api/v1/profile/me` - Obtener perfil del usuario
- `PUT /api/v1/profile/provider` - Actualizar perfil de proveedor

### Solicitudes (requiere autenticación)
- `POST /api/v1/requests/create` - Crear solicitud de servicio
- `GET /api/v1/requests/pending` - Obtener trabajos pendientes (Proveedor)
- `GET /api/v1/requests/my-requests` - Obtener mis solicitudes
- `POST /api/v1/requests/{id}/accept` - Aceptar trabajo (Proveedor)
- `POST /api/v1/requests/{id}/complete` - Completar trabajo

### IA
- `POST /api/v1/predict_price` - Predecir precio de servicio

## Modelos de Datos

### User
```go
{
  id: int
  email: string
  password_hash: string
  role: string // 'Demandante' | 'Proveedor'
  is_verified: bool
  created_at: timestamp
}
```

### ProviderProfile
```go
{
  id: int
  user_id: int
  services: []string
  radius_km: int
  lat: float64
  lon: float64
  rating: float64
  created_at: timestamp
  updated_at: timestamp
}
```

### ServiceRequest
```go
{
  id: int
  demandante_id: int
  provider_id: int? (nullable)
  description: string
  service_type: string
  lat: float64
  lon: float64
  status: string // 'Pendiente' | 'Asignado' | 'Completado' | 'Cancelado'
  price_quoted: float64? (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

## Tipos de Servicios Disponibles

- Plomeria
- Electricidad
- Jardineria
- Limpieza
- Pintura
- Carpinteria
- Herreria
- Albañileria
- Techado
- Mudanza

## Flujo de Usuario

1. **Registro**: Usuario se registra eligiendo rol (Demandante/Proveedor)
2. **Login**: Autenticación con JWT
3. **Demandante**:
   - Crea solicitud de servicio con ubicación
   - El sistema consulta la IA para precio dinámico
   - Espera que un proveedor acepte el trabajo
4. **Proveedor**:
   - Configura su perfil (servicios, radio, ubicación)
   - Ve trabajos pendientes filtrados por criterios
   - Acepta trabajos de su interés
5. **Completar**: Cualquiera puede marcar el trabajo como completado

## Deploy

### Frontend (Vercel)
El proyecto es un **monorepo** con el código de Next.js en la carpeta `frontend/`.

**Configuración en Vercel Dashboard:**
1. Importa el repositorio en Vercel
2. **Root Directory**: Configura a `frontend`
3. **Framework**: Next.js (auto-detectado)
4. **Variables de entorno**: Añade `NEXT_PUBLIC_API_URL` con la URL de tu API en producción

**Deploy con CLI:**
```bash
vercel --prod
```

El archivo `vercel.json` en la raíz ya está configurado para manejar el monorepo automáticamente.

📖 **Guía detallada**: Ver [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Backend
Los servicios backend pueden desplegarse en:
- **Google Cloud Run** (Recomendado para Go y Python)
- **AWS ECS/Fargate**
- **Railway** (Deploy rápido con Docker)
- **Render** (Alternativa a Heroku)
- **Kubernetes**
- Cualquier plataforma que soporte contenedores Docker

**Importante**: Configura las variables de entorno y actualiza `NEXT_PUBLIC_API_URL` en Vercel con la URL del backend en producción.

## Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con expiración de 24 horas
- CORS configurado
- Validación de roles en endpoints protegidos
- SQL preparado para prevenir inyección SQL

## Desarrollo

### Estructura del Código Go
```
microservices/api-core/
├── cmd/main.go           # Entry point
├── internal/
│   ├── db/              # Database connection and migrations
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── handlers/        # HTTP handlers
│   └── middleware/      # JWT middleware
├── go.mod
└── Dockerfile
```

### Estructura del Frontend
```
frontend/
├── app/
│   ├── login/          # Login page
│   ├── register/       # Register page
│   ├── demandante/     # Demandante dashboard
│   └── proveedor/      # Proveedor dashboard
├── lib/
│   └── api.ts          # API client
└── components/         # Reusable components
```

## Testing

Para probar el flujo completo:

1. Registra un usuario Demandante
2. Crea una solicitud de servicio
3. Registra un usuario Proveedor
4. Configura el perfil del proveedor (incluyendo el tipo de servicio)
5. Verifica que la solicitud aparezca en trabajos pendientes
6. Acepta el trabajo
7. Verifica el cambio de estado

## Licencia

MIT

## Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.
