# Guía de Deployment en Vercel - Monorepo

Este proyecto es un monorepo con la aplicación Next.js ubicada en la carpeta `frontend/`.

## Opción 1: Deployment Automático (Recomendado)

### Configuración del Proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. **IMPORTANTE**: Configura lo siguiente en "Configure Project":

   **Framework Preset**: Next.js

   **Root Directory**: `frontend`
   - Haz clic en "Edit" junto a "Root Directory"
   - Selecciona `frontend` de la lista

   **Build and Output Settings**:
   - Build Command: `npm run build` (auto-detectado)
   - Output Directory: `.next` (auto-detectado)
   - Install Command: `npm install` (auto-detectado)

5. **Variables de Entorno**:
   Añade la siguiente variable:
   ```
   NEXT_PUBLIC_API_URL=https://tu-api-backend.com
   ```
   (Reemplaza con la URL de tu API en producción)

6. Haz clic en "Deploy"

## Opción 2: Deployment con Vercel CLI

### Instalación
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Deploy
```bash
# Desde la raíz del proyecto
vercel

# Cuando te pregunte por el Root Directory, especifica: frontend
```

### Deploy a Producción
```bash
vercel --prod
```

## Opción 3: Usar el vercel.json en la Raíz

El archivo `vercel.json` en la raíz ya está configurado para manejar el monorepo:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

Con esta configuración, Vercel automáticamente:
- Entrará al directorio `frontend/`
- Instalará las dependencias
- Construirá la aplicación Next.js
- Desplegará desde `frontend/.next`

## Variables de Entorno Necesarias

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

### Para Producción
```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

### Para Preview/Development
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Resolución de Problemas

### Error 404/NOT_FOUND en rutas dinámicas

Next.js 14 con App Router maneja automáticamente el enrutamiento del lado del cliente. No necesitas configuraciones adicionales de rewrites.

Si encuentras errores 404:
1. Verifica que todas las páginas estén en la carpeta `app/`
2. Asegúrate de que los archivos se llamen `page.tsx`
3. Revisa que el build se complete sin errores

### El build falla

Si el build falla en Vercel:

1. **Verifica el Root Directory**: Debe estar configurado a `frontend`
2. **Revisa los logs**: Vercel muestra logs detallados del build
3. **Prueba localmente**:
   ```bash
   cd frontend
   npm run build
   ```
4. **Verifica las dependencias**: Todas deben estar en `frontend/package.json`

### Variables de entorno no se cargan

1. Asegúrate de que las variables comiencen con `NEXT_PUBLIC_` para que estén disponibles en el cliente
2. Después de añadir/modificar variables, haz un nuevo deploy

## Testing del Deployment

Una vez desplegado:

1. Abre la URL de Vercel
2. Prueba el flujo de autenticación (Login/Register)
3. Verifica que las llamadas API funcionen (necesitarás el backend desplegado)
4. Prueba la navegación entre rutas

## Estructura de Archivos para Vercel

```
Work-Match-Argentina/
├── frontend/              ← Root Directory en Vercel
│   ├── app/
│   ├── lib/
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── microservices/        ← Ignorado por Vercel
├── infra/                ← Ignorado por Vercel
├── vercel.json           ← Configuración del monorepo
└── .vercelignore         ← Archivos a ignorar
```

## Notas Importantes

1. **Backend**: El frontend en Vercel necesitará conectarse a tu backend (Go API) que debe estar desplegado en otra plataforma (Google Cloud Run, AWS, Railway, etc.)

2. **Variables de entorno**: Actualiza `NEXT_PUBLIC_API_URL` con la URL de tu backend en producción

3. **CORS**: Asegúrate de que tu backend Go tenga configurado CORS para permitir requests desde tu dominio de Vercel

4. **Dominio**: Vercel te dará un dominio como `tu-proyecto.vercel.app`. Puedes configurar un dominio personalizado en Settings → Domains

## Referencias

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
