# 🚀 Quick Start - Landing Page Futurista

## Instalación Rápida

```bash
# 1. Navegar al directorio
cd landing

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 🎨 Vista Previa

La landing page estará disponible en: **http://localhost:3000**

## 🎯 Componentes Visuales Implementados

### 1️⃣ Interactive Particle System
**Ubicación:** `src/components/InteractiveParticles.jsx`

Sistema de partículas 3D con:
- ✨ 1000 partículas flotantes
- 🔗 Líneas de conexión con gradientes
- 🖱️ Interacción con el mouse
- 🌊 Movimiento orgánico suave

**Personalización:**
```jsx
const particleCount = 1000; // Ajustar cantidad
const mouseInfluence = 2;   // Ajustar intensidad de interacción
```

### 2️⃣ Animated Mesh Gradient
**Ubicación:** `src/components/AnimatedMeshGradient.jsx`

Gradiente animado líquido con:
- 🌈 Colores que fluyen (cyan → purple → blue)
- ✨ Efecto shimmer superpuesto
- 🌫️ Blur alto (60-80px)
- 🎭 Hover interaction

**Personalización:**
```jsx
filter: `blur(${isHovered ? '60px' : '80px'})`
```

### 3️⃣ Iridescent Glow
**Ubicación:** `src/components/IridescentGlow.jsx`

Brillo iridiscente para CTAs:
- 💫 Múltiples capas de gradientes
- 🔄 Rotación animada
- 💎 Edge glow con box-shadows
- 🎚️ 3 niveles de intensidad

**Uso:**
```jsx
<IridescentGlow intensity="high">
  <button>Tu CTA</button>
</IridescentGlow>
```

## 🎨 Paleta de Colores

```javascript
{
  cyan: '#00BCD4',
  purple: '#9C27B0',
  blue: '#4285F4'
}
```

## 📱 Responsive

Optimizado para:
- 📱 Mobile (< 768px)
- 📲 Tablet (768px - 1280px)
- 💻 Laptop (1280px - 1920px)
- 🖥️ Desktop (1920px+)

## ⚡ Performance

- **Canvas rendering** para gradientes eficientes
- **requestAnimationFrame** para animaciones suaves
- **Float32Array** para datos de partículas
- **Additive blending** para efectos de luz
- **Optimizado para 60 FPS**

## 🔧 Configuración Avanzada

### Ajustar intensidad de partículas:
```jsx
// En InteractiveParticles.jsx, línea 10
const particleCount = 500; // Reducir para mejor performance
```

### Cambiar colores del gradiente:
```jsx
// En AnimatedMeshGradient.jsx
const hue1 = (190 + Math.sin(time) * 30) % 360; // Cyan
const hue2 = (270 + Math.cos(time * 0.7) * 30) % 360; // Purple
```

### Modificar velocidad de animaciones:
```jsx
// En tailwind.config.js
animation: {
  'gradient-shift': 'gradient-shift 4s ease infinite', // Cambiar 4s
}
```

## 🏗️ Build para Producción

```bash
npm run build
```

Archivos optimizados en `dist/`

## 🌐 Deploy

### Vercel (Recomendado)
```bash
vercel
```

### Netlify
```bash
netlify deploy
```

### Servidor estático
```bash
npm run build
# Copiar carpeta dist/ a tu servidor
```

## 🎭 Demos de Componentes

### Demo 1: Solo Partículas
```jsx
import InteractiveParticles from './components/InteractiveParticles';

function App() {
  return <InteractiveParticles />;
}
```

### Demo 2: Solo Hero con Gradiente
```jsx
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
    </div>
  );
}
```

### Demo 3: CTAs Iridiscentes
```jsx
import IridescentGlow from './components/IridescentGlow';

function CTASection() {
  return (
    <IridescentGlow intensity="high">
      <button className="px-8 py-4 bg-white/10">
        Click Me
      </button>
    </IridescentGlow>
  );
}
```

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module 'three'"
```bash
npm install three @react-three/fiber @react-three/drei
```

### ❌ Error: "Tailwind classes not working"
```bash
# Verificar que existe postcss.config.js
# Reiniciar servidor dev
npm run dev
```

### ❌ Performance lento
```jsx
// Reducir partículas
const particleCount = 500; // En vez de 1000

// Reducir calidad de blur
filter: 'blur(40px)' // En vez de 80px
```

## 📚 Recursos

- [Three.js Docs](https://threejs.org/docs/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

## 🤝 Contribuir

Ver el archivo principal `README.md` para más detalles sobre arquitectura y contribuciones.

---

**¡Disfruta creando experiencias visuales increíbles! ✨**
