import { motion } from 'framer-motion';

export default function IridescentGlow({ children, className = '', intensity = 'medium' }) {
  const blurValues = {
    low: '40px',
    medium: '60px',
    high: '80px',
  };

  const blur = blurValues[intensity] || blurValues.medium;

  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Multiple layered gradients for depth */}
      <div className="absolute -inset-1">
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 opacity-75 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(
                circle at 20% 50%,
                rgba(0, 188, 212, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 50%,
                rgba(156, 39, 176, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 50% 50%,
                rgba(66, 133, 244, 0.6) 0%,
                transparent 50%
              )
            `,
            filter: `blur(${blur})`,
            animation: 'gradient-rotate 8s ease infinite',
          }}
        />

        {/* Secondary shimmer layer */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              linear-gradient(
                45deg,
                transparent 30%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%
              )
            `,
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 4s ease infinite',
          }}
        />

        {/* Edge glow */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `
              0 0 20px rgba(0, 188, 212, 0.3),
              0 0 40px rgba(156, 39, 176, 0.2),
              0 0 60px rgba(66, 133, 244, 0.1)
            `,
          }}
        />
      </div>

      {/* Content container with backdrop blur */}
      <div className="relative backdrop-blur-sm rounded-2xl">
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient-rotate {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
