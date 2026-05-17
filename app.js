const STORAGE = {
  accounts: "oversee.accounts",
  session: "oversee.session",
  projects: "oversee.projects",
  invites: "oversee.invites",
  subscription: "oversee.subscription",
  swa: "oversee.swa",
  estimateDraft: "oversee.estimateDraft",
  estimateV2Draft: "oversee.estimateV2Draft",
  estimateTemplates: "oversee.estimateTemplates",
  materialPrices: "oversee.materialPrices",
  theme: "oversee.theme"
};

const ACCESS_KEYS = [
  { key: "engineering", label: "Engineers View" },
  { key: "procurement", label: "Procurement" },
  { key: "accounting", label: "Accounting" },
  { key: "administrative", label: "Administrative" }
];

const STATUS_OPTIONS = ["Not yet Started", "On-going", "On-Hold", "Completed"];
const PLAN_TYPES = ["Architectural", "Structural", "Plumbing", "Electrical", "Mechanical", "Electronics", "Civil", "Fire Protection", "Other"];
const YEAR_WEEKS_PER_MONTH = 4;
const GANTT_BAR_SIDE_MARGIN = 8;
const GANTT_BAR_INNER_PADDING = 4;
const NEW_PRICE_STORE = "__new_store__";

const state = {
  authTab: "signup",
  currentView: "welcome",
  engineeringView: "gantt",
  ganttZoom: "year",
  selectedYear: new Date().getFullYear(),
  filter: { name: "", type: "" },
  inviteToken: new URLSearchParams(window.location.hash.replace("#", "?")).get("invite"),
  riskOnly: false,
  pendingSignupEmail: null,
  backendNotice: "",
  activeSwaSheetId: "draft",
  dashboardFilter: { projectId: "all", year: "all" },
  activePriceStore: "",
  theme: readTheme()
};

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const API_ROOT = `${window.location.origin}/api`;

applyTheme(state.theme);

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme);
  seedProjects();
  render();
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const id = target.dataset.id;

  const handlers = {
    "auth-tab": () => {
      state.authTab = target.dataset.tab;
      render();
    },
    signup: handleSignup,
    login: handleLogin,
    logout: () => {
      localStorage.removeItem(STORAGE.session);
      state.currentView = "welcome";
      render();
    },
    "open-account": openAccountModal,
    "main-view": () => openMainView(target.dataset.view),
    "engineering-tab": () => {
      state.engineeringView = target.dataset.view;
      state.riskOnly = false;
      render();
    },
    "open-add-project": () => openProjectModal(),
    "edit-project": () => openProjectModal(id),
    "open-filter": openFilterModal,
    "clear-filter": () => {
      state.filter = { name: "", type: "" };
      state.riskOnly = false;
      render();
    },
    "show-risk": () => {
      state.riskOnly = true;
      render();
    },
    "marks-off": () => toast("Marks Off is reserved for the next build."),
    "zoom-in": () => {
      state.ganttZoom = "day";
      render();
    },
    "zoom-out": () => {
      state.ganttZoom = "year";
      render();
    },
    "set-theme": () => setTheme(target.dataset.theme),
    "close-modal": closeModal,
    "save-project": saveProject,
    "save-filter": saveFilter,
    "save-swa": saveSwa,
    "update-swa": updateSwa,
    "add-estimate-row": addEstimateRow,
    "save-estimate-template": saveEstimateTemplate,
    "extract-estimate-v2-pdf": extractEstimateV2Pdf,
    "clear-estimate-v2": clearEstimateV2Draft,
    "use-estimate-template": () => useEstimateTemplate(id),
    "delete-estimate-row": () => deleteEstimateRow(id),
    "duplicate-price-store": duplicatePriceStore,
    "save-price-list": savePriceList,
    "delete-price-row": () => deletePriceRow(id),
    "select-swa-sheet": () => {
      state.activeSwaSheetId = id || "draft";
      render();
    },
    "delete-swa-sheet": () => deleteSwaSheet(id),
    "verify-otp": verifySignupOtp,
    "create-invite": createInvite,
    "update-access": () => updateAccess(id),
    "cancel-subscription": cancelSubscription,
    "link-gmail": linkGmail,
    "copy-invite": () => copyInvite(target.dataset.link),
    "delete-project": () => deleteProject(id)
  };

  if (handlers[action]) handlers[action]();
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const priceInput = event.target.closest("[data-price-input]");
  if (!priceInput || event.key !== "Enter") return;
  event.preventDefault();
  handlePriceListEnter(priceInput);
});

document.addEventListener("input", (event) => {
  const estimateTitle = event.target.closest("[data-estimate-title]");
  if (estimateTitle) {
    saveEstimateDraft(collectEstimateDraftFromDom());
    return;
  }
  const templatePicker = event.target.closest("[data-template-picker]");
  if (templatePicker) {
    handleTemplatePicker(templatePicker.value);
    return;
  }
  const estimateInput = event.target.closest("[data-estimate-input]");
  if (estimateInput) {
    handleEstimateInput(estimateInput);
    return;
  }
  const priceInput = event.target.closest("[data-price-input]");
  if (priceInput) {
    persistCurrentPriceRows();
    return;
  }
  if (!event.target.closest("[data-swa-input]")) return;
  markSwaDraftDirty();
});

document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-action]");
  if (target && target.dataset.action === "select-swa-project") {
    updateSwaProject(target.value);
    return;
  }
  if (target && target.dataset.action === "dashboard-project-filter") {
    state.dashboardFilter.projectId = target.value || "all";
    render();
    return;
  }
  if (target && target.dataset.action === "dashboard-year-filter") {
    state.dashboardFilter.year = target.value || "all";
    render();
    return;
  }
  if (target && target.dataset.action === "select-estimate-store") {
    updateEstimateStore(target.value);
    return;
  }
  if (target && target.dataset.action === "estimate-v2-plan-type") {
    updateEstimateV2PlanType(target.value);
    return;
  }
  if (target && target.dataset.action === "select-price-store") {
    state.activePriceStore = target.value || NEW_PRICE_STORE;
    render();
    return;
  }
  if (!target || target.dataset.action !== "gantt-year") return;
  state.selectedYear = Number(target.value) || new Date().getFullYear();
  render();
});

function getAccounts() {
  return readJson(STORAGE.accounts, []);
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE.accounts, JSON.stringify(accounts));
}

function savePublicAccount(account) {
  const accounts = getAccounts();
  const nextAccounts = accounts.some((item) => item.id === account.id)
    ? accounts.map((item) => item.id === account.id ? { ...item, ...account } : item)
    : [...accounts, account];
  saveAccounts(nextAccounts);
}

function getProjects() {
  return readJson(STORAGE.projects, []);
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE.projects, JSON.stringify(projects));
}

function getInvites() {
  return readJson(STORAGE.invites, []);
}

function saveInvites(invites) {
  localStorage.setItem(STORAGE.invites, JSON.stringify(invites));
}

function getSessionAccount() {
  const session = readJson(STORAGE.session, null);
  if (!session) return null;
  return getAccounts().find((account) => account.id === session.accountId) || null;
}

function getSubscription() {
  const saved = readJson(STORAGE.subscription, null);
  if (saved) return saved;
  const created = {
    trialStartedAt: new Date().toISOString(),
    status: "trial",
    cancelledAt: null
  };
  localStorage.setItem(STORAGE.subscription, JSON.stringify(created));
  return created;
}

function saveSubscription(subscription) {
  localStorage.setItem(STORAGE.subscription, JSON.stringify(subscription));
}

function getSwaState() {
  const saved = readJson(STORAGE.swa, null);
  if (saved && Array.isArray(saved.draftRows) && Array.isArray(saved.sheets)) {
    const selectedProjectId = saved.selectedProjectId || "";
    const draftRows = isDefaultRoadSwaRows(saved.draftRows) ? [] : saved.draftRows;
    const draftsByProject = saved.draftsByProject && typeof saved.draftsByProject === "object"
      ? saved.draftsByProject
      : {};
    const projectKey = swaProjectKey(selectedProjectId);
    if (!Array.isArray(draftsByProject[projectKey])) {
      draftsByProject[projectKey] = draftRows;
    }
    return {
      draftRows: draftsByProject[projectKey],
      draftsByProject,
      sheets: saved.sheets,
      updated: Boolean(saved.updated),
      selectedProjectId
    };
  }
  const created = defaultSwaState();
  saveSwaState(created);
  return created;
}

function saveSwaState(swa) {
  localStorage.setItem(STORAGE.swa, JSON.stringify(swa));
}

function defaultSwaState() {
  return {
    draftRows: defaultSwaRows(),
    draftsByProject: {},
    sheets: [],
    updated: false,
    selectedProjectId: ""
  };
}

function readTheme() {
  return localStorage.getItem(STORAGE.theme) === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === "light" ? "light" : "dark";
}

function setTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  state.theme = nextTheme;
  localStorage.setItem(STORAGE.theme, nextTheme);
  applyTheme(nextTheme);
  render();
  toast(`${nextTheme === "light" ? "Light" : "Dark"} mode applied.`);
}

function defaultSwaRows() {
  return [];
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function render() {
  const account = getSessionAccount();
  if (!account) {
    app.innerHTML = renderAuthScreen();
    return;
  }
  app.innerHTML = renderAppShell(account);
}

async function apiRequest(path, body, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), Number(options.timeoutMs) || 5000);
  const token = sessionToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${API_ROOT}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      const error = new Error(payload.error || "Backend request failed.");
      error.fromBackend = true;
      error.statusCode = response.status;
      throw error;
    }
    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

function sessionToken() {
  const session = readJson(STORAGE.session, null);
  return session && session.token ? session.token : "";
}

function canUsePrototypeFallback() {
  const host = window.location.hostname;
  return window.location.protocol === "file:"
    || host === "localhost"
    || host === "127.0.0.1"
    || host.startsWith("192.168.");
}

function renderAuthScreen() {
  const invite = getInviteByToken(state.inviteToken);
  return `
    <main class="screen login-screen">
      <section class="login-shell">
        <div class="brand-panel">
          <div>
            <div class="brand-mark"><span class="brand-cube">O</span>Oversee</div>
            <h1>Construction monitoring for project owners.</h1>
            <p>Track construction progress, account access, project risk, and contract schedules from one project command center.</p>
            <div class="metric-strip">
              <div class="metric"><strong>30</strong><span>Day free trial</span></div>
              <div class="metric"><strong>5</strong><span>Access areas</span></div>
              <div class="metric"><strong>2</strong><span>Gantt bars</span></div>
            </div>
          </div>
          <p class="auth-note">Direct signups become owner accounts. Invitation signups receive only the access assigned by the inviter.</p>
        </div>
        <div class="auth-panel">
          ${invite ? `<div class="invite-banner">Invitation detected for ${accessText(invite.access)}. Create an account to accept it.</div>` : ""}
          <div class="auth-tabs">
            <button class="tab-btn ${state.authTab === "signup" ? "active" : ""}" data-action="auth-tab" data-tab="signup">Create Account</button>
            <button class="tab-btn ${state.authTab === "login" ? "active" : ""}" data-action="auth-tab" data-tab="login">Log In</button>
          </div>
          ${state.authTab === "signup" ? renderSignupForm(invite) : renderLoginForm()}
        </div>
      </section>
    </main>
  `;
}

function renderSignupForm(invite) {
  return `
    <form class="form-stack" id="signup-form">
      <div class="field">
        <label for="signup-name">Full Name</label>
        <input id="signup-name" name="name" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="signup-email">Email</label>
        <input id="signup-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" autocomplete="new-password" required>
      </div>
      <label class="checkline">
        <input id="signup-gmail" name="gmail" type="checkbox">
        Link this account with Gmail
      </label>
      <button class="primary-btn" data-action="signup">Create Account</button>
      <p class="auth-note">
        ${invite ? `This invited account will receive: ${escapeHtml(accessText(invite.access))}.` : "This direct signup will become an owner account and receive all module access."}
        When the backend server is running, an email OTP is required before the account is created.
      </p>
      ${state.backendNotice ? `<p class="auth-note">${escapeHtml(state.backendNotice)}</p>` : ""}
    </form>
  `;
}

function renderLoginForm() {
  return `
    <form class="form-stack" id="login-form">
      <div class="field">
        <label for="login-email">Email</label>
        <input id="login-email" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="login-password">Password</label>
        <input id="login-password" name="password" type="password" autocomplete="current-password" required>
      </div>
      <button class="primary-btn" data-action="login">Log In</button>
      <p class="auth-note">Run the backend server for verified account storage. Browser-only login is kept as a prototype fallback.</p>
      ${state.backendNotice ? `<p class="auth-note">${escapeHtml(state.backendNotice)}</p>` : ""}
    </form>
  `;
}

function renderAppShell(account) {
  return `
    <main class="screen app-screen">
      <header class="topbar">
        <div class="brand-mark"><span class="brand-cube">O</span>Oversee</div>
        <input class="search" placeholder="Search project, type, status" aria-label="Search">
        <div class="user-pill">
          <span>${escapeHtml(account.name)}</span>
          <span class="avatar">${escapeHtml(initials(account.name))}</span>
          <button class="ghost-btn" data-action="logout">Log Out</button>
        </div>
      </header>
      <div class="app-layout">
        ${renderSideDock(account)}
        <section class="main-stage">
          ${state.currentView === "engineering" ? renderEngineeringView(account) : renderWelcome(account)}
        </section>
      </div>
    </main>
  `;
}

function renderWelcome(account) {
  const projects = getProjects();
  const delayed = projects.filter(isDelayedProject).length;
  const subscription = getSubscription();
  return `
    <section class="welcome-card">
      <span class="eyebrow">Project Command Center</span>
      <h1>Welcome, ${escapeHtml(account.name)}</h1>
      <p>Choose an area from the left container. Engineering View is ready with a Gantt chart, project list, project risk view, filters, and editable construction project information.</p>
      <div class="dashboard-grid">
        <div class="mini-card"><span class="eyebrow">Projects</span><div class="value">${projects.length}</div></div>
        <div class="mini-card"><span class="eyebrow">Delayed</span><div class="value">${delayed}</div></div>
        <div class="mini-card"><span class="eyebrow">Trial</span><div class="value">${trialDaysLeft(subscription)}</div><span class="hint">days left</span></div>
        <div class="mini-card"><span class="eyebrow">Role</span><div class="value">${account.role === "owner" ? "Owner" : "Member"}</div></div>
      </div>
    </section>
  `;
}

function renderSideDock(account) {
  return `
    <aside class="side-dock">
      <div class="dock-title">Account Controls</div>
      <div class="dock-actions">
        <button class="dock-btn" data-action="open-account">Account</button>
        ${ACCESS_KEYS.map((item) => `
          <button class="dock-btn" data-action="main-view" data-view="${item.key}" ${hasAccess(account, item.key) ? "" : "disabled"}>
            ${item.label}
          </button>
        `).join("")}
      </div>
    </aside>
  `;
}

function renderEngineeringView(account) {
  if (!hasAccess(account, "engineering")) {
    return `<section class="visual-container"><div class="placeholder">Engineering access is not assigned to this account.</div></section>`;
  }
  return `
    <section>
      <div class="toolbar-container" aria-label="Engineering toolbar">
        ${[
          ["gantt", "Gantt Chart"],
          ["project-list", "Project List"],
          ["swa", "SWA Chart"],
          ["estimate", "Estimate Calculator"],
          ["estimate-v2", "Estimate v2"],
          ["price-list", "Material Price List"],
          ["milestone", "Milestone"],
          ["dashboard", "Dashboard"],
          ["settings", "Settings"]
        ].map(([view, label]) => `
          <button class="toolbar-btn ${state.engineeringView === view ? "active" : ""}" data-action="engineering-tab" data-view="${view}">${label}</button>
        `).join("")}
      </div>
      <div class="visual-container">
        ${renderEngineeringVisual()}
      </div>
    </section>
  `;
}

function renderEngineeringVisual() {
  if (state.engineeringView === "gantt") return renderGanttView();
  if (state.engineeringView === "project-list") return renderProjectList();
  if (state.engineeringView === "swa") return renderSwaView();
  if (state.engineeringView === "estimate") return renderEstimateView();
  if (state.engineeringView === "estimate-v2") return renderEstimateV2View();
  if (state.engineeringView === "price-list") return renderMaterialPriceListView();
  if (state.engineeringView === "dashboard") return renderDashboardView();
  if (state.engineeringView === "settings") return renderSettingsView();
  const titles = {
    milestone: "Milestone"
  };
  return `<div class="placeholder">${titles[state.engineeringView]} will be built in the next module.</div>`;
}

function renderSettingsView() {
  const isDark = state.theme === "dark";
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Settings</h2>
      </div>
    </div>
    <div class="settings-grid">
      <section class="settings-panel">
        <div>
          <span class="eyebrow">Appearance</span>
          <h3>Theme Mode</h3>
        </div>
        <div class="theme-options" role="group" aria-label="Theme mode">
          <button class="theme-option ${isDark ? "active" : ""}" data-action="set-theme" data-theme="dark" aria-pressed="${isDark}">
            <span class="theme-preview dark-preview"></span>
            <span>
              <strong>Dark Mode</strong>
              <small>Default colors</small>
            </span>
          </button>
          <button class="theme-option ${!isDark ? "active" : ""}" data-action="set-theme" data-theme="light" aria-pressed="${!isDark}">
            <span class="theme-preview light-preview"></span>
            <span>
              <strong>Light Mode</strong>
              <small>Soft gradient</small>
            </span>
          </button>
        </div>
      </section>
    </div>
  `;
}

function renderGanttView() {
  const allProjects = filteredProjects();
  const yearProjects = allProjects.filter((project) => projectOverlapsYear(project, state.selectedYear));
  const projects = state.riskOnly ? yearProjects.filter(isDelayedProject) : yearProjects;
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Gantt Chart</h2>
        <div class="legend">
          <span><i class="legend-dot blue"></i>Not yet started</span>
          <span><i class="legend-dot orange"></i>On-going or on track</span>
          <span><i class="legend-dot red"></i>On-hold or delayed</span>
          <span><i class="legend-dot green"></i>Completed</span>
        </div>
      </div>
      <div class="gantt-head-tools">
        <label class="year-picker">
          <span>Year</span>
          <select data-action="gantt-year" aria-label="Gantt year">
            ${ganttYearOptions().map((year) => `<option value="${year}" ${year === state.selectedYear ? "selected" : ""}>${year}</option>`).join("")}
          </select>
        </label>
        <div class="hint">${ganttZoomLabel()}</div>
      </div>
    </div>
    <div class="gantt-toolbar">
      <button class="secondary-btn" data-action="open-add-project">Add</button>
      <button class="secondary-btn" data-action="show-risk">Show Risk</button>
      <button class="secondary-btn" data-action="open-filter">Filter View</button>
      <button class="secondary-btn" data-action="marks-off">Marks Off</button>
      <button class="secondary-btn" data-action="zoom-in">Zoom In</button>
      <button class="secondary-btn" data-action="zoom-out">Zoom Out All Months</button>
      <button class="ghost-btn" data-action="clear-filter">Clear Filter</button>
    </div>
    ${projects.length ? renderGantt(projects) : `<div class="placeholder">No projects match this view. Add a project or clear the filter.</div>`}
  `;
}

function renderProjectList() {
  const projects = filteredProjects();
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Project List</h2>
      </div>
      <button class="secondary-btn" data-action="open-add-project">Add Project</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actual %</th>
            <th>Planned % Today</th>
            <th>Start of Day 1</th>
            <th>Duration</th>
            <th>Contract Amount</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map((project) => `
            <tr>
              <td><button class="ghost-btn" data-action="edit-project" data-id="${project.id}">${escapeHtml(project.name)}</button></td>
              <td>${escapeHtml(project.type)}</td>
              <td><span class="badge ${statusClass(project.status)}">${escapeHtml(project.status)}</span></td>
              <td>${Number(project.actualPercent).toFixed(2)}%</td>
              <td>${plannedPercent(project).toFixed(2)}%</td>
              <td>${formatDate(project.startDate)}</td>
              <td>${project.durationDays} days</td>
              <td>${formatCurrency(project.contractAmount)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEstimateView() {
  const draft = getEstimateDraft();
  const rowsForView = [...draft.rows, blankEstimateRow()];
  const templates = getEstimateTemplates();
  const stores = materialStoreOptions();
  const selectedStore = stores.some((store) => sameStore(store, draft.selectedStore)) ? draft.selectedStore : "";
  const prices = getMaterialPrices()
    .filter((price) => price.description)
    .filter((price) => !selectedStore || sameStore(price.store, selectedStore));

  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Estimate Calculator</h2>
      </div>
      <div class="estimate-actions">
        <button class="secondary-btn" data-action="add-estimate-row">Add Material</button>
        <button class="primary-btn" data-action="save-estimate-template">Save as Template</button>
      </div>
    </div>
    <div class="estimate-title-bar">
      <label class="estimate-title-field">
        <span>Template Title</span>
        <input data-estimate-title value="${escapeAttribute(draft.title)}" placeholder="Road Concreting Estimate Template">
      </label>
      <label class="estimate-template-picker">
        <span>Use Template</span>
        <input data-template-picker list="estimate-template-options" placeholder="Search saved template">
      </label>
      <label class="estimate-store-filter">
        <span>Select Store</span>
        <select data-action="select-estimate-store" aria-label="Select estimate store">
          <option value="" ${selectedStore ? "" : "selected"}>All Stores</option>
          ${stores.map((store) => `<option value="${escapeAttribute(store)}" ${sameStore(store, selectedStore) ? "selected" : ""}>${escapeHtml(store)}</option>`).join("")}
        </select>
      </label>
      <div class="estimate-summary">
        <span>Total Estimate</span>
        <strong data-estimate-grand-total>${formatCurrency(estimateTotal(draft.rows))}</strong>
      </div>
    </div>
    <datalist id="material-price-options">
      ${prices.map((price) => `<option value="${escapeAttribute(materialPriceOptionLabel(price))}"></option>`).join("")}
    </datalist>
    <datalist id="estimate-template-options">
      ${templates.map((template) => `<option value="${escapeAttribute(estimateTemplateOptionLabel(template))}"></option>`).join("")}
    </datalist>
    <div class="table-wrap estimate-table-wrap">
      <table class="estimate-table">
        <thead>
          <tr>
            <th>Description of Materials</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Cost Per Unit</th>
            <th>Total Unit Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsForView.map((row) => renderEstimateRow(row)).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">Total Estimate</td>
            <td data-estimate-grand-total>${formatCurrency(estimateTotal(draft.rows))}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

function renderEstimateRow(row) {
  const total = estimateRowTotal(row);
  return `
    <tr data-estimate-row="${escapeAttribute(row.id)}" class="${row.isBlank ? "estimate-add-row" : ""}">
      <td>
        <input
          class="estimate-input description"
          data-estimate-input
          data-field="description"
          list="material-price-options"
          value="${escapeAttribute(row.description)}"
          placeholder="${row.isBlank ? "Search price list or add material" : ""}"
        >
      </td>
      <td>
        <input class="estimate-input" data-estimate-input data-field="unit" value="${escapeAttribute(row.unit)}" placeholder="unit">
      </td>
      <td>
        <input class="estimate-input" data-estimate-input data-field="quantity" type="number" min="0" step="0.01" value="${numberInputValue(row.quantity)}" placeholder="0">
      </td>
      <td>
        <input class="estimate-input" data-estimate-input data-field="costPerUnit" type="number" min="0" step="0.01" value="${numberInputValue(row.costPerUnit)}" placeholder="0.00">
      </td>
      <td class="estimate-total-cell" data-estimate-total>${formatCurrency(total)}</td>
      <td>
        <button class="ghost-btn danger compact-btn" data-action="delete-estimate-row" data-id="${escapeAttribute(row.id)}" ${row.isBlank ? "disabled" : ""}>Delete</button>
      </td>
    </tr>
  `;
}

function renderEstimateV2View() {
  const draft = getEstimateV2Draft();
  const materials = draft.materials || [];
  const totalMentions = materials.reduce((total, material) => total + (Number(material.mentions) || 0), 0);
  const planType = PLAN_TYPES.includes(draft.planType) ? draft.planType : PLAN_TYPES[0];
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Estimate v2</h2>
      </div>
      <div class="estimate-actions">
        <button class="primary-btn" data-action="extract-estimate-v2-pdf">Extract PDF</button>
        <button class="ghost-btn danger" data-action="clear-estimate-v2">Clear</button>
      </div>
    </div>
    <div class="estimate-v2-grid">
      <section class="estimate-v2-upload-panel">
        <label class="estimate-v2-field">
          <span>Plan Type</span>
          <select data-action="estimate-v2-plan-type" aria-label="Plan type">
            ${PLAN_TYPES.map((type) => `<option value="${escapeAttribute(type)}" ${type === planType ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-upload">
          <span>PDF Upload</span>
          <input type="file" accept="application/pdf,.pdf" data-estimate-v2-file>
        </label>
      </section>
      <section class="estimate-v2-summary-panel">
        ${renderEstimateV2Metric("Detected Materials", materials.length)}
        ${renderEstimateV2Metric("Material Mentions", totalMentions)}
        ${renderEstimateV2Metric("Text Lines", draft.lineCount || 0)}
        ${renderEstimateV2Metric("PDF Pages", draft.pageCount || 0)}
      </section>
    </div>
    <div class="estimate-v2-file-card">
      <div>
        <span class="eyebrow">Current PDF</span>
        <strong>${draft.fileName ? escapeHtml(draft.fileName) : "No PDF extracted yet"}</strong>
      </div>
      <div>
        <span class="eyebrow">Last Extracted</span>
        <strong>${draft.extractedAt ? formatDateTime(draft.extractedAt) : "-"}</strong>
      </div>
    </div>
    ${materials.length ? renderEstimateV2Materials(materials) : `
      <div class="placeholder">Upload a selectable-text PDF to detect material names from the plan notes and schedules.</div>
    `}
    ${draft.textPreview ? `
      <section class="estimate-v2-text-panel">
        <div class="visual-head compact-head">
          <div>
            <span class="eyebrow">Readable Data</span>
            <h3>PDF Text Preview</h3>
          </div>
        </div>
        <pre>${escapeHtml(draft.textPreview)}</pre>
      </section>
    ` : ""}
  `;
}

function renderEstimateV2Metric(label, value) {
  return `
    <div class="estimate-v2-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${formatInteger(value)}</strong>
    </div>
  `;
}

function renderEstimateV2Materials(materials) {
  return `
    <div class="table-wrap estimate-v2-table-wrap">
      <table class="estimate-v2-table">
        <thead>
          <tr>
            <th>Description of Materials</th>
            <th>Plan Group</th>
            <th>Mentions</th>
            <th>Sample Readable Lines</th>
          </tr>
        </thead>
        <tbody>
          ${materials.map((material) => `
            <tr>
              <td>
                <strong>${escapeHtml(material.description)}</strong>
                <small>${(material.matchedTerms || []).map(escapeHtml).join(", ")}</small>
              </td>
              <td>${escapeHtml(material.category || "General")}</td>
              <td>${formatInteger(material.mentions)}</td>
              <td>${(material.sampleLines || []).map((line) => `<div>${escapeHtml(line)}</div>`).join("") || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMaterialPriceListView() {
  const prices = getMaterialPrices();
  const stores = materialStoreOptions();
  const selectedStore = selectedPriceStore(stores);
  const rowsForView = [
    ...prices.filter((price) => sameStore(price.store, selectedStore)),
    blankPriceRow(selectedStore)
  ];
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Material Price List</h2>
      </div>
      <div class="estimate-actions">
        <button class="secondary-btn" data-action="duplicate-price-store">Duplicate</button>
        <button class="primary-btn" data-action="save-price-list">Save Price List</button>
      </div>
    </div>
    <div class="price-store-bar">
      <label class="price-store-field">
        <span>Store Name</span>
        <input data-price-store-name value="${escapeAttribute(selectedStore)}" placeholder="Store name for these materials">
      </label>
      <label class="price-store-picker">
        <span>Saved Store</span>
        <select data-action="select-price-store" aria-label="Select price list store">
          ${selectedStore ? "" : `<option value="" selected disabled>Store needs a name</option>`}
          ${stores.map((store) => `<option value="${escapeAttribute(store)}" ${sameStore(store, selectedStore) ? "selected" : ""}>${escapeHtml(store)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="table-wrap price-list-table-wrap">
      <table class="price-list-table">
        <thead>
          <tr>
            <th>Description of Materials</th>
            <th>Unit</th>
            <th>Cost Per Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsForView.map((row) => renderPriceRow(row)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPriceRow(row) {
  return `
    <tr data-price-row="${escapeAttribute(row.id)}" class="${row.isBlank ? "estimate-add-row" : ""}">
      <td><input class="price-input description" data-price-input data-field="description" value="${escapeAttribute(row.description)}" placeholder="Material description"></td>
      <td><input class="price-input" data-price-input data-field="unit" value="${escapeAttribute(row.unit)}" placeholder="unit"></td>
      <td><input class="price-input" data-price-input data-field="costPerUnit" type="number" min="0" step="0.01" value="${numberInputValue(row.costPerUnit)}" placeholder="0.00"></td>
      <td>
        <button class="ghost-btn danger compact-btn" data-action="delete-price-row" data-id="${escapeAttribute(row.id)}" ${row.isBlank ? "disabled" : ""}>Delete</button>
      </td>
    </tr>
  `;
}

function renderDashboardView() {
  const allProjects = getProjects();
  const projects = dashboardFilteredProjects();
  const swa = getSwaState();
  const sheets = dashboardFilteredSheets(swa.sheets, projects);
  const atRisk = projects.filter(isDelayedProject);
  const statusCounts = dashboardStatusCounts(projects);
  const billingRows = dashboardBillingRows(projects, sheets);
  const totalContract = projects.reduce((total, project) => total + (Number(project.contractAmount) || 0), 0);
  const totalBilled = sheets.reduce((total, sheet) => total + dashboardSheetThisPeriodTotal(sheet), 0);
  const plannedAverage = average(projects.map((project) => plannedPercent(project)));
  const actualAverage = average(projects.map((project) => Number(project.actualPercent) || 0));
  const scheduleGap = actualAverage - plannedAverage;

  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Dashboard</h2>
      </div>
      <div class="dashboard-filters">
        <label class="dashboard-filter">
          <span>Project</span>
          <select data-action="dashboard-project-filter" aria-label="Dashboard project filter">
            <option value="all" ${state.dashboardFilter.projectId === "all" ? "selected" : ""}>All projects</option>
            ${allProjects.map((project) => `
              <option value="${project.id}" ${state.dashboardFilter.projectId === project.id ? "selected" : ""}>${escapeHtml(project.name)}</option>
            `).join("")}
          </select>
        </label>
        <label class="dashboard-filter">
          <span>Year</span>
          <select data-action="dashboard-year-filter" aria-label="Dashboard year filter">
            <option value="all" ${state.dashboardFilter.year === "all" ? "selected" : ""}>All years</option>
            ${dashboardYearOptions().map((year) => `
              <option value="${year}" ${String(state.dashboardFilter.year) === String(year) ? "selected" : ""}>${year}</option>
            `).join("")}
          </select>
        </label>
      </div>
    </div>
    <div class="dashboard-kpi-grid">
      <div class="dashboard-kpi"><span>Projects</span><strong>${projects.length}</strong></div>
      <div class="dashboard-kpi risk"><span>At Risk</span><strong>${atRisk.length}</strong></div>
      <div class="dashboard-kpi"><span>Progress Billings</span><strong>${sheets.length}</strong></div>
      <div class="dashboard-kpi"><span>Contract Amount</span><strong class="money-value" title="${escapeAttribute(formatCurrency(totalContract))}">${formatCurrencyCompact(totalContract)}</strong></div>
      <div class="dashboard-kpi"><span>Billed Amount</span><strong class="money-value" title="${escapeAttribute(formatCurrency(totalBilled))}">${formatCurrencyCompact(totalBilled)}</strong></div>
      <div class="dashboard-kpi ${scheduleGap < 0 ? "risk" : "good"}"><span>Average Gap</span><strong>${scheduleGap >= 0 ? "+" : ""}${scheduleGap.toFixed(2)}%</strong></div>
    </div>
    <div class="dashboard-layout">
      <section class="dashboard-panel">
        <div class="dashboard-panel-head">
          <div>
            <span class="eyebrow">Status</span>
            <h3>Project Status</h3>
          </div>
          <strong>${projects.length}</strong>
        </div>
        <div class="status-chart-wrap">
          <div class="status-pie" style="--pie:${dashboardPieGradient(statusCounts, projects.length)}">
            <span>${projects.length}</span>
          </div>
          <div class="pie-legend">
            ${statusCounts.map((item) => `
              <div><i class="legend-dot ${statusClass(item.status)}"></i><span>${escapeHtml(item.status)}</span><strong>${item.count}</strong></div>
            `).join("")}
          </div>
        </div>
      </section>
      <section class="dashboard-panel">
        <div class="dashboard-panel-head">
          <div>
            <span class="eyebrow">Risk</span>
            <h3>Projects At Risk</h3>
          </div>
          <strong>${atRisk.length}</strong>
        </div>
        <div class="risk-list">
          ${atRisk.length ? atRisk.map((project) => renderDashboardRiskItem(project, sheets)).join("") : `<div class="dashboard-empty">No projects at risk.</div>`}
        </div>
      </section>
    </div>
    <section class="dashboard-panel dashboard-wide">
      <div class="dashboard-panel-head">
        <div>
          <span class="eyebrow">Billing</span>
          <h3>Progress Billing Count</h3>
        </div>
        <strong>${sheets.length}</strong>
      </div>
      <div class="table-wrap dashboard-table-wrap">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Type</th>
              <th>Status</th>
              <th>Billings</th>
              <th>Latest Billing</th>
              <th>Billed Amount</th>
              <th>Contract Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billingRows.length ? billingRows.map((row) => `
              <tr>
                <td><button class="ghost-btn dashboard-project-link" data-action="edit-project" data-id="${row.project.id}">${escapeHtml(row.project.name)}</button></td>
                <td>${escapeHtml(row.project.type)}</td>
                <td><span class="badge ${statusClass(row.project.status)}">${escapeHtml(row.project.status)}</span></td>
                <td><span class="billing-pill">${row.count}</span></td>
                <td>${row.latest ? formatDate(row.latest.createdAt) : "-"}</td>
                <td>${formatCurrency(row.billedAmount)}</td>
                <td>${formatCurrency(row.project.contractAmount)}</td>
              </tr>
            `).join("") : `<tr><td colspan="7">No projects match this dashboard filter.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDashboardRiskItem(project, sheets) {
  const planned = plannedPercent(project);
  const actual = Number(project.actualPercent) || 0;
  const gap = Math.max(0, planned - actual);
  const billingCount = sheets.filter((sheet) => sameSwaProject(sheet.projectId, project.id)).length;
  return `
    <div class="risk-item">
      <button class="risk-project-name" data-action="edit-project" data-id="${project.id}">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.type)} | Planned ${planned.toFixed(2)}% | Actual ${actual.toFixed(2)}%</span>
      </button>
      <div class="risk-meta">
        <span class="badge red">Behind ${gap.toFixed(2)}%</span>
        <span class="billing-pill">${billingCount} billing${billingCount === 1 ? "" : "s"}</span>
      </div>
    </div>
  `;
}

function renderSwaView() {
  const swa = getSwaState();
  const projects = getProjects();
  const selectedDraftProjectId = swa.selectedProjectId || "";
  let projectSheets = swa.sheets.filter((sheet) => sameSwaProject(sheet.projectId, selectedDraftProjectId));
  const activeSheet = state.activeSwaSheetId === "draft"
    ? null
    : projectSheets.find((sheet) => sheet.id === state.activeSwaSheetId) || null;
  if (state.activeSwaSheetId !== "draft" && !activeSheet) {
    state.activeSwaSheetId = "draft";
  }
  const rows = activeSheet ? activeSheet.rows : swa.draftRows;
  const editable = !activeSheet;
  const rowsForView = editable ? [...rows, blankSwaRow()] : rows;
  const originalTotal = swaOriginalTotal(rows);
  const selectedProjectId = activeSheet ? activeSheet.projectId : swa.selectedProjectId;
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;
  projectSheets = activeSheet
    ? swa.sheets.filter((sheet) => sameSwaProject(sheet.projectId, activeSheet.projectId))
    : projectSheets;

  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Statement of Work Accomplished</h2>
        <p class="hint">${activeSheet ? `Viewing ${escapeHtml(activeSheet.name)} saved ${formatDate(activeSheet.createdAt)}.` : "Update the SWA before saving it as a progress billing sheet."}</p>
      </div>
      <div class="swa-actions">
        <button class="primary-btn" data-action="save-swa" ${editable && swa.updated ? "" : "disabled"}>Save SWA</button>
        <button class="secondary-btn" data-action="update-swa" ${editable ? "" : "disabled"}>Update SWA</button>
      </div>
    </div>
    <div class="swa-project-bar">
      <label class="swa-project-picker">
        <span>Project</span>
        <select data-action="select-swa-project" ${editable ? "" : "disabled"}>
          <option value="">Select project</option>
          ${projects.map((project) => `
            <option value="${project.id}" ${project.id === selectedProjectId ? "selected" : ""}>${escapeHtml(project.name)}</option>
          `).join("")}
        </select>
      </label>
      <div class="swa-project-type">
        <span>Project Type</span>
        <strong>${selectedProject ? escapeHtml(selectedProject.type) : "Not selected"}</strong>
      </div>
    </div>
    <div class="table-wrap swa-table-wrap">
      <table class="swa-table">
        <thead>
          <tr>
            <th rowspan="2">Description</th>
            <th colspan="5">Original Contract</th>
            <th colspan="3">Previous Billing</th>
            <th colspan="3">For This Payment Period</th>
            <th colspan="3">As To Date</th>
            <th rowspan="2">Cost Balance</th>
          </tr>
          <tr>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
            <th>%</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>%</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>%</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          ${rowsForView.map((row) => renderSwaRow(row, originalTotal, editable)).join("")}
        </tbody>
        <tfoot>
          ${renderSwaTotals(rows, originalTotal)}
        </tfoot>
      </table>
    </div>
    <div class="swa-sheet-tabs" aria-label="Saved SWA sheets">
      <button class="sheet-tab ${state.activeSwaSheetId === "draft" ? "active" : ""}" data-action="select-swa-sheet" data-id="draft">Current SWA</button>
      ${projectSheets.map((sheet) => `
        <span class="sheet-tab-group ${state.activeSwaSheetId === sheet.id ? "active" : ""}">
          <button class="sheet-tab" data-action="select-swa-sheet" data-id="${sheet.id}">
            ${escapeHtml(sheet.name)}
          </button>
          <button class="sheet-delete" data-action="delete-swa-sheet" data-id="${sheet.id}" aria-label="Delete ${escapeAttribute(sheet.name)}">Delete</button>
        </span>
      `).join("")}
    </div>
  `;
}

function renderSwaRow(row, originalTotal, editable) {
  const computed = computeSwaRow(row, originalTotal);
  const isBlank = row.isBlank;
  return `
    <tr data-swa-row="${escapeAttribute(row.id)}" class="${isBlank ? "swa-add-row" : ""}">
      <td>${renderSwaInput(row, "description", "text", isBlank ? "Add description" : "", editable)}</td>
      <td>${renderSwaInput(row, "originalQty", "number", "0", editable)}</td>
      <td>${renderSwaInput(row, "unit", "text", "unit", editable)}</td>
      <td>${renderSwaInput(row, "unitCost", "number", "0.00", editable)}</td>
      <td>${formatCurrency(computed.originalTotal)}</td>
      <td>${formatPercent(computed.originalPercent)}</td>
      <td>${formatSwaNumber(computed.previousQty)}</td>
      <td>${formatCurrency(computed.previousTotal)}</td>
      <td>${formatPercent(computed.previousPercent)}</td>
      <td>${renderSwaInput(row, "thisQty", "number", "0", editable)}</td>
      <td>${formatCurrency(computed.thisTotal)}</td>
      <td>${formatPercent(computed.thisPercent)}</td>
      <td>${formatSwaNumber(computed.asToDateQty)}</td>
      <td>${formatCurrency(computed.asToDateTotal)}</td>
      <td>${formatPercent(computed.asToDatePercent)}</td>
      <td>${formatCurrency(computed.costBalance)}</td>
    </tr>
  `;
}

function renderSwaInput(row, field, type, placeholder, editable) {
  const value = row[field] ?? "";
  const inputValue = type === "number" ? numberInputValue(value) : escapeAttribute(value);
  return `
    <input
      class="swa-input ${field === "description" ? "description" : ""}"
      data-swa-input
      data-field="${field}"
      ${type === "number" ? `type="number" step="0.01" min="0"` : `type="text"`}
      value="${inputValue}"
      placeholder="${escapeAttribute(placeholder)}"
      ${editable ? "" : "disabled"}
    >
  `;
}

function renderSwaTotals(rows, originalTotal) {
  const totals = rows.reduce((acc, row) => {
    const computed = computeSwaRow(row, originalTotal);
    acc.original += computed.originalTotal;
    acc.previous += computed.previousTotal;
    acc.thisPeriod += computed.thisTotal;
    acc.asToDate += computed.asToDateTotal;
    acc.balance += computed.costBalance;
    return acc;
  }, { original: 0, previous: 0, thisPeriod: 0, asToDate: 0, balance: 0 });

  return `
    <tr>
      <td>Total Amount</td>
      <td colspan="3"></td>
      <td>${formatCurrency(totals.original)}</td>
      <td>${formatPercent(originalTotal ? 1 : 0)}</td>
      <td></td>
      <td>${formatCurrency(totals.previous)}</td>
      <td>${formatPercent(safeDivide(totals.previous, originalTotal))}</td>
      <td></td>
      <td>${formatCurrency(totals.thisPeriod)}</td>
      <td>${formatPercent(safeDivide(totals.thisPeriod, originalTotal))}</td>
      <td></td>
      <td>${formatCurrency(totals.asToDate)}</td>
      <td>${formatPercent(safeDivide(totals.asToDate, originalTotal))}</td>
      <td>${formatCurrency(totals.balance)}</td>
    </tr>
  `;
}

function renderGantt(projects) {
  const timeline = getTimeline(projects);
  const width = timeline.columns.length * timeline.colWidth;
  return `
    <div class="gantt-shell zoom-${state.ganttZoom}" style="--cols:${timeline.columns.length}; --col-width:${timeline.colWidth}px; --timeline-width:${width}px">
      <div class="gantt-header-wrap">
        <div class="gantt-left-head">Projects</div>
        <div>
          <div class="gantt-months">
            ${timeline.months.map((month) => `
              <div class="month-cell" style="grid-column:${month.start} / span ${month.span}">${month.label}</div>
            `).join("")}
          </div>
          <div class="gantt-weeks">
            ${timeline.columns.map((column) => `<div class="week-cell">${column.label}</div>`).join("")}
          </div>
        </div>
      </div>
      ${projects.map((project) => renderGanttRow(project, timeline)).join("")}
    </div>
  `;
}

function renderGanttRow(project, timeline) {
  const placement = projectPlacement(project, timeline);
  const plannedLabel = clamp(plannedPercent(project), 0, 100);
  const plannedValue = visibleProgressPercent(project, placement, plannedLabel);
  const todayOffset = plannedProgressOffset(timeline, placement, plannedValue);
  const actualLabel = clamp(Number(project.actualPercent), 0, 100);
  const actualValue = visibleProgressPercent(project, placement, actualLabel);
  const actualColor = actualColorClass(project);
  const plannedColor = statusClass(project.status);
  return `
    <div class="gantt-row">
      <button class="project-name-btn" data-action="edit-project" data-id="${project.id}">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.type)} | Planned ${plannedLabel.toFixed(2)}% | Actual ${Number(project.actualPercent).toFixed(2)}%</span>
      </button>
      <div class="bar-grid">
        ${todayOffset !== null ? `<div class="today-line" style="left:${todayOffset}px"><span>Today</span></div>` : ""}
        <div class="track planned"></div>
        <div class="track actual"></div>
        <div
          class="bar planned ${plannedColor} ${plannedValue >= 99.5 ? "complete" : ""}"
          style="grid-column:${placement.start} / span ${placement.plannedSpan}; --progress:${plannedValue}%"
          aria-label="Planned progress ${plannedLabel.toFixed(0)} percent"
        >
          <span class="bar-percent">${plannedLabel.toFixed(0)}%</span>
          <span class="bar-meter"><span class="bar-fill"></span></span>
        </div>
        <div
          class="bar actual ${actualColor} ${actualValue >= 99.5 ? "complete" : ""}"
          style="grid-column:${placement.start} / span ${placement.plannedSpan}; --progress:${actualValue}%"
          aria-label="Actual progress ${actualLabel.toFixed(0)} percent"
        >
          <span class="bar-percent">${actualLabel.toFixed(0)}%</span>
          <span class="bar-meter"><span class="bar-fill"></span></span>
        </div>
      </div>
    </div>
  `;
}

function openMainView(view) {
  if (view === "engineering") {
    state.currentView = "engineering";
    state.engineeringView = "gantt";
    render();
    return;
  }
  state.currentView = "welcome";
  render();
  toast(`${labelForAccess(view)} is reserved for the next build.`);
}

async function handleSignup() {
  const form = document.getElementById("signup-form");
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const email = String(formData.get("email")).trim().toLowerCase();
  const payload = {
    name: String(formData.get("name")).trim(),
    email,
    password: String(formData.get("password")),
    gmailLinked: formData.get("gmail") === "on",
    inviteToken: state.inviteToken
  };

  try {
    const response = await apiRequest("/auth/signup/request-otp", payload);
    state.backendNotice = response.message || "OTP sent to email.";
    state.pendingSignupEmail = email;
    openOtpModal(email, response.delivery);
    return;
  } catch (error) {
    if (error.fromBackend) {
      state.backendNotice = error.message;
      toast(error.message);
      render();
      return;
    }
    if (!canUsePrototypeFallback()) {
      state.backendNotice = "Signup is temporarily unavailable. Please try again in a moment.";
      toast(state.backendNotice);
      render();
      return;
    }
    state.backendNotice = "Backend unavailable, so this account was created in browser-only prototype mode.";
    console.warn(error);
  }

  createLocalAccount(formData);
}

function createLocalAccount(formData) {
  const accounts = getAccounts();
  const email = String(formData.get("email")).trim().toLowerCase();
  if (accounts.some((account) => account.email === email)) {
    toast("An account already exists with that email.");
    return;
  }

  const invite = getInviteByToken(state.inviteToken);
  const isInvitedAccount = Boolean(invite);
  const access = isInvitedAccount ? invite.access : allAccess();

  const account = {
    id: cryptoId(),
    name: String(formData.get("name")).trim(),
    email,
    password: String(formData.get("password")),
    gmailLinked: formData.get("gmail") === "on",
    role: isInvitedAccount ? "member" : "owner",
    access,
    invitedBy: invite ? invite.createdBy : null,
    createdAt: new Date().toISOString()
  };

  accounts.push(account);
  saveAccounts(accounts);
  ensureSubscription();
  localStorage.setItem(STORAGE.session, JSON.stringify({ accountId: account.id }));

  if (invite) {
    const invites = getInvites().map((item) => item.token === invite.token ? { ...item, acceptedBy: account.id, acceptedAt: new Date().toISOString() } : item);
    saveInvites(invites);
    state.inviteToken = null;
    window.history.replaceState(null, "", window.location.pathname);
  }

  state.currentView = "welcome";
  render();
}

async function verifySignupOtp() {
  const form = document.getElementById("otp-form");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const email = String(formData.get("email")).trim().toLowerCase();
  const otp = String(formData.get("otp")).trim();

  try {
    const response = await apiRequest("/auth/signup/verify", { email, otp });
    savePublicAccount(response.account);
    localStorage.setItem(STORAGE.session, JSON.stringify({ accountId: response.account.id, token: response.session.token }));
    state.pendingSignupEmail = null;
    state.backendNotice = "";
    state.currentView = "welcome";
    closeModal();
    render();
    toast("Email verified. Account created.");
  } catch (error) {
    toast(error.message || "OTP verification failed.");
  }
}

function openOtpModal(email, delivery) {
  const devHint = delivery && delivery.mode === "dev-outbox"
    ? `<p class="auth-note">Email sending is not configured yet. For local testing, read the OTP from <code>backend/data/email-outbox.jsonl</code>. Configure Gmail SMTP to send it by email.</p>`
    : `<p class="auth-note">Enter the verification code sent to your email.</p>`;
  openModal(`
    <div class="modal">
      <div class="modal-head">
        <h3>Email Verification</h3>
        <button class="ghost-btn" data-action="close-modal">Close</button>
      </div>
      <div class="modal-body">
        <form id="otp-form" class="form-stack">
          <input type="hidden" name="email" value="${escapeAttribute(email)}">
          <div class="field">
            <label for="signup-otp">OTP Code</label>
            <input id="signup-otp" name="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required>
          </div>
          ${devHint}
        </form>
      </div>
      <div class="modal-foot">
        <button class="ghost-btn" data-action="close-modal">Cancel</button>
        <button class="primary-btn" data-action="verify-otp">Verify OTP</button>
      </div>
    </div>
  `);
}

async function handleLogin() {
  const form = document.getElementById("login-form");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));

  try {
    const response = await apiRequest("/auth/login", { email, password });
    savePublicAccount(response.account);
    localStorage.setItem(STORAGE.session, JSON.stringify({ accountId: response.account.id, token: response.session.token }));
    state.backendNotice = "";
    state.currentView = "welcome";
    render();
    return;
  } catch (error) {
    if (error.fromBackend) {
      state.backendNotice = error.message;
      toast(error.message);
      render();
      return;
    }
    if (!canUsePrototypeFallback()) {
      state.backendNotice = "Login is temporarily unavailable. Please try again in a moment.";
      toast(state.backendNotice);
      render();
      return;
    }
    state.backendNotice = "Backend login unavailable, trying browser-only prototype data.";
    console.warn(error);
  }

  const account = getAccounts().find((item) => item.email === email && item.password === password);
  if (!account) {
    toast("Email or password is incorrect.");
    return;
  }
  localStorage.setItem(STORAGE.session, JSON.stringify({ accountId: account.id }));
  state.currentView = "welcome";
  render();
}

function openProjectModal(projectId = null) {
  const project = projectId ? getProjects().find((item) => item.id === projectId) : null;
  const title = project ? "Project Information" : "Add Project";
  openModal(`
    <div class="modal">
      <div class="modal-head">
        <h3>${title}</h3>
        <button class="ghost-btn" data-action="close-modal">Close</button>
      </div>
      <div class="modal-body">
        <form id="project-form" class="form-grid">
          <input type="hidden" name="id" value="${project ? project.id : ""}">
          <div class="field">
            <label for="project-name">Project Name</label>
            <input id="project-name" name="name" value="${project ? escapeAttribute(project.name) : ""}" required>
          </div>
          <div class="field">
            <label for="project-type">Type of Project</label>
            <input id="project-type" name="type" list="project-types" value="${project ? escapeAttribute(project.type) : ""}" required>
            <datalist id="project-types">
              ${uniqueProjectTypes().map((type) => `<option value="${escapeAttribute(type)}"></option>`).join("")}
            </datalist>
          </div>
          <div class="field">
            <label for="project-status">Status</label>
            <select id="project-status" name="status">
              ${STATUS_OPTIONS.map((status) => `<option ${project && project.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="project-actual">Actual Percentage Completed</label>
            <input id="project-actual" name="actualPercent" type="number" min="0" max="100" step="0.01" value="${project ? project.actualPercent : 0}" required>
          </div>
          <div class="field">
            <label for="project-start">Start of Day 1</label>
            <input id="project-start" name="startDate" type="date" value="${project ? project.startDate : todayInputValue()}" required>
          </div>
          <div class="field">
            <label for="project-duration">Contract Duration (in days)</label>
            <input id="project-duration" name="durationDays" type="number" min="1" step="1" value="${project ? project.durationDays : 30}" required>
          </div>
          <div class="field full">
            <label for="project-amount">Contract Amount</label>
            <input id="project-amount" name="contractAmount" type="number" min="0" step="0.01" value="${project ? project.contractAmount : 0}" required>
          </div>
        </form>
      </div>
      <div class="modal-foot">
        ${project ? `<button class="ghost-btn" data-action="delete-project" data-id="${project.id}">Delete</button>` : ""}
        <button class="primary-btn" data-action="save-project">Save Project</button>
      </div>
    </div>
  `);
}

function saveProject() {
  const form = document.getElementById("project-form");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const id = String(formData.get("id")) || cryptoId();
  const project = {
    id,
    name: String(formData.get("name")).trim(),
    type: String(formData.get("type")).trim(),
    status: String(formData.get("status")),
    actualPercent: clamp(Number(formData.get("actualPercent")), 0, 100),
    startDate: String(formData.get("startDate")),
    durationDays: Math.max(1, Number(formData.get("durationDays")) || 1),
    contractAmount: Math.max(0, Number(formData.get("contractAmount")) || 0),
    updatedAt: new Date().toISOString()
  };

  const projects = getProjects();
  const index = projects.findIndex((item) => item.id === id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
  closeModal();
  render();
  toast("Project saved.");
}

function deleteProject(id) {
  saveProjects(getProjects().filter((project) => project.id !== id));
  closeModal();
  render();
  toast("Project deleted.");
}

function openFilterModal() {
  openModal(`
    <div class="modal">
      <div class="modal-head">
        <h3>Filter View</h3>
        <button class="ghost-btn" data-action="close-modal">Close</button>
      </div>
      <div class="modal-body">
        <form id="filter-form" class="form-grid">
          <div class="field">
            <label for="filter-name">Project Name</label>
            <input id="filter-name" name="name" value="${escapeAttribute(state.filter.name)}">
          </div>
          <div class="field">
            <label for="filter-type">Project Type</label>
            <input id="filter-type" name="type" list="project-types-filter" value="${escapeAttribute(state.filter.type)}">
            <datalist id="project-types-filter">
              ${uniqueProjectTypes().map((type) => `<option value="${escapeAttribute(type)}"></option>`).join("")}
            </datalist>
          </div>
        </form>
      </div>
      <div class="modal-foot">
        <button class="ghost-btn" data-action="clear-filter">Clear</button>
        <button class="primary-btn" data-action="save-filter">Apply Filter</button>
      </div>
    </div>
  `);
}

function saveFilter() {
  const form = document.getElementById("filter-form");
  const formData = new FormData(form);
  state.filter = {
    name: String(formData.get("name")).trim(),
    type: String(formData.get("type")).trim()
  };
  state.riskOnly = false;
  closeModal();
  render();
}

function markSwaDraftDirty() {
  if (state.engineeringView !== "swa" || state.activeSwaSheetId !== "draft") return;
  const swa = getSwaState();
  if (!swa.updated) return;
  swa.updated = false;
  saveSwaState(swa);
  const saveButton = document.querySelector('[data-action="save-swa"]');
  if (saveButton) saveButton.disabled = true;
}

function updateSwaProject(projectId) {
  if (state.activeSwaSheetId !== "draft") return;
  const swa = getSwaState();
  const currentKey = swaProjectKey(swa.selectedProjectId);
  const nextKey = swaProjectKey(projectId);
  const currentRows = collectSwaRowsFromDom(swa.draftRows);
  swa.draftsByProject = {
    ...swa.draftsByProject,
    [currentKey]: currentRows
  };
  swa.selectedProjectId = projectId;
  swa.draftRows = Array.isArray(swa.draftsByProject[nextKey]) ? swa.draftsByProject[nextKey] : [];
  swa.updated = false;
  saveSwaState(swa);
  render();
}

function updateSwa() {
  if (state.activeSwaSheetId !== "draft") return;
  const swa = getSwaState();
  const rows = collectSwaRowsFromDom(swa.draftRows);
  if (!rows.length) {
    toast("Add at least one SWA description.");
    return;
  }
  swa.draftRows = rows;
  swa.draftsByProject = {
    ...swa.draftsByProject,
    [swaProjectKey(swa.selectedProjectId)]: rows
  };
  swa.updated = true;
  saveSwaState(swa);
  render();
  toast("SWA updated.");
}

function saveSwa() {
  if (state.activeSwaSheetId !== "draft") return;
  const swa = getSwaState();
  if (!swa.updated) {
    toast("Update the SWA before saving.");
    return;
  }

  const originalTotal = swaOriginalTotal(swa.draftRows);
  const snapshotRows = swa.draftRows.map((row) => ({ ...row }));
  const projectId = swa.selectedProjectId || "";
  const sheetNumber = swa.sheets.filter((sheet) => sameSwaProject(sheet.projectId, projectId)).length + 1;
  const sheet = {
    id: cryptoId(),
    name: `Progress Billing No.${sheetNumber}`,
    projectId,
    rows: snapshotRows,
    originalTotal,
    createdAt: new Date().toISOString()
  };

  swa.sheets.push(sheet);
  swa.draftRows = swa.draftRows.map((row) => {
    const computed = computeSwaRow(row, originalTotal);
    return {
      ...row,
      previousQty: computed.asToDateQty,
      thisQty: 0
    };
  });
  swa.draftsByProject = {
    ...swa.draftsByProject,
    [swaProjectKey(swa.selectedProjectId)]: swa.draftRows
  };
  swa.updated = false;
  saveSwaState(swa);
  state.activeSwaSheetId = sheet.id;
  render();
  toast(`${sheet.name} saved.`);
}

function deleteSwaSheet(sheetId) {
  if (!sheetId || sheetId === "draft") return;
  const swa = getSwaState();
  const sheet = swa.sheets.find((item) => item.id === sheetId);
  if (!sheet) return;
  swa.sheets = swa.sheets.filter((item) => item.id !== sheetId);
  saveSwaState(swa);
  if (state.activeSwaSheetId === sheetId) state.activeSwaSheetId = "draft";
  render();
  toast(`${sheet.name} deleted.`);
}

function collectSwaRowsFromDom(existingRows) {
  return [...document.querySelectorAll("[data-swa-row]")].map((rowNode) => {
    const rowId = rowNode.dataset.swaRow || cryptoId();
    const previous = existingRows.find((row) => row.id === rowId) || {};
    const row = {
      id: rowId,
      description: getSwaInputValue(rowNode, "description"),
      originalQty: getSwaInputNumber(rowNode, "originalQty"),
      unit: getSwaInputValue(rowNode, "unit"),
      unitCost: getSwaInputNumber(rowNode, "unitCost"),
      previousQty: Number(previous.previousQty) || 0,
      thisQty: getSwaInputNumber(rowNode, "thisQty")
    };
    return row;
  }).filter((row) => {
    return row.description || row.unit || row.originalQty || row.unitCost || row.previousQty || row.thisQty;
  });
}

function getSwaInputValue(rowNode, field) {
  const input = rowNode.querySelector(`[data-field="${field}"]`);
  return input ? String(input.value || "").trim() : "";
}

function getSwaInputNumber(rowNode, field) {
  const input = rowNode.querySelector(`[data-field="${field}"]`);
  return input ? Math.max(0, Number(input.value) || 0) : 0;
}

function handleEstimateInput(input) {
  const rowNode = input.closest("[data-estimate-row]");
  if (rowNode && input.dataset.field === "description") {
    const selectedPrice = findMaterialPriceByOption(input.value, estimateSelectedStoreFromDom());
    if (selectedPrice) {
      input.value = selectedPrice.description;
      const unitInput = rowNode.querySelector('[data-field="unit"]');
      const costInput = rowNode.querySelector('[data-field="costPerUnit"]');
      if (unitInput) unitInput.value = selectedPrice.unit;
      if (costInput) costInput.value = numberInputValue(selectedPrice.costPerUnit);
    }
  }
  updateEstimateCalculatedCells(rowNode);
  ensureEstimateTrailingBlankRow(rowNode);
  saveEstimateDraft(collectEstimateDraftFromDom());
}

function updateEstimateCalculatedCells(rowNode) {
  if (rowNode) {
    const quantity = getRowInputNumber(rowNode, "quantity");
    const costPerUnit = getRowInputNumber(rowNode, "costPerUnit");
    const totalCell = rowNode.querySelector("[data-estimate-total]");
    if (totalCell) totalCell.textContent = formatCurrency(quantity * costPerUnit);
  }
  const rows = collectEstimateRowsFromDom();
  const total = estimateTotal(rows);
  document.querySelectorAll("[data-estimate-grand-total]").forEach((node) => {
    node.textContent = formatCurrency(total);
  });
}

function addEstimateRow() {
  const draft = collectEstimateDraftFromDom();
  saveEstimateDraft(draft);
  render();
}

function ensureEstimateTrailingBlankRow(rowNode) {
  if (!rowNode || !rowNode.classList.contains("estimate-add-row")) return;
  const row = readEstimateRowFromDom(rowNode);
  if (!hasEstimateRowData(row)) return;
  rowNode.classList.remove("estimate-add-row");
  const deleteButton = rowNode.querySelector('[data-action="delete-estimate-row"]');
  if (deleteButton) deleteButton.disabled = false;
  const tableBody = rowNode.parentElement;
  if (tableBody) tableBody.insertAdjacentHTML("beforeend", renderEstimateRow(blankEstimateRow()));
}

function saveEstimateTemplate() {
  const draft = collectEstimateDraftFromDom();
  if (!draft.rows.length) {
    toast("Add at least one material before saving a template.");
    return;
  }
  const templates = getEstimateTemplates();
  const title = draft.title.trim() || `Estimate Template No. ${templates.length + 1}`;
  const template = {
    id: cryptoId(),
    title,
    selectedStore: draft.selectedStore || "",
    rows: draft.rows.map((row) => ({ ...row })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveEstimateTemplates([...templates, template]);
  saveEstimateDraft(defaultEstimateDraft());
  render();
  toast(`${title} saved. Estimate cleared for a new template.`);
}

function updateEstimateStore(store) {
  const draft = collectEstimateDraftFromDom();
  draft.selectedStore = store || "";
  saveEstimateDraft(draft);
  render();
}

function deleteEstimateRow(rowId) {
  if (!rowId) return;
  const draft = collectEstimateDraftFromDom();
  draft.rows = draft.rows.filter((row) => row.id !== rowId);
  saveEstimateDraft(draft);
  render();
  toast("Estimate material deleted.");
}

function handleTemplatePicker(value) {
  const template = findEstimateTemplateByOption(value);
  if (!template) return;
  useEstimateTemplate(template.id);
}

function useEstimateTemplate(templateId) {
  const template = getEstimateTemplates().find((item) => item.id === templateId);
  if (!template) return;
  saveEstimateDraft({
    title: template.title,
    selectedStore: template.selectedStore || "",
    rows: template.rows.map((row) => normalizeEstimateRow({ ...row, id: cryptoId() })),
    updatedAt: new Date().toISOString()
  });
  render();
  toast(`${template.title} loaded.`);
}

async function extractEstimateV2Pdf() {
  const fileInput = document.querySelector("[data-estimate-v2-file]");
  const planTypeInput = document.querySelector('[data-action="estimate-v2-plan-type"]');
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (!file) {
    toast("Choose a PDF file first.");
    return;
  }
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    toast("Estimate v2 accepts PDF files only.");
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast("Use a PDF below 8 MB for this first extractor.");
    return;
  }

  const planType = PLAN_TYPES.includes(planTypeInput && planTypeInput.value) ? planTypeInput.value : PLAN_TYPES[0];
  toast("Extracting readable PDF data...");
  try {
    const data = await fileToBase64(file);
    const response = await apiRequest("/estimate-v2/extract-pdf", {
      fileName: file.name,
      planType,
      data
    }, { timeoutMs: 45000 });
    saveEstimateV2Draft(normalizeEstimateV2Draft({
      planType,
      fileName: response.fileName || file.name,
      extractedAt: response.extractedAt || new Date().toISOString(),
      pageCount: response.pageCount || 0,
      characterCount: response.characterCount || 0,
      lineCount: response.lineCount || 0,
      textPreview: response.textPreview || "",
      materials: response.materials || []
    }));
    render();
    toast(`${formatInteger((response.materials || []).length)} materials detected.`);
  } catch (error) {
    toast(error.message || "PDF extraction failed.");
  }
}

function updateEstimateV2PlanType(planType) {
  const draft = getEstimateV2Draft();
  draft.planType = PLAN_TYPES.includes(planType) ? planType : PLAN_TYPES[0];
  saveEstimateV2Draft(draft);
  render();
}

function clearEstimateV2Draft() {
  saveEstimateV2Draft(defaultEstimateV2Draft());
  render();
  toast("Estimate v2 cleared.");
}

function savePriceList() {
  const storeName = priceStoreNameFromDom();
  if (!storeName) {
    toast("Add a store name before saving the price list.");
    return;
  }
  persistCurrentPriceRows();
  state.activePriceStore = NEW_PRICE_STORE;
  render();
  toast("Material price list saved. Store entry cleared.");
}

function duplicatePriceStore() {
  const sourceStore = priceStoreNameFromDom();
  if (!sourceStore) {
    toast("Select or enter a store before duplicating.");
    return;
  }
  const currentRows = collectPriceRowsFromDom(sourceStore);
  if (!currentRows.length) {
    toast("Add at least one material before duplicating this store.");
    return;
  }
  const existingRows = getMaterialPrices();
  const previousStore = state.activePriceStore || sourceStore;
  const nextStore = duplicateStoreName(sourceStore, [...existingRows, ...currentRows]);
  const otherRows = existingRows.filter((row) => !sameStore(row.store, previousStore) && !sameStore(row.store, sourceStore));
  const duplicateRows = currentRows.map((row) => ({
    ...row,
    id: cryptoId(),
    store: nextStore
  }));
  saveMaterialPrices([...otherRows, ...currentRows, ...duplicateRows]);
  state.activePriceStore = nextStore;
  render();
  toast(`${nextStore} created.`);
}

function deletePriceRow(rowId) {
  if (!rowId) return;
  const storeName = priceStoreNameFromDom();
  const previousStore = state.activePriceStore || storeName;
  const currentRows = collectPriceRowsFromDom(storeName).filter((row) => row.id !== rowId);
  const otherRows = getMaterialPrices().filter((row) => !sameStore(row.store, previousStore) && !sameStore(row.store, storeName));
  saveMaterialPrices([...otherRows, ...currentRows]);
  state.activePriceStore = storeName;
  render();
  toast("Price list material deleted.");
}

function persistCurrentPriceRows() {
  const storeName = priceStoreNameFromDom();
  if (!storeName) return;
  const previousStore = state.activePriceStore || storeName;
  const currentRows = collectPriceRowsFromDom(storeName);
  const otherRows = getMaterialPrices().filter((row) => !sameStore(row.store, previousStore) && !sameStore(row.store, storeName));
  saveMaterialPrices([...otherRows, ...currentRows]);
  state.activePriceStore = storeName;
}

function handlePriceListEnter(input) {
  const rowNode = input.closest("[data-price-row]");
  ensurePriceTrailingBlankRow(rowNode, true);
  persistCurrentPriceRows();
}

function ensurePriceTrailingBlankRow(rowNode, focusNewRow = false) {
  if (!rowNode || !rowNode.classList.contains("estimate-add-row")) return;
  const storeName = priceStoreNameFromDom();
  const row = readPriceRowFromDom(rowNode, storeName);
  if (!hasPriceRowData(row)) return;
  rowNode.classList.remove("estimate-add-row");
  const deleteButton = rowNode.querySelector('[data-action="delete-price-row"]');
  if (deleteButton) deleteButton.disabled = false;
  const tableBody = rowNode.parentElement;
  if (!tableBody) return;
  tableBody.insertAdjacentHTML("beforeend", renderPriceRow(blankPriceRow(storeName)));
  if (!focusNewRow) return;
  const nextInput = tableBody.lastElementChild && tableBody.lastElementChild.querySelector('[data-field="description"]');
  if (nextInput && typeof nextInput.focus === "function") nextInput.focus();
}

function collectEstimateDraftFromDom() {
  const current = getEstimateDraft();
  const titleInput = document.querySelector("[data-estimate-title]");
  return {
    title: titleInput ? titleInput.value.trim() : current.title,
    selectedStore: estimateSelectedStoreFromDom(),
    rows: collectEstimateRowsFromDom(),
    updatedAt: new Date().toISOString()
  };
}

function collectEstimateRowsFromDom() {
  return [...document.querySelectorAll("[data-estimate-row]")].map((rowNode) => {
    return readEstimateRowFromDom(rowNode);
  }).filter(hasEstimateRowData);
}

function readEstimateRowFromDom(rowNode) {
  return normalizeEstimateRow({
    id: rowNode.dataset.estimateRow || cryptoId(),
    description: getRowInputValue(rowNode, "description"),
    unit: getRowInputValue(rowNode, "unit"),
    quantity: getRowInputNumber(rowNode, "quantity"),
    costPerUnit: getRowInputNumber(rowNode, "costPerUnit")
  });
}

function collectPriceRowsFromDom(storeName = priceStoreNameFromDom()) {
  return [...document.querySelectorAll("[data-price-row]")].map((rowNode) => {
    return readPriceRowFromDom(rowNode, storeName);
  }).filter(hasPriceRowData);
}

function readPriceRowFromDom(rowNode, storeName = priceStoreNameFromDom()) {
  return normalizePriceRow({
    id: rowNode.dataset.priceRow || cryptoId(),
    store: storeName,
    description: getRowInputValue(rowNode, "description"),
    unit: getRowInputValue(rowNode, "unit"),
    costPerUnit: getRowInputNumber(rowNode, "costPerUnit")
  });
}

function getRowInputValue(rowNode, field) {
  const input = rowNode.querySelector(`[data-field="${field}"]`);
  return input ? String(input.value || "").trim() : "";
}

function getRowInputNumber(rowNode, field) {
  const input = rowNode.querySelector(`[data-field="${field}"]`);
  return input ? Math.max(0, Number(input.value) || 0) : 0;
}

function estimateSelectedStoreFromDom() {
  const select = document.querySelector('[data-action="select-estimate-store"]');
  return select ? String(select.value || "").trim() : getEstimateDraft().selectedStore || "";
}

function priceStoreNameFromDom() {
  const input = document.querySelector("[data-price-store-name]");
  if (input) return String(input.value || "").trim();
  if (state.activePriceStore === NEW_PRICE_STORE) return "";
  return state.activePriceStore || selectedPriceStore(materialStoreOptions());
}

function openAccountModal() {
  const account = getSessionAccount();
  const subscription = getSubscription();
  const isOwner = account.role === "owner";
  openModal(`
    <div class="modal">
      <div class="modal-head">
        <h3>Account</h3>
        <button class="ghost-btn" data-action="close-modal">Close</button>
      </div>
      <div class="modal-body">
        <div class="form-stack">
          <div class="mini-card">
            <span class="eyebrow">Signed In</span>
            <h3>${escapeHtml(account.name)}</h3>
            <p class="hint">${escapeHtml(account.email)} | ${account.gmailLinked ? "Gmail linked" : "Gmail not linked"}</p>
            ${account.gmailLinked ? "" : `<button class="secondary-btn" data-action="link-gmail">Link Gmail</button>`}
          </div>
          <div class="mini-card">
            <span class="eyebrow">Subscription</span>
            <h3>${subscription.status === "cancelled" ? "Cancelled" : "Free Trial"}</h3>
            <p class="hint">${subscription.status === "cancelled" ? "Subscription access is marked cancelled in this prototype." : `${trialDaysLeft(subscription)} day(s) left in the first free month.`}</p>
            <button class="secondary-btn" data-action="cancel-subscription">Cancel Subscription</button>
          </div>
          ${isOwner ? renderOwnerAccountTools(account) : `<p class="hint">Only the owner account can view created accounts and send access invitations.</p>`}
        </div>
      </div>
      <div class="modal-foot">
        <button class="primary-btn" data-action="close-modal">Done</button>
      </div>
    </div>
  `);
}

function renderOwnerAccountTools(owner) {
  const accounts = getAccounts();
  return `
    <div class="mini-card">
      <span class="eyebrow">Invite Account</span>
      <form id="invite-form" class="form-stack">
        <div class="field">
          <label for="invite-email">Recipient Email</label>
          <input id="invite-email" name="email" type="email" placeholder="name@example.com">
        </div>
        <div class="access-grid">
          ${ACCESS_KEYS.map((item) => `
            <label class="checkline">
              <input type="checkbox" name="${item.key}" ${item.key === "engineering" ? "checked" : ""}>
              ${item.label}
            </label>
          `).join("")}
        </div>
        <button class="secondary-btn" data-action="create-invite">Create Gmail or Outlook Link</button>
      </form>
      ${renderInviteLinks()}
    </div>
    <div class="mini-card">
      <span class="eyebrow">Created Accounts</span>
      <div class="account-list">
        ${accounts.map((account) => renderAccountRow(account, owner)).join("")}
      </div>
    </div>
  `;
}

function renderInviteLinks() {
  const invites = getInvites().slice(-3).reverse();
  if (!invites.length) return "";
  return `
    <div class="account-list" style="margin-top:12px">
      ${invites.map((invite) => {
        const link = inviteLink(invite.token);
        return `
          <div class="account-row">
            <div>
              <strong>${escapeHtml(invite.email || "Open invitation")}</strong>
              <p class="hint">${escapeHtml(accessText(invite.access))}</p>
            </div>
            <div>
              <a class="secondary-btn" style="display:inline-flex;align-items:center;padding:0 12px;text-decoration:none" href="${gmailComposeLink(invite.email, link)}" target="_blank" rel="noreferrer">Gmail</a>
              <a class="secondary-btn" style="display:inline-flex;align-items:center;padding:0 12px;text-decoration:none" href="${outlookComposeLink(invite.email, link)}" target="_blank" rel="noreferrer">Outlook</a>
              <button class="ghost-btn" data-action="copy-invite" data-link="${escapeAttribute(link)}">Copy</button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAccountRow(account, owner) {
  return `
    <div class="account-row">
      <div>
        <strong>${escapeHtml(account.name)} ${account.role === "owner" ? "(Owner)" : ""}</strong>
        <p class="hint">${escapeHtml(account.email)} | Created ${formatDate(account.createdAt)}</p>
        <div class="access-grid">
          ${ACCESS_KEYS.map((item) => `
            <label class="checkline">
              <input type="checkbox" data-access="${item.key}" data-account="${account.id}" ${hasAccess(account, item.key) ? "checked" : ""} ${account.id === owner.id ? "disabled" : ""}>
              ${item.label}
            </label>
          `).join("")}
        </div>
      </div>
      <button class="secondary-btn" data-action="update-access" data-id="${account.id}" ${account.id === owner.id ? "disabled" : ""}>Save Access</button>
    </div>
  `;
}

function createInvite() {
  const form = document.getElementById("invite-form");
  const formData = new FormData(form);
  const account = getSessionAccount();
  const access = {};
  ACCESS_KEYS.forEach((item) => {
    access[item.key] = formData.get(item.key) === "on";
  });
  const invite = {
    token: cryptoId(),
    email: String(formData.get("email")).trim().toLowerCase(),
    access,
    createdBy: account.id,
    createdAt: new Date().toISOString(),
    acceptedBy: null
  };
  const invites = getInvites();
  invites.push(invite);
  saveInvites(invites);
  openAccountModal();
  toast("Invitation link created.");
}

function updateAccess(accountId) {
  const accounts = getAccounts();
  const account = accounts.find((item) => item.id === accountId);
  if (!account || account.role === "owner") return;
  const access = {};
  ACCESS_KEYS.forEach((item) => {
    const checkbox = document.querySelector(`input[data-account="${accountId}"][data-access="${item.key}"]`);
    access[item.key] = Boolean(checkbox && checkbox.checked);
  });
  account.access = access;
  saveAccounts(accounts);
  toast("Access updated.");
  render();
  openAccountModal();
}

function cancelSubscription() {
  const subscription = getSubscription();
  subscription.status = "cancelled";
  subscription.cancelledAt = new Date().toISOString();
  saveSubscription(subscription);
  openAccountModal();
}

function linkGmail() {
  const account = getSessionAccount();
  const accounts = getAccounts().map((item) => item.id === account.id ? { ...item, gmailLinked: true } : item);
  saveAccounts(accounts);
  openAccountModal();
}

function copyInvite(link) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link);
    toast("Invitation link copied.");
  } else {
    toast(link);
  }
}

function openModal(content) {
  modalRoot.innerHTML = `<div class="modal-backdrop">${content}</div>`;
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function toast(message) {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toastNode = document.createElement("div");
  toastNode.className = "toast";
  toastNode.textContent = message;
  stack.appendChild(toastNode);
  window.setTimeout(() => toastNode.remove(), 3200);
}

function filteredProjects() {
  return getProjects().filter((project) => {
    const nameMatch = !state.filter.name || project.name.toLowerCase().includes(state.filter.name.toLowerCase());
    const typeMatch = !state.filter.type || project.type.toLowerCase().includes(state.filter.type.toLowerCase());
    return nameMatch && typeMatch;
  });
}

function dashboardFilteredProjects() {
  const projectId = state.dashboardFilter.projectId || "all";
  const year = state.dashboardFilter.year || "all";
  return getProjects().filter((project) => {
    const projectMatch = projectId === "all" || project.id === projectId;
    const yearMatch = year === "all" || projectOverlapsYear(project, Number(year));
    return projectMatch && yearMatch;
  });
}

function dashboardYearOptions() {
  const years = new Set([new Date().getFullYear()]);
  getProjects().forEach((project) => {
    years.add(parseDate(project.startDate).getFullYear());
    years.add(projectEndDate(project).getFullYear());
  });
  getSwaState().sheets.forEach((sheet) => {
    const createdAt = new Date(sheet.createdAt);
    if (!Number.isNaN(createdAt.getTime())) years.add(createdAt.getFullYear());
  });
  return [...years].sort((a, b) => a - b);
}

function dashboardFilteredSheets(sheets, projects) {
  const projectIds = new Set(projects.map((project) => project.id));
  const year = state.dashboardFilter.year || "all";
  return sheets.filter((sheet) => {
    const projectMatch = projectIds.has(sheet.projectId);
    const sheetYear = new Date(sheet.createdAt).getFullYear();
    const yearMatch = year === "all" || sheetYear === Number(year);
    return projectMatch && yearMatch;
  });
}

function dashboardStatusCounts(projects) {
  return STATUS_OPTIONS.map((status) => ({
    status,
    count: projects.filter((project) => project.status === status).length
  }));
}

function dashboardBillingRows(projects, sheets) {
  return projects.map((project) => {
    const projectSheets = sheets.filter((sheet) => sameSwaProject(sheet.projectId, project.id));
    const sortedSheets = [...projectSheets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      project,
      count: projectSheets.length,
      latest: sortedSheets[0] || null,
      billedAmount: projectSheets.reduce((total, sheet) => total + dashboardSheetThisPeriodTotal(sheet), 0)
    };
  }).sort((a, b) => b.count - a.count || a.project.name.localeCompare(b.project.name));
}

function dashboardSheetThisPeriodTotal(sheet) {
  const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
  const originalTotal = Number(sheet.originalTotal) || swaOriginalTotal(rows);
  return rows.reduce((total, row) => total + computeSwaRow(row, originalTotal).thisTotal, 0);
}

function dashboardPieGradient(statusCounts, total) {
  if (!total) return "conic-gradient(rgba(255, 255, 255, 0.16) 0deg 360deg)";
  let start = 0;
  const segments = statusCounts.map((item) => {
    const end = start + ((item.count / total) * 360);
    const segment = `${dashboardStatusColor(item.status)} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`;
    start = end;
    return segment;
  });
  return `conic-gradient(${segments.join(", ")})`;
}

function dashboardStatusColor(status) {
  return `var(--${statusClass(status)})`;
}

function average(values) {
  const validValues = values.filter((value) => Number.isFinite(Number(value)));
  if (!validValues.length) return 0;
  return validValues.reduce((total, value) => total + Number(value), 0) / validValues.length;
}

function seedProjects() {
  const existing = getProjects();
  if (existing.length) return;
  const today = startOfDay(new Date());
  const samples = [
    ["Road Concreting - Barangay 1", "Road Concreting", "On-going", 42, -18, 60, 19990000],
    ["Drainage Improvement Phase 2", "Drainage", "On-Hold", 18, -10, 45, 8450000],
    ["Municipal Hall Renovation", "Building", "Not yet Started", 0, 8, 90, 32100000],
    ["Slope Protection Works", "Slope Protection", "Completed", 100, -80, 75, 12750000]
  ];
  const projects = samples.map(([name, type, status, actualPercent, startOffset, durationDays, contractAmount]) => ({
    id: cryptoId(),
    name,
    type,
    status,
    actualPercent,
    startDate: toInputDate(addDays(today, startOffset)),
    durationDays,
    contractAmount,
    updatedAt: new Date().toISOString()
  }));
  saveProjects(projects);
}

function ganttZoomLabel() {
  if (state.ganttZoom === "day") return "Daily zoom";
  if (state.ganttZoom === "year") return "All months view by W1-W4";
  return "Weekly zoom";
}

function ganttYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = new Set([currentYear - 1, currentYear, currentYear + 1, state.selectedYear]);
  getProjects().forEach((project) => {
    const start = parseDate(project.startDate);
    const end = projectEndDate(project);
    years.add(start.getFullYear());
    years.add(end.getFullYear());
  });
  return [...years].sort((a, b) => a - b);
}

function projectOverlapsYear(project, year) {
  const start = parseDate(project.startDate);
  const end = projectEndDate(project);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  return start <= yearEnd && end >= yearStart;
}

function getTimeline(projects) {
  const year = Number(state.selectedYear) || new Date().getFullYear();
  const rangeStart = state.ganttZoom === "week" ? startOfWeek(new Date(year, 0, 1)) : startOfDay(new Date(year, 0, 1));
  const rangeEnd = state.ganttZoom === "week" ? endOfWeek(new Date(year, 11, 31)) : startOfDay(new Date(year, 11, 31));
  const columns = [];
  const months = [];
  const colWidth = state.ganttZoom === "day" ? 44 : state.ganttZoom === "year" ? 42 : 96;

  if (state.ganttZoom === "day") {
    let cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      columns.push({
        date: new Date(cursor),
        label: `${monthShort(cursor)} ${cursor.getDate()}`
      });
      cursor = addDays(cursor, 1);
    }
  } else if (state.ganttZoom === "year") {
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(year, month, 1);
      for (let week = 1; week <= YEAR_WEEKS_PER_MONTH; week += 1) {
        columns.push({
          date,
          label: `W${week}`,
          month,
          week
        });
      }
    }
  } else {
    let cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      const weekEnd = addDays(cursor, 6);
      columns.push({
        date: new Date(cursor),
        label: `${monthShort(cursor)} ${cursor.getDate()}-${monthShort(weekEnd)} ${weekEnd.getDate()}`
      });
      cursor = addDays(cursor, 7);
    }
  }

  if (state.ganttZoom === "year") {
    for (let month = 0; month < 12; month += 1) {
      months.push({
        label: `${monthShort(new Date(year, month, 1))} ${year}`,
        start: month * YEAR_WEEKS_PER_MONTH + 1,
        span: YEAR_WEEKS_PER_MONTH
      });
    }
  } else {
    let monthStart = 1;
    let currentMonth = "";
    columns.forEach((column, index) => {
      const label = `${monthName(column.date)} ${column.date.getFullYear()}`;
      if (!currentMonth) currentMonth = label;
      if (label !== currentMonth) {
        months.push({ label: currentMonth, start: monthStart, span: index + 1 - monthStart });
        currentMonth = label;
        monthStart = index + 1;
      }
    });
    if (columns.length) {
      months.push({ label: currentMonth, start: monthStart, span: columns.length + 1 - monthStart });
    }
  }

  return { rangeStart, rangeEnd, columns, months, colWidth };
}

function projectPlacement(project, timeline) {
  const projectStart = parseDate(project.startDate);
  const projectEnd = projectEndDate(project);
  const start = maxDate(projectStart, timeline.rangeStart);
  const end = minDate(projectEnd, timeline.rangeEnd);
  const base = {
    projectStart,
    projectEnd,
    visibleStart: start,
    visibleEnd: end
  };
  if (state.ganttZoom === "year") {
    const startColumn = monthWeekColumn(start);
    const endColumn = monthWeekColumn(end);
    return {
      ...base,
      start: startColumn,
      plannedSpan: Math.max(1, endColumn - startColumn + 1)
    };
  }
  if (state.ganttZoom === "day") {
    const startColumn = daysBetween(timeline.rangeStart, start) + 1;
    return {
      ...base,
      start: Math.max(1, startColumn),
      plannedSpan: Math.max(1, daysBetween(start, end) + 1)
    };
  }
  const startColumn = Math.floor(daysBetween(timeline.rangeStart, start) / 7) + 1;
  const plannedSpan = Math.max(1, Math.ceil((daysBetween(start, end) + 1) / 7));
  return { ...base, start: Math.max(1, startColumn), plannedSpan };
}

function monthWeekColumn(date) {
  const day = date.getDate();
  const daysInCurrentMonth = daysInMonth(date);
  const week = Math.min(YEAR_WEEKS_PER_MONTH, Math.floor(((day - 1) * YEAR_WEEKS_PER_MONTH) / daysInCurrentMonth) + 1);
  return date.getMonth() * YEAR_WEEKS_PER_MONTH + week;
}

function visibleProgressPercent(project, placement, overallPercent) {
  const completedDays = progressCompletedDays(project, overallPercent);
  const visibleStartIndex = daysBetween(placement.projectStart, placement.visibleStart);
  const visibleEndIndex = daysBetween(placement.projectStart, placement.visibleEnd) + 1;
  const visibleDays = Math.max(1, visibleEndIndex - visibleStartIndex);
  const visibleCompletedDays = clamp(completedDays - visibleStartIndex, 0, visibleDays);
  return (visibleCompletedDays / visibleDays) * 100;
}

function progressCompletedDays(project, overallPercent) {
  const duration = Math.max(1, Number(project.durationDays) || 1);
  return (clamp(overallPercent, 0, 100) / 100) * duration;
}

function plannedProgressOffset(timeline, placement, plannedValue) {
  if (plannedValue <= 0) return null;
  const meterStart = ((placement.start - 1) * timeline.colWidth) + GANTT_BAR_SIDE_MARGIN + GANTT_BAR_INNER_PADDING;
  const meterWidth = Math.max(
    1,
    (placement.plannedSpan * timeline.colWidth) - ((GANTT_BAR_SIDE_MARGIN + GANTT_BAR_INNER_PADDING) * 2)
  );
  return meterStart + (meterWidth * (clamp(plannedValue, 0, 100) / 100));
}

function plannedPercent(project) {
  const today = startOfDay(new Date());
  const start = parseDate(project.startDate);
  const end = addDays(start, Number(project.durationDays) - 1);
  if (today < start) return 0;
  if (today > end) return 100;
  return clamp(((daysBetween(start, today) + 1) / Number(project.durationDays)) * 100, 0, 100);
}

function isDelayedProject(project) {
  if (project.status === "Completed") return false;
  return Number(project.actualPercent) < plannedPercent(project);
}

function actualColorClass(project) {
  if (project.status === "Completed" || Number(project.actualPercent) >= 100) return "green";
  if (project.status === "Not yet Started") return "blue";
  if (Number(project.actualPercent) >= plannedPercent(project)) return "orange";
  return "red";
}

function statusClass(status) {
  if (status === "Completed") return "green";
  if (status === "On-Hold") return "red";
  if (status === "On-going") return "orange";
  return "blue";
}

function hasAccess(account, key) {
  return account.role === "owner" || Boolean(account.access && account.access[key]);
}

function allAccess() {
  return ACCESS_KEYS.reduce((acc, item) => ({ ...acc, [item.key]: true }), {});
}

function noAccess() {
  return ACCESS_KEYS.reduce((acc, item) => ({ ...acc, [item.key]: false }), {});
}

function labelForAccess(key) {
  const item = ACCESS_KEYS.find((access) => access.key === key);
  return item ? item.label : key;
}

function accessText(access) {
  const labels = ACCESS_KEYS.filter((item) => access && access[item.key]).map((item) => item.label);
  return labels.length ? labels.join(", ") : "No module access";
}

function getInviteByToken(token) {
  if (!token) return null;
  return getInvites().find((invite) => invite.token === token) || null;
}

function inviteLink(token) {
  return `${window.location.origin}${window.location.pathname}#invite=${token}`;
}

function gmailComposeLink(email, link) {
  const subject = encodeURIComponent("Oversee construction monitoring invitation");
  const body = encodeURIComponent(`Create your Oversee account using this invitation link:\n\n${link}`);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email || "")}&su=${subject}&body=${body}`;
}

function outlookComposeLink(email, link) {
  const subject = encodeURIComponent("Oversee construction monitoring invitation");
  const body = encodeURIComponent(`Create your Oversee account using this invitation link:\n\n${link}`);
  return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email || "")}&subject=${subject}&body=${body}`;
}

function ensureSubscription() {
  getSubscription();
}

function trialDaysLeft(subscription) {
  if (subscription.status === "cancelled") return 0;
  const started = new Date(subscription.trialStartedAt);
  const ends = addDays(started, 30);
  return Math.max(0, Math.ceil((ends - new Date()) / 86400000));
}

function uniqueProjectTypes() {
  return [...new Set(getProjects().map((project) => project.type).filter(Boolean))].sort();
}

function getEstimateDraft() {
  const saved = readJson(STORAGE.estimateDraft, null);
  if (saved && Array.isArray(saved.rows)) {
    return {
      title: saved.title || "Untitled Estimate",
      selectedStore: saved.selectedStore || "",
      rows: saved.rows.map(normalizeEstimateRow).filter(hasEstimateRowData),
      updatedAt: saved.updatedAt || new Date().toISOString()
    };
  }
  const created = defaultEstimateDraft();
  saveEstimateDraft(created);
  return created;
}

function saveEstimateDraft(draft) {
  localStorage.setItem(STORAGE.estimateDraft, JSON.stringify({
    title: draft.title || "Untitled Estimate",
    selectedStore: draft.selectedStore || "",
    rows: Array.isArray(draft.rows) ? draft.rows.map(normalizeEstimateRow).filter(hasEstimateRowData) : [],
    updatedAt: draft.updatedAt || new Date().toISOString()
  }));
}

function defaultEstimateDraft() {
  return {
    title: "Untitled Estimate",
    selectedStore: "",
    rows: [],
    updatedAt: new Date().toISOString()
  };
}

function getEstimateV2Draft() {
  return normalizeEstimateV2Draft(readJson(STORAGE.estimateV2Draft, defaultEstimateV2Draft()));
}

function saveEstimateV2Draft(draft) {
  localStorage.setItem(STORAGE.estimateV2Draft, JSON.stringify(normalizeEstimateV2Draft(draft)));
}

function defaultEstimateV2Draft() {
  return {
    planType: PLAN_TYPES[0],
    fileName: "",
    extractedAt: "",
    pageCount: 0,
    characterCount: 0,
    lineCount: 0,
    textPreview: "",
    materials: []
  };
}

function normalizeEstimateV2Draft(draft) {
  const source = draft && typeof draft === "object" ? draft : {};
  return {
    planType: PLAN_TYPES.includes(source.planType) ? source.planType : PLAN_TYPES[0],
    fileName: String(source.fileName || "").trim(),
    extractedAt: String(source.extractedAt || "").trim(),
    pageCount: Math.max(0, Number(source.pageCount) || 0),
    characterCount: Math.max(0, Number(source.characterCount) || 0),
    lineCount: Math.max(0, Number(source.lineCount) || 0),
    textPreview: String(source.textPreview || "").slice(0, 8000),
    materials: Array.isArray(source.materials) ? source.materials.map(normalizeEstimateV2Material).filter((item) => item.description) : []
  };
}

function normalizeEstimateV2Material(material) {
  return {
    description: String(material.description || "").trim(),
    category: String(material.category || "General").trim(),
    mentions: Math.max(0, Number(material.mentions) || 0),
    matchedTerms: Array.isArray(material.matchedTerms) ? material.matchedTerms.map((term) => String(term || "").trim()).filter(Boolean).slice(0, 8) : [],
    sampleLines: Array.isArray(material.sampleLines) ? material.sampleLines.map((line) => String(line || "").trim()).filter(Boolean).slice(0, 3) : []
  };
}

function getEstimateTemplates() {
  const saved = readJson(STORAGE.estimateTemplates, []);
  if (!Array.isArray(saved)) return [];
  return saved.map((template) => ({
    id: template.id || cryptoId(),
    title: template.title || "Untitled Estimate Template",
    selectedStore: template.selectedStore || "",
    rows: Array.isArray(template.rows) ? template.rows.map(normalizeEstimateRow).filter(hasEstimateRowData) : [],
    createdAt: template.createdAt || new Date().toISOString(),
    updatedAt: template.updatedAt || template.createdAt || new Date().toISOString()
  }));
}

function saveEstimateTemplates(templates) {
  localStorage.setItem(STORAGE.estimateTemplates, JSON.stringify(templates));
}

function getMaterialPrices() {
  const saved = readJson(STORAGE.materialPrices, []);
  if (!Array.isArray(saved)) return [];
  return saved.map(normalizePriceRow).filter(hasPriceRowData)
    .sort((a, b) => a.description.localeCompare(b.description) || a.store.localeCompare(b.store) || a.costPerUnit - b.costPerUnit);
}

function saveMaterialPrices(prices) {
  localStorage.setItem(STORAGE.materialPrices, JSON.stringify(prices.map(normalizePriceRow).filter(hasPriceRowData)));
}

function blankEstimateRow() {
  return {
    id: cryptoId(),
    description: "",
    unit: "",
    quantity: 0,
    costPerUnit: 0,
    isBlank: true
  };
}

function blankPriceRow(store = "") {
  return {
    id: cryptoId(),
    store,
    description: "",
    unit: "",
    costPerUnit: 0,
    isBlank: true
  };
}

function normalizeEstimateRow(row) {
  return {
    id: row.id || cryptoId(),
    description: String(row.description || "").trim(),
    unit: String(row.unit || "").trim(),
    quantity: Math.max(0, Number(row.quantity) || 0),
    costPerUnit: Math.max(0, Number(row.costPerUnit) || 0)
  };
}

function normalizePriceRow(row) {
  return {
    id: row.id || cryptoId(),
    store: String(row.store || "").trim(),
    description: String(row.description || "").trim(),
    unit: String(row.unit || "").trim(),
    costPerUnit: Math.max(0, Number(row.costPerUnit) || 0)
  };
}

function hasEstimateRowData(row) {
  return Boolean(row.description || row.unit || row.quantity || row.costPerUnit);
}

function hasPriceRowData(row) {
  return Boolean(row.description || row.unit || row.costPerUnit);
}

function estimateRowTotal(row) {
  return (Number(row.quantity) || 0) * (Number(row.costPerUnit) || 0);
}

function estimateTotal(rows) {
  return rows.reduce((total, row) => total + estimateRowTotal(row), 0);
}

function materialPriceOptionLabel(price) {
  const store = price.store ? ` | ${price.store}` : "";
  const unit = price.unit ? ` | ${price.unit}` : "";
  return `${price.description}${store}${unit} | ${formatCurrency(price.costPerUnit)}`;
}

function estimateTemplateOptionLabel(template) {
  const total = estimateTotal(template.rows || []);
  return `${template.title} | ${formatCurrency(total)}`;
}

function findEstimateTemplateByOption(optionValue) {
  const value = String(optionValue || "");
  return getEstimateTemplates().find((template) => estimateTemplateOptionLabel(template) === value) || null;
}

function materialStoreOptions() {
  return [...new Set(getMaterialPrices().map((price) => price.store).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function selectedPriceStore(stores = materialStoreOptions()) {
  if (state.activePriceStore === NEW_PRICE_STORE) return "";
  if (state.activePriceStore && stores.some((store) => sameStore(store, state.activePriceStore))) return state.activePriceStore;
  if (state.activePriceStore && !stores.length) return state.activePriceStore;
  return stores[0] || "";
}

function duplicateStoreName(storeName, rows = getMaterialPrices()) {
  const baseName = String(storeName || "").trim().replace(/\s+Duplicate No\.\s*\d+$/i, "").trim() || "Store";
  const pattern = new RegExp(`^${escapeRegExp(baseName)} Duplicate No\\.\\s*(\\d+)$`, "i");
  const duplicateNumbers = [...new Set(rows.map((row) => row.store).filter(Boolean))]
    .map((store) => {
      const match = String(store).trim().match(pattern);
      return match ? Number(match[1]) || 0 : 0;
    })
    .filter((number) => number > 0);
  const nextNumber = duplicateNumbers.length ? Math.max(...duplicateNumbers) + 1 : 1;
  return `${baseName} Duplicate No. ${nextNumber}`;
}

function sameStore(firstStore, secondStore) {
  return String(firstStore || "").trim().toLowerCase() === String(secondStore || "").trim().toLowerCase();
}

function findMaterialPriceByOption(optionValue, selectedStore = "") {
  const value = String(optionValue || "");
  return getMaterialPrices()
    .filter((price) => price.description)
    .filter((price) => !selectedStore || sameStore(price.store, selectedStore))
    .find((price) => materialPriceOptionLabel(price) === value) || null;
}

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function blankSwaRow() {
  return {
    id: cryptoId(),
    description: "",
    originalQty: 0,
    unit: "",
    unitCost: 0,
    previousQty: 0,
    thisQty: 0,
    isBlank: true
  };
}

function swaProjectKey(projectId) {
  return projectId || "__unassigned";
}

function sameSwaProject(firstProjectId, secondProjectId) {
  return swaProjectKey(firstProjectId) === swaProjectKey(secondProjectId);
}

function isDefaultRoadSwaRows(rows) {
  const descriptions = [
    "Mobilization/Demobilization",
    "Project Billboard/Signboard",
    "Clearing and Grubbing",
    "Base Preparation",
    "Formworks",
    "Aggregate Base Course Preparation",
    "Portland Cement Concrete Pavement (Unreinforced)",
    "Shouldering",
    "Thermoplastic Pavement Markings"
  ];
  return Array.isArray(rows)
    && rows.length === descriptions.length
    && rows.every((row, index) => row && row.description === descriptions[index]);
}

function computeSwaRow(row, originalTotal) {
  const originalQty = Number(row.originalQty) || 0;
  const unitCost = Number(row.unitCost) || 0;
  const previousQty = Number(row.previousQty) || 0;
  const thisQty = Number(row.thisQty) || 0;
  const originalRowTotal = originalQty * unitCost;
  const previousTotal = previousQty * unitCost;
  const thisTotal = thisQty * unitCost;
  const asToDateQty = previousQty + thisQty;
  const asToDateTotal = previousTotal + thisTotal;

  return {
    originalTotal: originalRowTotal,
    originalPercent: safeDivide(originalRowTotal, originalTotal),
    previousQty,
    previousTotal,
    previousPercent: safeDivide(previousTotal, originalTotal),
    thisQty,
    thisTotal,
    thisPercent: safeDivide(thisTotal, originalTotal),
    asToDateQty,
    asToDateTotal,
    asToDatePercent: safeDivide(asToDateTotal, originalTotal),
    costBalance: originalRowTotal - asToDateTotal
  };
}

function swaOriginalTotal(rows) {
  return rows.reduce((total, row) => total + ((Number(row.originalQty) || 0) * (Number(row.unitCost) || 0)), 0);
}

function safeDivide(value, divisor) {
  return divisor ? value / divisor : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0);
}

function formatCurrencyCompact(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function formatInteger(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function formatPercent(value) {
  return `${((Number(value) || 0) * 100).toFixed(2)}%`;
}

function formatSwaNumber(value) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value) || 0);
}

function numberInputValue(value) {
  const number = Number(value) || 0;
  return number ? String(number) : "";
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function todayInputValue() {
  return toInputDate(new Date());
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

function projectEndDate(project) {
  return addDays(parseDate(project.startDate), Number(project.durationDays) - 1);
}

function maxDate(first, second) {
  return first > second ? first : second;
}

function minDate(first, second) {
  return first < second ? first : second;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + Number(days));
  return startOfDay(next);
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  return addDays(next, offset);
}

function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

function daysBetween(start, end) {
  return Math.round((startOfDay(end) - startOfDay(start)) / 86400000);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function monthShort(date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function monthName(date) {
  return date.toLocaleString("en-US", { month: "long" });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function cryptoId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
