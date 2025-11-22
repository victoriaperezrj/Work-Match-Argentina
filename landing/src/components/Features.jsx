import { motion } from 'framer-motion';
import { useState } from 'react';
import IridescentGlow from './IridescentGlow';

const features = [
  {
    icon: '🔍',
    title: 'Búsqueda Inteligente',
    description: 'Encuentra profesionales cerca de ti con filtros avanzados por servicio, ubicación y calificación.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: '⭐',
    title: 'Calificaciones Verificadas',
    description: 'Sistema de reseñas transparente para garantizar calidad y confianza en cada servicio.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🛡️',
    title: 'Seguro y Confiable',
    description: 'Reportes, verificación de usuarios y sistema de resolución de disputas integrado.',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: '📍',
    title: 'Geolocalización',
    description: 'Matching inteligente basado en ubicación para servicios rápidos y eficientes.',
    gradient: 'from-green-500 to-cyan-500',
  },
  {
    icon: '💬',
    title: 'Comunicación Directa',
    description: 'Chat integrado para coordinar detalles y mantener todo en un solo lugar.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: '📊',
    title: 'Estadísticas en Tiempo Real',
    description: 'Dashboard completo con métricas de rendimiento, ganancias y solicitudes.',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-30`}
          />
        )}

        {/* Card content */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
          {/* Icon */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} text-3xl`}>
              {feature.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">
            {feature.description}
          </p>

          {/* Decorative gradient line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-6 h-1 bg-gradient-to-r ${feature.gradient} rounded-full origin-left`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold">
              Características
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Todo lo que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              necesitas
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Una plataforma completa diseñada para conectar talento con oportunidades
            de manera eficiente y segura.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <IridescentGlow intensity="medium">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              Ver Todas las Características
            </button>
          </IridescentGlow>
        </motion.div>
      </div>
    </section>
  );
}
