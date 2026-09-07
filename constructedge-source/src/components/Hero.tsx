import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "../ui";
import { usePrefersReducedMotion, scrollToId, type Theme } from "../hooks";
import { useBO } from "../bo";

const A = 10;
const B = 6;
const F = 9;
const FH = 0.85;
const H = F * FH;

const ss = (a: number, b: number, x: number) => {
  x = (x - a) / (b - a);
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
};

interface SceneOpts {
  idleAnim: boolean;
  idleGhost: boolean;
  printBeam: boolean;
}

function scene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, t: number, dark: boolean, opts: SceneOpts) {
  const pal = dark
    ? {
        bgA: "#0a1120", bgB: "#122340", grid: "rgba(140,175,220,0.11)", scan: "rgba(159,192,228,0.09)",
        line: "#9fc0e4", lineSoft: "rgba(159,192,228,0.5)", accent: "#ff6b00", slab: "rgba(170,200,235,0.13)",
        glass: "rgba(110,155,210,0.40)", glassDim: "rgba(90,130,185,0.30)", spandrel: "rgba(190,215,240,0.32)",
        lit: "rgba(255,178,84,0.85)", text: "rgba(159,192,228,0.85)", tree: "rgba(105,160,140,0.85)",
        road: "rgba(16,28,48,0.85)", shadow: "rgba(4,8,15,0.5)", fade: "rgba(12,15,19,1)", dust: "rgba(170,200,235,0.5)",
      }
    : {
        bgA: "#f4f7fa", bgB: "#dfe8f1", grid: "rgba(35,64,110,0.13)", scan: "rgba(58,85,120,0.10)",
        line: "#3a5578", lineSoft: "rgba(58,85,120,0.5)", accent: "#e85f00", slab: "rgba(58,85,120,0.12)",
        glass: "rgba(70,110,160,0.30)", glassDim: "rgba(70,110,160,0.22)", spandrel: "rgba(58,85,120,0.28)",
        lit: "rgba(232,95,0,0.5)", text: "rgba(58,85,120,0.9)", tree: "rgba(80,130,105,0.85)",
        road: "rgba(58,85,120,0.14)", shadow: "rgba(35,48,70,0.16)", fade: "rgba(242,244,246,1)", dust: "rgba(58,85,120,0.4)",
      };

  const s = Math.min(w / 24, h / 16.5);
  const cx = w * 0.52;
  const cy = h * 0.68;
  const iso = (a: number, b: number, c: number): [number, number] => [
    cx + (a - b) * 0.866 * s,
    cy + (a + b) * 0.5 * s - c * s,
  ];
  const L = (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) => {
    const [x1, y1] = iso(a1, b1, c1);
    const [x2, y2] = iso(a2, b2, c2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  const poly = (pts: [number, number, number][], close = true) => {
    ctx.beginPath();
    pts.forEach(([a, b, c], i) => {
      const [x, y] = iso(a, b, c);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (close) ctx.closePath();
  };

  const grid = ss(0, 0.06, p);
  const plan = ss(0.02, 0.16, p);
  const extrude = ss(0.14, 0.44, p);
  const steel = ss(0.36, 0.56, p);
  const slabs = ss(0.5, 0.7, p);
  const facade = ss(0.64, 0.84, p);
  const context = ss(0.76, 0.92, p);
  const dissolve = ss(0.95, 1, p);
  const topZ = extrude * H;
  const idle = 1 - ss(0, 0.1, p); // full choreography on the idle pad

  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, pal.bgA);
  g.addColorStop(1, pal.bgB);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  if (grid > 0) {
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = grid * (1 - dissolve * 0.75);
    for (let a = -12; a <= 16; a += 2) L(a, -8, 0, a, 14, 0);
    for (let b = -8; b <= 14; b += 2) L(-12, b, 0, 16, b, 0);
    ctx.globalAlpha = 1;
  }

  /* ---------- idle choreography: the site is alive before the pour ---------- */
  if (idle > 0.02 && opts.idleAnim) {
    const [ox, oy] = iso(A / 2, B / 2, 0);

    /* total-station radar sweep */
    const ang = t * 0.55;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.16 * idle;
    for (let k = 0; k < 26; k++) {
      const a2 = ang - k * 0.028;
      ctx.globalAlpha = 0.16 * idle * (1 - k / 26);
      const r = 9.2 * s;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(a2) * r, oy + Math.sin(a2) * r * 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.3 * idle;
    ctx.beginPath();
    ctx.ellipse(ox, oy, 9.2 * s, 4.6 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.14 * idle;
    ctx.beginPath();
    ctx.ellipse(ox, oy, 5.6 * s, 2.8 * s, 0, 0, Math.PI * 2);
    ctx.stroke();

    /* survey control points, blinking in sequence */
    const pts: [number, number][] = [[-6, -4], [14, -4], [-6, 11], [14, 11], [A + 4, B / 2]];
    pts.forEach(([a, b], i) => {
      const blink = (Math.sin(t * 2.4 + i * 1.7) + 1) / 2;
      const [x, y] = iso(a, b, 0);
      ctx.globalAlpha = (0.25 + 0.6 * blink) * idle;
      ctx.strokeStyle = i === 4 ? pal.accent : pal.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
      if (blink > 0.82) {
        ctx.fillStyle = i === 4 ? pal.accent : pal.line;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    /* animated dimension callouts sweeping out */
    const dimCycle = (t * 0.35) % 1;
    const dimLen = dimCycle < 0.7 ? dimCycle / 0.7 : 1;
    const dimAlpha = dimCycle < 0.7 ? 1 : 1 - (dimCycle - 0.7) / 0.3;
    ctx.globalAlpha = 0.5 * idle * dimAlpha;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 1;
    L(-3, B + 3.2, 0, -3 + (A + 6) * dimLen, B + 3.2, 0);
    if (dimLen > 0.96) {
      ctx.fillStyle = pal.text;
      ctx.font = `500 ${Math.max(9, s * 0.34)}px "JetBrains Mono", monospace`;
      const [dx, dy] = iso(A / 2, B + 4, 0);
      ctx.fillText("LOT 214 Â· 64.0 m", dx - s * 1.4, dy);
    }
    const dim2 = ((t * 0.35) + 0.5) % 1;
    const dimLen2 = dim2 < 0.7 ? dim2 / 0.7 : 1;
    const dimAlpha2 = dim2 < 0.7 ? 1 : 1 - (dim2 - 0.7) / 0.3;
    ctx.globalAlpha = 0.4 * idle * dimAlpha2;
    L(-3.4, -1, 0, -3.4, -1 + (B + 2) * dimLen2, 0);
    ctx.globalAlpha = 1;

    /* north arrow, slowly turning */
    const nx = w - 64;
    const ny = 96;
    ctx.globalAlpha = 0.4 * idle;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(nx, ny, 20, 0, Math.PI * 2);
    ctx.stroke();
    const na = Math.sin(t * 0.3) * 0.25 - Math.PI / 2;
    ctx.strokeStyle = pal.accent;
    ctx.beginPath();
    ctx.moveTo(nx + Math.cos(na) * 14, ny + Math.sin(na) * 14);
    ctx.lineTo(nx - Math.cos(na) * 14, ny - Math.sin(na) * 14);
    ctx.stroke();
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.moveTo(nx + Math.cos(na) * 18, ny + Math.sin(na) * 18);
    ctx.lineTo(nx + Math.cos(na + 2.6) * 6, ny + Math.sin(na + 2.6) * 6);
    ctx.lineTo(nx + Math.cos(na - 2.6) * 6, ny + Math.sin(na - 2.6) * 6);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ghost tower breathing on the pad */
  if (idle > 0.02 && opts.idleGhost) {
    const gh = (Math.sin(t * 0.5) * 0.5 + 0.5) * 2.2;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.16 * idle;
    for (let k = 0; k <= gh; k += 0.55) {
      poly([[0, 0, k], [A, 0, k], [A, B, k], [0, B, k]]);
      ctx.stroke();
    }
    [[0, 0], [A, 0], [A, B], [0, B]].forEach(([a, b]) => {
      const e = Math.min(gh, 2.2);
      L(a, b, 0, a, b, e);
    });
    ctx.globalAlpha = 1;
  }

  /* print-head beam sweeping across the sheet */
  if (opts.printBeam && p < 0.3) {
    const bx = ((t * 0.12) % 1.3) - 0.15;
    if (bx >= 0 && bx <= 1) {
      const x = bx * w;
      const grad = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
      grad.addColorStop(0, "rgba(159,192,228,0)");
      grad.addColorStop(0.5, dark ? "rgba(159,192,228,0.10)" : "rgba(58,85,120,0.12)");
      grad.addColorStop(1, "rgba(159,192,228,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - 40, 0, 80, h);
      ctx.fillStyle = dark ? "rgba(255,107,0,0.5)" : "rgba(232,95,0,0.5)";
      ctx.fillRect(x - 0.5, 0, 1, h);
    }
  }

  if (p < 0.25) {
    const sy = (t * 55) % h;
    ctx.fillStyle = pal.scan;
    ctx.fillRect(0, sy, w, 1.5);
  }

  /* ---------- blueprint plan ---------- */
  if (plan > 0) {
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 1 - dissolve;
    const segs: [number, number, number][] = [
      [0, 0, 0], [A, 0, 0], [A, B, 0], [0, B, 0], [0, 0, 0],
      [3.5, 1.5, 0], [6.5, 1.5, 0], [6.5, 4.5, 0], [3.5, 4.5, 0], [3.5, 1.5, 0],
    ];
    const units = 12;
    const prog = plan * units;
    let head: [number, number] | null = null;
    for (let i = 0; i < segs.length - 1; i++) {
      const amt = Math.max(0, Math.min(1, prog - i));
      if (amt <= 0) break;
      const [a1, b1, c1] = segs[i];
      const [a2, b2, c2] = segs[i + 1];
      const [x1, y1] = iso(a1, b1, c1);
      const [x2, y2] = iso(a1 + (a2 - a1) * amt, b1 + (b2 - b1) * amt, c1);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      head = [x2, y2];
    }
    const colProg = Math.max(0, Math.min(3, prog - 8)) / 3;
    if (colProg > 0) {
      ctx.globalAlpha = colProg * (1 - dissolve) * 0.85;
      const cols: [number, number][] = [];
      for (let a = 2.5; a <= 7.6; a += 2.5) for (let b = 1.5; b <= 4.6; b += 1.5) cols.push([a, b]);
      const n = Math.ceil(cols.length * colProg);
      for (let i = 0; i < n; i++) {
        const [a, b] = cols[i];
        const d = 0.22;
        L(a - d, b - d, 0, a + d, b + d, 0);
        L(a - d, b + d, 0, a + d, b - d, 0);
      }
    }
    if (head && plan < 0.98) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = pal.accent;
      ctx.beginPath();
      ctx.arc(head[0], head[1], 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(head[0], head[1], 8, 0, Math.PI * 2);
      ctx.fill();
    }
    const dimProg = Math.max(0, Math.min(1, prog - 11));
    if (dimProg > 0) {
      ctx.globalAlpha = dimProg * (1 - dissolve);
      ctx.strokeStyle = pal.lineSoft;
      ctx.lineWidth = 1;
      L(0, B + 1.1, 0, A * dimProg, B + 1.1, 0);
      if (dimProg > 0.9) {
        ctx.fillStyle = pal.text;
        ctx.font = `500 ${Math.max(10, s * 0.4)}px "JetBrains Mono", monospace`;
        const [tx, ty] = iso(A / 2, B + 1.9, 0);
        ctx.fillText("64.0 m", tx - s * 0.9, ty);
        const [nx2, ny2] = iso(-1.2, B / 2, 0);
        ctx.fillText("38.4 m", nx2 - s * 1.6, ny2);
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- context ---------- */
  if (context > 0) {
    ctx.globalAlpha = context * (1 - dissolve);
    const [shx, shy] = iso(A / 2, B / 2, 0);
    ctx.save();
    ctx.translate(shx, shy);
    ctx.rotate(Math.PI / 6);
    ctx.fillStyle = pal.shadow;
    ctx.beginPath();
    ctx.ellipse(0, 0, A * s * 0.6, B * s * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const box = (a0: number, b0: number, a1: number, b1: number, hh: number) => {
      poly([[a0, b0, hh], [a1, b0, hh], [a1, b1, hh], [a0, b1, hh]]);
      ctx.fillStyle = pal.slab;
      ctx.fill();
      poly([[a1, b0, 0], [a1, b0, hh], [a1, b1, hh], [a1, b1, 0]]);
      ctx.fillStyle = pal.glassDim;
      ctx.fill();
      poly([[a0, b1, 0], [a0, b1, hh], [a1, b1, hh], [a1, b1, 0]]);
      ctx.fill();
      ctx.strokeStyle = pal.lineSoft;
      ctx.lineWidth = 1;
      poly([[a0, b0, hh], [a1, b0, hh], [a1, b1, hh], [a0, b1, hh]]);
      ctx.stroke();
      L(a1, b0, 0, a1, b0, hh);
      L(a1, b1, 0, a1, b1, hh);
      L(a0, b1, 0, a0, b1, hh);
    };
    box(-9.5, 0.5, -5.5, 4, 2.4);
    box(2.5, -6.5, 7, -3, 1.7);
    box(12.5, -3.5, 15.5, 0.5, 3.1);
    ctx.fillStyle = pal.tree;
    const trees: [number, number][] = [[12, 3.5], [13.5, 6], [11, 1], [-1.5, 7.5], [12.5, 9]];
    for (const [ta, tb] of trees) {
      L(ta, tb, 0, ta, tb, 0.55);
      for (let k = 0; k < 3; k++) {
        const z0 = 0.45 + k * 0.42;
        const rad = 0.75 - k * 0.2;
        poly([[ta - rad, tb, z0], [ta + rad, tb, z0], [ta, tb, z0 + 0.62]]);
        ctx.fill();
      }
    }
    poly([[-12, B + 1.8, 0], [16, B + 1.8, 0], [16, B + 3.6, 0], [-12, B + 3.6, 0]]);
    ctx.fillStyle = pal.road;
    ctx.fill();
    ctx.strokeStyle = pal.lineSoft;
    ctx.globalAlpha = context * (1 - dissolve) * 0.6;
    for (let a = -11; a < 16; a += 2) L(a, B + 2.7, 0, a + 0.9, B + 2.7, 0);
    ctx.globalAlpha = 1;
  }

  /* ---------- slabs ---------- */
  if (slabs > 0 || extrude > 0.02) {
    ctx.globalAlpha = Math.min(1, extrude * 3) * 0.65 * (1 - dissolve);
    poly([[0, 0, 0], [A, 0, 0], [A, B, 0], [0, B, 0]]);
    ctx.fillStyle = pal.slab;
    ctx.fill();
    ctx.globalAlpha = 1;
    for (let k = 1; k <= F; k++) {
      const amt = Math.max(0, Math.min(1, slabs * F - (k - 1)));
      if (amt <= 0) continue;
      const z = k * FH;
      ctx.globalAlpha = amt * (1 - dissolve);
      poly([[0, 0, z], [A, 0, z], [A, B, z], [0, B, z]]);
      ctx.fillStyle = pal.slab;
      ctx.fill();
      ctx.strokeStyle = pal.lineSoft;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- facade ---------- */
  if (facade > 0) {
    for (let k = 0; k < F; k++) {
      for (let i = 0; i < A; i++) {
        const amt = Math.max(0, Math.min(1, facade * 1.12 * (A * F) - (k * A + i)));
        if (amt <= 0) continue;
        const z0 = k * FH, z1 = (k + 1) * FH;
        ctx.globalAlpha = amt * (1 - dissolve);
        poly([[i, B, z0], [i + 1, B, z0], [i + 1, B, z1], [i, B, z1]]);
        ctx.fillStyle = pal.glassDim;
        ctx.fill();
        poly([[i, B, z0], [i + 1, B, z0], [i + 1, B, z0 + FH * 0.24], [i, B, z0 + FH * 0.24]]);
        ctx.fillStyle = pal.spandrel;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    for (let k = 0; k < F; k++) {
      for (let j = 0; j < B; j++) {
        const amt = Math.max(0, Math.min(1, facade * 1.12 * (B * F) - (k * B + j)));
        if (amt <= 0) continue;
        const z0 = k * FH, z1 = (k + 1) * FH;
        ctx.globalAlpha = amt * (1 - dissolve);
        poly([[A, j, z0], [A, j + 1, z0], [A, j + 1, z1], [A, j, z1]]);
        ctx.fillStyle = pal.glass;
        ctx.fill();
        poly([[A, j, z0], [A, j + 1, z0], [A, j + 1, z0 + FH * 0.24], [A, j, z0 + FH * 0.24]]);
        ctx.fillStyle = pal.spandrel;
        ctx.fill();
        ctx.strokeStyle = pal.lineSoft;
        ctx.lineWidth = 0.7;
        L(A, j + 0.5, z0 + FH * 0.24, A, j + 0.5, z1);
        if (dark && amt > 0.9 && (j * 7 + k * 13) % 4 === 0) {
          const flick = 0.45 + 0.3 * Math.sin(t * 1.4 + j * 3 + k * 5);
          ctx.globalAlpha = flick * (1 - dissolve);
          poly([[A, j + 0.14, z0 + FH * 0.34], [A, j + 0.86, z0 + FH * 0.34], [A, j + 0.86, z0 + FH * 0.9], [A, j + 0.14, z0 + FH * 0.9]]);
          ctx.fillStyle = pal.lit;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  /* ---------- frame + scaffold ---------- */
  if (extrude > 0) {
    ctx.lineWidth = 1.1;
    const frameAlpha = (0.55 + 0.45 * (1 - facade)) * (1 - dissolve);
    ctx.strokeStyle = pal.line;
    ctx.globalAlpha = frameAlpha;
    const verts: [number, number][] = [
      [0, 0], [A, 0], [A, B], [0, B], [A / 2, 0], [A / 2, B], [0, B / 2], [A, B / 2],
      [2.5, 1.5], [5, 1.5], [7.5, 1.5], [2.5, 3], [5, 3], [7.5, 3], [2.5, 4.5], [5, 4.5], [7.5, 4.5],
    ];
    verts.forEach(([a, b], i) => {
      const e = Math.max(0, Math.min(1, extrude * 1.25 - i * 0.018));
      if (e > 0) L(a, b, 0, a, b, H * e);
    });
    if (steel > 0) {
      ctx.globalAlpha = steel * 0.6 * (1 - dissolve);
      for (let k = 1; k <= F; k++) {
        const z = k * FH;
        if (z > topZ + 0.01) break;
        L(0, 0, z, A, 0, z);
        L(0, B, z, A, B, z);
        L(0, 0, z, 0, B, z);
        L(A, 0, z, A, B, z);
      }
      ctx.globalAlpha = steel * 0.3 * (1 - dissolve);
      for (let k = 0; k < F; k++) {
        const z0 = k * FH, z1 = (k + 1) * FH;
        if (z1 > topZ + 0.01) break;
        for (let j = 0; j < B; j++) {
          if ((k + j) % 2 === 0) L(A, j, z0, A, j + 1, z1);
          else L(A, j + 1, z0, A, j, z1);
        }
        for (let i = 0; i < A; i += 2) {
          if ((k + i) % 2 === 0) L(i, B, z0, i + 2, B, z1);
          else L(i + 2, B, z0, i, B, z1);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  if (extrude > 0.05 && extrude < 0.97) {
    const pulse = (Math.sin(t * 3) + 1) / 2;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = (0.25 + 0.4 * pulse) * (1 - dissolve);
    poly([[0, 0, topZ], [A, 0, topZ], [A, B, topZ], [0, B, topZ]]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const roof = ss(0.8, 0.92, p);
  if (roof > 0) {
    ctx.globalAlpha = roof * (1 - dissolve);
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.2;
    poly([[0, 0, H], [A, 0, H], [A, B, H], [0, B, H]]);
    ctx.stroke();
    ctx.fillStyle = pal.slab;
    ctx.fill();
    const cz = H + 0.75;
    poly([[3.5, 1.5, cz], [6.5, 1.5, cz], [6.5, 4.5, cz], [3.5, 4.5, cz]]);
    ctx.fill();
    ctx.stroke();
    L(6.5, 1.5, H, 6.5, 1.5, cz);
    L(6.5, 4.5, H, 6.5, 4.5, cz);
    L(3.5, 4.5, H, 3.5, 4.5, cz);
    L(6.5, 1.5, cz, 6.5, 4.5, cz);
    L(3.5, 4.5, cz, 6.5, 4.5, cz);
    L(5, 3, cz, 5, 3, cz + 1.5);
    ctx.fillStyle = pal.accent;
    ctx.globalAlpha = (t % 1 < 0.5 ? 0.95 : 0.25) * roof * (1 - dissolve);
    const [bx, by] = iso(5, 3, cz + 1.6);
    ctx.beginPath();
    ctx.arc(bx, by, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ---------- tower crane ---------- */
  const craneUp = ss(0.12, 0.3, p);
  const craneA = craneUp * (1 - ss(0.86, 0.96, p));
  if (craneA > 0.01) {
    const ca = -3, cb = 1;
    const mh = 2 + craneUp * (H + 3.4);
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.1;
    ctx.globalAlpha = craneA * (1 - dissolve);
    L(ca, cb - 0.35, 0, ca, cb - 0.35, mh);
    L(ca, cb + 0.35, 0, ca, cb + 0.35, mh);
    for (let z = 0; z < mh; z += 0.62) {
      L(ca, cb - 0.35, z, ca, cb + 0.35, z + 0.31);
      L(ca, cb + 0.35, z, ca, cb - 0.35, z + 0.31);
    }
    const apex = mh + 1.15;
    L(ca - 1.4, cb, mh, 8.8, cb, mh);
    L(ca - 1.4, cb, mh, ca - 6.6, cb, mh);
    L(ca, cb, apex, 8.8, cb, mh);
    L(ca, cb, apex, ca - 6.6, cb, mh);
    L(ca, cb, mh, ca, cb, apex);
    poly([[ca - 6.6, cb - 0.4, mh - 0.55], [ca - 5.4, cb - 0.4, mh - 0.55], [ca - 5.4, cb - 0.4, mh], [ca - 6.6, cb - 0.4, mh]]);
    ctx.fillStyle = pal.spandrel;
    ctx.fill();
    const tx = 0.5 + (Math.sin(t * 0.23) * 0.5 + 0.5) * 7.4;
    const hookC = 1.6 + (Math.sin(t * 0.47) * 0.5 + 0.5) * (mh * 0.42);
    L(tx, cb, mh, tx, cb, hookC);
    ctx.fillStyle = pal.line;
    const [hx, hy] = iso(tx, cb, hookC);
    ctx.beginPath();
    ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
    ctx.fill();
    if (steel > 0.15 && steel < 0.9) {
      L(tx - 1.2, cb, hookC - 0.12, tx + 1.2, cb, hookC - 0.12);
      L(tx - 1.2, cb, hookC - 0.32, tx + 1.2, cb, hookC - 0.32);
      L(tx, cb, hookC, tx - 1.2, cb, hookC - 0.32);
      L(tx, cb, hookC, tx + 1.2, cb, hookC - 0.32);
    } else if (facade > 0.15 && facade < 0.95) {
      poly([[tx - 0.8, cb, hookC - 1.1], [tx + 0.8, cb, hookC - 1.1], [tx + 0.8, cb, hookC - 0.15], [tx - 0.8, cb, hookC - 0.15]]);
      ctx.fillStyle = pal.glass;
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = pal.accent;
    ctx.globalAlpha = (t % 1 < 0.5 ? 0.95 : 0.2) * craneA * (1 - dissolve);
    const [ax, ay] = iso(ca, cb, apex + 0.15);
    ctx.beginPath();
    ctx.arc(ax, ay, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* dust */
  const activity = Math.min(1, extrude + steel + slabs + facade) * (1 - dissolve);
  if (activity > 0.05) {
    ctx.fillStyle = pal.dust;
    for (let i = 0; i < 22; i++) {
      const px = ((i * 137.5) % 100) / 100 * w;
      const py = h - (((i * 89.3 + t * (14 + (i % 5) * 7)) % 110) / 110) * h;
      ctx.globalAlpha = 0.3 * activity;
      ctx.fillRect(px, py, 1.6, 1.6);
    }
    ctx.globalAlpha = 1;
  }

  if (dissolve > 0) {
    ctx.globalAlpha = dissolve * 0.94;
    ctx.fillStyle = pal.fade;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
}

const PHASES = [
  { upto: 0.14, label: "01 Â· Blueprint" },
  { upto: 0.44, label: "02 Â· Structural Steel" },
  { upto: 0.7, label: "03 Â· Concrete & Slabs" },
  { upto: 0.84, label: "04 Â· Facade & Glazing" },
  { upto: 0.95, label: "05 Â· Site Works" },
  { upto: 1.01, label: "06 Â· Handover" },
];

export default function Hero({ theme }: { theme: Theme }) {
  const bo = useBO();
  const [wrapRef, p] = useScrollProgress<HTMLElement>();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progRef = useRef(0);
  const renderRef = useRef<(t: number) => void>(() => {});
  const optsRef = useRef<SceneOpts>({ idleAnim: true, idleGhost: true, printBeam: true });
  progRef.current = p;
  optsRef.current = { idleAnim: bo.hero.idleAnim, idleGhost: bo.hero.idleGhost, printBeam: bo.hero.printBeam };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const render = (tms: number) => {
      const r = parent.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.round(r.width * dpr);
      const Hh = Math.round(r.height * dpr);
      if (canvas.width !== W || canvas.height !== Hh) {
        canvas.width = W;
        canvas.height = Hh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene(ctx, r.width, r.height, progRef.current, tms / 1000, theme === "dark", optsRef.current);
    };
    renderRef.current = render;
    if (reduced) {
      render(0);
    } else {
      const loop = (tms: number) => {
        render(tms);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onResize = () => render(performance.now());
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [theme, reduced]);

  useEffect(() => {
    if (reduced) renderRef.current(0);
  }, [p, reduced, bo.hero.idleAnim, bo.hero.idleGhost, bo.hero.printBeam]);

  /* ---------- convergent tagline system ---------- */
  const taglines = bo.hero.taglines.length ? bo.hero.taglines : ["From first line to final beam."];
  const phaseIdx = PHASES.findIndex((ph) => p < ph.upto);
  const constructing = p > 0.045;
  const [ti, setTi] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (progRef.current < 0.045) setTi((i) => i + 1);
    }, Math.max(1500, bo.hero.rotationMs / Math.max(0.25, bo.motion.speed)));
    return () => clearInterval(id);
  }, [bo.hero.rotationMs, bo.motion.speed, reduced, taglines.length]);

  const headline = constructing
    ? bo.hero.phaseTaglines[phaseIdx] || taglines[0]
    : taglines[ti % taglines.length];
  const headKey = constructing ? `ph-${phaseIdx}` : `tl-${ti % taglines.length}`;

  const pct = Math.round(p * 100);
  const phase = PHASES[phaseIdx] ?? PHASES[PHASES.length - 1];
  const elev = p < 0.14 ? 0 : ss(0.14, 0.44, p) * 128.4;
  const dissolve = ss(0.95, 1, p);

  return (
    <section ref={wrapRef} id="top" className="relative" style={{ height: `${bo.hero.scrollVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        <div className="absolute inset-4 md:inset-6 pointer-events-none hidden sm:block" aria-hidden="true">
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} className={`absolute w-6 h-6 border-steel/60 ${c}`} />
          ))}
        </div>

        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-5 text-right font-mono">
          <div className="border-r-2 border-accent pr-4">
            <p className="text-[10.5px] tracking-[0.28em] uppercase text-accent whitespace-nowrap">{phase.label}</p>
            <p className="font-display font-bold text-4xl lg:text-5xl text-ink mt-2 tabular-nums">
              {String(pct).padStart(2, "0")}
              <span className="text-lg text-muted">%</span>
            </p>
          </div>
          <div className="text-[10.5px] text-muted space-y-1.5 tracking-[0.12em]">
            <p>
              ELEV <span className="text-ink">+{elev.toFixed(1)} m</span>
            </p>
            <p>
              GRID <span className="text-ink">N41Â°52â² W087Â°38â²</span>
            </p>
            <p className="flex items-center justify-end gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full blink" /> SITE CAM 02 Â· LIVE
            </p>
          </div>
        </div>

        <div
          className="absolute left-6 lg:left-14 bottom-[10vh] max-w-[860px]"
          style={{ transform: `translateY(${p * -70}px)`, opacity: 1 - dissolve * 1.2 }}
        >
          <p className="font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-accent flex items-center gap-3">
            <span className="inline-block w-8 h-[2px] bg-accent" />
            {bo.hero.kicker}
          </p>
          <h1 className="font-display font-bold uppercase text-ink leading-[0.95] tracking-tight text-[clamp(2.3rem,6.2vw,5.1rem)] mt-5 min-h-[1.9em]">
            <span key={headKey} className="tag-swap">
              {headline.split(" ").map((word, i) => (
                <span key={i} className={constructing && i === headline.split(" ").length - 1 ? "text-accent" : undefined}>
                  {word}
                  {i < headline.split(" ").length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </h1>
          <p className="text-muted text-lg md:text-xl mt-5 max-w-xl leading-relaxed">
            High-rise, industrial and civil structures â engineered in-house, erected by our own crews.
            <span className="text-ink font-medium"> 1,240 delivered since 1987.</span>{" "}
            {constructing ? "Watch the frame climb." : "Watch the site wake up, then pour."}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button onClick={() => scrollToId("contact")} className="btn-slab btn-primary px-7 py-3.5 text-sm uppercase">
              {bo.hero.ctaPrimary}
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 12h15m-6-7 7 7-7 7" />
              </svg>
            </button>
            <button onClick={() => scrollToId("work")} className="btn-slab btn-ghost px-7 py-3.5 text-sm uppercase">
              {bo.hero.ctaSecondary}
            </button>
          </div>
        </div>

        {/* convergent phase timeline */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 font-mono transition-opacity duration-500"
          style={{ opacity: p > 0.02 ? 1 : 0 }}
          aria-hidden="true"
        >
          {PHASES.map((ph, i) => {
            const active = i === phaseIdx;
            const done = i < phaseIdx;
            return (
              <div key={ph.label} className={`flex items-center gap-2 transition-opacity duration-500 ${active ? "opacity-100" : done ? "opacity-60" : "opacity-40"}`}>
                <span
                  className={`h-[3px] transition-all duration-500 ${active ? "w-12 bg-accent shadow-[0_0_10px_rgba(255,107,0,0.9)]" : done ? "w-7 bg-accent/60" : "w-5 bg-steel/60"}`}
                />
                <span
                  className={`text-[9px] tracking-[0.22em] uppercase overflow-hidden whitespace-nowrap transition-all duration-500 ${
                    active ? "max-w-[170px] text-accent" : "max-w-0"
                  }`}
                >
                  {ph.label.split("Â· ")[1]}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: p < 0.06 ? 1 : 0 }}
        >
          <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-muted">Scroll to construct</span>
          <span className="w-px h-9 bg-gradient-to-b from-accent to-transparent relative overflow-hidden">
            <span className="absolute inset-x-0 h-3 bg-accent animate-[scanY_1.4s_linear_infinite]" />
          </span>
        </div>
      </div>
    </section>
  );
}
