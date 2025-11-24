import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedMeshGradient({ children, className = '' }) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Create gradient that shifts
      const gradient = ctx.createLinearGradient(
        0,
        0,
        rect.width,
        rect.height
      );

      // Calculate colors with time-based animation
      const hue1 = (190 + Math.sin(time) * 30) % 360; // Cyan range
      const hue2 = (270 + Math.cos(time * 0.7) * 30) % 360; // Purple range
      const hue3 = (210 + Math.sin(time * 1.3) * 20) % 360; // Blue range

      gradient.addColorStop(0, `hsla(${hue1}, 100%, 60%, 0.8)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 55%, 0.9)`);
      gradient.addColorStop(1, `hsla(${hue3}, 90%, 50%, 0.8)`);

      // Clear and draw
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated gradient canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: `blur(${isHovered ? '60px' : '80px'})`,
          opacity: 0.7,
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(255, 255, 255, 0.3) 45%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0.3) 55%,
              transparent 75%
            )
          `,
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
