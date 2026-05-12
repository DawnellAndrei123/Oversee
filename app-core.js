const STORAGE = {
  accounts: "oversee.accounts",
  session: "oversee.session",
  projects: "oversee.projects",
  invites: "oversee.invites",
  subscription: "oversee.subscription"
};

const ACCESS_KEYS = [
  { key: "engineering", label: "Engineers View" },
  { key: "procurement", label: "Procurement" },
  { key: "accounting", label: "Accounting" },
  { key: "administrative", label: "Administrative" }
];

const STATUS_OPTIONS = ["Not yet Started", "On-going", "On-Hold", "Completed"];

const state = {
  authTab: "signup",
  currentView: "welcome",
  engineeringView: "gantt",
  ganttZoom: "week",
  filter: { name: "", type: "" },
  inviteToken: new URLSearchParams(window.location.hash.replace("#", "?")).get("invite"),
  riskOnly: false
};

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");

document.addEventListener("DOMContentLoaded", () => {
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
      state.ganttZoom = "week";
      render();
    },
    "close-modal": closeModal,
    "save-project": saveProject,
    "save-filter": saveFilter,
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

function getAccounts() {
  return readJson(STORAGE.accounts, []);
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE.accounts, JSON.stringify(accounts));
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

