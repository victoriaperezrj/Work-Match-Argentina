# WorkMatch Argentina - Landing Page Futurista

Landing page con diseño futurista inspirado en Google DeepMind/Gemini, implementada con React, Tailwind CSS, Framer Motion y Three.js.

## 🎨 Componentes Visuales

### 1. Interactive Particle System
Sistema de partículas 3D interactivo que responde sutilmente al movimiento del mouse del usuario.

**Características:**
- 1000 partículas flotantes con movimiento orgánico
- Líneas de conexión con gradientes cyan-purple
- Interacción suave con el cursor
- Blending aditivo para efectos de luz
- Rotación gentle del campo completo

**Archivo:** `src/components/InteractiveParticles.jsx`

### 2. Animated Mesh Gradient
Gradiente animado que fluye líquidamente con colores que cambian dinámicamente.

**Características:**
- Canvas HTML5 con gradientes animados
- Transición suave entre tonos cyan, purple y blue
- Efecto shimmer superpuesto
- Blur alto (60-80px) para efecto suave
- Hover interaction con scaling

**Archivo:** `src/components/AnimatedMeshGradient.jsx`

### 3. Iridescent Glow
Efecto de brillo iridiscente para botones y CTAs.

**Características:**
- Múltiples capas de gradientes radiales
- Rotación y scaling animados
- Edge glow con box-shadow multicapa
- Backdrop blur para profundidad
- Tres niveles de intensidad (low, medium, high)

**Archivo:** `src/components/IridescentGlow.jsx`

### 4. Hero Section
Sección principal que integra todos los efectos visuales.

**Características:**
- Logo con Mesh Gradient animado
- CTAs con Iridescent Glow
- Feature pills con animaciones escalonadas
- Ambient light effects en background
- Responsive design

**Archivo:** `src/components/Hero.jsx`

## 🚀 Instalación

```bash
cd landing
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecutará en `http://localhost:3000`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`

## 📦 Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animaciones fluidas
- **Three.js** - Gráficos 3D
- **React Three Fiber** - React renderer para Three.js
- **React Three Drei** - Helpers para React Three Fiber

## 🎯 Optimizaciones de Rendimiento

- **Sistema de partículas optimizado**: Solo 1000 partículas para balance visual/rendimiento
- **Canvas rendering**: Gradientes dibujados en canvas para mejor performance
- **Blending modes**: AdditiveBlending para efectos de luz sin impacto pesado
- **Device pixel ratio**: Canvas escalado correctamente para pantallas HiDPI
- **Animation frames**: Uso de requestAnimationFrame para animaciones suaves

## 🎨 Paleta de Colores

```javascript
{
  deepmindBlue: '#4285F4',    // Azul principal
  deepmindPurple: '#9C27B0',  // Violeta
  deepmindCyan: '#00BCD4',    // Cyan
}
```

## 📱 Responsive Design

La landing está optimizada para:
- Desktop (1920px+)
- Laptop (1280px - 1920px)
- Tablet (768px - 1280px)
- Mobile (< 768px)

## 🔧 Personalización

### Ajustar intensidad de partículas:
```jsx
// En InteractiveParticles.jsx
const particleCount = 1000; // Cambiar este valor
```

### Ajustar blur del gradiente:
```jsx
// En AnimatedMeshGradient.jsx
filter: `blur(${isHovered ? '60px' : '80px'})`
```

### Cambiar colores del gradiente:
```jsx
// En IridescentGlow.jsx
rgba(0, 188, 212, 0.8)  // Cyan
rgba(156, 39, 176, 0.8) // Purple
rgba(66, 133, 244, 0.6) // Blue
```

## 📝 Notas Técnicas

- El sistema de partículas usa `Float32Array` para mejor performance
- Los gradientes se animan con canvas 2D context
- Framer Motion se usa para micro-interacciones
- Las animaciones CSS se prefieren para loops simples
- El particle system tiene mouse tracking desacoplado para suavidad

## 🌟 Mejoras Futuras

- [ ] WebGL shaders personalizados para efectos más complejos
- [ ] Particle system adaptativo según GPU del usuario
- [ ] Más secciones de contenido (Features, Pricing, etc.)
- [ ] Modo oscuro/claro toggle
- [ ] Preloader con animación
- [ ] Scroll-triggered animations para secciones adicionales

## 📄 Licencia

Parte del proyecto WorkMatch Argentina

<!-- Deployment trigger: 2025-11-24 -->

