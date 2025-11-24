import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import IridescentGlow from './IridescentGlow';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const navbarOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const navbarBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Características', href: '#features' },
    { name: 'Cómo Funciona', href: '#how-it-works' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <motion.nav
      style={{
        opacity: navbarOpacity,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          style={{
            backdropFilter: `blur(${navbarBlur}px)`,
          }}
          className={`relative rounded-2xl border transition-all duration-300 ${
            isScrolled
              ? 'bg-white/10 border-white/20 shadow-xl'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                WorkMatch
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="px-4 py-2 text-white hover:text-cyan-400 transition-colors duration-200 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Iniciar Sesión
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <IridescentGlow intensity="low">
                  <button className="px-6 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium">
                    Registrarse
                  </button>
                </IridescentGlow>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 px-6 py-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <button className="px-4 py-2 text-white hover:text-cyan-400 transition-colors duration-200 font-medium text-left">
                    Iniciar Sesión
                  </button>
                  <button className="px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium">
                    Registrarse
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
