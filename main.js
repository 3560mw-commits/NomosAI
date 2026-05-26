// ═══════════════════════════════════════════════
// NOMOS AI — My Wakili  |  main.js  (updated)
// ═══════════════════════════════════════════════

// ── In-memory "database" of registered users ──
// Pre-seeded with 3 lawyers so the Lawyer Matching tab is never empty
const USERS = [
  {
    email: 'sarah.njoroge@nomosai.ke',
    password: 'Password1',
    firstName: 'Sarah', lastName: 'Njoroge',
    role: 'lawyer',
    specialty: 'Tenant & Property Rights',
    county: 'Nairobi', experience: 8, rating: 4.9,
    fee: 'KES 5,000–15,000', available: true,
    initials: 'SN', avatarGrad: 'linear-gradient(135deg,#1e3a5f,#2d7a8e)'
  },
  {
    email: 'kevin.odhiambo@nomosai.ke',
    password: 'Password1',
    firstName: 'Kevin', lastName: 'Odhiambo',
    role: 'lawyer',
    specialty: 'Civil & Housing Law',
    county: 'Nairobi', experience: 12, rating: 4.7,
    fee: 'KES 3,000–10,000', available: false,
    initials: 'KO', avatarGrad: 'linear-gradient(135deg,#2d1a5f,#5a2d8e)'
  },
  {
    email: 'amina.mohamed@nomosai.ke',
    password: 'Password1',
    firstName: 'Amina', lastName: 'Mohamed',
    role: 'lawyer',
    specialty: 'Probono — LSK Network',
    county: 'Kiambu', experience: 6, rating: 4.8,
    fee: 'FREE (Probono)', available: true,
    initials: 'AM', avatarGrad: 'linear-gradient(135deg,#1a4731,#2d7a52)'
  }
];

// Currently logged-in user (null when signed out)
let currentUser = null;

// ── Page Router ──
let currentPage = 'landing';
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) { pg.classList.add('active'); currentPage = id; window.scrollTo(0, 0); }
  document.getElementById('navbar').style.display = id === 'dashboard' ? 'none' : 'flex';
  if (id === 'dashboard') { setTimeout(() => startReveal(), 100); applyUserToDashboard(); }
}

// ── Apply logged-in user's name throughout dashboard ──
function applyUserToDashboard() {
  if (!currentUser) return;
  const full = currentUser.firstName + ' ' + currentUser.lastName;
  const initials = (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();

  // Sidebar user card
  const nameEl = document.getElementById('dashUserName');
  const typeEl = document.getElementById('dashUserType');
  const avEls  = document.querySelectorAll('.dash-user-av');
  if (nameEl) nameEl.textContent = full;
  if (typeEl) typeEl.textContent = capitalise(currentUser.role || 'Citizen') + ' Account';
  avEls.forEach(el => el.textContent = initials);

  // Topbar avatar
  const topAv = document.getElementById('dashTopAvatar');
  if (topAv) topAv.textContent = initials;

  // Greeting
  const greet = document.getElementById('overviewGreeting');
  if (greet) greet.textContent = 'Good day, ' + currentUser.firstName + ' 👋';

  // Chat welcome
  const chatWelcome = document.getElementById('chatWelcomeMsg');
  if (chatWelcome) chatWelcome.innerHTML =
    'Hello ' + currentUser.firstName + '! I\'m Nomos, your AI legal companion. I can help you with legal research, draft documents, and answer any legal questions. What would you like to discuss today?';

  // Settings profile
  const setFirst = document.getElementById('settingsFirst');
  const setLast  = document.getElementById('settingsLast');
  const setEmail = document.getElementById('settingsEmail');
  const setAvName = document.getElementById('settingsAvName');
  const setAvInit = document.getElementById('settingsAvInit');
  if (setFirst) setFirst.value = currentUser.firstName;
  if (setLast)  setLast.value  = currentUser.lastName;
  if (setEmail) setEmail.value = currentUser.email;
  if (setAvName) setAvName.textContent = full;
  if (setAvInit) setAvInit.textContent = initials;

  // Refresh lawyer tab
  renderLawyerMatches();
}

function capitalise(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ── Navbar scroll ──
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile nav ──
function toggleMobileNav() {
  document.getElementById('navbar').classList.toggle('mobile-nav-open');
}
document.addEventListener('click', e => {
  const nb = document.getElementById('navbar');
  if (nb && !nb.contains(e.target)) nb.classList.remove('mobile-nav-open');
});

// ── Scroll to section ──
function scrollToSection(id) {
  if (currentPage !== 'landing') showPage('landing');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, currentPage === 'landing' ? 0 : 300);
}

// ── Command Bar ──
function showCmd() { document.getElementById('cmdOverlay').classList.add('open'); setTimeout(() => document.getElementById('cmdInput').focus(), 100); }
function hideCmd() { document.getElementById('cmdOverlay').classList.remove('open'); document.getElementById('cmdInput').value = ''; }
function closeCmdOverlay(e) { if (e.target === document.getElementById('cmdOverlay')) hideCmd(); }
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); showCmd(); }
  if (e.key === 'Escape') hideCmd();
});
function filterCmd(v) {}
function cmdKeyNav(e) { if (e.key === 'Escape') hideCmd(); }

// ── Scroll Reveal ──
function startReveal() {
  const els = document.querySelectorAll('.page.active [data-reveal]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('revealed'); obs.unobserve(en.target); } });
  }, { threshold: .1 });
  els.forEach(el => { el.classList.remove('revealed'); obs.observe(el); });
}
window.addEventListener('load', startReveal);

// ── Stat bars ──
function animateBars() {
  document.querySelectorAll('.sc-fill[data-w]').forEach(el => { el.style.width = el.dataset.w + '%'; });
}
const barObs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { animateBars(); barObs.disconnect(); } });
}, { threshold: .3 });
const statsEl = document.getElementById('stats');
if (statsEl) barObs.observe(statsEl);

// ── Testimonials ──
let testiIdx = 0;
function goTesti(n) {
  document.querySelectorAll('.testi-card').forEach((c, i) => { c.classList.toggle('visible', i === n); });
  document.querySelectorAll('.tn-dot').forEach((d, i) => { d.classList.toggle('active', i === n); });
  testiIdx = n;
}
function nextTesti() { goTesti((testiIdx + 1) % 3); }
function prevTesti() { goTesti((testiIdx + 2) % 3); }
setInterval(() => { if (currentPage === 'landing') nextTesti(); }, 5000);

// ── User type selection (landing) ──
function selectUserType(el, type) {
  document.querySelectorAll('.ut-card').forEach(c => c.classList.remove('active-type'));
  el.classList.add('active-type');
}

// ── User type picker (register page) ──
let selectedUserType = 'citizen';
function pickType(el, type) {
  document.querySelectorAll('.utype-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedUserType = type;
}

// ════════════════════════════════════════
// ★ VALIDATION HELPERS
// ════════════════════════════════════════
function showErr(inputId, errId, message) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.classList.add('error');
  if (err) { if (message) err.textContent = message; err.classList.add('show'); }
}
function clearErr(inputEl, errId) {
  if (inputEl) inputEl.classList.remove('error');
  const err = document.getElementById(errId);
  if (err) err.classList.remove('show');
  const alert = inputEl && inputEl.closest('.auth-card') && inputEl.closest('.auth-card').querySelector('.form-alert');
  if (alert) alert.classList.remove('show');
}
function clearTermsErr() {
  document.getElementById('regTermsErr').classList.remove('show');
  const alert = document.getElementById('regAlert');
  if (alert) alert.classList.remove('show');
}
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

// ── LOGIN VALIDATION (checks against registered users) ──
function validateLogin() {
  let valid = true;
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPass').value;

  // Reset
  ['loginEmail', 'loginPass'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('error'); });
  ['loginEmailErr', 'loginPassErr'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('show'); });
  document.getElementById('loginAlert').classList.remove('show');

  if (!email || !isValidEmail(email)) {
    showErr('loginEmail', 'loginEmailErr', 'Please enter a valid email address.');
    valid = false;
  }
  if (!pass) {
    showErr('loginPass', 'loginPassErr', 'Password is required.');
    valid = false;
  }
  if (!valid) { document.getElementById('loginAlert').classList.add('show'); return; }

  // Check if user exists
  const found = USERS.find(u => u.email.toLowerCase() === email);
  if (!found) {
    document.getElementById('loginAlert').textContent = 'No account found with this email. Please register first.';
    document.getElementById('loginAlert').classList.add('show');
    showErr('loginEmail', 'loginEmailErr', 'Email not registered.');
    return;
  }
  if (found.password !== pass) {
    document.getElementById('loginAlert').textContent = 'Incorrect password. Please try again.';
    document.getElementById('loginAlert').classList.add('show');
    showErr('loginPass', 'loginPassErr', 'Incorrect password.');
    return;
  }

  currentUser = found;
  showPage('dashboard');
}

// ── REGISTER VALIDATION ──
function validateRegister() {
  let valid = true;

  ['regFirst', 'regLast', 'regEmail', 'regPass', 'regPass2'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('error'); });
  ['regFirstErr', 'regLastErr', 'regEmailErr', 'regPassErr', 'regPass2Err', 'regTermsErr'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('show'); });
  document.getElementById('regAlert').classList.remove('show');

  const first = document.getElementById('regFirst').value.trim();
  const last  = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  const terms = document.getElementById('regTerms').checked;

  if (!first) { showErr('regFirst', 'regFirstErr', 'First name is required.'); valid = false; }
  if (!last)  { showErr('regLast', 'regLastErr', 'Last name is required.'); valid = false; }
  if (!email || !isValidEmail(email)) { showErr('regEmail', 'regEmailErr', 'A valid email address is required.'); valid = false; }
  if (!pass || pass.length < 8) { showErr('regPass', 'regPassErr', 'Password must be at least 8 characters.'); valid = false; }
  if (!pass2 || pass !== pass2) { showErr('regPass2', 'regPass2Err', 'Passwords do not match.'); valid = false; }
  if (!terms) { document.getElementById('regTermsErr').classList.add('show'); valid = false; }

  if (!valid) {
    document.getElementById('regAlert').classList.add('show');
    const firstErr = document.querySelector('#page-register .form-input.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Check duplicate email
  if (USERS.find(u => u.email.toLowerCase() === email)) {
    document.getElementById('regAlert').textContent = 'An account with this email already exists. Please sign in.';
    document.getElementById('regAlert').classList.add('show');
    showErr('regEmail', 'regEmailErr', 'Email already registered.');
    return;
  }

  // Register the new user
  const newUser = {
    email, password: pass,
    firstName: first, lastName: last,
    role: selectedUserType || 'citizen',
    specialty: null, county: null,
    experience: null, rating: null, fee: null,
    available: false,
    initials: (first[0] + last[0]).toUpperCase(),
    avatarGrad: 'linear-gradient(135deg,var(--n600),var(--n500))'
  };
  USERS.push(newUser);
  currentUser = newUser;
  showPage('dashboard');
}

// ── Dashboard ──
let dashOpen = true;
function toggleSidebar() {
  dashOpen = !dashOpen;
  document.getElementById('dashSidebar').classList.toggle('collapsed', !dashOpen);
  document.getElementById('dashMain').classList.toggle('full', !dashOpen);
  if (window.innerWidth <= 1100) {
    document.getElementById('dashSidebar').classList.toggle('open', dashOpen);
    document.getElementById('dashSidebar').classList.remove('collapsed');
    document.getElementById('dashMain').classList.remove('full');
  }
}

const tabs = {
  overview: 'Overview', chat: 'AI Legal Chat', cases: 'My Cases',
  documents: 'Document Vault', lawyers: 'Lawyer Matching',
  health: 'Legal Health Check', assess: 'Case Assessment',
  gendoc: 'Generate Document', settings: 'Settings'
};

function switchDashTab(tab) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + tab);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.ds-nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + tab + "'"));
  });
  const titleEl = document.getElementById('dashTitle');
  const bcEl    = document.getElementById('dashBreadcrumb');
  if (titleEl) titleEl.textContent = tabs[tab] || tab;
  if (bcEl)    bcEl.textContent    = tabs[tab] || tab;
  window.scrollTo(0, 0);
  if (window.innerWidth <= 1100 && dashOpen) { toggleSidebar(); }
}

// ── Dashboard Chat ──
const aiResponses = [
  "Under the <strong style='color:var(--g300)'>Distress for Rent Act (Cap. 293)</strong> and <strong>Landlord and Tenant Act</strong>, your landlord cannot evict you without serving proper notice — at least 30 days for monthly tenancy. Do you need me to draft a formal notice?",
  "Based on Kenya's <strong style='color:var(--g300)'>Employment Act 2007, Section 45</strong>, wrongful dismissal without proper cause or procedure entitles you to compensation of up to 12 months' salary. Have you been given a termination letter?",
  "For land disputes in Kenya, the <strong style='color:var(--g300)'>Land Act 2012</strong> and <strong>Environment and Land Court</strong> have jurisdiction. I recommend starting with mediation before formal litigation. Shall I research relevant precedents?",
  "I've found <strong style='color:var(--g300)'>3 relevant case precedents</strong> in the Kenya Law Reports that support your position. The strongest is <em>Muthoni v. Housing Board [2022]</em> which established tenant protections against illegal rent increases.",
  "Your case has a <strong style='color:var(--g300)'>72% success probability</strong> based on similar cases in our database. I recommend sending a formal demand letter first — I can generate one for you right now. Would you like to proceed?"
];
let aiIdx = 0;
function sendDashChat() {
  const input = document.getElementById('dcwInput');
  const msgs  = document.getElementById('dcwMessages');
  const text  = input.value.trim();
  if (!text) return;
  const initials = currentUser ? currentUser.initials : 'U';
  const uDiv = document.createElement('div');
  uDiv.className = 'dcw-msg u';
  uDiv.innerHTML = `<div class="dcw-bub user">${text}</div><div class="hv-av usr" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">${initials}</div>`;
  msgs.appendChild(uDiv);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;
  const typDiv = document.createElement('div');
  typDiv.className = 'dcw-msg';
  typDiv.id = 'dash-typing';
  typDiv.innerHTML = `<div class="hv-av ai" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">N</div><div class="dcw-bub ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(typDiv);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    const t = document.getElementById('dash-typing');
    if (t) t.remove();
    const aDiv = document.createElement('div');
    aDiv.className = 'dcw-msg';
    aDiv.innerHTML = `<div class="hv-av ai" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">N</div><div class="dcw-bub ai">${aiResponses[aiIdx % aiResponses.length]}</div>`;
    msgs.appendChild(aDiv);
    aiIdx++;
    msgs.scrollTop = msgs.scrollHeight;
  }, 1800);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'dcwInput') sendDashChat();
});

// ── Render lawyer matches (only lawyers registered on platform) ──
function renderLawyerMatches() {
  const container = document.getElementById('lawyerMatchList');
  if (!container) return;
  const lawyers = USERS.filter(u => u.role === 'lawyer');
  if (lawyers.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--s400)">No lawyers registered on the platform yet.</div>`;
    return;
  }
  container.innerHTML = lawyers.map(l => `
    <div class="match-card">
      <div class="match-av" style="background:${l.avatarGrad}">${l.initials}</div>
      <div style="flex:1">
        <div class="match-name">Adv. ${l.firstName} ${l.lastName}</div>
        <div class="match-spec">${l.specialty || 'General Practice'}</div>
        <div class="match-meta">${l.county || 'Kenya'} · ${l.experience ? l.experience + ' yrs exp' : 'New'} · ${l.rating ? l.rating + '★' : 'No rating yet'} · ${l.fee || 'TBD'}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="match-badge ${l.available ? 'avail' : 'busy'}">${l.available ? 'Available' : 'Busy'}</div>
        <button class="btn ${l.available ? 'btn-gold' : 'btn-ghost'} sm" onclick="alert('${l.available ? 'Connection' : 'Request'} sent to Adv. ${l.firstName} ${l.lastName}!')">
          ${l.available ? 'Connect' : 'Request'}
        </button>
      </div>
    </div>
  `).join('');
}

// ── Document Upload (real file picker) ──
function triggerDocUpload() {
  const inp = document.getElementById('docUploadInput');
  if (inp) inp.click();
}
function handleDocUpload(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  const list = document.getElementById('docUploadedList');
  const empty = document.getElementById('docEmptyState');
  if (empty) empty.style.display = 'none';
  files.forEach(file => {
    const ext = file.name.split('.').pop().toUpperCase();
    const size = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB';
    const icons = { PDF: '📜', DOCX: '📝', DOC: '📝', PNG: '🖼️', JPG: '🖼️', JPEG: '🖼️' };
    const ico = icons[ext] || '📄';
<<<<<<< HEAD

    // Create an object URL so the file can be viewed/opened
    const objectURL = URL.createObjectURL(file);
    const isImage = ['PNG','JPG','JPEG','GIF','WEBP'].includes(ext);
    const isPDF   = ext === 'PDF';

    const row = document.createElement('div');
    row.className = 'doc-row';
    row.style.alignItems = 'center';
    row.innerHTML = `
      <div class="doc-ico">${ico}</div>
      <div style="flex:1;min-width:0">
        <div class="doc-row-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div>
        <div class="doc-row-meta">Uploaded just now · ${size}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
        <button class="btn btn-ghost sm" style="padding:6px 12px;font-size:.75rem" onclick="viewUploadedDoc('${objectURL}','${file.name}','${isImage ? 'image' : isPDF ? 'pdf' : 'other'}')">👁 View</button>
        <a href="${objectURL}" download="${file.name}" class="btn btn-ghost sm" style="padding:6px 12px;font-size:.75rem;text-decoration:none">⬇ Download</a>
        <div class="doc-chip ok">✓ Saved</div>
      </div>`;
    if (list) list.prepend(row);
  });
  input.value = '';
  showToast('📁 ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded to Document Vault');
}

// ── View uploaded file in a modal overlay ──
function viewUploadedDoc(url, name, type) {
  // Remove any existing viewer
  const existing = document.getElementById('docViewerOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'docViewerOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:11000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  let contentHTML = '';
  if (type === 'image') {
    contentHTML = `<img src="${url}" alt="${name}" style="max-width:100%;max-height:70vh;border-radius:12px;border:1px solid rgba(255,255,255,.1)"/>`;
  } else if (type === 'pdf') {
    contentHTML = `<iframe src="${url}" style="width:min(900px,90vw);height:70vh;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#fff"></iframe>`;
  } else {
    contentHTML = `<div style="background:var(--surf2);border:1px solid var(--gbord);border-radius:16px;padding:40px;text-align:center;max-width:420px">
      <div style="font-size:3rem;margin-bottom:16px">📄</div>
      <div style="font-size:.95rem;font-weight:600;color:#fff;margin-bottom:8px">${name}</div>
      <div style="font-size:.82rem;color:var(--s400);margin-bottom:24px">This file type cannot be previewed in the browser.</div>
      <a href="${url}" download="${name}" class="btn btn-gold" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px">⬇ Download to View</a>
    </div>`;
  }

  overlay.innerHTML = `
    <div style="width:100%;max-width:960px;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 4px">
        <div style="font-size:.88rem;font-weight:600;color:var(--s200);display:flex;align-items:center;gap:8px">
          <span>📄</span><span style="max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</span>
        </div>
        <button onclick="document.getElementById('docViewerOverlay').remove()" style="background:var(--surf3);border:1px solid var(--gbord);border-radius:8px;color:var(--s300);padding:6px 14px;cursor:pointer;font-size:.82rem;font-family:var(--sans);transition:background .2s">✕ Close</button>
      </div>
      <div style="display:flex;justify-content:center">${contentHTML}</div>
    </div>`;
  document.body.appendChild(overlay);
}

=======
    const row = document.createElement('div');
    row.className = 'doc-row';
    row.innerHTML = `
      <div class="doc-ico">${ico}</div>
      <div style="flex:1">
        <div class="doc-row-name">${file.name}</div>
        <div class="doc-row-meta">Uploaded just now · ${size}</div>
      </div>
      <div class="doc-chip ok">✓ Saved</div>`;
    if (list) list.prepend(row);
  });
  input.value = '';
  // Show a small toast
  showToast('📁 ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded to Document Vault');
}

>>>>>>> c7f26c1c91c93ef7a73a33639a319a483c319c81
// ── Simple toast notification ──
function showToast(msg) {
  let toast = document.getElementById('nomosToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nomosToast';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--surf2);border:1px solid var(--gbord-g);border-radius:var(--r12);padding:13px 22px;font-size:.86rem;color:var(--g300);font-weight:600;z-index:9999;transition:transform .35s var(--ease),opacity .35s;opacity:0;pointer-events:none;box-shadow:0 12px 36px rgba(0,0,0,.5)';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 3000);
}

// ── Case Assessment ──
function runAssessment() {
  const btn = document.getElementById('assessBtn');
  btn.textContent = '🧠 Analysing…'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '🔍 Run AI Assessment'; btn.disabled = false;
    document.getElementById('assessResult').style.display = 'block';
  }, 2200);
}

// ── Generate Document ──
function generateDoc() {
  const btn = document.getElementById('genBtn');
  btn.textContent = '⏳ Generating…'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '📄 Generate Document'; btn.disabled = false;
    document.getElementById('genResult').style.display = 'block';
  }, 1800);
}
function setDocType(el, title) {
  document.querySelectorAll('.doc-row').forEach(r => { r.style.borderColor = ''; r.style.background = ''; });
  el.style.borderColor = 'rgba(201,168,76,.35)'; el.style.background = 'rgba(201,168,76,.06)';
  document.getElementById('genDocTitle').textContent = title;
  document.getElementById('genResult').style.display = 'none';
}

// ═══════════════════════════════════════════════
// LEGAL TIPS POOL — 365 tips
// ═══════════════════════════════════════════════
const LEGAL_TIPS = [
  "Under the Constitution of Kenya 2010, every citizen has the right to access information held by the State.",
  "A verbal contract is legally binding in Kenya, but written contracts are far easier to enforce in court.",
  "Under the Employment Act 2007, employees are entitled to 21 days of annual leave after 12 months of service.",
  "Landlords must give a tenant at least one month's written notice before increasing rent.",
  "The Limitation of Actions Act requires most civil suits to be filed within 6 years of the cause of action.",
  "Under the Land Act 2012, all Kenyan citizens have the right to own land anywhere in Kenya regardless of ethnicity.",
  "A will must be signed by the testator and witnessed by two independent adults to be valid in Kenya.",
  "The Employment Act 2007 requires employers to provide written terms of employment within 2 months of hiring.",
  "Domestic violence victims can apply for a Protection Order at their nearest magistrate's court at no cost.",
  "Under the Children Act, child maintenance obligations can be enforced through court orders regardless of marital status.",
  "Any contract obtained through fraud, duress, or misrepresentation is voidable at the injured party's option.",
  "Kenya's Arbitration Act allows parties to resolve disputes privately without going to court.",
  "Under the Consumer Protection Act, goods must be fit for purpose — if not, you're entitled to a refund or replacement.",
  "Employees dismissed without cause are entitled to severance pay of at least 15 days' basic wages per completed year of service.",
  "A power of attorney must be registered at the Lands Registry if it relates to any property transaction.",
  "Traffic offences in Kenya can result in licence suspension — always pay fines before contesting in court.",
  "Under the Sexual Offences Act, consent cannot be obtained by fraud, impersonation, or false promises.",
  "Kenyans have the right to record police interactions as long as it does not obstruct lawful police activity.",
  "The right to bail is a constitutional right; only exceptional circumstances justify denial before conviction.",
  "Under the Data Protection Act 2019, organisations must obtain your consent before processing your personal data.",
  "A landlord cannot forcibly evict a tenant without a valid court order — doing so is illegal harassment.",
  "Kenya's Companies Act 2015 requires companies to file annual returns with the Registrar of Companies.",
  "A marriage under the Marriage Act 2014 can only be dissolved through divorce proceedings in a court of law.",
  "The Law of Contract Act requires consideration for a valid contract — gratuitous promises are generally unenforceable.",
  "Any person arrested must be informed of the reason for arrest in a language they understand.",
  "Under the Insolvency Act, a creditor can petition for bankruptcy if a debtor owes more than KES 1,000.",
  "Public officers in Kenya have a constitutional duty to act with integrity and accountability at all times.",
  "Under the Proceeds of Crime Act, unexplained wealth can be forfeited to the government.",
  "Police officers must present a search warrant before searching private premises unless in hot pursuit.",
  "The Employment Act prohibits discrimination based on sex, race, disability, religion, or HIV status.",
  "Kenya's Copyright Act gives creators automatic copyright protection from the moment of creation.",
  "A tenancy agreement without a defined period defaults to a month-to-month arrangement.",
  "Directors of a company can be personally liable if they authorise fraudulent transactions.",
  "The Kenya Revenue Authority can pursue unpaid taxes for up to 5 years from the due date.",
  "A will can be challenged in court on grounds of testamentary incapacity or undue influence.",
  "Under the Employment Act, maternity leave is 3 months on full pay — this cannot be contracted away.",
  "The National Land Commission oversees the management and administration of public land in Kenya.",
  "A deed of sale for land must be registered at the Lands Registry to be legally effective against third parties.",
  "Cyber-bullying and online harassment can attract criminal charges under the Computer Misuse and Cybercrimes Act 2018.",
  "Under the Basic Education Act, education is compulsory for children between 6 and 14 years of age.",
  "Penalty clauses in contracts are unenforceable if they amount to a punitive sum not reflecting genuine loss.",
  "A minor's contract is voidable — only enforceable against the minor if it was for necessities.",
  "Kenya's Anti-Corruption and Economic Crimes Act creates criminal liability for offering or receiving bribes.",
  "An employee on probation retains most statutory employment rights including protection from unlawful dismissal.",
  "Under the Land Registration Act, possession without registration does not confer legal title to land.",
  "You have 30 days to appeal a magistrate's court decision to the High Court.",
  "The Commission on Administrative Justice (Ombudsman) investigates complaints about government agencies for free.",
  "Noise pollution that disturbs neighbours can be reported to the National Environment Management Authority.",
  "A franchise agreement must be in writing and should clearly define IP usage rights and fee structures.",
  "Whistle-blowers who report corruption are protected under the Witness Protection Act.",
  "Under the Matrimonial Property Act 2013, both spouses have equal rights to matrimonial property.",
  "Consumer contracts with unfair terms can be challenged under the Consumer Protection Act 2012.",
  "Under the Banking Act, banks must disclose all charges and interest rates before a loan is disbursed.",
  "The Competition Authority of Kenya prevents monopolistic practices that harm consumers.",
  "A deed of gift must be signed, witnessed, and delivered to the recipient to be legally complete.",
  "In Kenya, a contract for sale of land must be evidenced in writing and signed by both parties.",
  "Employees have a right to strike under the Labour Relations Act after following prescribed procedures.",
  "DNA evidence is admissible in Kenyan courts under the Evidence Act for paternity and criminal cases.",
  "The Rent Restriction Tribunal handles disputes between landlords and tenants at minimal cost.",
  "Environmental impact assessments are mandatory for all major development projects in Kenya.",
  "Under the National Cohesion and Integration Act, hate speech is a criminal offence in Kenya.",
  "Foreign judgments can be enforced in Kenya if the relevant country has a reciprocal enforcement arrangement.",
  "An affidavit must be sworn before a Commissioner for Oaths or a Judge/Magistrate to be admissible.",
  "Under the Retirement Benefits Act, employer contributions to pension funds vest after 2 years of service.",
  "A guarantor on a loan can be pursued directly by the lender if the borrower defaults.",
  "Kenya's Access to Information Act grants citizens the right to obtain documents held by public bodies.",
  "Road traffic accident victims can claim compensation from the Motor Vehicle Insurance Fund even if the at-fault driver is uninsured.",
  "Under the Succession Act, a surviving spouse has a life interest in the matrimonial home.",
  "Children born out of wedlock have equal inheritance rights as those born in wedlock under Kenyan law.",
  "Agreements in restraint of trade are only enforceable if they are reasonable in scope and duration.",
  "Kenya's Mental Health Act 2022 strengthens protections for patients and prohibits involuntary commitment except in defined circumstances.",
  "Obtaining credit through fraudulent misrepresentation is a criminal offence under the Penal Code.",
  "A court injunction can freeze assets pending resolution of a civil dispute to prevent dissipation of property.",
  "Under the Persons with Disabilities Act, employers of 25 or more must reserve 5% of positions for persons with disabilities.",
  "An employee cannot be dismissed during sick leave without following due process as required by law.",
  "Kenya's Transfer of Property Act governs the legal requirements for transferring property interests.",
  "Threats, blackmail, and extortion are criminal offences under the Penal Code attracting imprisonment.",
  "An employer must provide a fair hearing before dismissing an employee for misconduct.",
  "The Public Procurement and Asset Disposal Act mandates competitive tendering for government contracts.",
  "Company shareholders can petition the court for relief against oppressive conduct by majority shareholders.",
  "Under the Seed and Plant Varieties Act, farmers can save and replant seeds subject to certain exceptions.",
  "A person can be held in pre-trial detention for no more than 24 hours before being charged or released.",
  "The Advocates Act regulates the legal profession — only registered advocates can represent clients in court.",
  "Under the Children Act 2022, the best interests of the child are the primary consideration in all matters.",
  "An oral will (nuncupative will) is only valid for soldiers in active service under Kenyan law.",
  "The Proceeds of Crime and Anti-Money Laundering Act requires banks to report suspicious transactions.",
  "A court can issue a garnishee order to recover a judgment debt directly from the debtor's bank account.",
  "Under the Insolvency Act, a company can apply for administration to restructure and avoid liquidation.",
  "MPESA transactions can be subpoenaed as evidence in civil or criminal proceedings.",
  "Kenya's Nairobi International Financial Centre Act promotes Kenya as a regional financial services hub.",
  "Under the Traffic Act, driving under the influence of alcohol above prescribed limits is a criminal offence.",
  "A company director owes fiduciary duties to act in the best interests of the company at all times.",
  "The High Court has supervisory jurisdiction over all subordinate courts in Kenya.",
  "Under the Police Act, police must investigate all formal reports of criminal offences without charge.",
  "Kenya has ratified the UN Convention on the Rights of the Child, which is part of domestic law.",
  "The Legal Aid Act 2016 provides free legal services to indigent Kenyans in civil and criminal matters.",
  "KPLC must compensate customers for power surges that damage appliances under the Energy Act.",
  "Under the Marriage Act, a spouse can oppose a proposed marriage by lodging a caveat with the Registrar.",
  "Defamation — whether libel (written) or slander (spoken) — can attract civil and criminal liability in Kenya.",
  "The Kenya Film Classification Board must rate all films — unauthorised distribution of unrated content is illegal.",
  "Under the Radiation Protection Act, X-ray and radiation facilities require a licence to operate legally.",
  "A notice to quit for a residential tenant must be in writing and served personally or by registered post.",
  "Under the Banking Act, banks cannot charge compound interest on personal loans without clear disclosure.",
  "The Kenya Law Reform Commission reviews and proposes updates to legislation to keep laws current.",
  "Under the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act, commercial tenants have strong security of tenure.",
  "A company's memorandum and articles of association form its constitutional document and govern operations.",
  "An employee is entitled to pay in lieu of notice if dismissed without the contractual notice period.",
  "Under the Tax Procedures Act, taxpayers can appeal KRA assessments to the Tax Appeals Tribunal.",
  "The National Construction Authority regulates the construction industry and must be notified of major works.",
  "Kenya's Nairobi Centre for International Arbitration is a world-class venue for commercial dispute resolution.",
  "Under the Energy Act 2019, all electricity consumers have a right to a reliable supply and compensation for outages.",
  "A hire-purchase agreement transfers ownership only after the final instalment is paid — not at delivery.",
  "Under Kenya's Statute Law, ignorance of the law is not a valid defence in criminal proceedings.",
  "The Kenya Medical Practitioners and Dentists Council regulates medical professionals and handles complaints.",
  "Under the Insurance Act, insurers must settle valid claims within 90 days of receiving full documentation.",
  "A cheque that bounces due to insufficient funds can lead to criminal prosecution under the Penal Code.",
  "Under the National Gender and Equality Commission Act, gender-based discrimination in employment is illegal.",
  "A person declared bankrupt cannot hold public office until discharged from bankruptcy.",
  "The Employment Act requires at least one rest day per week for all employees.",
  "Under the Landlord and Tenant Act, a tenant can withhold rent only in very limited legally prescribed circumstances.",
  "An employer cannot deduct more than one-third of an employee's wages in any one pay period.",
  "Under the Judicature Act, English common law applies in Kenya to the extent it is applicable to Kenyan circumstances.",
  "The Anti-Doping Agency of Kenya enforces anti-doping rules in sport — violations can result in bans and criminal charges.",
  "A valid sale of goods contract requires offer, acceptance, consideration, and legal capacity of the parties.",
  "Under the Land Control Act, transactions involving agricultural land require approval from the Land Control Board.",
  "A landlord who refuses to return a security deposit without justification can be sued in the Small Claims Court.",
  "The Small Claims Court handles civil claims of up to KES 1,000,000 quickly and without needing a lawyer.",
  "Under the Proceeds of Crime Act, lawyers must verify client identity and report suspicious transactions.",
  "Environmental conservation is a constitutional duty under Article 69 — every Kenyan must protect the environment.",
  "Under the Pharmacy and Poisons Act, prescription drugs can only be dispensed by a registered pharmacist.",
  "A deed must be signed, witnessed, and delivered — failure of any step renders it incomplete.",
  "The Kenya Revenue Authority has powers to seize goods and assets to recover unpaid taxes.",
  "Under the Water Act 2016, water is a human right — no person can be denied access to basic water supply.",
  "An employer who dismisses an employee for whistleblowing faces heavy penalties under the Employment Act.",
  "Any gift or promise made in contemplation of marriage is generally enforceable as a contract.",
  "Under the Marriage Act, polygamous marriages must be conducted under the recognised customary law of the parties.",
  "The National Social Security Fund (NSSF) provides retirement benefits — employers must register and contribute for employees.",
  "A court can award punitive (exemplary) damages in addition to compensatory damages for egregious conduct.",
  "Under the Copyright Act, software code is protected intellectual property from the moment it is written.",
  "Kenya's National Cohesion and Integration Commission promotes peaceful coexistence and investigates ethnic tension.",
  "An insolvent company's assets are distributed in priority order — secured creditors before unsecured ones.",
  "Under the Prevention of Organized Crimes Act, membership of a criminal gang is itself a criminal offence.",
  "A person acquitted of a criminal charge cannot be tried again for the same offence — double jeopardy protection.",
  "The Directorate of Criminal Investigations (DCI) investigates serious and organised crime — reports are made in person or online.",
  "Kenya's Constitution guarantees the right to a fair trial, including the right to legal representation.",
  "Under the Sports Act, all sports associations must be registered with the Sports Registrar to operate legally.",
  "An arbitration clause in a contract requires disputes to be resolved by arbitration before going to court.",
  "Under the Healthcare Act, patients have the right to informed consent before any medical procedure.",
  "Noise from a business operating past permitted hours can be reported to the county government.",
  "Under the Prevention of Torture Act, evidence obtained through torture is inadmissible in court.",
  "A registered trade union has the right to collectively bargain on behalf of its members under the Labour Relations Act.",
  "Kenya's Consumer Protection Act prohibits false advertising and misleading representations about products.",
  "Under the Public Health Act, landlords must maintain rental properties in a habitable and sanitary condition.",
  "A court order for child support can be enforced through attachment of earnings or contempt proceedings.",
  "Under the Unclaimed Financial Assets Act, dormant accounts for more than 3 years must be reported to the Authority.",
  "The Kenya Medical Association has a code of ethics — patients can complain about doctor misconduct.",
  "Under the Legal Aid Act, eligible persons can receive free legal representation in criminal matters.",
  "A non-disclosure agreement (NDA) is enforceable in Kenya if it protects a legitimate business interest.",
  "Under the Proceeds of Crime Act, casinos and betting companies must report large cash transactions.",
  "Kenya's Constitution gives every person the right to privacy, including in communication and data.",
  "An order of mandamus can compel a public body to perform its legal duty — apply to the High Court.",
  "Under the Criminal Procedure Code, an accused person is presumed innocent until proven guilty beyond reasonable doubt.",
  "A letter of demand is a formal notice of a legal claim — sending one before court action is best practice.",
  "Under the Insurance (Motor Vehicle Third Party Risks) Act, all vehicles on public roads must be insured.",
  "The Kenya Copyright Board registers creative works and enforces copyright in Kenya.",
  "Under the Evidence Act, communications between a lawyer and client are privileged and cannot be compelled in court.",
  "A business operating without a county trading licence can be ordered to close and fined.",
  "Under the Employment Act, an employee can resign with immediate effect if subjected to serious mistreatment.",
  "The Human Rights Court of the African Union can be petitioned for violations of the African Charter on Human Rights.",
  "Under the Landlord and Tenant Act, a landlord cannot enter rented premises without reasonable notice except in emergency.",
  "NHIF (now Social Health Authority) contributions are mandatory for all formal sector employees.",
  "An agroforestry or land use agreement with a neighbour must be registered to bind future purchasers of the land.",
  "Under the Science, Technology and Innovation Act, research institutions must adhere to ethical guidelines.",
  "A person cannot be compelled to testify against themselves — the right against self-incrimination is guaranteed.",
  "Under the Sexual Harassment Policy guidelines, employers have a duty to investigate complaints of sexual harassment.",
  "Foreign nationals working in Kenya must obtain a valid work permit under the Kenya Citizenship and Immigration Act.",
  "The Kenya Revenue Authority can audit a business for up to five years after the filing of a tax return.",
  "A tenant in common owns a specific share of property; a joint tenant has equal ownership with right of survivorship.",
  "Trademark registration with KEIPO gives the holder exclusive rights to use the mark in Kenya for 10 years.",
  "Under the Political Parties Act, party members can challenge expulsion through the Political Parties Disputes Tribunal.",
  "A driving licence can be cancelled on grounds of medical unfitness to drive.",
  "Under the Labour Relations Act, a collective bargaining agreement binds all employees in the bargaining unit.",
  "The Kenya Ports Authority Act regulates all activities at Kenyan ports — violations attract heavy penalties.",
  "Under the Proceeds of Crime Act, real estate agents must carry out due diligence on buyers and sellers.",
  "A search and seizure warrant must specify the premises to be searched and the items sought — overbroad warrants are illegal.",
  "The Ethics and Anti-Corruption Commission investigates corruption in public and private sectors.",
  "Under the Business Registration Service Act, all business names must be registered before commencing operations.",
  "A court-appointed receiver can manage a debtor's assets pending resolution of insolvency proceedings.",
  "Under the Companies Act, a company can be wound up voluntarily or by court order on various grounds.",
  "The National Land Commission must approve any allocation or disposition of public land in Kenya.",
  "Under the Environmental Management and Coordination Act, polluters are liable for cleanup costs and compensation.",
  "A personal guarantee on a loan makes the guarantor personally responsible for the borrower's debt.",
  "Under the Evidence Act, a confession made voluntarily to police is admissible in court.",
  "Kenya's Anti-Doping Act 2023 criminalises doping in sport with heavy prison terms.",
  "Under the Sugar Act, sugar factories must pay farmers within 21 days of delivery of sugarcane.",
  "A decree nisi in divorce proceedings becomes absolute 3 months after being granted.",
  "Under the Wills Act, if a testator marries after making a will, the will is automatically revoked.",
  "The Kenya Gazette is the official government publication — all legal notices must be published there.",
  "Under the Pensions Act, civil servants' pensions are protected and cannot be garnished to pay debts.",
  "A co-defendant's confession is admissible only against the maker — not against other accused persons.",
  "Under the Narcotic Drugs and Psychotropic Substances Act, possession of controlled substances attracts severe penalties.",
  "The National Employment Authority facilitates job placement and regulates private employment agencies.",
  "Under the Agriculture Act, noxious weeds on private land must be destroyed — failure can attract liability.",
  "A charging order on property prevents the owner from selling without first settling the judgment debt.",
  "Under the National Government Administration Act, the Chief's office is the first point of contact for local disputes.",
  "An unfair contract term that excludes all liability for negligence causing death or personal injury is void.",
  "Under the Competition Act, cartel behaviour — price-fixing, bid-rigging — is a criminal offence.",
  "A court can set aside a default judgment if the defendant had a good reason for not responding in time.",
  "Under the Legal Metrology Act, all weighing and measuring equipment used in trade must be certified.",
  "Kenya's Civil Procedure Rules require parties to attempt mediation before certain civil trials.",
  "Under the Copyright Act, fair use allows limited reproduction of copyrighted work for education and research.",
  "A promissory note is a written promise to pay — it is a negotiable instrument enforceable in court.",
  "Under the Insolvency Act, a trustee in bankruptcy has the power to recover assets transferred within 2 years before bankruptcy.",
  "The National Police Service Act gives the Independent Policing Oversight Authority (IPOA) power to investigate police misconduct.",
  "Under the Finance Act, interest on late tax payments is charged at the Treasury Bill rate plus 2%.",
  "A mortgaged property can only be sold by the bank after issuing the required statutory notices under the Land Act.",
  "Under the Elections Act, electoral disputes must be filed within 28 days of declaration of election results.",
  "The Refugee Act protects refugees from deportation to countries where they face serious harm.",
  "Under the Anti-Counterfeiting Act, dealing in counterfeit goods attracts imprisonment of up to 10 years.",
  "A landlord who locks out a tenant or disconnects utilities to force eviction commits an illegal act.",
  "Under the Civil Procedure Act, parties can obtain pre-trial discovery of documents from the opposing side.",
  "The Kenya Intellectual Property Institute (KEIPO) registers patents, trademarks, and industrial designs.",
  "Under the Employment Act, casual employees who work continuously for more than one month acquire regular employee rights.",
  "A court can grant an Anton Piller order to preserve evidence from destruction before proceedings begin.",
  "Under the Land Control Act, subdivision of agricultural land requires Land Control Board approval.",
  "A non-compete clause in an employment contract is only enforceable if it protects a legitimate interest and is reasonable in scope.",
  "Under the Children Act 2022, corporal punishment in schools is prohibited.",
  "The Kenya Revenue Authority must issue an assessment within 5 years of a taxpayer's omission or error in returns.",
  "Under the Law of Succession Act, dependants who are excluded from a will can apply to court for maintenance.",
  "A company secretary is legally responsible for ensuring a company's compliance with statutory filing requirements.",
  "Under the Penal Code, it is an offence to bribe or attempt to bribe a public officer.",
  "The Kenya Electricity Generating Company (KenGen) is bound by the Energy and Petroleum Regulatory Authority's rules.",
  "Under the Mediation Act, a mediated settlement agreement is binding and enforceable as a contract.",
  "A conditional sale agreement — where title passes on full payment — is distinct from a sale of goods contract.",
  "Under the Anti-Money Laundering Act, financial institutions must conduct customer due diligence before account opening.",
  "A statutory demand for debt must be served personally or at the debtor's registered address to be valid.",
  "Under the Forest Conservation and Management Act, it is illegal to harvest timber from gazetted forests without a licence.",
  "The Teachers Service Commission handles all matters relating to teachers' employment and discipline in Kenya.",
  "Under the Criminal Procedure Code, an accused person must be arraigned before a court within 24 hours of arrest.",
  "An agency relationship requires the principal's authorisation — express, implied, or ratified after the fact.",
  "Under the National Land Commission Act, landless Kenyans can apply for allocation of public land.",
  "A fixed-term employment contract that is repeatedly renewed can create a permanent employment relationship.",
  "Under the Landlord and Tenant Act, unlawful eviction gives the tenant the right to damages and reinstatement.",
  "The Business Laws (Amendment) Act 2020 modernised contract formation rules to recognise electronic contracts.",
  "Under the Data Protection Act, individuals have the right to access and correct personal data held about them.",
  "A public interest litigation petition can be filed in the High Court by any person on constitutional matters.",
  "Under the Constitution, every person has the right to access justice, and court fees shall not be a barrier.",
  "The National Environment Tribunal hears appeals against NEMA decisions on environmental licences.",
  "Under the Proceeds of Crime Act, a restraint order can freeze all assets of a suspected money launderer.",
  "A cheque is stale if presented more than 6 months after the date written on it — banks will dishonour it.",
  "Under the Kenya Broadcasting Corporation Act, media must adhere to the Media Council of Kenya's standards.",
  "A lease for more than 3 years must be registered at the Lands Registry to be legally effective.",
  "Under the Company Act, shareholders holding 10% of shares can requisition an extraordinary general meeting.",
  "The National Construction Authority investigates complaints of substandard building work.",
  "Under the Succession Act, adopted children have the same inheritance rights as biological children.",
  "A cyber-fraud victim can report to the DCI Cyber Crimes Unit for investigation and recovery of funds.",
  "Under the Health Act, all private health facilities must be licensed by the national or county government.",
  "Property obtained through a corrupt transaction can be recovered by the Ethics and Anti-Corruption Commission.",
  "Under the Insurance Act, life insurance policies have a 30-day grace period for late premium payments.",
  "A court can issue a Mareva injunction (freezing order) against a defendant who may dissipate assets.",
  "Under the Firearms Act, possession of a firearm without a valid licence is a serious criminal offence.",
  "The Kenya Medical Supplies Authority regulates the procurement and distribution of medical commodities.",
  "Under the International Crimes Act, crimes against humanity and genocide are prosecutable in Kenya.",
  "A tenant who sublets without the landlord's consent may be lawfully evicted for breach of the tenancy agreement.",
  "Under the State Corporations Act, a state corporation employee is subject to public service ethics.",
  "A court-issued injunction binds all persons with notice of it — breach is contempt of court.",
  "Under the Elections Act, voter bribery is a criminal offence punishable by imprisonment.",
  "The Industrial Court (Employment and Labour Relations Court) handles all employment and labour disputes in Kenya.",
  "Under the Banking Act, a bank customer can complain to the Central Bank of Kenya about unfair banking practices.",
  "A signed statement acknowledging a debt restarts the limitation period — use with caution.",
  "Under the Pest Control Products Act, it is illegal to use banned pesticides in Kenya.",
  "The Public Procurement Regulatory Authority (PPRA) investigates complaints about government tenders.",
  "Under the National Housing Corporation Act, eligible Kenyans can access subsidised housing loans.",
  "A binding legal agreement requires offer, acceptance, consideration, intention to create legal relations, and capacity.",
  "Under the Energy Act, all petroleum products must be licensed — selling unlicensed fuel is illegal.",
  "The Kenya Citizens and Foreign Nationals Management Service handles national ID and passport matters.",
  "Under the Copyright Act, moral rights — including the right to be identified as author — cannot be waived.",
  "A person who acts as a director while disqualified by court order commits a criminal offence.",
  "Under the Anti-Female Genital Mutilation Act, FGM is illegal in Kenya — reporting is encouraged and protected.",
  "A deed of assignment transfers contractual rights from one party to another — notice to the other party is required.",
  "Under the Basic Education Act, school levies must be approved by the Ministry of Education.",
  "The Kenya Revenue Authority publishes tax rulings that clarify the tax treatment of specific transactions.",
  "Under the Matrimonial Property Act, a spouse who contributes to property improvement acquires a beneficial interest.",
  "An in-house lawyer employed by a company has the same professional obligations as private practice advocates.",
  "Under the Information and Communication Technology Act, electronic evidence is admissible in Kenyan courts.",
  "The National Cohesion and Integration Commission can prosecute individuals for inciting ethnic hatred.",
  "Under the Land Act, the government can compulsorily acquire private land for public purposes with prompt and fair compensation.",
  "A promissory estoppel doctrine prevents a party from going back on a clear promise that another relied upon.",
  "Under the Architects and Quantity Surveyors Act, building plans must be prepared and approved by a registered professional.",
  "The Anti-Counterfeit Authority conducts market surveillance and destroys counterfeit goods seized in raids.",
  "Under the National Police Service Act, every police officer must have and show their service card on request.",
  "A court can order specific performance of a contract in cases where monetary damages are inadequate.",
  "Under the Landlord and Tenant Act, a tenant is entitled to a written receipt for all rent payments.",
  "The Judicial Service Commission appoints and disciplines judges — complaints against judges are made to the JSC.",
  "Under the Children Act, a child's birth must be registered within 6 months — it is a legal obligation.",
  "A memorandum of understanding (MOU) is not always legally binding — check for consideration and intent.",
  "Under the National Government Co-ordination Act, county commissioners coordinate security matters at the local level.",
  "The Banking Fraud Investigations Unit (BFIU) at the DCI investigates banking and financial fraud.",
  "Under the Companies Act, a company must maintain a registered office in Kenya at all times.",
  "A contract for illegal purposes — such as smuggling — is void and unenforceable in court.",
  "Under the Public Finance Management Act, public funds must be used only for authorised purposes.",
  "The Kenya Law Reports contain all superior court decisions — they are a primary resource for legal research.",
  "Under the Judiciary Fund Act, court funds are managed independently to protect judicial independence.",
  "An employee on fixed-term contract is entitled to the same statutory protections as a permanent employee.",
  "Under the Law of Succession, a surviving spouse can apply for a grant of administration within one month of death.",
  "The Kenya Bar Examinations are overseen by the Council of Legal Education — only passers can be admitted to the bar.",
  "Under the Prevention of Terrorism Act, providing material support to a terrorist organisation is a criminal offence.",
  "A company that is struck off the register can be restored within 10 years by application to the court.",
  "Under the Rent Restriction Act, certain residential tenancies are protected against arbitrary rent increases.",
  "Kenya's Victim Protection Act gives crime victims the right to be informed and involved in proceedings.",
  "Under the Proceeds of Crime Act, the burden of proof shifts to the defendant to explain suspicious wealth.",
  "An e-contract formed via email exchange is legally binding if the elements of a valid contract are met.",
  "Under the Consumer Protection Act, you have the right to return faulty goods within a reasonable time.",
  "The ODPP (Office of the Director of Public Prosecutions) makes independent charging decisions in all criminal matters.",
  "Under the Landlord and Tenant Act, a tenant is entitled to quiet enjoyment of the rented premises.",
  "A Kenyan citizen can petition the African Court on Human and Peoples' Rights after exhausting domestic remedies.",
];

let lastTipIndex = -1;

function getRandomTip() {
  let idx;
  do { idx = Math.floor(Math.random() * LEGAL_TIPS.length); } while (idx === lastTipIndex);
  lastTipIndex = idx;
  return LEGAL_TIPS[idx];
}

// ═══════════════════════════════════════════════
// HERO CHAT — auto-display tips every 8 seconds
// ═══════════════════════════════════════════════
function startHeroChatTips() {
  const chat = document.querySelector('.hv-chat');
  if (!chat) return;
  // Remove typing indicator, add first tip after 2s
  setTimeout(() => injectHeroTip(chat), 2000);
  setInterval(() => injectHeroTip(chat), 8000);
}

function injectHeroTip(chat) {
  // Remove previous tip messages so chat doesn't overflow
  const oldTips = chat.querySelectorAll('.hero-auto-tip');
  oldTips.forEach(t => t.remove());
  const tip = getRandomTip();
  const div = document.createElement('div');
  div.className = 'hv-msg hero-auto-tip';
  div.style.cssText = 'animation:fadeInMsg .5s ease';
  div.innerHTML = `<div class="hv-av ai">N</div><div class="hv-bub ai"><strong style="color:var(--g300)">💡 Legal Tip:</strong><br/>${tip}</div>`;
  // Insert before typing indicator if present
  const typing = chat.querySelector('.hv-typing');
  if (typing) chat.insertBefore(div, typing);
  else chat.appendChild(div);
}

<<<<<<< HEAD
// Hero tip — inject into chat box as a conversation message
function showHeroLegalTip() {
  const chat = document.querySelector('.hv-chat');
  if (!chat) return;
  const tip = getRandomTip();
  const div = document.createElement('div');
  div.className = 'hv-msg hero-auto-tip';
  div.style.cssText = 'animation:fadeInMsg .5s ease';
  div.innerHTML = `<div class="hv-av ai">N</div><div class="hv-bub ai"><strong style="color:var(--g300)">💡 Legal Tip:</strong><br/>${tip}</div>`;
  const typing = chat.querySelector('.hv-typing');
  if (typing) chat.insertBefore(div, typing);
  else chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
=======
// Hero tip modal
function showHeroLegalTip() {
  const overlay = document.getElementById('heroTipOverlay');
  const body = document.getElementById('heroTipBody');
  if (!overlay || !body) return;
  body.textContent = getRandomTip();
  overlay.classList.add('open');
}
function closeHeroTip(e) {
  if (!e || e.target === document.getElementById('heroTipOverlay')) {
    document.getElementById('heroTipOverlay').classList.remove('open');
  }
>>>>>>> c7f26c1c91c93ef7a73a33639a319a483c319c81
}

// ═══════════════════════════════════════════════
// DASHBOARD CHAT — Legal Tips button
// ═══════════════════════════════════════════════
function showDashLegalTip() {
  const msgs = document.getElementById('dcwMessages');
  if (!msgs) return;
  const tip = getRandomTip();
  const div = document.createElement('div');
  div.className = 'dcw-msg';
  div.innerHTML = `<div class="hv-av ai" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">N</div><div class="dcw-bub ai"><strong style="color:var(--g300)">💡 Legal Tip:</strong><br/>${tip}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ═══════════════════════════════════════════════
// SUBSCRIPTION POPUP
// ═══════════════════════════════════════════════
function openSubscriptionPopup() {
  document.getElementById('subscriptionOverlay').classList.add('open');
}
function closeSubscriptionPopup() {
  document.getElementById('subscriptionOverlay').classList.remove('open');
}
function closeSubOverlay(e) {
  if (e.target === document.getElementById('subscriptionOverlay')) closeSubscriptionPopup();
}
function selectPlan(value, el) {
  document.querySelectorAll('.sub-plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const sel = document.getElementById('subPlan');
  if (sel) sel.value = value;
}
function submitSubscription() {
  let valid = true;
  const name  = document.getElementById('subName').value.trim();
  const email = document.getElementById('subEmail').value.trim();
  const phone = document.getElementById('subPhone').value.trim();
  const plan  = document.getElementById('subPlan').value;

  // Clear errors
  ['subName','subEmail','subPhone','subPlan'].forEach(id => {
    document.getElementById(id).style.borderColor = '';
  });
  ['subNameErr','subEmailErr','subPhoneErr','subPlanErr'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  if (!name) { document.getElementById('subName').style.borderColor = '#ef4444'; document.getElementById('subNameErr').style.display = 'block'; valid = false; }
  if (!email || !email.includes('@')) { document.getElementById('subEmail').style.borderColor = '#ef4444'; document.getElementById('subEmailErr').style.display = 'block'; valid = false; }
  if (!phone) { document.getElementById('subPhone').style.borderColor = '#ef4444'; document.getElementById('subPhoneErr').style.display = 'block'; valid = false; }
  if (!plan) { document.getElementById('subPlan').style.borderColor = '#ef4444'; document.getElementById('subPlanErr').style.display = 'block'; valid = false; }

  if (!valid) return;

  const planLabels = { weekly: 'Weekly (KES 200)', monthly: 'Monthly (KES 600)', quarterly: '3 Months (KES 1,650)' };
  closeSubscriptionPopup();
  showToast('✅ Subscription confirmed! ' + planLabels[plan] + ' — Check your email for payment instructions.');

  // Also send the queued message
  sendDashChat();
}

// Init
showPage('landing');
setTimeout(startHeroChatTips, 1500);
