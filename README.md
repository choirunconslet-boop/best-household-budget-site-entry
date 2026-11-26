# DompetKeluarga — Anggaran Rumah Tangga Keluarga Pratama

Situs anggaran rumah tangga statis (tanpa build step, tanpa request jaringan):
dasbor pemasukan vs pengeluaran, pelacak transaksi, perencana anggaran per
kategori, target tabungan, dan laporan tren — dengan data contoh realistis
dalam rupiah untuk satu keluarga di Surabaya.

## Yang ditampilkan

- **Dasbor** — pemasukan, pengeluaran, dan sisa bulan ini; donat pengeluaran
  per kategori; transaksi terakhir; progres target tabungan; pengingat tagihan
  (lunas/belum dibayar, dihitung dari transaksi bulan berjalan).
- **Transaksi** — tambah, ubah, dan hapus transaksi; filter per kategori dan
  cari berdasarkan keterangan.
- **Anggaran** — batas tiap kategori dengan bilah progres; batas bisa diubah
  dan langsung terlihat di dasbor.
- **Tabungan** — target dana darurat, liburan, dan laptop, dengan tambah dana
  yang langsung menggerakkan progres.
- **Laporan** — grafik tren pengeluaran 6 bulan dan urutan kategori terbesar,
  plus tips hemat keluarga.
- Pengalih bulan (November/Oktober 2026) mengubah dasbor, transaksi, anggaran,
  dan laporan sekaligus. Tata letak menyesuaikan layar ponsel.

## Menjalankan

```sh
node serve.ts
```

Lalu buka http://localhost:8080. Untuk menyerahkan entri:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entri make.fun

Kompetisi `best-household-budget-site-20261126-1457` — "Make the best household
budget site". Lisensi MIT.
