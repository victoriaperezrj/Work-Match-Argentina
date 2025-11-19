'use client';

import { useState, useEffect } from 'react';

interface UseCounterAnimationOptions {
  duration?: number;
  delay?: number;
}

export function useCounterAnimation(
  targetValue: number,
  options: UseCounterAnimationOptions = {}
): number {
  const { duration = 1000, delay = 0 } = options;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    let timeoutId: NodeJS.Timeout;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, delay]);

  return count;
}

// Format number with locale
export function formatAnimatedNumber(value: number, locale: string = 'es-AR'): string {
  return value.toLocaleString(locale);
}
