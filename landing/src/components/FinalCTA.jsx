import { motion } from 'framer-motion';
import IridescentGlow from './IridescentGlow';
import AnimatedMeshGradient from './AnimatedMeshGradient';

export default function FinalCTA() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main card with mesh gradient background */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
            <div className="absolute inset-0 opacity-30">
              <AnimatedMeshGradient className="w-full h-full" />
            </div>

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />

            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-sm">
                  ✨ Únete a la comunidad
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                ¿Listo para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  comenzar?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              >
                Únete a miles de profesionales y clientes que ya están
                conectando en nuestra plataforma. Es gratis y solo toma minutos.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <IridescentGlow intensity="high">
                  <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-2xl min-w-[200px]">
                    Comenzar Gratis
                  </button>
                </IridescentGlow>

                <IridescentGlow intensity="medium">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 min-w-[200px]">
                    Ver Demo
                  </button>
                </IridescentGlow>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Configuración en 2 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Cancela cuando quieras</span>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl" />
          </div>
        </motion.div>

        {/* Floating elements around CTA */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-8 -left-8 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-8 -right-8 w-20 h-20 bg-purple-500/20 rounded-full blur-xl hidden lg:block"
        />
      </div>
    </section>
  );
}
