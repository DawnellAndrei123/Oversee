function renderAuthScreen() {
  const invite = getInviteByToken(state.inviteToken);
  const hasOwner = getAccounts().some((account) => account.role === "owner");
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
          <p class="auth-note">The first account created becomes the owner account. Owner accounts can view created users and send access invitations.</p>
        </div>
        <div class="auth-panel">
          ${invite ? `<div class="invite-banner">Invitation detected for ${accessText(invite.access)}. Create an account to accept it.</div>` : ""}
          <div class="auth-tabs">
            <button class="tab-btn ${state.authTab === "signup" ? "active" : ""}" data-action="auth-tab" data-tab="signup">Create Account</button>
            <button class="tab-btn ${state.authTab === "login" ? "active" : ""}" data-action="auth-tab" data-tab="login">Log In</button>
          </div>
          ${state.authTab === "signup" ? renderSignupForm(hasOwner, invite) : renderLoginForm()}
        </div>
      </section>
    </main>
  `;
}

function renderSignupForm(hasOwner, invite) {
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
        ${hasOwner && !invite ? "This account will be created without module access until the owner grants permission." : "This account will become the owner account and receive all module access."}
      </p>
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
      <p class="auth-note">Accounts are stored in this browser for the first prototype. A production build should use a secure backend and real OAuth.</p>
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
        <section class="main-stage">
          ${state.currentView === "engineering" ? renderEngineeringView(account) : renderWelcome(account)}
        </section>
        ${renderSideDock(account)}
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
      <p>Choose an area from the right container. Engineering View is ready with a Gantt chart, project list, project risk view, filters, and editable construction project information.</p>
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
  const titles = {
    swa: "SWA Chart",
    milestone: "Milestone",
    dashboard: "Engineering Dashboard",
    settings: "Settings"
  };
  return `<div class="placeholder">${titles[state.engineeringView]} will be built in the next module.</div>`;
}

function renderGanttView() {
  const allProjects = filteredProjects();
  const projects = state.riskOnly ? allProjects.filter(isDelayedProject) : allProjects;
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
      <div class="hint">${state.ganttZoom === "day" ? "Daily zoom" : "Weekly zoom"}</div>
    </div>
    <div class="gantt-toolbar">
      <button class="secondary-btn" data-action="open-add-project">Add</button>
      <button class="secondary-btn" data-action="show-risk">Show Risk</button>
      <button class="secondary-btn" data-action="open-filter">Filter View</button>
      <button class="secondary-btn" data-action="marks-off">Marks Off</button>
      <button class="secondary-btn" data-action="zoom-in">Zoom In</button>
      <button class="secondary-btn" data-action="zoom-out">Zoom Out</button>
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

function renderGantt(projects) {
  const timeline = getTimeline(projects);
  const todayOffset = getTodayOffset(timeline);
  const width = timeline.columns.length * timeline.colWidth;
  return `
    <div class="gantt-shell" style="--cols:${timeline.columns.length}; --col-width:${timeline.colWidth}px; --timeline-width:${width}px">
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
      ${projects.map((project) => renderGanttRow(project, timeline, todayOffset)).join("")}
    </div>
  `;
}

function renderGanttRow(project, timeline, todayOffset) {
  const placement = projectPlacement(project, timeline);
  const actualSpan = Math.max(0, Math.round((placement.plannedSpan * Number(project.actualPercent)) / 100));
  const actualColor = actualColorClass(project);
  const plannedColor = statusClass(project.status);
  return `
    <div class="gantt-row">
      <button class="project-name-btn" data-action="edit-project" data-id="${project.id}">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.type)} | Planned ${plannedPercent(project).toFixed(2)}% | Actual ${Number(project.actualPercent).toFixed(2)}%</span>
      </button>
      <div class="bar-grid">
        ${todayOffset !== null ? `<div class="today-line" style="left:${todayOffset}px"><span>Today</span></div>` : ""}
        <div class="track planned"></div>
        <div class="track actual"></div>
        <div class="bar planned ${plannedColor}" style="grid-column:${placement.start} / span ${placement.plannedSpan}"></div>
        ${actualSpan > 0 ? `<div class="bar actual ${actualColor}" style="grid-column:${placement.start} / span ${actualSpan}"></div>` : ""}
      </div>
    </div>
  `;
}

