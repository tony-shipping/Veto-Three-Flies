import React, { useEffect, useRef } from 'react';

interface RadarCanvasProps {
  lastSweepHit?: string | null;
}

export const RadarCanvas: React.FC<RadarCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 240);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let sweepAngle = 0;
    
    // Tactically positioned scent plumes & telemetry targets matching the bio-sensor domain
    const targets = [
      { id: 'T-01', r: 0.38, angle: 1.15, color: '#ff007f', label: 'PLUME [10⁻⁶]', strength: 'HIGH' },
      { id: 'T-02', r: 0.65, angle: 2.85, color: '#00f5ff', label: 'POOL [6.2E]', strength: '94%' },
      { id: 'T-03', r: 0.82, angle: 4.45, color: '#ffd000', label: 'TEMP ∇', strength: '0.4K' },
      { id: 'T-04', r: 0.52, angle: 5.60, color: '#00ff88', label: 'FLOW [PASS]', strength: 'NOM' },
    ];

    const render = () => {
      // Cathode ray phosphor decay fade
      ctx.fillStyle = 'rgba(2, 6, 17, 0.16)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(cx, cy) - 14;

      // 1. Outer Compass Ring & Azimuth degree ticks
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.stroke();

      // Degree tick marks every 15 deg, longer every 45 deg
      for (let deg = 0; deg < 360; deg += 15) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 45 === 0;
        const tickLen = isMajor ? 7 : 3.5;
        const x1 = cx + Math.cos(rad) * (maxR - tickLen);
        const y1 = cy + Math.sin(rad) * (maxR - tickLen);
        const x2 = cx + Math.cos(rad) * maxR;
        const y2 = cy + Math.sin(rad) * maxR;

        ctx.strokeStyle = isMajor ? 'rgba(0, 245, 255, 0.8)' : 'rgba(0, 245, 255, 0.3)';
        ctx.lineWidth = isMajor ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (isMajor && maxR > 75) {
          ctx.fillStyle = 'rgba(0, 245, 255, 0.6)';
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const lx = cx + Math.cos(rad) * (maxR - 14);
          const ly = cy + Math.sin(rad) * (maxR - 14);
          ctx.fillText(`${deg}°`, lx, ly);
        }
      }

      // 2. Concentric Range Rings with distance labels
      const rings = [0.33, 0.66, 1.0];
      const ringLabels = ['0.8m', '1.6m', '2.5m'];
      ctx.lineWidth = 1;
      rings.forEach((ratio, idx) => {
        const r = maxR * ratio;
        ctx.strokeStyle = idx === 2 ? 'rgba(0, 245, 255, 0.4)' : 'rgba(0, 245, 255, 0.2)';
        ctx.setLineDash(idx === 1 ? [3, 3] : []);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Distance label on North-East axis
        ctx.fillStyle = 'rgba(0, 245, 255, 0.45)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(ringLabels[idx], cx + 4, cy - r + 9);
      });

      // 3. Crosshairs & 45-degree diagonal guide lines
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.18)';
      ctx.lineWidth = 1;
      // Main axes
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Diagonal crosshairs (dashed)
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
      ctx.beginPath();
      const diag = maxR * 0.7071;
      ctx.moveTo(cx - diag, cy - diag);
      ctx.lineTo(cx + diag, cy + diag);
      ctx.moveTo(cx - diag, cy + diag);
      ctx.lineTo(cx + diag, cy - diag);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Sweeping cone with rich Phosphor Persistence Gradient
      sweepAngle += 0.045;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, maxR);
      grad.addColorStop(0, 'rgba(0, 245, 255, 0.4)');
      grad.addColorStop(0.7, 'rgba(0, 245, 255, 0.18)');
      grad.addColorStop(1, 'rgba(0, 245, 255, 0.0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - 0.55, sweepAngle);
      ctx.fillStyle = grad;
      ctx.fill();

      // Sharp sweeping lead line with glowing head
      const sx = cx + Math.cos(sweepAngle) * maxR;
      const sy = cy + Math.sin(sweepAngle) * maxR;
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center sensor origin emitter
      ctx.fillStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Tactical Blip Targets
      targets.forEach((tgt) => {
        const bx = cx + Math.cos(tgt.angle) * (maxR * tgt.r);
        const by = cy + Math.sin(tgt.angle) * (maxR * tgt.r);

        // Calculate angular difference for sweep hit
        const normSweep = sweepAngle % (Math.PI * 2);
        let diff = normSweep - tgt.angle;
        if (diff < 0) diff += Math.PI * 2;

        const isJustHit = diff >= 0 && diff < 0.35;
        const decayAlpha = Math.max(0.25, 1.0 - diff * 0.4);

        // Blip Glow
        ctx.fillStyle = tgt.color;
        ctx.globalAlpha = isJustHit ? 1.0 : decayAlpha;
        ctx.shadowColor = tgt.color;
        ctx.shadowBlur = isJustHit ? 14 : 6;
        ctx.beginPath();
        ctx.arc(bx, by, isJustHit ? 4.5 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Expanding ping ring on hit
        if (isJustHit) {
          ctx.strokeStyle = tgt.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(bx, by, 5 + diff * 32, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Tactical Target Box & Data Tag
        ctx.strokeStyle = tgt.color;
        ctx.lineWidth = 1;
        const boxSize = 7;
        ctx.strokeRect(bx - boxSize, by - boxSize, boxSize * 2, boxSize * 2);

        // Tag label
        ctx.fillStyle = tgt.color;
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(tgt.label, bx + 10, by + 3);
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-h-[220px] bg-[#020611] rounded border border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,245,255,0.06)]">
      {/* Corner Grid Crosses */}
      <span className="absolute top-1.5 left-1.5 text-[8px] font-mono text-cyan-400/50">+</span>
      <span className="absolute top-1.5 right-1.5 text-[8px] font-mono text-cyan-400/50">+</span>
      <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-cyan-400/50">+</span>
      <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-cyan-400/50">+</span>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
