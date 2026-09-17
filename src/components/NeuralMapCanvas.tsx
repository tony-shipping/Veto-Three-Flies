import React, { useEffect, useRef } from 'react';

interface NeuralMapCanvasProps {
  scoutActive?: boolean;
  guardVeto?: boolean;
  hunterLanded?: boolean;
}

export const NeuralMapCanvas: React.FC<NeuralMapCanvasProps> = ({
  scoutActive = true,
  guardVeto = false,
  hunterLanded = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 740);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 470);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Deep Neural Starfield Constellation
    const bgNodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 45; i++) {
      bgNodes.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.6,
      });
    }

    const txPills = [
      { id: '0xabc2', time: '22s', color: '#ff007f' },
      { id: '0x56bf', time: '44s', color: '#00f5ff' },
      { id: '0x3001', time: '28s', color: '#00f5ff' },
      { id: '0x7de4', time: '17s', color: '#00f5ff' },
      { id: '0xc322', time: '23s', color: '#00f5ff' },
    ];

    const render = () => {
      ctx.fillStyle = '#04060f';
      ctx.fillRect(0, 0, width, height);

      const t = Date.now() * 0.0015;

      // Subtle ambient background constellation
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.035)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < bgNodes.length; i++) {
        const n = bgNodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < bgNodes.length; j++) {
          const n2 = bgNodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Top Status Bar: VETO HIVE PONS · ROBINHOOD CHAIN · PAPER | TIME
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      ctx.font = '10px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('VETO HIVE', 20, 20);

      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(12, 17, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px monospace';
      ctx.fillText('PONS  ·  ROBINHOOD CHAIN  ·  PAPER', 56, 20);

      ctx.font = 'bold 12px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = 'right';
      ctx.fillText(timeStr, width - 20, 20);

      // PONS FEED Pills Bar
      ctx.font = 'bold 9px "Orbitron", monospace';
      ctx.fillStyle = '#00f5ff';
      ctx.textAlign = 'left';
      ctx.fillText('PONS FEED', 20, 42);

      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(88, 39, 2, 0, Math.PI * 2);
      ctx.fill();

      let pillX = 108;
      txPills.forEach((pill, idx) => {
        const isTarget = idx === 0;
        ctx.strokeStyle = isTarget ? 'rgba(255, 0, 127, 0.45)' : 'rgba(0, 245, 255, 0.25)';
        ctx.fillStyle = isTarget ? 'rgba(255, 0, 127, 0.08)' : 'rgba(0, 245, 255, 0.04)';
        ctx.lineWidth = 0.8;

        const pillW = 84;
        const pillH = 17;
        ctx.beginPath();
        ctx.roundRect(pillX, 31, pillW, pillH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = '8.5px monospace';
        ctx.fillStyle = isTarget ? '#ff70a6' : '#90e0ef';
        ctx.textAlign = 'left';
        ctx.fillText(pill.id, pillX + 6, 42.5);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(pill.time, pillX + 44, 42.5);

        ctx.fillStyle = pill.color;
        ctx.beginPath();
        ctx.arc(pillX + 74, 39.5, 2, 0, Math.PI * 2);
        ctx.fill();

        pillX += pillW + 8;
      });

      // =========================================================================
      // 1. TOP CENTER: HYPER-DETAILED FLAT CONNECTOME BRAIN (FLYWIRE / NEUROPIL SCHEMATIC)
      // =========================================================================
      const brainY = 102;
      const brainX = width / 2;
      drawHyperDetailFlatBrain(ctx, brainX, brainY, t);

      // Multi-fiber Axon Bundles streaming down to each fly
      const flyY = height * 0.66;
      const flyX1 = width * 0.19; // SCOUT
      const flyX2 = width * 0.50; // GUARD
      const flyX3 = width * 0.81; // HUNTER

      drawBrainAxonTrunk(ctx, brainX - 58, brainY + 36, flyX1, flyY - 62, '#00f5ff', t);
      drawBrainAxonTrunk(ctx, brainX, brainY + 44, flyX2, flyY - 62, guardVeto ? '#ff2200' : '#ff007f', t + 0.8);
      drawBrainAxonTrunk(ctx, brainX + 58, brainY + 36, flyX3, flyY - 62, '#9d4edd', t + 1.6);

      // Data Stream between Scout and Guard
      drawDataStream(ctx, flyX1 + 80, flyY - 6, flyX2 - 80, flyY - 6, '#00f5ff', t);

      // Veto Stream between Guard and Hunter
      drawVetoStream(ctx, flyX2 + 80, flyY - 6, flyX3 - 80, flyY - 6, '#ff007f', t, guardVeto);

      // =========================================================================
      // 2. THE THREE HIGH-DETAIL DORSAL FLIES
      // =========================================================================
      // Unit 1: SCOUT (Cyan)
      drawHyperDetailFly(
        ctx,
        flyX1,
        flyY,
        '#00f5ff',
        '#ff0033',
        t,
        false
      );
      drawUnitLabel(ctx, flyX1, flyY + 90, 'SCOUT', 'SNIFF', '#00f5ff');

      // Unit 2: GUARD (Magenta / Red Veto)
      drawHyperDetailFly(
        ctx,
        flyX2,
        flyY,
        guardVeto ? '#ff1e00' : '#ff007f',
        '#ff0033',
        t + 1,
        guardVeto
      );
      drawUnitLabel(ctx, flyX2, flyY + 90, 'GUARD', guardVeto ? 'VETO' : 'ARMED', '#ff007f');

      // Unit 3: HUNTER (Purple / Violet)
      drawHyperDetailFly(
        ctx,
        flyX3,
        flyY,
        hunterLanded ? '#00ff88' : '#8a2be2',
        hunterLanded ? '#00ff88' : '#ff0033',
        t + 2,
        false
      );
      drawUnitLabel(ctx, flyX3, flyY + 90, 'HUNTER', hunterLanded ? 'LANDED' : 'IDLE', hunterLanded ? '#00ff88' : '#9d4edd');

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scoutActive, guardVeto, hunterLanded]);

  return (
    <div className="relative w-full h-[480px] bg-[#04060f] rounded-lg border border-cyan-500/30 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// =============================================================================
// HYPER-DETAILED FLAT CONNECTOME BRAIN SCHEMATIC
// =============================================================================
function drawHyperDetailFlatBrain(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Soft atmospheric glows for optic lobes
  const glowL = ctx.createRadialGradient(-85, 0, 5, -85, 0, 80);
  glowL.addColorStop(0, 'rgba(0, 245, 255, 0.28)');
  glowL.addColorStop(0.5, 'rgba(0, 245, 255, 0.05)');
  glowL.addColorStop(1, 'transparent');
  ctx.fillStyle = glowL;
  ctx.beginPath();
  ctx.arc(-85, 0, 80, 0, Math.PI * 2);
  ctx.fill();

  const glowR = ctx.createRadialGradient(85, 0, 5, 85, 0, 80);
  glowR.addColorStop(0, 'rgba(255, 0, 127, 0.28)');
  glowR.addColorStop(0.5, 'rgba(255, 0, 127, 0.05)');
  glowR.addColorStop(1, 'transparent');
  ctx.fillStyle = glowR;
  ctx.beginPath();
  ctx.arc(85, 0, 80, 0, Math.PI * 2);
  ctx.fill();

  // Draw Dual Stratified Optic Lobes (Lamina, Medulla, Lobula, Lobula Plate)
  [-1, 1].forEach((dir) => {
    const color = dir === -1 ? '#00f5ff' : '#ff007f';
    const hx = dir * 85;

    // 1. Outer Lamina boundary with micro-tick calibration marks
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(hx, 0, 56, 32, dir * 0.16, 0, Math.PI * 2);
    ctx.stroke();

    // Micro-tick marks along outer contour (like precision HUD / dial)
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.6;
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x1 = hx + cos * 56;
      const y1 = sin * 32;
      const tickLen = deg % 30 === 0 ? 5 : 2.5;
      const x2 = hx + cos * (56 + tickLen);
      const y2 = sin * (32 + tickLen * 0.6);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 2. Stratified Neuropil Layers (Medulla outer/inner, Lobula plate)
    const layers = [
      { rx: 48, ry: 27, alpha: 0.8, dash: [] },
      { rx: 40, ry: 22, alpha: 0.65, dash: [4, 3] },
      { rx: 32, ry: 17, alpha: 0.75, dash: [] },
      { rx: 24, ry: 12, alpha: 0.5, dash: [2, 2] },
      { rx: 16, ry: 8, alpha: 0.85, dash: [] },
    ];
    layers.forEach((l) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = l.alpha;
      ctx.setLineDash(l.dash);
      ctx.beginPath();
      ctx.ellipse(hx, 0, l.rx, l.ry, dir * 0.16, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;

    // 3. Dense Radial Columnar Axons (trans-medullary fibers)
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.35;
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const x1 = hx + Math.cos(rad) * 16;
      const y1 = Math.sin(rad) * 8;
      const x2 = hx + Math.cos(rad) * 54;
      const y2 = Math.sin(rad) * 31;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 4. Glomerular Clusters & Synaptic Hotspots
    for (let g = 0; g < 12; g++) {
      const a = g * 0.52 + time * 0.3 * dir;
      const radX = 18 + (g % 4) * 8;
      const radY = 10 + (g % 3) * 5;
      const gx = hx + Math.cos(a) * radX;
      const gy = Math.sin(a) * radY;
      const isPulsing = (g + Math.floor(time * 4)) % 5 === 0;

      ctx.fillStyle = isPulsing ? '#ffffff' : color;
      ctx.beginPath();
      ctx.arc(gx, gy, isPulsing ? 2.2 : 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Micro interconnect thread between adjacent glomeruli
      if (g > 0 && g % 2 === 0) {
        const prevA = (g - 1) * 0.52 + time * 0.3 * dir;
        const pgx = hx + Math.cos(prevA) * (radX - 4);
        const pgy = Math.sin(prevA) * (radY - 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.4;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(pgx, pgy);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }

    // 5. Cross-Connect Chiasma Cables between hemispheres
    ctx.strokeStyle = '#ffd000';
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = 0.35;
    for (let c = -10; c <= 10; c += 5) {
      ctx.beginPath();
      ctx.moveTo(hx - dir * 40, c);
      ctx.quadraticCurveTo(0, c * 1.5, -hx + dir * 40, -c);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  });

  // =========================================================================
  // CENTRAL COMPLEX / MUSHROOM BODY / ANTENNAL LOBES (GOLD NEURAL HUB)
  // =========================================================================
  // 1. Antennal Lobe Core (Dual Olfactory Glomeruli Rosette)
  [-1, 1].forEach((dir) => {
    const ax = dir * 22;
    const ay = 14;

    ctx.strokeStyle = '#ffd000';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(ax, ay, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Rosette sub-glomeruli chambers (OR42a / OR47b)
    for (let r = 0; r < 6; r++) {
      const ra = (r * Math.PI) / 3;
      const rx = ax + Math.cos(ra) * 6;
      const ry = ay + Math.sin(ra) * 6;
      ctx.fillStyle = '#ffd000';
      ctx.beginPath();
      ctx.arc(rx, ry, 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 208, 0, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 2. Mushroom Body Calyx & Peduncle (Vertical fan arch)
  ctx.strokeStyle = '#ffd000';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(0, -6, 26, 15, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Concentric ring inside Mushroom Body
  ctx.lineWidth = 0.7;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.ellipse(0, -6, 17, 9, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Fan rays of Kenyon cells in mushroom body
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.6;
  for (let s = -20; s <= 20; s += 4) {
    ctx.beginPath();
    ctx.moveTo(s * 0.9, -18);
    ctx.lineTo(s * 0.4, 6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // 3. Ellipsoid Body (Navigation Ring compass of Drosophila)
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(0, -6, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Active heading wedge in Ellipsoid Body (compass needle of fly)
  const compassAngle = time * 1.2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(Math.cos(compassAngle) * 5, -6 + Math.sin(compassAngle) * 5, 2.0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Center Synaptic Core (White Hot Focus)
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffd000';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, -6, 3.0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Precision Callout Typography
  ctx.font = 'bold 8px "Orbitron", monospace';
  ctx.fillStyle = '#00f5ff';
  ctx.textAlign = 'right';
  ctx.fillText('OPTIC LOBE // L', -95, -36);
  ctx.font = '6.5px monospace';
  ctx.fillStyle = 'rgba(0, 245, 255, 0.6)';
  ctx.fillText('MEDULLA & LOBULA', -95, -27);

  ctx.font = 'bold 8px "Orbitron", monospace';
  ctx.fillStyle = '#ff007f';
  ctx.textAlign = 'left';
  ctx.fillText('OPTIC LOBE // R', 95, -36);
  ctx.font = '6.5px monospace';
  ctx.fillStyle = 'rgba(255, 0, 127, 0.6)';
  ctx.fillText('MOTION TRACKING', 95, -27);

  ctx.font = 'bold 7.5px "Orbitron", monospace';
  ctx.fillStyle = '#ffd000';
  ctx.textAlign = 'center';
  ctx.fillText('MUSHROOM BODY [OLFACTORY HUB]', 0, -26);

  ctx.restore();
}

// Multi-fiber Axon Trunk from brain down to fly
function drawBrainAxonTrunk(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  time: number
) {
  ctx.save();
  // 5 parallel fine fibers
  for (let b = -2; b <= 2; b++) {
    const ox = x1 + b * 5;
    const tx = x2 + b * 6;
    const cpx = (ox + tx) / 2 + Math.sin(time * 1.5 + b) * 10;
    const cpy = (y1 + y2) / 2;

    ctx.beginPath();
    ctx.moveTo(ox, y1);
    ctx.quadraticCurveTo(cpx, cpy, tx, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = b === 0 ? 1.4 : 0.6;
    ctx.globalAlpha = b === 0 ? 0.6 : 0.2;
    ctx.stroke();
  }

  // Traveling Data Packets
  for (let k = 0; k < 2; k++) {
    const p = ((time * 1.5 + k * 0.5) % 1);
    const px = (1 - p) * (1 - p) * x1 + 2 * (1 - p) * p * ((x1 + x2) / 2) + p * p * x2;
    const py = (1 - p) * (1 - p) * y1 + 2 * (1 - p) * p * ((y1 + y2) / 2) + p * p * y2;

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  ctx.restore();
}

// =============================================================================
// HYPER-DETAILED FLAT BLUEPRINT DROSOPHILA MELANOGASTER
// =============================================================================
function drawHyperDetailFly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  eyeColor: string,
  time: number,
  isVeto: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  const scale = 0.98 + Math.sin(time * 2.5) * 0.01;
  ctx.scale(scale, scale);

  // 1. Holographic Floor Target Rings with compass tick marks
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.0;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.ellipse(0, 82, 64, 14, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.15;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.ellipse(0, 82, 44, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;

  // 2. Wings with intricate filigree micro-venation
  drawFiligreeWing(ctx, -1, color, time);
  drawFiligreeWing(ctx, 1, color, time);

  // 3. Anatomical Articulated Legs (Coxa, Trochanter, Femur, Tibia, 5 Tarsomeres, Claws)
  [-1, 1].forEach((dir) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;

    // --- FORELEG ---
    drawJointSegment(ctx, dir * 10, -16, dir * 18, -26, 1.4);
    drawJointSegment(ctx, dir * 18, -26, dir * 34, -46, 1.6);
    drawJointSegment(ctx, dir * 34, -46, dir * 30, -72, 1.2);
    drawJointSegment(ctx, dir * 30, -72, dir * 26, -84, 0.8);
    drawJointSegment(ctx, dir * 26, -84, dir * 22, -88, 0.6);

    // --- MIDLEG ---
    drawJointSegment(ctx, dir * 14, -2, dir * 26, 0, 1.4);
    drawJointSegment(ctx, dir * 26, 0, dir * 54, 4, 1.6);
    drawJointSegment(ctx, dir * 54, 4, dir * 68, 36, 1.2);
    drawJointSegment(ctx, dir * 68, 36, dir * 74, 52, 0.8);
    drawJointSegment(ctx, dir * 74, 52, dir * 78, 58, 0.6);

    // --- HINDLEG ---
    drawJointSegment(ctx, dir * 12, 16, dir * 24, 28, 1.4);
    drawJointSegment(ctx, dir * 24, 28, dir * 46, 46, 1.6);
    drawJointSegment(ctx, dir * 46, 46, dir * 52, 82, 1.2);
    drawJointSegment(ctx, dir * 52, 82, dir * 56, 96, 0.8);
    drawJointSegment(ctx, dir * 56, 96, dir * 58, 104, 0.6);

    ctx.shadowBlur = 0;
  });

  // 4. Segmented Abdomen with double-rail borders & internal micro-circuitry
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(0, 36, 18, 34, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Transverse stripe segments (A1 - A6)
  for (let s = 14; s <= 58; s += 8) {
    const norm = (s - 36) / 34;
    const w = Math.sqrt(Math.max(0, 1 - norm * norm)) * 17.5;
    ctx.beginPath();
    ctx.moveTo(-w, s);
    ctx.lineTo(w, s);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-w + 2, s + 2.5);
    ctx.lineTo(w - 2, s + 2.5);
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // Abdominal micro-circuit nodes
  const circNodes = [
    { x: -6, y: 22 }, { x: 0, y: 20 }, { x: 6, y: 24 },
    { x: -5, y: 32 }, { x: 5, y: 34 },
    { x: -4, y: 44 }, { x: 0, y: 42 }, { x: 4, y: 46 },
    { x: -3, y: 54 }, { x: 3, y: 56 }
  ];
  ctx.fillStyle = '#ffffff';
  circNodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < circNodes.length - 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(circNodes[i].x, circNodes[i].y);
    ctx.lineTo(circNodes[i + 1].x, circNodes[i + 1].y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // 5. Mesothorax Shield (Geometric diamond + internal micro-concentric circuits)
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.0;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(0, -6, 16, 14, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Inner Diamond Shield
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(13, -6);
  ctx.lineTo(0, 6);
  ctx.lineTo(-13, -6);
  ctx.closePath();
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Concentric sub-diamond
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(9, -6);
  ctx.lineTo(0, 1);
  ctx.lineTo(-9, -6);
  ctx.closePath();
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Scutellum triangular crest
  ctx.beginPath();
  ctx.moveTo(-9, 2);
  ctx.lineTo(0, 8);
  ctx.lineTo(9, 2);
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // 6. Cranium / Head Plate
  ctx.beginPath();
  ctx.ellipse(0, -28, 15, 9, 0, 0, Math.PI * 2);
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 7. High-Detail Faceted Compound Red Eyes
  [-1, 1].forEach((dir) => {
    const eyeX = dir * 14;
    const eyeY = -30;

    // Radiant Bloom Gradient
    const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, 20);
    eyeGlow.addColorStop(0, 'rgba(255, 20, 60, 0.95)');
    eyeGlow.addColorStop(0.5, 'rgba(255, 10, 40, 0.4)');
    eyeGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Base Solid Oval
    ctx.fillStyle = '#ff1133';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 8, 6.5, 0.2 * dir, 0, Math.PI * 2);
    ctx.fill();

    // Faceted Ommatidia Grid Pattern (Micro hexagonal mesh)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.65;
    [-3, 0, 3].forEach((ox) => {
      ctx.beginPath();
      ctx.moveTo(eyeX + ox, eyeY - 4);
      ctx.lineTo(eyeX + ox, eyeY + 4);
      ctx.stroke();
    });
    [-2, 2].forEach((oy) => {
      ctx.beginPath();
      ctx.moveTo(eyeX - 5, eyeY + oy);
      ctx.lineTo(eyeX + 5, eyeY + oy);
      ctx.stroke();
    });
    ctx.globalAlpha = 1.0;

    // Specular White Core Reflections
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX - dir * 1.5, eyeY - 1.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX + dir * 2.5, eyeY + 2, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 8. Feathered Aristae (Olfactory Sensor Bristles)
  [-1, 1].forEach((dir) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(dir * 5, -36);
    ctx.lineTo(dir * 13, -56);
    ctx.stroke();

    // Fine plumose lateral comb hairs
    ctx.lineWidth = 0.8;
    for (let h = 0; h < 4; h++) {
      const frac = 0.35 + h * 0.18;
      const hx = dir * (5 + 8 * frac);
      const hy = -36 - 20 * frac;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + dir * (6 + h * 2), hy - (4 + h * 2));
      ctx.stroke();
    }
  });

  ctx.restore();
}

// Helper: Leg Joint Segment with circular articulation node
function drawJointSegment(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.stroke();

  // Articular node bead
  ctx.beginPath();
  ctx.arc(x1, y1, width * 0.9, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

// Hyper-detailed Wing with filigree venation & cross-arches
function drawFiligreeWing(
  ctx: CanvasRenderingContext2D,
  dir: number,
  color: string,
  time: number
) {
  ctx.save();
  const baseAngle = dir * 0.88;
  const flutter = Math.sin(time * 5) * 0.015;
  ctx.rotate(baseAngle + flutter);

  const rootX = dir * 8;
  const rootY = -12;
  const tipX = dir * 96;
  const tipY = 6;

  // Outer Wing Contour
  ctx.beginPath();
  ctx.moveTo(rootX, rootY);
  ctx.bezierCurveTo(dir * 38, -30, dir * 80, -24, tipX, tipY);
  ctx.bezierCurveTo(dir * 74, 28, dir * 40, 32, rootX, rootY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.shadowColor = color;
  ctx.shadowBlur = 5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Translucent Wing Tint
  ctx.fillStyle = color === '#ff007f' || color === '#ff1e00'
    ? 'rgba(255, 0, 127, 0.05)'
    : color === '#8a2be2'
    ? 'rgba(138, 43, 226, 0.05)'
    : 'rgba(0, 245, 255, 0.05)';
  ctx.fill();

  // Major Longitudinal Veins
  ctx.lineWidth = 0.9;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  // R1
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo(dir * 44, -16, dir * 72, -9);
  // R2+3
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo(dir * 50, -8, dir * 88, -2);
  // R4+5
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo(dir * 52, 2, tipX - dir * 4, tipY);
  // M1
  ctx.moveTo(rootX + dir * 4, rootY + 6);
  ctx.quadraticCurveTo(dir * 46, 16, dir * 74, 17);
  // CuA
  ctx.moveTo(rootX + dir * 6, rootY + 10);
  ctx.quadraticCurveTo(dir * 36, 24, dir * 54, 26);
  ctx.stroke();

  // Delicate filigree cross-veins
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.55;
  const crossVeins = [
    { x1: dir * 36, y1: -10, x2: dir * 38, y2: 4 },
    { x1: dir * 48, y1: -7, x2: dir * 50, y2: 8 },
    { x1: dir * 62, y1: -4, x2: dir * 64, y2: 12 },
    { x1: dir * 76, y1: 0, x2: dir * 78, y2: 14 },
    { x1: dir * 28, y1: 6, x2: dir * 32, y2: 20 },
    { x1: dir * 44, y1: 12, x2: dir * 46, y2: 24 }
  ];
  crossVeins.forEach((cv) => {
    ctx.beginPath();
    ctx.moveTo(cv.x1, cv.y1);
    ctx.lineTo(cv.x2, cv.y2);
    ctx.stroke();
  });

  // Micro-constellation dot rivets on vein junctions
  ctx.fillStyle = '#ffffff';
  crossVeins.forEach((cv) => {
    ctx.beginPath();
    ctx.arc(cv.x1, cv.y1, 1.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cv.x2, cv.y2, 1.0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1.0;
  ctx.restore();
}

// Data Stream wave
function drawDataStream(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  time: number
) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x1 + 30, y1 - 16, mx - 30, my + 14, mx, my);
  ctx.bezierCurveTo(mx + 30, my - 14, x2 - 30, y2 + 16, x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.45;
  ctx.stroke();

  // Traveling photon
  const p = (time * 1.4) % 1;
  const px = x1 + (x2 - x1) * p;
  const py = y1 + Math.sin(p * Math.PI * 2) * 8;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(px, py, 3.0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1.0;
}

// Veto Crossed Stream
function drawVetoStream(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  time: number,
  isVetoTriggered: boolean
) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(mx - 16, my);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.5;
  ctx.stroke();

  ctx.beginPath();
  if (isVetoTriggered) ctx.setLineDash([3, 4]);
  ctx.moveTo(mx + 16, my);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;

  // The Veto Cross Gate Ring
  ctx.strokeStyle = isVetoTriggered ? '#ff1e00' : color;
  ctx.lineWidth = 1.6;
  ctx.shadowColor = isVetoTriggered ? '#ff1e00' : color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(mx, my, 13, 0, Math.PI * 2);
  ctx.stroke();

  // Crossed X inside ring
  ctx.beginPath();
  ctx.moveTo(mx - 5, my - 5);
  ctx.lineTo(mx + 5, my + 5);
  ctx.moveTo(mx + 5, my - 5);
  ctx.lineTo(mx - 5, my + 5);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// Unit Badge Label
function drawUnitLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  name: string,
  status: string,
  color: string
) {
  ctx.save();
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'right';
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fillText(name, x - 4, y);
  ctx.shadowBlur = 0;

  // Status Pill Badge
  ctx.font = '9px monospace';
  const pillW = ctx.measureText(status).width + 12;
  const pillH = 16;
  const pillX = x + 6;
  const pillY = y - 11;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillStyle = 'rgba(2, 6, 20, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'center';
  ctx.fillText(status, pillX + pillW / 2, y);

  ctx.restore();
}
