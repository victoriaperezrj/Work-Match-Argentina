import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: '-100px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: duration,
        ease: 'easeOut',
      });

      return controls.stop;
    }
  }, [isInView, count, value, duration]);

  return (
    <motion.span ref={nodeRef}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Usuarios Activos',
    description: 'Profesionales y clientes conectados',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    value: 50000,
    suffix: '+',
    label: 'Servicios Completados',
    description: 'Trabajos exitosos realizados',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    value: 4.8,
    suffix: '/5',
    label: 'Calificación Promedio',
    description: 'Satisfacción de nuestros usuarios',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    value: 150,
    suffix: '+',
    label: 'Categorías',
    description: 'Tipos de servicios disponibles',
    gradient: 'from-green-500 to-cyan-500',
  },
];

function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Animated border gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />

      {/* Card content */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        {/* Number */}
        <div className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2`}>
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </div>

        {/* Label */}
        <div className="text-xl font-semibold text-white mb-2">
          {stat.label}
        </div>

        {/* Description */}
        <div className="text-sm text-gray-400">
          {stat.description}
        </div>

        {/* Decorative dot */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
        />
      </div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(66, 133, 244, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(66, 133, 244, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Números que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              hablan por sí mismos
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Parte de una comunidad en crecimiento que confía en nuestra plataforma
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
