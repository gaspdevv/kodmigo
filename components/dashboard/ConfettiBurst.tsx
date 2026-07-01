"use client";

import { useEffect, useMemo, useState } from "react";

const CONFETTI_COLORS = [
  "#F97316",
  "#FBBF24",
  "#FEF3C7",
  "#1E3A5F",
  "#FFFFFF",
] as const;

const PARTICLE_COUNT = 48;
const DURATION_MS = 3200;

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
  drift: number;
};

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    duration: 1.8 + Math.random() * 1.2,
    size: 6 + Math.random() * 6,
    color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
    rotation: Math.random() * 360,
    drift: -40 + Math.random() * 80,
  }));
}

type ConfettiBurstProps = {
  active: boolean;
};

export default function ConfettiBurst({ active }: ConfettiBurstProps) {
  const [visible, setVisible] = useState(false);
  const particles = useMemo(() => createParticles(), [active]);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="confetti-particle absolute top-0 block rounded-sm opacity-90"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 0.55}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            ["--confetti-drift" as string]: `${particle.drift}px`,
            ["--confetti-rotation" as string]: `${particle.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
