/* ===== storage.js ===== */
/* Centralized localStorage helpers + shared utilities */

const KEYS = {
  equipment : 'it_equipment',
  users     : 'it_users',
  borrows   : 'it_borrows',
  activity  : 'it_activity',
  counters  : 'it_counters',
};

/* ---------- low-level helpers ---------- */

function lsGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('lsGet error:', e);
    return null;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('lsSet error:', e);
  }
}

/* ---------- collection helpers ---------- */

function getEquipment() { return lsGet(KEYS.equipment)  || []; }
function getUsers()      { return lsGet(KEYS.users)      || []; }
function getBorrows()    { return lsGet(KEYS.borrows)    || []; }
function getActivity()   { return lsGet(KEYS.activity)   || []; }
function getCounters()   { return lsGet(KEYS.counters)   || { eq: 1, user: 1, borrow: 1 }; }

function saveEquipment(data) { lsSet(KEYS.equipment, data); }
function saveUsers(data)      { lsSet(KEYS.users, data); }
function saveBorrows(data)    { lsSet(KEYS.borrows, data); }
function saveCounters(c)      { lsSet(KEYS.counters, c); }

function addActivity(text) {
  const activity = getActivity();
  activity.unshift({
    text,
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
  });
  if (activity.length > 15) activity.pop();
  lsSet(KEYS.activity, activity);
}

/* ---------- toast ---------- */

function showToast(msg, ok = true) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = ok ? '#22c55e' : '#ef4444';
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 2600);
}
