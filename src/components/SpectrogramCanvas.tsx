import React, { useEffect, useRef } from 'react';

export const SpectrogramCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 135);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const bands = 24;
    const colW = 5;

    const render = () => {
      // Shift left
      const imgData = ctx.getImageData(colW, 0, width - colW, height);
      ctx.putImageData(imgData, 0, 0);

      // New frequency slice on the right
      const t = Date.now() * 0.0035;
      for (let i = 0; i < bands; i++) {
        const freqNorm = i / bands;
        // Peak intensity around 38.7 Hz (~ 40% band)
        const peakWeight = Math.exp(-Math.pow((freqNorm - 0.4) / 0.15, 2));
        const noise = (Math.sin(t * 1.5 + i * 0.6) + Math.cos(t * 0.8 - i * 0.4) + 2) / 4;
        const val = Math.min(1.0, noise * 0.6 + peakWeight * 0.55);

        const y = height - (i / bands) * height;
        const bandH = height / bands;

        // Color gradient: Dark purple -> Magenta -> Bright Yellow
        let r = 0, g = 0, b = 0;
        if (val < 0.3) {
          r = Math.floor(val * 3.3 * 180);
          g = 0;
          b = Math.floor(val * 3.3 * 220);
        } else if (val < 0.7) {
          const norm = (val - 0.3) / 0.4;
          r = Math.floor(180 + norm * 75);
          g = Math.floor(norm * 140);
          b = Math.floor(220 * (1 - norm));
        } else {
          const norm = (val - 0.7) / 0.3;
          r = 255;
          g = Math.floor(140 + norm * 115);
          b = Math.floor(norm * 120);
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(width - colW, y - bandH, colW, bandH);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[135px] bg-[#020611] rounded border border-pink-500/30 overflow-hidden">
      {/* Frequency Hz axis labels */}
      <div className="absolute left-1.5 top-1 bottom-1 flex flex-col justify-between text-[8px] font-mono text-pink-400/80 pointer-events-none z-10 select-none">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0 Hz</span>
      </div>
      {/* Time axis */}
      <div className="absolute right-2 bottom-0.5 flex gap-4 text-[8px] font-mono text-cyan-400/70 pointer-events-none z-10 select-none">
        <span>0s</span>
        <span>2s</span>
        <span>4s</span>
        <span>6s</span>
        <span>8s</span>
        <span>10s</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
