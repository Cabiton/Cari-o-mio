'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  delay: number;
}

export function FloatingPetals({ count = 30 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals: Petal[] = [];

    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * 20,
        radius: Math.random() * 3 + 2,
        speedY: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 5,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal) => {
        ctx.beginPath();
        ctx.arc(petal.x, petal.y, petal.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 192, 203, 0.6)';
        ctx.fill();

        petal.y += petal.speedY;

        if (petal.y > canvas.height + 10) {
          petal.y = -10;
          petal.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

export default FloatingPetals;
