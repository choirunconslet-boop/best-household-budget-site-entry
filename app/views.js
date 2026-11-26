// Merender tiap halaman situs dari state. Semua fungsi mengembalikan string HTML
// yang dimasukkan ke <main>. Tidak ada fetch — semua data dari data.js / state.

import { CATEGORIES, GOALS, TIPS, TREND, BILLS } from './data.js';
import { rupiah, rupiahShort, tanggal, pct } from './format.js';
import { donutChart, barChart } from './charts.js';

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id, color: '#888', budget: 0 };
}

export function monthTotals(state) {
  const txs = state.transactions[state.month];
  const income = txs.filter((t) => t.category === 'income').reduce((s, t) => s + t.amount, 0);
  const spent = txs.filter((t) => t.category !== 'income' && t.category !== 'tabungan')
    .reduce((s, t) => s + t.amount, 0);
  const saved = txs.filter((t) => t.category === 'tabungan').reduce((s, t) => s + t.amount, 0);
  return { income, spent, saved, left: income - spent - saved };
}

export function categorySpent(state, catId) {
  return state.transactions[state.month]
    .filter((t) => t.category === catId)
    .reduce((s, t) => s + t.amount, 0);
}

// ---------- Dasbor ----------
export function renderDashboard(state) {
  const t = monthTotals(state);
  const parts = CATEGORIES.filter((c) => c.id !== 'tabungan').map((c) => ({
    label: c.name, value: categorySpent(state, c.id), color: c.color,
  }));
  const recent = [...state.transactions[state.month]]
    .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 6);
  const top = parts.slice().sort((a, b) => b.value - a.value)[0];
  return `
  <section class="cards">
    <article class="card stat"><span class="stat-label">Pemasukan bulan ini</span><strong class="stat-num income">${rupiah(t.income)}</strong><span class="stat-sub">Gaji Budi + gaji Sari</span></article>
    <article class="card stat"><span class="stat-label">Pengeluaran bulan ini</span><strong class="stat-num spent">${rupiah(t.spent)}</strong><span class="stat-sub">Tanpa tabungan · ${pct(t.spent, t.income)}% dari pemasukan</span></article>
    <article class="card stat"><span class="stat-label">Sisa anggaran</span><strong class="stat-num ${t.left >= 0 ? 'ok' : 'over'}">${rupiah(t.left)}</strong><span class="stat-sub">${t.left >= 0 ? 'Masih aman sampai akhir bulan' : 'Melebihi pemasukan bulan ini'}</span></article>
    <article class="card stat"><span class="stat-label">Tabungan bulan ini</span><strong class="stat-num saved">${rupiah(t.saved)}</strong><span class="stat-sub">Target Rp 1.000.000 · ${pct(t.saved, 1000000)}% tercapai</span></article>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Pengeluaran per kategori</h2>
      <div class="donut-wrap">${donutChart(parts, 220)}
        <ul class="legend">${parts.map((p) => `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${rupiahShort(p.value)}</b></li>`).join('')}</ul>
      </div>
      <p class="hint">Kategori terbesar: <b>${top.label}</b> (${rupiah(top.value)}). <a href="#/anggaran">Atur anggaran →</a></p>
    </article>
    <article class="card">
      <h2>Transaksi terakhir</h2>
      <ul class="tx-list">${recent.map((tx) => txRow(tx)).join('')}</ul>
      <p class="hint"><a href="#/transaksi">Lihat semua transaksi →</a></p>
    </article>
  </section>
  <section class="card">
    <h2>Target tabungan</h2>
    <div class="goals-mini">${state.goals.map((g) => `
      <div class="goal-mini"><span>${g.name}</span><div class="bar"><i style="width:${pct(g.saved, g.target)}%;background:#2e7d52"></i></div><b>${pct(g.saved, g.target)}%</b></div>`).join('')}
    </div>
    <p class="hint"><a href="#/tabungan">Kelola semua target tabungan →</a></p>
  </section>
  <section class="card">
    <h2>Pengingat tagihan — ${state.monthLabel}</h2>
    <p class="hint">Status dihitung otomatis dari transaksi bulan ini.</p>
    <ul class="bills">${BILLS.map((b) => {
      const paid = state.transactions[state.month]
        .some((t) => t.category === b.category && t.amount >= b.amount * 0.9);
      return `<li><span class="bill-day">Tgl ${b.day}</span><span>${b.name}</span><b>${rupiah(b.amount)}</b><span class="bill-status ${paid ? 'paid' : 'due'}">${paid ? '✓ Lunas' : 'Belum dibayar'}</span></li>`;
    }).join('')}</ul>
  </section>`;
}

function txRow(tx) {
  const cat = tx.category === 'income' ? { name: 'Pemasukan', color: '#2e7d52' } : categoryById(tx.category);
  return `<li><span class="tx-date">${tanggal(tx.date)}</span><span class="tx-desc">${escapeHtml(tx.desc)}</span><span class="tx-cat" style="--c:${cat.color}">${cat.name}</span><b class="${tx.category === 'income' ? 'in' : 'out'}">${tx.category === 'income' ? '+' : '−'} ${rupiah(tx.amount)}</b></li>`;
}

// ---------- Transaksi ----------
export function renderTransactions(state) {
  let txs = [...state.transactions[state.month]]
    .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  if (state.filterCategory !== 'semua') txs = txs.filter((t) => t.category === state.filterCategory);
  if (state.search) {
    const q = state.search.toLowerCase();
    txs = txs.filter((t) => t.desc.toLowerCase().includes(q));
  }
  const total = txs.reduce((s, t) => s + (t.category === 'income' ? t.amount : -t.amount), 0);
  const editing = state.editingId ? state.transactions[state.month].find((t) => t.id === state.editingId) : null;
  const form = editing || { date: '2026-11-26', desc: '', category: 'belanja', amount: '' };
  return `
  <section class="card">
    <h2>${editing ? 'Ubah transaksi' : 'Tambah transaksi'}</h2>
    <form id="tx-form" class="tx-form">
      <label>Tanggal<input type="date" name="date" value="${form.date}" required></label>
      <label>Keterangan<input type="text" name="desc" value="${escapeHtml(form.desc)}" placeholder="cth: Belanja pasar Minggu" required></label>
      <label>Kategori<select name="category">${categoryOptions(form.category)}</select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" value="${form.amount}" placeholder="150000" required></label>
      <button class="btn primary" type="submit">${editing ? 'Simpan perubahan' : 'Tambah'}</button>
      ${editing ? '<button class="btn" type="button" id="cancel-edit">Batal</button>' : ''}
    </form>
    <p class="hint">Transaksi baru langsung mengubah dasbor, anggaran, dan laporan bulan ini.</p>
  </section>
  <section class="card">
    <h2>Semua transaksi — ${state.monthLabel}</h2>
    <div class="filters">
      <label>Filter kategori <select id="filter-cat">${filterOptions(state.filterCategory)}</select></label>
      <label>Cari <input type="search" id="search-tx" placeholder="cth: pasar, listrik…" value="${escapeHtml(state.search)}"></label>
    </div>
    <p class="hint">${txs.length} transaksi ditampilkan · selisih bersih: <b>${rupiah(total)}</b></p>
    <div class="table-wrap"><table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>${txs.map((tx) => `
        <tr><td>${tanggal(tx.date)}</td><td>${escapeHtml(tx.desc)}</td><td>${tx.category === 'income' ? 'Pemasukan' : categoryById(tx.category).name}</td><td class="num ${tx.category === 'income' ? 'in' : 'out'}">${tx.category === 'income' ? '+' : '−'} ${rupiah(tx.amount)}</td>
        <td class="row-actions">${tx.category === 'income' ? '' : `<button class="btn small" data-edit="${tx.id}">Ubah</button> <button class="btn small danger" data-del="${tx.id}">Hapus</button>`}</td></tr>`).join('') || '<tr><td colspan="5">Tidak ada transaksi yang cocok.</td></tr>'}</tbody>
    </table></div>
  </section>`;
}

function categoryOptions(selected) {
  return CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.name}</option>`).join('');
}

function filterOptions(selected) {
  const all = `<option value="semua" ${selected === 'semua' ? 'selected' : ''}>Semua kategori</option>`
    + `<option value="income" ${selected === 'income' ? 'selected' : ''}>Pemasukan</option>`;
  return all + CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.name}</option>`).join('');
}

// ---------- Anggaran ----------
export function renderBudget(state) {
  const totalBudget = CATEGORIES.reduce((s, c) => s + state.budgets[c.id], 0);
  const totalSpent = CATEGORIES.reduce((s, c) => s + categorySpent(state, c.id), 0);
  return `
  <section class="card">
    <h2>Anggaran ${state.monthLabel}</h2>
    <p>Total anggaran <b>${rupiah(totalBudget)}</b> dari pemasukan <b>${rupiah(monthTotals(state).income)}</b>. Terpakai <b>${rupiah(totalSpent)}</b> (${pct(totalSpent, totalBudget)}%). Ubah batas tiap kategori di bawah — perubahan langsung terlihat di dasbor.</p>
    <div class="budget-list">${CATEGORIES.map((c) => {
      const spent = categorySpent(state, c.id);
      const limit = state.budgets[c.id];
      const p = pct(spent, limit);
      return `<article class="budget-row">
        <div class="budget-head"><span class="dot" style="background:${c.color}"></span><b>${c.name}</b><span>${rupiah(spent)} dari ${rupiah(limit)}</span></div>
        <div class="bar"><i style="width:${Math.min(p, 100)}%;background:${p > 100 ? '#b23a48' : c.color}"></i></div>
        <div class="budget-foot"><span class="${p > 100 ? 'over' : 'ok'}">${p}% terpakai${p > 100 ? ' — melebihi batas!' : ''}</span>
        <form class="budget-edit" data-cat="${c.id}"><label>Batas baru (Rp) <input type="number" name="limit" min="0" step="50000" value="${limit}" required></label><button class="btn small" type="submit">Simpan batas</button></form></div>
      </article>`;
    }).join('')}</div>
  </section>`;
}

// ---------- Tabungan ----------
export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="card">
    <h2>Target tabungan keluarga</h2>
    <p>Terkumpul <b>${rupiah(totalSaved)}</b> dari target <b>${rupiah(totalTarget)}</b> (${pct(totalSaved, totalTarget)}%). Tambah dana kapan saja — progres langsung berubah.</p>
    <div class="goal-list">${state.goals.map((g) => `
      <article class="goal-card">
        <h3>${g.name}</h3><p class="hint">${g.note}</p>
        <p class="goal-nums"><b>${rupiah(g.saved)}</b> dari ${rupiah(g.target)} · ${pct(g.saved, g.target)}%</p>
        <div class="bar big"><i style="width:${pct(g.saved, g.target)}%;background:#2e7d52"></i></div>
        <p class="hint">Sisa ${rupiah(Math.max(g.target - g.saved, 0))} lagi.</p>
        <form class="goal-add" data-goal="${g.id}"><label>Tambah dana (Rp) <input type="number" name="amount" min="10000" step="10000" placeholder="100000" required></label><button class="btn small primary" type="submit">Tambah</button></form>
      </article>`).join('')}</div>
  </section>`;
}

// ---------- Laporan ----------
export function renderReport(state) {
  const parts = CATEGORIES.map((c) => ({ label: c.name, value: categorySpent(state, c.id), color: c.color }))
    .sort((a, b) => b.value - a.value);
  const t = monthTotals(state);
  return `
  <section class="grid-2">
    <article class="card">
      <h2>Tren pengeluaran 6 bulan</h2>
      ${barChart(TREND, 560, 300)}
      <p class="hint">Pengeluaran November ${rupiah(TREND[5].spent)} — naik ${rupiah(TREND[5].spent - TREND[4].spent)} dari Oktober (${rupiah(TREND[4].spent)}). Batang hijau adalah bulan berjalan.</p>
    </article>
    <article class="card">
      <h2>Ringkasan ${state.monthLabel}</h2>
      <dl class="summary">
        <div><dt>Pemasukan</dt><dd>${rupiah(t.income)}</dd></div>
        <div><dt>Pengeluaran</dt><dd>${rupiah(t.spent)}</dd></div>
        <div><dt>Tabungan</dt><dd>${rupiah(t.saved)}</dd></div>
        <div><dt>Sisa</dt><dd>${rupiah(t.left)}</dd></div>
      </dl>
      <h3>Urutan pengeluaran terbesar</h3>
      <ol class="rank">${parts.filter((p) => p.value > 0).map((p) => `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${rupiah(p.value)}</b></li>`).join('')}</ol>
    </article>
  </section>
  <section class="card">
    <h2>Tips hemat keluarga</h2>
    <div class="tips">${TIPS.map((tip) => `<article class="tip"><h3>${tip.title}</h3><p>${tip.body}</p></article>`).join('')}</div>
  </section>`;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export { GOALS };
