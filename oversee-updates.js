state.selectedYear = Number(state.selectedYear) || new Date().getFullYear();

document.addEventListener("change", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target || target.dataset.action !== "gantt-year") return;
  state.selectedYear = Number(target.value) || new Date().getFullYear();
  render();
});

document.addEventListener(
  "click",
  (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || target.dataset.action !== "zoom-out") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.ganttZoom = "year";
    render();
  },
  true
);

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

function ganttZoomLabel() {
  if (state.ganttZoom === "day") return "Daily zoom";
  if (state.ganttZoom === "year") return "All months view";
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
  const colWidth = state.ganttZoom === "day" ? 44 : state.ganttZoom === "year" ? 128 : 96;

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
      columns.push({
        date,
        label: monthShort(date)
      });
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
    months.push({ label: String(year), start: 1, span: 12 });
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
  const start = maxDate(parseDate(project.startDate), timeline.rangeStart);
  const end = minDate(projectEndDate(project), timeline.rangeEnd);
  if (state.ganttZoom === "year") {
    const startColumn = start.getMonth() + 1;
    const endColumn = end.getMonth() + 1;
    return {
      start: startColumn,
      plannedSpan: Math.max(1, endColumn - startColumn + 1)
    };
  }
  if (state.ganttZoom === "day") {
    const startColumn = daysBetween(timeline.rangeStart, start) + 1;
    return {
      start: Math.max(1, startColumn),
      plannedSpan: Math.max(1, daysBetween(start, end) + 1)
    };
  }
  const startColumn = Math.floor(daysBetween(timeline.rangeStart, start) / 7) + 1;
  const plannedSpan = Math.max(1, Math.ceil((daysBetween(start, end) + 1) / 7));
  return { start: Math.max(1, startColumn), plannedSpan };
}

function getTodayOffset(timeline) {
  const today = startOfDay(new Date());
  if (today < timeline.rangeStart || today > timeline.rangeEnd) return null;
  const totalDays = Math.max(1, daysBetween(timeline.rangeStart, addDays(timeline.rangeEnd, 1)));
  const elapsedDays = daysBetween(timeline.rangeStart, today) + 0.5;
  return (elapsedDays / totalDays) * timeline.columns.length * timeline.colWidth;
}

function renderGanttRow(project, timeline, todayOffset) {
  const placement = projectPlacement(project, timeline);
  const plannedValue = clamp(plannedPercent(project), 0, 100);
  const actualValue = clamp(Number(project.actualPercent), 0, 100);
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
        <div
          class="bar planned ${plannedColor} ${plannedValue >= 99.5 ? "complete" : ""}"
          style="grid-column:${placement.start} / span ${placement.plannedSpan}; --progress:${plannedValue}%"
          aria-label="Planned progress ${plannedValue.toFixed(0)} percent"
        >
          <span class="bar-percent">${plannedValue.toFixed(0)}%</span>
          <span class="bar-meter"><span class="bar-fill"></span></span>
        </div>
        <div
          class="bar actual ${actualColor} ${actualValue >= 99.5 ? "complete" : ""}"
          style="grid-column:${placement.start} / span ${placement.plannedSpan}; --progress:${actualValue}%"
          aria-label="Actual progress ${actualValue.toFixed(0)} percent"
        >
          <span class="bar-percent">${actualValue.toFixed(0)}%</span>
          <span class="bar-meter"><span class="bar-fill"></span></span>
        </div>
      </div>
    </div>
  `;
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
