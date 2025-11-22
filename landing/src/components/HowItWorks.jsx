import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Crea tu Perfil',
    description: 'Regístrate como demandante o proveedor en minutos. Completa tu perfil con información relevante.',
    icon: '👤',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    number: '02',
    title: 'Busca o Publica',
    description: 'Busca profesionales cerca de ti o publica tu servicio para que te encuentren.',
    icon: '🔍',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    number: '03',
    title: 'Conecta y Coordina',
    description: 'Comunícate directamente, acuerda detalles y confirma el servicio.',
    icon: '💬',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    number: '04',
    title: 'Completa y Califica',
    description: 'Realiza el trabajo, marca como completado y deja una reseña para ayudar a la comunidad.',
    icon: '⭐',
    gradient: 'from-pink-500 to-orange-500',
  },
];

function StepCard({ step, index, isLast }) {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-8">
      {/* Step content */}
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className="flex-1"
      >
        <div className="relative group">
          {/* Hover glow */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

          {/* Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            {/* Number badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} text-2xl font-bold text-white`}>
                {step.number}
              </div>
              <div className="text-4xl">{step.icon}</div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-4">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeline connector - only on desktop */}
      {!isLast && (
        <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-24 -translate-x-1/2">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            className={`w-full h-full bg-gradient-to-b ${step.gradient} origin-top`}
          />
        </div>
      )}

      {/* Animated circle on timeline - desktop only */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
        className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.gradient}`} />
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.gradient} blur-md animate-pulse`} />
        </div>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold">
              Proceso Simple
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            ¿Cómo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600">
              funciona?
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            En solo 4 pasos simples, comienza a conectar con profesionales
            o a ofrecer tus servicios
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <span className="text-green-400 text-2xl animate-pulse">✓</span>
            <span className="text-white font-medium">Simple, rápido y efectivo</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
