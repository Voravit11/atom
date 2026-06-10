/* ===== dashboard.js ===== */

function renderDashboard() {
  renderStats();
  renderRecentActivity();
  renderChart();
}

/* ---- Stats cards ---- */
function renderStats() {
  const equipment = getEquipment();
  const users     = getUsers();
  const borrows   = getBorrows();

  document.getElementById('stat-eq').textContent      = equipment.length;
  document.getElementById('stat-users').textContent   = users.length;
  document.getElementById('stat-borrowed').textContent = borrows.filter(b => b.status === 'borrowed').length;
}

/* ---- Recent activity ---- */
function renderRecentActivity() {
  const container = document.getElementById('recent-list');
  const activity  = getActivity();

  if (!activity.length) {
    container.innerHTML = '<p class="empty-state" style="color:#ccc">ยังไม่มีกิจกรรม</p>';
    return;
  }

  container.innerHTML = activity.map(a => `
    <div class="recent-item">
      <div>${a.text}</div>
      <div class="time">${a.time}</div>
    </div>
  `).join('');
}

/* ---- Bar chart (borrow count per date) ---- */
function renderChart() {
  const chartBars   = document.getElementById('chart-bars');
  const chartLabels = document.getElementById('chart-labels');
  const borrows     = getBorrows();

  if (!borrows.length) {
    chartBars.innerHTML   = '<p class="empty-state" style="color:#999;width:100%">ยังไม่มีข้อมูล</p>';
    chartLabels.innerHTML = '';
    return;
  }

  /* Aggregate by date */
  const map = {};
  borrows.forEach(b => {
    const key = b.date || '?';
    if (!map[key]) map[key] = { borrow: 0, ret: 0 };
    map[key].borrow++;
    if (b.status === 'returned') map[key].ret++;
  });

  /* Take last 7 dates */
  const keys   = Object.keys(map).slice(-7);
  const maxVal = Math.max(...keys.map(k => map[k].borrow), 1);
  const MAX_H  = 130; /* px */

  chartBars.innerHTML = keys.map(k => {
    const bh = Math.round((map[k].borrow / maxVal) * MAX_H);
    const rh = Math.round((map[k].ret    / maxVal) * MAX_H);
    return `
      <div class="bar-group">
        <div class="bar black" style="height:${bh}px" title="ยืม ${map[k].borrow}"></div>
        <div class="bar red"   style="height:${rh}px" title="คืน ${map[k].ret}"></div>
      </div>`;
  }).join('');

  chartLabels.innerHTML = keys.map(k =>
    `<span class="chart-label">${k}</span>`
  ).join('');
}
