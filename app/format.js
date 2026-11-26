// Format angka rupiah dan tanggal untuk tampilan.

// Rp 8.500.000
export function rupiah(amount) {
  const n = Math.round(amount);
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Rp 8,5 jt — bentuk singkat untuk label grafik.
export function rupiahShort(amount) {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return 'Rp ' + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (amount >= 1000) return 'Rp ' + Math.round(amount / 1000) + ' rb';
  return rupiah(amount);
}

// '2026-11-04' -> '4 Nov 2026'
export function tanggal(id) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const parts = id.split('-');
  return Number(parts[2]) + ' ' + months[Number(parts[1]) - 1] + ' ' + parts[0];
}

// Persen pemakaian anggaran, dibatasi 0..100 untuk bar, nilai asli untuk label.
export function pct(used, limit) {
  if (limit <= 0) return 0;
  return Math.round((used / limit) * 100);
}
