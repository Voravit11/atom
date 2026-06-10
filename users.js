/* ===== users.js ===== */

function addUser() {
  const input = document.getElementById('user-input');
  const name  = input.value.trim();

  if (!name) { showToast('กรุณากรอกชื่อผู้ใช้', false); return; }

  const users    = getUsers();
  const counters = getCounters();

  users.push({ id: counters.user++, name });

  saveUsers(users);
  saveCounters(counters);
  addActivity(`เพิ่มผู้ใช้: ${name}`);

  input.value = '';
  renderUsers();
  renderDashboard();
  showToast('เพิ่มผู้ใช้สำเร็จ');
}

function deleteUser(id) {
  const users = getUsers();
  const user  = users.find(u => u.id === id);

  if (!user) return;

  const updated = users.filter(u => u.id !== id);
  saveUsers(updated);
  addActivity(`ลบผู้ใช้: ${user.name}`);
  renderUsers();
  renderDashboard();
  showToast('ลบผู้ใช้แล้ว');
}

function renderUsers() {
  const list  = document.getElementById('user-list');
  const users = getUsers();

  if (!users.length) {
    list.innerHTML = '<p class="empty-state">ยังไม่มีผู้ใช้</p>';
    return;
  }

  list.innerHTML = users.map(u => `
    <div class="table-row table-users-grid">
      <span>${u.id}</span>
      <span>${u.name}</span>
    </div>
  `).join('');
}
