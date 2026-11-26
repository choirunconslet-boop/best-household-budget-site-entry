// Data keluarga Pratama — angka contoh realistis dalam rupiah (Nov 2026).
// Semua angka adalah data contoh yang disimpan di file ini, bukan dari jaringan.

export const HOUSEHOLD = {
  name: 'Keluarga Pratama',
  city: 'Surabaya, Jawa Timur',
  members: 'Budi (ayah) · Sari (ibu) · Dimas (12 th) · Nisa (8 th)',
  income: [
    { label: 'Gaji Budi — staf gudang', amount: 6500000 },
    { label: 'Gaji Sari — kasir toko', amount: 2500000 },
  ],
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', color: '#2e7d52', budget: 2200000 },
  { id: 'rumah', name: 'Cicilan Rumah', color: '#1f5fa8', budget: 1800000 },
  { id: 'pendidikan', name: 'Pendidikan Anak', color: '#7a4fa3', budget: 1200000 },
  { id: 'transport', name: 'Transport', color: '#c77414', budget: 900000 },
  { id: 'utilitas', name: 'Listrik, Air & Internet', color: '#0e7c7b', budget: 750000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#b23a48', budget: 400000 },
  { id: 'hiburan', name: 'Hiburan', color: '#8a6d1b', budget: 350000 },
  { id: 'tabungan', name: 'Tabungan', color: '#3a6ea5', budget: 1000000 },
];

export const MONTHS = [
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
];

// Transaksi contoh per bulan. id unik, amount dalam rupiah.
export const TRANSACTIONS = {
  '2026-11': [
    { id: 't01', date: '2026-11-01', desc: 'Gaji Budi masuk', category: 'income', amount: 6500000 },
    { id: 't02', date: '2026-11-01', desc: 'Gaji Sari masuk', category: 'income', amount: 2500000 },
    { id: 't03', date: '2026-11-02', desc: 'Belanja pasar Minggu — beras, sayur, ayam', category: 'belanja', amount: 312000 },
    { id: 't04', date: '2026-11-03', desc: 'Cicilan rumah KPR', category: 'rumah', amount: 1800000 },
    { id: 't05', date: '2026-11-04', desc: 'Bensin motor Budi', category: 'transport', amount: 85000 },
    { id: 't06', date: '2026-11-05', desc: 'SPP Dimas + buku tulis', category: 'pendidikan', amount: 685000 },
    { id: 't07', date: '2026-11-06', desc: 'Belanja Indomaret — sabun, minyak, telur', category: 'belanja', amount: 187500 },
    { id: 't08', date: '2026-11-08', desc: 'Tagihan listrik PLN', category: 'utilitas', amount: 412000 },
    { id: 't09', date: '2026-11-09', desc: 'Ojek online Sari (seminggu)', category: 'transport', amount: 142000 },
    { id: 't10', date: '2026-11-10', desc: 'Internet + TV kabel', category: 'utilitas', amount: 275000 },
    { id: 't11', date: '2026-11-12', desc: 'Belanja pasar — ikan, buah, bumbu', category: 'belanja', amount: 268000 },
    { id: 't12', date: '2026-11-13', desc: 'Les matematika Dimas', category: 'pendidikan', amount: 300000 },
    { id: 't13', date: '2026-11-14', desc: 'Periksa gigi Nisa', category: 'kesehatan', amount: 175000 },
    { id: 't14', date: '2026-11-15', desc: 'Setor tabungan keluarga', category: 'tabungan', amount: 1000000 },
    { id: 't15', date: '2026-11-16', desc: 'Belanja mingguan — daging, susu, roti', category: 'belanja', amount: 294000 },
    { id: 't16', date: '2026-11-18', desc: 'Parkir + tol antar jemput anak', category: 'transport', amount: 96000 },
    { id: 't17', date: '2026-11-20', desc: 'Nonton bioskop keluarga', category: 'hiburan', amount: 180000 },
    { id: 't18', date: '2026-11-21', desc: 'Tagihan air PDAM', category: 'utilitas', amount: 64000 },
    { id: 't19', date: '2026-11-22', desc: 'Belanja pasar — sayur & lauk', category: 'belanja', amount: 221000 },
    { id: 't20', date: '2026-11-24', desc: 'Obat flu + vitamin', category: 'kesehatan', amount: 86000 },
    { id: 't21', date: '2026-11-25', desc: 'Beli buku cerita Nisa', category: 'pendidikan', amount: 95000 },
    { id: 't22', date: '2026-11-26', desc: 'Makan malam keluarga di luar', category: 'hiburan', amount: 165000 },
  ],
  '2026-10': [
    { id: 'o01', date: '2026-10-01', desc: 'Gaji Budi masuk', category: 'income', amount: 6500000 },
    { id: 'o02', date: '2026-10-01', desc: 'Gaji Sari masuk', category: 'income', amount: 2500000 },
    { id: 'o03', date: '2026-10-02', desc: 'Belanja pasar Minggu', category: 'belanja', amount: 298000 },
    { id: 'o04', date: '2026-10-03', desc: 'Cicilan rumah KPR', category: 'rumah', amount: 1800000 },
    { id: 'o05', date: '2026-10-05', desc: 'Bensin motor Budi', category: 'transport', amount: 92000 },
    { id: 'o06', date: '2026-10-06', desc: 'SPP Dimas + Nisa', category: 'pendidikan', amount: 745000 },
    { id: 'o07', date: '2026-10-08', desc: 'Tagihan listrik PLN', category: 'utilitas', amount: 398000 },
    { id: 'o08', date: '2026-10-10', desc: 'Internet + TV kabel', category: 'utilitas', amount: 275000 },
    { id: 'o09', date: '2026-10-12', desc: 'Belanja mingguan', category: 'belanja', amount: 276000 },
    { id: 'o10', date: '2026-10-14', desc: 'Servis motor Budi', category: 'transport', amount: 210000 },
    { id: 'o11', date: '2026-10-15', desc: 'Setor tabungan keluarga', category: 'tabungan', amount: 1000000 },
    { id: 'o12', date: '2026-10-18', desc: 'Belanja pasar — daging & buah', category: 'belanja', amount: 301000 },
    { id: 'o13', date: '2026-10-20', desc: 'Les matematika Dimas', category: 'pendidikan', amount: 300000 },
    { id: 'o14', date: '2026-10-22', desc: 'Periksa kesehatan Sari', category: 'kesehatan', amount: 240000 },
    { id: 'o15', date: '2026-10-24', desc: 'Tagihan air PDAM', category: 'utilitas', amount: 58000 },
    { id: 'o16', date: '2026-10-26', desc: 'Belanja mingguan', category: 'belanja', amount: 243000 },
    { id: 'o17', date: '2026-10-28', desc: 'Piknik keluarga ke pantai', category: 'hiburan', amount: 320000 },
  ],
};

// Tren pengeluaran 6 bulan terakhir (total belanja, tanpa tabungan), dalam rupiah.
export const TREND = [
  { month: 'Jun', spent: 7120000 },
  { month: 'Jul', spent: 7450000 },
  { month: 'Agu', spent: 6980000 },
  { month: 'Sep', spent: 7610000 },
  { month: 'Okt', spent: 5556000 },
  { month: 'Nov', spent: 5842500 },
];

export const GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 12000000, saved: 8400000, note: 'Target 6x pengeluaran pokok' },
  { id: 'g2', name: 'Liburan Keluarga ke Malang', target: 3500000, saved: 2100000, note: 'Berangkat libur sekolah Desember' },
  { id: 'g3', name: 'Laptop Dimas', target: 6500000, saved: 1950000, note: 'Untuk belajar & tugas sekolah' },
];

// Tagihan rutin bulanan. "Lunas" dihitung dari transaksi bulan berjalan:
// lunas bila ada transaksi di kategorinya sebesar minimal 90% tagihan.
export const BILLS = [
  { name: 'Cicilan rumah KPR', day: 3, amount: 1800000, category: 'rumah' },
  { name: 'SPP Dimas + Nisa', day: 5, amount: 685000, category: 'pendidikan' },
  { name: 'Listrik PLN', day: 8, amount: 412000, category: 'utilitas' },
  { name: 'Internet + TV kabel', day: 10, amount: 275000, category: 'utilitas' },
  { name: 'Air PDAM', day: 21, amount: 64000, category: 'utilitas' },
  { name: 'Asuransi kesehatan keluarga', day: 25, amount: 350000, category: 'kesehatan' },
];

export const TIPS = [
  { title: 'Belanja pasar 2x seminggu', body: 'Belanja lebih sering tapi sedikit mengurangi makanan terbuang. Keluarga Pratama memangkas Rp 180.000/bulan dengan cara ini.' },
  { title: 'Pisahkan amplop transport', body: 'Tarik tunai Rp 900.000 di awal bulan khusus transport — kalau amplop habis, naik angkot, bukan ambil dari amplop lain.' },
  { title: 'Bayar cicilan di tanggal 3', body: 'Cicilan rumah dibayar begitu gaji masuk, jadi uangnya tidak sempat terpakai untuk hal lain.' },
];
