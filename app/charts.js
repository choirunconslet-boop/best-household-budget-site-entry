// Grafik SVG yang digambar sendiri — tanpa library luar.
// donutChart: donat pembagian pengeluaran per kategori.
// barChart: batang tren pengeluaran bulanan.

import { rupiahShort } from './format.js';

// Gambar donat dari daftar {label, value, color}. Mengembalikan string SVG.
export function donutChart(parts, size) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const hole = r - 34;
  let angle = -Math.PI / 2;
  let arcs = '';
  for (const p of parts) {
    if (p.value <= 0) continue;
    const sweep = (p.value / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep);
    const y2 = cy + r * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    arcs += `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${p.color}"/>`;
    angle += sweep;
  }
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donat pengeluaran per kategori" class="chart-svg">`
    + arcs
    + `<circle cx="${cx}" cy="${cy}" r="${hole}" fill="#fffdf8"/>`
    + `<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-num">${rupiahShort(total)}</text>`
    + `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-cap">terpakai bulan ini</text>`
    + `</svg>`;
}

// Gambar batang tren dari daftar {month, spent}. Mengembalikan string SVG.
export function barChart(bars, width, height) {
  const pad = { top: 26, right: 8, bottom: 26, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(...bars.map((b) => b.spent)) * 1.1;
  const bw = Math.min(64, innerW / bars.length - 18);
  const gap = (innerW - bw * bars.length) / (bars.length + 1);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik tren pengeluaran bulanan" class="chart-svg">`;
  // Garis grid + label sumbu Y.
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = pad.top + innerH - (innerH * v) / max;
    out += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" class="grid-line"/>`;
    out += `<text x="${pad.left - 6}" y="${y + 4}" text-anchor="end" class="axis-label">${rupiahShort(v)}</text>`;
  }
  bars.forEach((b, i) => {
    const h = (innerH * b.spent) / max;
    const x = pad.left + gap + i * (bw + gap);
    const y = pad.top + innerH - h;
    const last = i === bars.length - 1;
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="5" fill="${last ? '#2e7d52' : '#9db8a6'}"/>`;
    out += `<text x="${x + bw / 2}" y="${y - 7}" text-anchor="middle" class="bar-value">${rupiahShort(b.spent)}</text>`;
    out += `<text x="${x + bw / 2}" y="${height - 8}" text-anchor="middle" class="axis-label">${b.month}</text>`;
  });
  return out + '</svg>';
}
