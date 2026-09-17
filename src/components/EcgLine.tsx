import React, { useEffect, useRef } from 'react';

interface EcgLineProps {
  color: string;
  speed?: number;
  height?: number;
  active?: boolean;
}

export const EcgLine: React.FC<EcgLineProps> = ({
  color,
  speed = 0.08,
  height = 36,
  active = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;
    const w = (canvas.width = canvas.parentElement?.clientWidth || 200);
    const h = (canvas.height = height);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      if (active) {
        offset += speed;
      }

      for (let x = 0; x < w; x++) {
        const norm = x / 24;
        let y = Math.sin(norm + offset) * 4;

        // Realistic QRS complex pulse spike
        const pulseCycle = (x + Math.floor(offset * 22)) % 65;
        if (pulseCycle === 10) y -= 5;
        else if (pulseCycle === 12) y += 14;
        else if (pulseCycle === 14) y -= 8;
        else if (pulseCycle === 16) y += 3;

        const cy = h / 2 + y;
        if (x === 0) ctx.moveTo(x, cy);
        else ctx.lineTo(x, cy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [color, speed, height, active]);

  return (
    <div className="w-full h-[36px] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
