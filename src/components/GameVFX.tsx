import React, { useEffect, useRef } from 'react';

export interface VFXEvent {
  id: string;
  type: 'bust' | 'bank' | 'correct' | 'card_reveal' | 'rune_cast';
  score?: number;
}

interface GameVFXProps {
  event: VFXEvent | null;
  onEventComplete?: (id: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  char?: string;
  shape?: 'circle' | 'square' | 'char';
}

export const GameVFX: React.FC<GameVFXProps> = ({ event, onEventComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!event) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const newParticles: Particle[] = [];

    if (event.type === 'bust') {
      const colors = ['#d46262', '#a83232', '#d4963a'];
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 10;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: 'square',
        });
      }
    } else if (event.type === 'bank') {
      const colors = ['#d4963a', '#4ea87a', '#f4f3ef'];
      for (let i = 0; i < 40; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const speed = 5 + Math.random() * 10;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 60,
          y: cy + 80,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.9,
          decay: 0.018 + Math.random() * 0.018,
          rotation: 0,
          vRot: 0,
          shape: 'circle',
        });
      }
    } else if (event.type === 'correct') {
      const mathGlyphs = ['π', '∑', '√', 'x', '+'];
      const colors = ['#4ea87a', '#d4963a'];
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        newParticles.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 12 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.9,
          decay: 0.025 + Math.random() * 0.02,
          rotation: 0,
          vRot: (Math.random() - 0.5) * 0.06,
          char: mathGlyphs[Math.floor(Math.random() * mathGlyphs.length)],
          shape: 'char',
        });
      }
    }

    particlesRef.current.push(...newParticles);

    if (onEventComplete) {
      setTimeout(() => onEventComplete(event.id), 1000);
    }
  }, [event, onEventComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'char' && p.char) {
          ctx.font = `500 ${p.size}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.char, 0, 0);
        } else if (p.shape === 'square') {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
