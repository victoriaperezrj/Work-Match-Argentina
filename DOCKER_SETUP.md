# Docker Setup - WorkMatch Argentina

Este documento describe cómo ejecutar WorkMatch usando Docker y Docker Compose.

## Pre-requisitos

- Docker Engine 20.10+
- Docker Compose v2.0+

## Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Work-Match-Argentina
```

### 2. Iniciar todos los servicios

```bash
docker-compose up -d
```

Este comando iniciará:
- PostgreSQL (puerto 5432)
- AI Service (puerto 8081)
- API Core (puerto 8080)

### 3. Verificar que los servicios están corriendo

```bash
docker-compose ps
```

Deberías ver todos los servicios con estado "Up".

### 4. Ver los logs

```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f api-core
docker-compose logs -f ai-service
docker-compose logs -f postgres
```

### 5. Probar la API

```bash
# Health check
curl http://localhost:8080/health

# O visita en tu navegador
http://localhost:8080/health
```

## Comandos Útiles

### Detener los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (¡CUIDADO! Elimina la base de datos)

```bash
docker-compose down -v
```

### Reconstruir las imágenes

```bash
docker-compose build
```

### Reconstruir y reiniciar

```bash
docker-compose up -d --build
```

### Ejecutar comandos en un contenedor

```bash
# Entrar a la shell de PostgreSQL
docker-compose exec postgres psql -U workmatch -d workmatch

# Ver las tablas
docker-compose exec postgres psql -U workmatch -d workmatch -c "\dt"
```

### Reiniciar un servicio específico

```bash
docker-compose restart api-core
```

## Variables de Entorno

Las variables de entorno se configuran en el archivo `docker-compose.yml`:

- `DATABASE_URL`: Conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT (¡CAMBIAR EN PRODUCCIÓN!)
- `AI_SERVICE_URL`: URL del servicio de AI
- `PORT`: Puerto de la API (8080)

## Arquitectura

```
┌─────────────┐
│   Mobile    │
│  (Flutter)  │
└──────┬──────┘
       │
       │ HTTP
       ▼
┌─────────────────┐     ┌──────────────┐
│   API Core      │────▶│ AI Service   │
│   (Go:8080)     │     │ (Python:8081)│
└────────┬────────┘     └──────────────┘
         │
         │ SQL
         ▼
    ┌──────────┐
    │PostgreSQL│
    │  :5432   │
    └──────────┘
```

## Desarrollo

### Modo desarrollo con auto-reload

Para desarrollo local sin Docker, consulta los README individuales de cada servicio:
- [API Core](./microservices/api-core/README.md)
- [AI Service](./microservices/ai-service/README.md)
- [Mobile App](./mobile/README.md)

### Acceder a la base de datos

```bash
# Opción 1: Desde el contenedor
docker-compose exec postgres psql -U workmatch -d workmatch

# Opción 2: Desde tu máquina (si tienes psql instalado)
psql -h localhost -U workmatch -d workmatch
# Password: workmatch123
```

### Migrar la base de datos

Las migraciones se ejecutan automáticamente al iniciar el API Core.
Si necesitas ejecutarlas manualmente:

```bash
docker-compose restart api-core
docker-compose logs -f api-core
```

## Troubleshooting

### Puerto ya en uso

Si ves un error como "port is already allocated":

```bash
# Ver qué está usando el puerto
lsof -i :8080

# Detener el proceso o cambiar el puerto en docker-compose.yml
```

### Problemas de conexión a la base de datos

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### Limpiar todo y empezar de cero

```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes huérfanas
docker system prune -f

# Reconstruir e iniciar
docker-compose up -d --build
```

## Producción

### Consideraciones de seguridad para producción:

1. **Cambiar JWT_SECRET**: Usa un valor aleatorio y seguro
2. **Cambiar contraseñas de DB**: No uses las credenciales por defecto
3. **Usar HTTPS**: Configura un reverse proxy (nginx) con SSL
4. **Rate limiting**: Ya está implementado (100 req/min)
5. **Logs**: Configura log aggregation (ELK, Datadog, etc.)
6. **Backups**: Configura backups automáticos de PostgreSQL
7. **Monitoring**: Agrega health checks y alertas

### Ejemplo de variables de entorno para producción:

```bash
# Crear un archivo .env
DATABASE_URL=postgres://user:STRONG_PASSWORD@postgres:5432/workmatch?sslmode=require
JWT_SECRET=RANDOM_GENERATED_SECRET_KEY_AT_LEAST_32_CHARS
```

## Soporte

Para más información, consulta la documentación:
- [API Documentation](./API_DOCUMENTATION.md)
- [Mobile README](./mobile/README.md)
