// Titik masuk situs: state, routing hash (#/dashboard dst), dan semua interaksi
// (ganti bulan, tambah/ubah/hapus transaksi, filter & cari, ubah batas, tambah dana).

import { CATEGORIES, GOALS, MONTHS, TRANSACTIONS } from './data.js';
import { renderDashboard, renderTransactions, renderBudget, renderGoals, renderReport, categorySpent } from './views.js';

// State hidup di memori selama halaman dibuka.
const state = {
  month: '2026-11',
  route: 'dashboard',
  filterCategory: 'semua',
  search: '',
  editingId: null,
  transactions: JSON.parse(JSON.stringify(TRANSACTIONS)),
  budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  goals: JSON.parse(JSON.stringify(GOALS)),
};

Object.defineProperty(state, 'monthLabel', {
  get() { return MONTHS.find((m) => m.id === this.month).label; },
});

const main = document.getElementById('page');
const monthSelect = document.getElementById('month-select');

const ROUTES = {
  dashboard: { title: 'Dasbor', render: renderDashboard },
  transaksi: { title: 'Transaksi', render: renderTransactions },
  anggaran: { title: 'Anggaran', render: renderBudget },
  tabungan: { title: 'Tabungan', render: renderGoals },
  laporan: { title: 'Laporan', render: renderReport },
};

function render() {
  const route = ROUTES[state.route] || ROUTES.dashboard;
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === state.route);
    if (a.dataset.route === state.route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  main.innerHTML = `<h1>${route.title}</h1>` + route.render(state);
  wirePage();
}

function routeFromHash() {
  const name = (location.hash || '#/dashboard').replace('#/', '');
  state.route = ROUTES[name] ? name : 'dashboard';
  if (state.route !== 'transaksi') state.editingId = null;
  render();
}

function nextId(prefix) {
  return prefix + Date.now().toString(36);
}

function wirePage() {
  // Form tambah / ubah transaksi.
  const form = document.getElementById('tx-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const amount = Math.round(Number(data.get('amount')));
      if (!amount || amount <= 0) return;
      const tx = {
        id: state.editingId || nextId('x'),
        date: String(data.get('date')),
        desc: String(data.get('desc')).trim(),
        category: String(data.get('category')),
        amount,
      };
      const list = state.transactions[state.month];
      if (state.editingId) {
        const i = list.findIndex((t) => t.id === state.editingId);
        if (i >= 0) list[i] = tx;
        state.editingId = null;
      } else {
        list.push(tx);
      }
      render();
    });
    const cancel = document.getElementById('cancel-edit');
    if (cancel) cancel.addEventListener('click', () => { state.editingId = null; render(); });
  }

  // Filter kategori + cari transaksi.
  const filter = document.getElementById('filter-cat');
  if (filter) filter.addEventListener('change', () => { state.filterCategory = filter.value; render(); });
  const search = document.getElementById('search-tx');
  if (search) {
    search.addEventListener('input', () => {
      state.search = search.value;
      render();
      const again = document.getElementById('search-tx');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
  }

  // Tombol ubah / hapus di tabel transaksi (event delegation).
  main.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => {
    state.editingId = btn.dataset.edit;
    render();
  }));
  main.querySelectorAll('[data-del]').forEach((btn) => btn.addEventListener('click', () => {
    state.transactions[state.month] = state.transactions[state.month].filter((t) => t.id !== btn.dataset.del);
    render();
  }));

  // Ubah batas anggaran per kategori.
  main.querySelectorAll('.budget-edit').forEach((f) => f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const limit = Math.round(Number(new FormData(f).get('limit')));
    if (Number.isFinite(limit) && limit >= 0) state.budgets[f.dataset.cat] = limit;
    render();
  }));

  // Tambah dana ke target tabungan.
  main.querySelectorAll('.goal-add').forEach((f) => f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const amount = Math.round(Number(new FormData(f).get('amount')));
    if (!amount || amount <= 0) return;
    const goal = state.goals.find((g) => g.id === f.dataset.goal);
    if (goal) goal.saved = Math.min(goal.saved + amount, goal.target);
    render();
  }));
}

// Ganti bulan: dasbor, transaksi, anggaran, dan laporan ikut berubah.
monthSelect.addEventListener('change', () => {
  state.month = monthSelect.value;
  state.editingId = null;
  render();
});

window.addEventListener('hashchange', routeFromHash);
routeFromHash();

// Dipakai tes otomatis: total pengeluaran bulan berjalan per kategori.
export function debugCategorySpent(catId) { return categorySpent(state, catId); }
