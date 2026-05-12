function filteredProjects() {
  return getProjects().filter((project) => {
    const nameMatch = !state.filter.name || project.name.toLowerCase().includes(state.filter.name.toLowerCase());
    const typeMatch = !state.filter.type || project.type.toLowerCase().includes(state.filter.type.toLowerCase());
    return nameMatch && typeMatch;
  });
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

function getTimeline(projects) {
  const starts = projects.map((project) => parseDate(project.startDate).getTime());
  const ends = projects.map((project) => addDays(parseDate(project.startDate), Number(project.durationDays) - 1).getTime());
  const minStart = new Date(Math.min(...starts));
  const maxEnd = new Date(Math.max(...ends));
  const rangeStart = state.ganttZoom === "week" ? startOfWeek(minStart) : startOfDay(minStart);
  const rangeEnd = state.ganttZoom === "week" ? endOfWeek(maxEnd) : startOfDay(maxEnd);
  const columns = [];
  const months = [];
  const colWidth = state.ganttZoom === "day" ? 44 : 96;

  if (state.ganttZoom === "day") {
    let cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      columns.push({
        date: new Date(cursor),
        label: `${monthShort(cursor)} ${cursor.getDate()}`
      });
      cursor = addDays(cursor, 1);
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

  return { rangeStart, rangeEnd, columns, months, colWidth };
}

function projectPlacement(project, timeline) {
  const start = parseDate(project.startDate);
  if (state.ganttZoom === "day") {
    const startColumn = daysBetween(timeline.rangeStart, start) + 1;
    return {
      start: Math.max(1, startColumn),
      plannedSpan: Math.max(1, Number(project.durationDays))
    };
  }
  const startColumn = Math.floor(daysBetween(timeline.rangeStart, start) / 7) + 1;
  const plannedSpan = Math.max(1, Math.ceil(Number(project.durationDays) / 7));
  return { start: Math.max(1, startColumn), plannedSpan };
}

function getTodayOffset(timeline) {
  const today = startOfDay(new Date());
  if (today < timeline.rangeStart || today > timeline.rangeEnd) return null;
  if (state.ganttZoom === "day") {
    return (daysBetween(timeline.rangeStart, today) + 0.5) * timeline.colWidth;
  }
  return ((daysBetween(timeline.rangeStart, today) / 7) + 0.5) * timeline.colWidth;
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
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
