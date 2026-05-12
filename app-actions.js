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

function handleSignup() {
  const form = document.getElementById("signup-form");
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const accounts = getAccounts();
  const email = String(formData.get("email")).trim().toLowerCase();
  if (accounts.some((account) => account.email === email)) {
    toast("An account already exists with that email.");
    return;
  }

  const invite = getInviteByToken(state.inviteToken);
  const isFirstAccount = accounts.length === 0;
  const access = isFirstAccount
    ? allAccess()
    : invite
      ? invite.access
      : noAccess();

  const account = {
    id: cryptoId(),
    name: String(formData.get("name")).trim(),
    email,
    password: String(formData.get("password")),
    gmailLinked: formData.get("gmail") === "on",
    role: isFirstAccount ? "owner" : "member",
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

function handleLogin() {
  const form = document.getElementById("login-form");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
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

