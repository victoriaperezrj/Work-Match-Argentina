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
