/* ===== borrow.js ===== */

function populateBorrowSelects() {
  const userSel = document.getElementById('borrow-user');
  const eqSel   = document.getElementById('borrow-eq');
  const users     = getUsers();
  const equipment = getEquipment();

  userSel.innerHTML =
    '<option value="">-- เลือกผู้ใช้ --</option>' +
    users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

  eqSel.innerHTML =
    '<option value="">-- เลือกอุปกรณ์ --</option>' +
    equipment
      .filter(e => e.status === 'available')
      .map(e => `<option value="${e.id}">${e.name}</option>`)
      .join('');
}

function saveBorrow() {
  const userId = document.getElementById('borrow-user').value;
  const eqId   = document.getElementById('borrow-eq').value;
  const detail = document.getElementById('borrow-detail').value.trim();

  if (!userId || !eqId) {
    showToast('กรุณาเลือกผู้ใช้และอุปกรณ์', false);
    return;
  }

  const users     = getUsers();
  const equipment = getEquipment();
  const borrows   = getBorrows();
  const counters  = getCounters();

  const user = users.find(u => u.id == userId);
  const eq   = equipment.find(e => e.id == eqId);

  if (!user || !eq) { showToast('ข้อมูลไม่ถูกต้อง', false); return; }

  /* Mark equipment as borrowed */
  eq.status = 'borrowed';
  saveEquipment(equipment);

  /* Create borrow record */
  const date = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' });
  borrows.push({
    id      : counters.borrow++,
    userId  : Number(userId),
    userName: user.name,
    eqId    : Number(eqId),
    eqName  : eq.name,
    detail  : detail || '-',
    date,
    status  : 'borrowed',
  });

  saveBorrows(borrows);
  saveCounters(counters);
  addActivity(`ยืม: ${eq.name} โดย ${user.name}`);

  document.getElementById('borrow-detail').value = '';
  renderBorrow();
  renderDashboard();
  populateBorrowSelects();
  showToast('บันทึกการยืมสำเร็จ');
}

function returnItem(borrowId) {
  const borrows   = getBorrows();
  const equipment = getEquipment();

  const record = borrows.find(b => b.id === borrowId);
  if (!record) return;

  record.status = 'returned';

  const eq = equipment.find(e => e.id === record.eqId);
  if (eq) eq.status = 'available';

  saveBorrows(borrows);
  saveEquipment(equipment);
  addActivity(`คืน: ${record.eqName} โดย ${record.userName}`);

  renderBorrow();
  renderEquipment();
  renderDashboard();
  showToast('บันทึกการคืนสำเร็จ');
}

function renderBorrow() {
  const list    = document.getElementById('borrow-list');
  const borrows = getBorrows();

  if (!borrows.length) {
    list.innerHTML = '<p class="empty-state">ยังไม่มีรายการยืม</p>';
    return;
  }

  /* Show newest first */
  const sorted = [...borrows].reverse();

  list.innerHTML = sorted.map(b => `
    <div class="table-row table-borrow-grid">
      <span>${b.id}</span>
      <span>${b.userName}</span>
      <span>${b.eqName}</span>
      <span style="font-size:12px">${b.detail}</span>
      <span>
        ${b.status === 'borrowed'
          ? `<button class="action-btn btn-return" onclick="returnItem(${b.id})">คืน</button>`
          : `<span class="badge badge-returned">คืนแล้ว</span>`}
      </span>
    </div>
  `).join('');
}
