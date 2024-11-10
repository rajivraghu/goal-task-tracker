import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  isVisible: boolean;
}

export default function Confetti({ isVisible }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string }>>([]);

  useEffect(() => {
    if (isVisible) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}