import { motion } from 'framer-motion';
import AnimatedMeshGradient from './AnimatedMeshGradient';
import IridescentGlow from './IridescentGlow';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Main content */}
      <div className="max-w-6xl mx-auto text-center z-10">
        {/* Logo/Brand with Mesh Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <AnimatedMeshGradient className="inline-block px-8 py-4 rounded-3xl">
            <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight">
              WorkMatch
            </h1>
          </AnimatedMeshGradient>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Conectando{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            talento
          </span>{' '}
          con{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
            oportunidades
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {/* Primary CTA with Iridescent Glow */}
          <IridescentGlow intensity="high">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              Buscar Servicios
            </button>
          </IridescentGlow>

          {/* Secondary CTA */}
          <IridescentGlow intensity="medium">
            <button className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              Ofrecer Servicios
            </button>
          </IridescentGlow>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap gap-4 justify-center"
        >
          {[
            { icon: '🔍', text: 'Búsqueda Inteligente' },
            { icon: '⭐', text: 'Calificaciones Verificadas' },
            { icon: '🛡️', text: 'Seguro y Confiable' },
            { icon: '📍', text: 'Geolocalización' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="px-6 py-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 flex items-center gap-2"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-white/80 text-sm font-medium">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
    </section>
  );
}
