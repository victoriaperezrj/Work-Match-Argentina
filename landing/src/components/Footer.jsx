import { motion } from 'framer-motion';

export default function Footer() {
  const footerLinks = {
    producto: [
      { name: 'Características', href: '#features' },
      { name: 'Cómo Funciona', href: '#how-it-works' },
      { name: 'Precios', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Carreras', href: '#careers' },
      { name: 'Contacto', href: '#contact' },
    ],
    legal: [
      { name: 'Términos', href: '#terms' },
      { name: 'Privacidad', href: '#privacy' },
      { name: 'Cookies', href: '#cookies' },
      { name: 'Licencias', href: '#licenses' },
    ],
    social: [
      { name: 'Twitter', href: '#', icon: '𝕏' },
      { name: 'LinkedIn', href: '#', icon: 'in' },
      { name: 'GitHub', href: '#', icon: '' },
      { name: 'Instagram', href: '#', icon: '' },
    ],
  };

  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

      {/* Background effects */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    W
                  </div>
                  <span className="text-white font-bold text-2xl">
                    WorkMatch
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                  Conectando talento con oportunidades en Argentina.
                  La plataforma líder para servicios profesionales.
                </p>

                {/* Newsletter */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Suscribirse
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Links columns */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-white font-semibold mb-4 capitalize">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2"
                      >
                        {link.icon && <span>{link.icon}</span>}
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} WorkMatch Argentina. Todos los derechos reservados.
              </p>

              {/* Made with love */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Hecho con</span>
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-red-500"
                >
                  ❤️
                </motion.span>
                <span>en Argentina</span>
              </div>

              {/* Language selector */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm">
                  🇦🇷 ES
                </button>
                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm opacity-50">
                  🇺🇸 EN
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50" />
    </footer>
  );
}
