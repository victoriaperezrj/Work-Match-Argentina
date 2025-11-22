# WorkMatch Argentina - API Documentation

API REST para la plataforma WorkMatch Argentina.

## Base URL

```
Production: https://your-api.com
Development: http://localhost:8080
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

---

## Endpoints

### 🔓 Autenticación (Públicos)

#### POST /api/v1/auth/register

Registrar un nuevo usuario.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "tu_password",
  "role": "Demandante" // o "Proveedor"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "role": "Demandante",
    "is_verified": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400`: Email ya registrado
- `400`: Datos inválidos

---

#### POST /api/v1/auth/login

Iniciar sesión.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "tu_password"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "role": "Demandante",
    "is_verified": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401`: Credenciales inválidas

---

### 🔒 Perfil (Protegidos)

#### GET /api/v1/profile/me

Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "role": "Proveedor",
    "is_verified": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "provider_profile": {
    "id": 1,
    "user_id": 1,
    "services": ["Plomeria", "Electricidad"],
    "radius_km": 10,
    "lat": -34.6037,
    "lon": -58.3816,
    "rating": 4.5,
    "created_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
}
```

---

#### PUT /api/v1/profile/provider

Actualizar perfil de proveedor.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "services": ["Plomeria", "Electricidad", "Jardineria"],
  "radius_km": 15,
  "lat": -34.6037,
  "lon": -58.3816
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "services": ["Plomeria", "Electricidad", "Jardineria"],
  "radius_km": 15,
  "lat": -34.6037,
  "lon": -58.3816,
  "rating": 4.5,
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

### 🔒 Solicitudes de Servicio (Protegidos)

#### POST /api/v1/requests/create

Crear una nueva solicitud de servicio.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Necesito reparar una fuga de agua en el baño",
  "service_type": "Plomeria",
  "lat": -34.6037,
  "lon": -58.3816
}
```

**Response (201 Created):**
```json
{
  "id": 10,
  "demandante_id": 1,
  "provider_id": null,
  "description": "Necesito reparar una fuga de agua en el baño",
  "service_type": "Plomeria",
  "lat": -34.6037,
  "lon": -58.3816,
  "status": "Pendiente",
  "price_quoted": 3500.00,
  "created_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

**Errores:**
- `400`: Datos inválidos
- `401`: No autenticado
- `403`: Solo demandantes pueden crear solicitudes

---

#### GET /api/v1/requests/pending

Obtener solicitudes pendientes (para proveedores).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- Ninguno (filtra automáticamente por ubicación y servicios del proveedor)

**Response (200 OK):**
```json
[
  {
    "id": 10,
    "demandante_id": 2,
    "provider_id": null,
    "description": "Necesito reparar una fuga de agua",
    "service_type": "Plomeria",
    "lat": -34.6037,
    "lon": -58.3816,
    "status": "Pendiente",
    "price_quoted": 3500.00,
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
]
```

---

#### GET /api/v1/requests/my-requests

Obtener mis solicitudes (para demandantes y proveedores).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 10,
    "demandante_id": 1,
    "provider_id": 5,
    "description": "Reparación de fuga",
    "service_type": "Plomeria",
    "lat": -34.6037,
    "lon": -58.3816,
    "status": "Asignado",
    "price_quoted": 3500.00,
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
  }
]
```

---

#### POST /api/v1/requests/{requestID}/accept

Aceptar una solicitud de servicio (para proveedores).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 10,
  "demandante_id": 2,
  "provider_id": 1,
  "description": "Reparación de fuga",
  "service_type": "Plomeria",
  "lat": -34.6037,
  "lon": -58.3816,
  "status": "Asignado",
  "price_quoted": 3500.00,
  "updated_at": "2024-01-15T12:30:00Z"
}
```

**Errores:**
- `400`: Solicitud ya asignada
- `403`: Solo proveedores pueden aceptar

---

#### POST /api/v1/requests/{requestID}/complete

Completar una solicitud de servicio.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 10,
  "demandante_id": 2,
  "provider_id": 1,
  "description": "Reparación de fuga",
  "service_type": "Plomeria",
  "lat": -34.6037,
  "lon": -58.3816,
  "status": "Completado",
  "price_quoted": 3500.00,
  "updated_at": "2024-01-15T15:00:00Z"
}
```

---

### 🔒 Calificaciones (Protegidos)

#### POST /api/v1/ratings

Enviar una calificación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "request_id": 10,
  "score": 5,
  "comment": "Excelente trabajo, muy profesional"
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "request_id": 10,
  "from_user_id": 2,
  "to_user_id": 1,
  "score": 5,
  "comment": "Excelente trabajo, muy profesional",
  "created_at": "2024-01-15T16:00:00Z"
}
```

**Errores:**
- `400`: Ya has calificado esta solicitud
- `400`: Solo trabajos completados pueden ser calificados
- `400`: Score debe estar entre 1 y 5

---

#### GET /api/v1/ratings/user/{userID}

Obtener calificaciones de un usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 15,
    "request_id": 10,
    "from_user_id": 2,
    "to_user_id": 1,
    "score": 5,
    "comment": "Excelente trabajo",
    "created_at": "2024-01-15T16:00:00Z"
  }
]
```

---

#### GET /api/v1/ratings/user/{userID}/summary

Obtener resumen de calificaciones de un usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "average_score": 4.7,
  "total_ratings": 23,
  "distribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 5,
    "5": 15
  }
}
```

---

### 6. Búsqueda y Filtros

#### POST /api/v1/requests/search

Búsqueda avanzada de solicitudes con filtros.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (todos opcionales):**
```json
{
  "service_type": "Plomeria",
  "status": "Pendiente",
  "min_price": 1000.0,
  "max_price": 5000.0,
  "lat": -34.6037,
  "lon": -58.3816,
  "radius_km": 10,
  "sort_by": "created_at",
  "sort_order": "desc",
  "limit": 50,
  "offset": 0
}
```

**Parámetros:**
- `service_type`: Filtrar por tipo de servicio
- `status`: Filtrar por estado (Pendiente, Asignado, Completado)
- `min_price`, `max_price`: Rango de precio
- `lat`, `lon`, `radius_km`: Filtro por ubicación (radio en km)
- `sort_by`: Ordenar por "created_at" o "price_quoted"
- `sort_order`: "asc" o "desc"
- `limit`: Máximo de resultados (default: 50, max: 100)
- `offset`: Para paginación

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "demandante_id": 2,
    "provider_id": null,
    "description": "Reparar canilla que gotea",
    "service_type": "Plomeria",
    "lat": -34.6037,
    "lon": -58.3816,
    "status": "Pendiente",
    "price_quoted": 2500.50,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

### 7. Reportes

#### POST /api/v1/reports

Crear un reporte de usuario.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "reported_id": 5,
  "request_id": 10,
  "reason": "fraud",
  "description": "El usuario solicitó pago adicional no acordado"
}
```

**Parámetros:**
- `reported_id` (requerido): ID del usuario reportado
- `request_id` (opcional): ID de la solicitud relacionada
- `reason` (requerido): "spam", "inappropriate", "fraud", "harassment", "other"
- `description` (requerido): Descripción detallada del problema

**Response (201 Created):**
```json
{
  "id": 1,
  "reporter_id": 2,
  "reported_id": 5,
  "request_id": 10,
  "reason": "fraud",
  "description": "El usuario solicitó pago adicional no acordado",
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

**Errores:**
- `400`: No puedes reportarte a ti mismo
- `400`: Razón inválida
- `404`: Usuario reportado no encontrado

---

#### GET /api/v1/reports/my-reports

Obtener mis reportes creados.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "reporter_id": 2,
    "reported_id": 5,
    "request_id": 10,
    "reason": "fraud",
    "description": "El usuario solicitó pago adicional no acordado",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

---

## Estados de Solicitud

| Estado | Descripción |
|--------|-------------|
| `Pendiente` | Solicitud creada, esperando proveedor |
| `Asignado` | Proveedor aceptó la solicitud |
| `Completado` | Trabajo finalizado |
| `Cancelado` | Solicitud cancelada |

---

## Tipos de Servicio

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

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - Token inválido o ausente |
| `403` | Forbidden - No tienes permisos |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## Límites de Rate

- 100 requests por minuto por IP
- 1000 requests por hora por usuario autenticado

---

## Notas de Seguridad

- Todos los passwords son hasheados con bcrypt
- Los tokens JWT expiran en 24 horas
- CORS está habilitado para todos los orígenes en desarrollo
- En producción, configurar CORS para dominios específicos
