/* ===== equipment.js ===== */

function addEquipment() {
  const input = document.getElementById('eq-input');
  const name  = input.value.trim();

  if (!name) { showToast('กรุณากรอกชื่ออุปกรณ์', false); return; }

  const equipment = getEquipment();
  const counters  = getCounters();

  equipment.push({ id: counters.eq++, name, status: 'available' });

  saveEquipment(equipment);
  saveCounters(counters);
  addActivity(`เพิ่มอุปกรณ์: ${name}`);

  input.value = '';
  renderEquipment();
  renderDashboard();
  showToast('เพิ่มอุปกรณ์สำเร็จ');
}

function deleteEquipment(id) {
  const equipment = getEquipment();
  const item = equipment.find(e => e.id === id);

  if (!item) return;
  if (item.status === 'borrowed') {
    showToast('ไม่สามารถลบได้ กำลังถูกยืมอยู่', false);
    return;
  }

  const updated = equipment.filter(e => e.id !== id);
  saveEquipment(updated);
  addActivity(`ลบอุปกรณ์: ${item.name}`);
  renderEquipment();
  renderDashboard();
  showToast('ลบอุปกรณ์แล้ว');
}

function renderEquipment() {
  const list      = document.getElementById('eq-list');
  const equipment = getEquipment();

  if (!equipment.length) {
    list.innerHTML = '<p class="empty-state">ยังไม่มีอุปกรณ์</p>';
    return;
  }

  list.innerHTML = equipment.map(e => `
    <div class="table-row table-eq-grid">
      <span>${e.id}</span>
      <span>${e.name}</span>
      <span>
        <span class="badge ${e.status === 'available' ? 'badge-available' : 'badge-borrowed'}">
          ${e.status === 'available' ? 'ว่าง' : 'ถูกยืม'}
        </span>
      </span>
      <span>
        <button class="action-btn btn-delete" onclick="deleteEquipment(${e.id})">ลบ</button>
      </span>
    </div>
  `).join('');
}
