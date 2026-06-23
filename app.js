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
  procurement: "oversee.procurement",
  accounting: "oversee.accounting",
  theme: "oversee.theme"
};

const CLOUD_APP_DATA_KEYS = [
  { dataKey: "projects", storageKey: STORAGE.projects, fallback: [] },
  { dataKey: "swa", storageKey: STORAGE.swa, fallback: null },
  { dataKey: "estimateDraft", storageKey: STORAGE.estimateDraft, fallback: null },
  { dataKey: "estimateV2Draft", storageKey: STORAGE.estimateV2Draft, fallback: null },
  { dataKey: "estimateTemplates", storageKey: STORAGE.estimateTemplates, fallback: [] },
  { dataKey: "materialPrices", storageKey: STORAGE.materialPrices, fallback: [] },
  { dataKey: "procurement", storageKey: STORAGE.procurement, fallback: null },
  { dataKey: "accounting", storageKey: STORAGE.accounting, fallback: null },
  { dataKey: "subscription", storageKey: STORAGE.subscription, fallback: null }
];

const ACCESS_KEYS = [
  { key: "engineering", label: "Engineers View" },
  { key: "procurement", label: "Procurement" },
  { key: "accounting", label: "Accounting" },
  { key: "administrative", label: "Administrative" }
];
const ASSIGNABLE_ACCESS_KEYS = ACCESS_KEYS.filter((item) => item.key !== "administrative");
const PROCUREMENT_REQUEST_STATUSES = ["Pending", "Approved", "Ordered", "Received", "Cancelled"];
const PROCUREMENT_ORDER_STATUSES = ["Draft", "Sent", "Partially Received", "Received", "Cancelled"];
const ACCOUNTING_BILLING_STATUSES = ["Draft", "Submitted", "Approved", "Paid", "Rejected"];
const ACCOUNTING_EXPENSE_STATUSES = ["Unpaid", "Partially Paid", "Paid"];

const STATUS_OPTIONS = ["Not yet Started", "On-going", "On-Hold", "Completed"];
const PLAN_TYPES = ["Architectural", "Structural", "Plumbing", "Electrical", "Mechanical", "Electronics", "Civil", "Fire Protection", "Other"];
const DRAWING_SCALES = ["1:20", "1:25", "1:50", "1:75", "1:100", "1:150", "1:200", "Custom"];
const ESTIMATE_V2_TAKEOFF_TOOLS = [
  { key: "calibrate", label: "Calibrate", type: "calibrate", unit: "m", defaultName: "Scale Reference", color: "#28f4ff" },
  { key: "tile-area", label: "Tiles", type: "area", unit: "sq.m", defaultName: "Floor Tiles", color: "#22c55e" },
  { key: "floor-slab", label: "Floor Slab", type: "area", unit: "sq.m", defaultName: "Floor Slab", color: "#f59e0b" },
  { key: "wall-area", label: "Wall Area", type: "area", unit: "sq.m", defaultName: "Wall Finish", color: "#f59e0b", hidden: true },
  { key: "chb-wall", label: "CHB Wall", type: "chb", unit: "pcs", defaultName: "Concrete Hollow Block", color: "#14b8a6" },
  { key: "column-concrete", label: "Column", type: "concrete-count", unit: "cu.m", defaultName: "Column Concrete", color: "#06b6d4" },
  { key: "footing-concrete", label: "Footing", type: "concrete-count", unit: "cu.m", defaultName: "Column Footing Concrete", color: "#8b5cf6" },
  { key: "beam-concrete", label: "Beam", type: "linear", unit: "cu.m", defaultName: "Beam Concrete", color: "#0ea5e9" },
  { key: "steel-column", label: "Column", type: "count", unit: "pcs", defaultName: "Column Rebar", color: "#60a5fa", steelwork: true },
  { key: "steel-footing", label: "Footing", type: "count", unit: "pcs", defaultName: "Footing Rebar", color: "#818cf8", steelwork: true },
  { key: "steel-beam", label: "Beam", type: "linear", unit: "pcs", defaultName: "Beam Rebar", color: "#c084fc", steelwork: true },
  { key: "steel-wall", label: "Wall", type: "linear", unit: "pcs", defaultName: "Wall Rebar", color: "#f472b6", steelwork: true },
  { key: "steel-slab", label: "Slab", type: "area", unit: "pcs", defaultName: "Slab Rebar", color: "#fb7185", steelwork: true },
  { key: "pipe-length", label: "Pipe Length", type: "linear", unit: "lm", defaultName: "Pipe Line", color: "#38bdf8" },
  { key: "wire-length", label: "Wire Length", type: "linear", unit: "lm", defaultName: "Electrical Wiring", color: "#a78bfa" },
  { key: "curve-line", label: "Curve Line", type: "curve", unit: "lm", defaultName: "Curved Line", color: "#ec4899" },
  { key: "door-count", label: "Doors", type: "count", unit: "pcs", defaultName: "Door", color: "#fb7185" },
  { key: "window-count", label: "Windows", type: "count", unit: "pcs", defaultName: "Window", color: "#f97316" }
];
const ESTIMATE_V2_TAKEOFF_GROUPS = [
  { key: "setup", label: "Setup", tools: ["calibrate"] },
  { key: "architectural", label: "Architectural", tools: ["door-count", "window-count", "curve-line"] },
  { key: "structural", label: "Structural", tools: ["column-concrete", "footing-concrete", "beam-concrete", "floor-slab"] },
  { key: "steelworks", label: "Steelworks", tools: ["steel-column", "steel-footing", "steel-beam", "steel-wall", "steel-slab"] },
  { key: "masonry", label: "Masonry", tools: ["tile-area", "chb-wall"] },
  { key: "plumbing", label: "Plumbing", tools: ["pipe-length"] },
  { key: "electrical", label: "Electrical", tools: ["wire-length"] }
];
const CHB_SIZE_OPTIONS = ['4" CHB', '6" CHB', '8" CHB'];
const REBAR_DIAMETER_OPTIONS = [10, 12, 16, 20, 25, 28, 32, 36];
const REBAR_LENGTH_OPTIONS = [6, 7.5, 9, 10.5, 12];
const REBAR_UNIT_WEIGHTS = {
  10: 0.617,
  12: 0.888,
  16: 1.579,
  20: 2.466,
  25: 3.853,
  28: 4.834,
  32: 6.313,
  36: 7.99
};
const STEEL_COLUMN_DEFAULTS = {
  longitudinalBarsPerColumn: 8,
  tieSpacing: 0.2,
  lapAllowancePerBar: 0,
  tieHookAllowance: 0,
  longitudinalWastePercent: 0,
  tieWastePercent: 0
};
const STEEL_FOOTING_DEFAULTS = {
  rebarSpacing: 0.15,
  allowancePerBar: 0
};
const STEEL_SLAB_TYPE_OPTIONS = [
  { key: "auto", label: "Auto by Span Ratio" },
  { key: "one-way", label: "One-Way Slab" },
  { key: "two-way", label: "Two-Way Slab" }
];
const STEEL_SLAB_DEFAULTS = {
  rebarSpacing: 0.2,
  type: "auto",
  thickness: 0.15,
  cover: 0.02,
  wastePercent: 10
};
const STEEL_BEAM_DEFAULTS = {
  width: 0.2,
  depth: 0.4,
  mainBars: 4,
  stirrupSpacing: 0.2,
  crankBars: 2,
  crankAllowancePerBar: 0
};
const STEEL_WALL_VERTICAL_MODE_OPTIONS = [
  { key: "full-height", label: "Full Wall Height / Rebar Length" },
  { key: "dowel", label: "Dowel" }
];
const STEEL_WALL_DEFAULTS = {
  height: 3,
  verticalSpacing: 0.6,
  horizontalSpacing: 0.6,
  dowelLength: 0.6,
  allowancePerBar: 0,
  verticalMode: "full-height"
};
const SNAP_GRID_TOOL_TYPES = new Set(["area", "linear", "curve", "chb"]);
const ORTHO_TOOL_TYPES = new Set(["area", "linear", "chb"]);
const OBJECT_SNAP_TOOL_TYPES = new Set(["area", "linear", "curve", "chb"]);
const OBJECT_SNAP_SCREEN_TOLERANCE = 16;
const LOCAL_VISION_LIBS = {
  pdfScript: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
  pdfWorker: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
  tesseractScript: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"
};
const LOCAL_VISION_CONFIG = {
  maxPages: 3,
  targetDpi: 300,
  maxCanvasSide: 3200
};
const LOCAL_VISION_REGIONS = [
  { key: "full-sheet", label: "Full Sheet", x: 0, y: 0, width: 1, height: 1 },
  { key: "right-notes", label: "Right Notes / Schedules", x: 0.58, y: 0, width: 0.42, height: 1 },
  { key: "bottom-title", label: "Bottom Schedules / Title Block", x: 0, y: 0.66, width: 1, height: 0.34 },
  { key: "upper-legends", label: "Upper Notes / Legends", x: 0, y: 0, width: 1, height: 0.36 }
];
const CONCRETE_MIX_DEFAULT = {
  dryVolumeFactor: 1.54,
  cementBagVolume: 0.0283
};
const CONCRETE_MIX_OPTIONS = [
  { key: "1:2:4", label: "1:2:4", cement: 1, sand: 2, gravel: 4 },
  { key: "1:1.5:3", label: "1:1.5:3", cement: 1, sand: 1.5, gravel: 3 },
  { key: "1:2:3", label: "1:2:3", cement: 1, sand: 2, gravel: 3 },
  { key: "1:3:6", label: "1:3:6", cement: 1, sand: 3, gravel: 6 }
];
const DEFAULT_CONCRETE_MIX_RATIO = "1:2:4";
const FLOOR_SLAB_THICKNESS_OPTIONS = [0.1, 0.125, 0.15, 0.2];
const TILE_TAKEOFF = {
  defaultLength: 0.6,
  defaultWidth: 0.6,
  defaultWastePercent: 5
};
const CHB_TAKEOFF = {
  blocksPerSquareMeter: 12.5,
  defaultWastePercent: 5,
  wasteFactor: 1.05
};
const ESTIMATE_V2_MATERIAL_TERMS = [
  { description: "Concrete", category: "Structural", planTypes: ["Structural", "Civil", "Architectural"], terms: ["concrete", "conc.", "ready mix", "pcc", "reinforced concrete", "r.c.", "rc concrete", "f'c", "fc=", "class a concrete", "lean concrete"] },
  { description: "Portland Cement", category: "Concrete Mix", planTypes: ["Structural", "Civil", "Architectural"], terms: ["cement", "portland cement", "type 1 cement", "cement bag"] },
  { description: "Fine Aggregate / Sand", category: "Concrete Mix", planTypes: ["Structural", "Civil", "Architectural"], terms: ["sand", "fine aggregate", "washed sand", "concrete sand"] },
  { description: "Coarse Aggregate / Gravel", category: "Concrete Mix", planTypes: ["Structural", "Civil", "Architectural"], terms: ["gravel", "coarse aggregate", "crushed gravel", "crushed stone", "aggregate", "3/4 gravel", "3/4\" gravel"] },
  { description: "Rebar / Reinforcing Bar", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["rebar", "reinforcing bar", "deformed bar", "steel bar", "r.s.b.", "rsb", "rebars", "main bar", "stirrups", "ties", "vertical bars", "horizontal bars", "db10", "db12", "db16", "db20"] },
  { description: "Foundation / Footing", category: "Structural Element", planTypes: ["Structural", "Civil"], terms: ["foundation", "footing", "footings", "foundation plan"] },
  { description: "Structural Wall", category: "Structural Element", planTypes: ["Structural", "Civil", "Architectural"], terms: ["wall", "walls", "xwall", "xwalls", "shear wall", "retaining wall"] },
  { description: "Column", category: "Structural Element", planTypes: ["Structural"], terms: ["column", "columns", "col.", "cols.", "schedule of columns", "column schedule"] },
  { description: "Beam", category: "Structural Element", planTypes: ["Structural"], terms: ["beam", "beams", "girder", "schedule of beams", "beam schedule"] },
  { description: "Slab", category: "Structural Element", planTypes: ["Structural", "Architectural"], terms: ["slab", "slabs", "suspended slab", "slab on grade"] },
  { description: "Joist", category: "Structural Element", planTypes: ["Structural", "Architectural"], terms: ["joist", "joists"] },
  { description: "Wire Mesh", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["wire mesh", "welded wire mesh", "wwm"] },
  { description: "Formworks", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["formwork", "formworks", "forms", "plyform"] },
  { description: "Tie Wire", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["tie wire", "g.i. tie wire", "binding wire"] },
  { description: "Anchor Bolt", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["anchor bolt", "anchor bolts", "expansion bolt"] },
  { description: "Concrete Spacer", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["concrete spacer", "bar chair", "chair bar", "dobie"] },
  { description: "Excavation", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["excavation", "excavate", "earthworks", "earth work"] },
  { description: "Backfill / Compacted Fill", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["backfill", "compacted fill", "selected fill", "structural fill"] },
  { description: "Gravel Bedding / Base", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["gravel bedding", "gravel base", "base course", "aggregate base course"] },
  { description: "Concrete Hollow Block", category: "Masonry", planTypes: ["Architectural", "Structural", "Civil"], terms: ["concrete hollow block", "hollow block", "chb", "100mm chb", "150mm chb", "200mm chb", "4\" chb", "6\" chb", "8\" chb"] },
  { description: "Masonry Mortar", category: "Masonry", planTypes: ["Architectural", "Structural", "Civil"], terms: ["mortar", "masonry mortar", "cement mortar", "plaster"] },
  { description: "Tiles", category: "Architectural", planTypes: ["Architectural"], terms: ["tile", "tiles", "ceramic tile", "porcelain tile"] },
  { description: "Paint", category: "Architectural", planTypes: ["Architectural"], terms: ["paint", "primer", "skim coat", "elastomeric"] },
  { description: "Plywood", category: "Architectural", planTypes: ["Architectural", "Structural"], terms: ["plywood", "phenolic board", "marine plywood"] },
  { description: "Gypsum Board", category: "Architectural", planTypes: ["Architectural"], terms: ["gypsum board", "drywall", "gypsum"] },
  { description: "Metal Stud / Framing", category: "Architectural", planTypes: ["Architectural"], terms: ["metal stud", "metal framing", "furring channel", "carrying channel"] },
  { description: "Glass", category: "Architectural", planTypes: ["Architectural"], terms: ["glass", "tempered glass", "glazing"] },
  { description: "Aluminum", category: "Architectural", planTypes: ["Architectural"], terms: ["aluminum", "aluminium", "aluminum frame"] },
  { description: "Doors", category: "Architectural", planTypes: ["Architectural"], terms: ["door", "doors", "door jamb"] },
  { description: "Windows", category: "Architectural", planTypes: ["Architectural"], terms: ["window", "windows", "window frame"] },
  { description: "Roofing", category: "Architectural", planTypes: ["Architectural"], terms: ["roofing", "roof panel", "long span", "flashing"] },
  { description: "Waterproofing", category: "Architectural", planTypes: ["Architectural", "Civil"], terms: ["waterproofing", "membrane", "sealant"] },
  { description: "PVC Pipe", category: "Plumbing", planTypes: ["Plumbing", "Fire Protection"], terms: ["pvc pipe", "pvc pipes", "polyvinyl chloride"] },
  { description: "PPR Pipe", category: "Plumbing", planTypes: ["Plumbing"], terms: ["ppr pipe", "ppr pipes"] },
  { description: "HDPE Pipe", category: "Plumbing", planTypes: ["Plumbing", "Civil"], terms: ["hdpe pipe", "hdpe pipes"] },
  { description: "GI Pipe", category: "Plumbing", planTypes: ["Plumbing", "Fire Protection"], terms: ["gi pipe", "g.i. pipe", "galvanized iron pipe"] },
  { description: "Valves", category: "Plumbing", planTypes: ["Plumbing", "Mechanical", "Fire Protection"], terms: ["valve", "valves", "gate valve", "ball valve", "check valve"] },
  { description: "Floor Drain", category: "Plumbing", planTypes: ["Plumbing"], terms: ["floor drain", "fd"] },
  { description: "Water Closet", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["water closet", "toilet", "wc"] },
  { description: "Lavatory", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["lavatory", "lav.", "wash basin"] },
  { description: "Faucet", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["faucet", "tap"] },
  { description: "Conduit", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["conduit", "emt", "imc", "pvc conduit", "rigid conduit"] },
  { description: "Wires / Cables", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["wire", "wires", "cable", "cables", "thhn", "thwn"] },
  { description: "Panel Board", category: "Electrical", planTypes: ["Electrical"], terms: ["panel board", "panelboard", "distribution panel", "load center"] },
  { description: "Circuit Breaker", category: "Electrical", planTypes: ["Electrical"], terms: ["breaker", "circuit breaker", "mccb", "mcb"] },
  { description: "Outlet", category: "Electrical", planTypes: ["Electrical"], terms: ["outlet", "receptacle", "convenience outlet"] },
  { description: "Switch", category: "Electrical", planTypes: ["Electrical"], terms: ["switch", "switches", "light switch"] },
  { description: "Lighting Fixture", category: "Electrical", planTypes: ["Electrical"], terms: ["lighting fixture", "light fixture", "luminaire", "downlight"] },
  { description: "Junction Box", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["junction box", "pull box", "utility box"] },
  { description: "Duct", category: "Mechanical", planTypes: ["Mechanical"], terms: ["duct", "ducting", "air duct"] },
  { description: "Diffuser / Grille", category: "Mechanical", planTypes: ["Mechanical"], terms: ["diffuser", "grille", "return air grille", "supply air diffuser"] },
  { description: "Damper", category: "Mechanical", planTypes: ["Mechanical"], terms: ["damper", "fire damper", "volume damper"] },
  { description: "Insulation", category: "Mechanical", planTypes: ["Mechanical", "Architectural"], terms: ["insulation", "thermal insulation", "acoustic insulation"] },
  { description: "Exhaust Fan", category: "Mechanical", planTypes: ["Mechanical", "Electrical"], terms: ["exhaust fan", "ventilating fan"] },
  { description: "Copper Tube", category: "Mechanical", planTypes: ["Mechanical"], terms: ["copper tube", "copper pipe", "refrigerant pipe"] },
  { description: "Air Conditioning Unit", category: "Mechanical", planTypes: ["Mechanical"], terms: ["aircon", "air conditioning", "ahu", "fcu", "split type"] },
  { description: "CAT6 Cable", category: "Electronics", planTypes: ["Electronics"], terms: ["cat6", "cat 6", "utp cable", "data cable"] },
  { description: "Data Outlet", category: "Electronics", planTypes: ["Electronics"], terms: ["data outlet", "information outlet", "io outlet"] },
  { description: "CCTV Camera", category: "Electronics", planTypes: ["Electronics"], terms: ["cctv", "camera", "ip camera"] },
  { description: "Smoke Detector", category: "Electronics", planTypes: ["Electronics", "Fire Protection"], terms: ["smoke detector", "detector", "heat detector"] },
  { description: "Speaker", category: "Electronics", planTypes: ["Electronics"], terms: ["speaker", "pa speaker"] },
  { description: "Access Point", category: "Electronics", planTypes: ["Electronics"], terms: ["access point", "wireless access point", "wap"] },
  { description: "Cable Tray", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["cable tray", "ladder tray"] },
  { description: "Fire Sprinkler", category: "Fire Protection", planTypes: ["Fire Protection"], terms: ["sprinkler", "sprinkler head", "fire sprinkler"] },
  { description: "Fire Hose Cabinet", category: "Fire Protection", planTypes: ["Fire Protection"], terms: ["fire hose cabinet", "fhc"] }
];
const YEAR_WEEKS_PER_MONTH = 4;
const GANTT_BAR_SIDE_MARGIN = 8;
const GANTT_BAR_INNER_PADDING = 4;
const NEW_PRICE_STORE = "__new_store__";

const state = {
  authTab: "signup",
  currentView: "welcome",
  engineeringView: "gantt",
  procurementView: "overview",
  procurementProjectSearch: "",
  accountingView: "overview",
  administrativeView: "accounts",
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
  estimateV2Pdf: null,
  estimateV2PageImage: "",
  estimateV2PageWidth: 0,
  estimateV2PageHeight: 0,
  estimateV2ActivePoints: [],
  estimateV2RedoPoints: [],
  estimateV2EditingRowId: "",
  estimateV2DraggingPointIndex: null,
  estimateV2SuppressNextPlanClick: false,
  estimateV2TakeoffUndoStack: [],
  estimateV2TakeoffRedoStack: [],
  estimateV2PlanExpanded: false,
  estimateV2ToolGroup: "setup",
  sideDockCollapsed: false,
  cloudSyncApplying: false,
  cloudSyncTimer: null,
  cloudSyncLoaded: false,
  cloudSyncSignature: "",
  cloudSyncInFlight: null,
  cloudSyncQueued: false,
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
  initializeCloudAppData().then((loaded) => {
    if (!loaded) return;
    seedProjects();
    render();
    handleGoogleDriveReturn();
  });
  handleGoogleDriveReturn();
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
    logout: handleLogout,
    "open-account": openAccountModal,
    "toggle-side-dock": () => {
      state.sideDockCollapsed = !state.sideDockCollapsed;
      render();
    },
    "main-view": () => openMainView(target.dataset.view),
    "procurement-tab": () => {
      state.procurementView = target.dataset.view || "overview";
      render();
    },
    "open-procurement-instructions": openProcurementInstructionModal,
    "accounting-tab": () => {
      state.accountingView = target.dataset.view || "overview";
      render();
    },
    "open-accounting-instructions": openAccountingInstructionModal,
    "administrative-tab": () => {
      state.administrativeView = target.dataset.view || "accounts";
      render();
    },
    "engineering-tab": () => {
      if (target.dataset.premiumLocked === "true") {
        showPremiumAccessNotice();
        return;
      }
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
    "connect-google-drive": connectGoogleDrive,
    "sync-google-drive": () => syncGoogleDriveSnapshot(true),
    "disconnect-google-drive": disconnectGoogleDrive,
    "refresh-google-drive-status": () => refreshGoogleDriveStatus(true),
    "close-modal": closeModal,
    "save-project": saveProject,
    "save-filter": saveFilter,
    "save-swa": saveSwa,
    "update-swa": updateSwa,
    "submit-swa-accounting": submitSwaToAccounting,
    "submit-estimate-procurement": () => submitEstimateToProcurement("v1"),
    "submit-estimate-v2-procurement": () => submitEstimateToProcurement("v2"),
    "add-estimate-row": addEstimateRow,
    "save-estimate-template": saveEstimateTemplate,
    "extract-estimate-v2-pdf": extractEstimateV2Pdf,
    "extract-estimate-v2-local": extractEstimateV2LocalVision,
    "extract-estimate-v2-ai": extractEstimateV2Ai,
    "open-estimate-v2-instructions": openEstimateV2InstructionModal,
    "add-estimate-v2-row": addEstimateV2Row,
    "save-estimate-v2-template": saveEstimateV2Template,
    "clear-estimate-v2": clearEstimateV2Draft,
    "delete-estimate-v2-row": () => deleteEstimateV2Row(id),
    "set-estimate-v2-tool-group": () => setEstimateV2TakeoffGroup(target.dataset.group),
    "set-estimate-v2-tool": () => setEstimateV2TakeoffTool(target.dataset.tool),
    "estimate-v2-plan-click": () => handleEstimateV2PlanClick(event),
    "finish-estimate-v2-takeoff": finishEstimateV2Takeoff,
    "add-estimate-v2-perpendicular": () => addEstimateV2PerpendicularPoint(false),
    "undo-estimate-v2-point": undoEstimateV2Point,
    "redo-estimate-v2-point": redoEstimateV2Point,
    "undo-estimate-v2-takeoff": undoEstimateV2GeneratedTakeoff,
    "clear-estimate-v2-points": clearEstimateV2Points,
    "cancel-estimate-v2-edit": cancelEstimateV2ShapeEdit,
    "toggle-estimate-v2-plan-fullscreen": toggleEstimateV2PlanExpanded,
    "estimate-v2-zoom-in": () => changeEstimateV2Zoom(0.25),
    "estimate-v2-zoom-out": () => changeEstimateV2Zoom(-0.25),
    "estimate-v2-zoom-reset": resetEstimateV2Zoom,
    "delete-estimate-v2-takeoff": () => deleteEstimateV2Takeoff(id),
    "edit-estimate-v2-takeoff": () => editEstimateV2Takeoff(id),
    "estimate-v2-prev-page": () => changeEstimateV2Page(-1),
    "estimate-v2-next-page": () => changeEstimateV2Page(1),
    "load-estimate-v2-stored-pdf": loadEstimateV2StoredPdf,
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
    "refresh-admin-accounts": refreshOwnerAccounts,
    "open-procurement-request": () => openProcurementRequestModal(id),
    "clear-procurement-project-filter": clearProcurementProjectFilter,
    "save-procurement-request": saveProcurementRequest,
    "delete-procurement-request": () => deleteProcurementRecord("requests", id),
    "open-purchase-order": () => openPurchaseOrderModal(id),
    "save-purchase-order": savePurchaseOrder,
    "delete-purchase-order": () => deleteProcurementRecord("orders", id),
    "open-supplier": () => openSupplierModal(id),
    "save-supplier": saveSupplier,
    "delete-supplier": () => deleteProcurementRecord("suppliers", id),
    "open-accounting-billing": () => openAccountingBillingModal(id),
    "save-accounting-billing": saveAccountingBilling,
    "delete-accounting-billing": () => deleteAccountingRecord("billings", id),
    "open-accounting-expense": () => openAccountingExpenseModal(id),
    "save-accounting-expense": saveAccountingExpense,
    "delete-accounting-expense": () => deleteAccountingRecord("expenses", id),
    "cancel-subscription": cancelSubscription,
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
  if (priceInput && event.key === "Enter") {
    event.preventDefault();
    handlePriceListEnter(priceInput);
    return;
  }
  if (state.currentView === "engineering" && state.engineeringView === "estimate-v2" && event.key === "F8") {
    event.preventDefault();
    toggleEstimateV2OrthoMode();
    return;
  }
  if (isTypingTarget(event.target)) return;
  if (state.currentView !== "engineering" || state.engineeringView !== "estimate-v2") return;
  const key = event.key.toLowerCase();
  if (!event.altKey && (event.metaKey || event.ctrlKey)) {
    if (key === "z") {
      event.preventDefault();
      if (event.shiftKey) redoEstimateV2PointOrTakeoff();
      else undoEstimateV2PointOrTakeoff();
    } else if (key === "y") {
      event.preventDefault();
      redoEstimateV2PointOrTakeoff();
    }
    return;
  }
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (key === "enter") {
    event.preventDefault();
    finishEstimateV2Takeoff();
  } else if (key === "p") {
    event.preventDefault();
    addEstimateV2PerpendicularPoint(event.shiftKey);
  } else if (key === "g") {
    event.preventDefault();
    toggleEstimateV2SnapGrid();
  } else if (key === "c") {
    event.preventDefault();
    setEstimateV2TakeoffTool("curve-line");
  }
});

document.addEventListener("pointerdown", handleEstimateV2PointPointerDown);
document.addEventListener("pointermove", handleEstimateV2PointPointerMove);
document.addEventListener("pointerup", handleEstimateV2PointPointerUp);
document.addEventListener("pointercancel", handleEstimateV2PointPointerUp);

document.addEventListener("input", (event) => {
  const procurementProjectFilter = event.target.closest("[data-procurement-project-filter]");
  if (procurementProjectFilter) {
    updateProcurementProjectFilter(procurementProjectFilter.value);
    return;
  }
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
  const estimateV2Input = event.target.closest("[data-estimate-v2-input]");
  if (estimateV2Input) {
    saveEstimateV2Draft(collectEstimateV2DraftFromDom());
    updateEstimateV2StructuralSummary();
    return;
  }
  const estimateV2TakeoffInput = event.target.closest("[data-estimate-v2-takeoff-input]");
  if (estimateV2TakeoffInput) {
    if (estimateV2TakeoffInput.matches("[data-estimate-v2-project-select]")) {
      state.estimateV2EditingRowId = "";
      state.estimateV2ActivePoints = [];
      state.estimateV2RedoPoints = [];
      state.estimateV2DraggingPointIndex = null;
      clearEstimateV2TakeoffHistory();
    }
    saveEstimateV2Draft(collectEstimateV2DraftFromDom());
    updateEstimateV2TakeoffTotals();
    if (estimateV2TakeoffInput.matches("[data-estimate-v2-snap-grid], [data-estimate-v2-ortho], [data-estimate-v2-object-snap], [data-estimate-v2-layer-toggle], [data-estimate-v2-label-toggle]")) render();
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
  const estimateV2FileInput = event.target.closest("[data-estimate-v2-file]");
  if (estimateV2FileInput) {
    loadEstimateV2TakeoffPdf(estimateV2FileInput.files && estimateV2FileInput.files[0]);
    return;
  }
  const estimateV2TakeoffInput = event.target.closest("[data-estimate-v2-takeoff-input]");
  if (estimateV2TakeoffInput) {
    if (estimateV2TakeoffInput.matches("[data-estimate-v2-project-select]")) {
      state.estimateV2EditingRowId = "";
      state.estimateV2ActivePoints = [];
      state.estimateV2RedoPoints = [];
      state.estimateV2DraggingPointIndex = null;
      clearEstimateV2TakeoffHistory();
    }
    saveEstimateV2Draft(collectEstimateV2DraftFromDom());
    updateEstimateV2TakeoffTotals();
    if (estimateV2TakeoffInput.matches("[data-estimate-v2-snap-grid], [data-estimate-v2-snap-size], [data-estimate-v2-ortho], [data-estimate-v2-object-snap], [data-estimate-v2-project-select], [data-estimate-v2-layer-toggle], [data-estimate-v2-label-toggle]")) render();
    return;
  }
  const target = event.target.closest("[data-action]");
  if (target && target.dataset.action === "toggle-password-visibility") {
    togglePasswordVisibility(target);
    return;
  }
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
  if (target && target.dataset.action === "select-estimate-project") {
    updateEstimateProject(target.value);
    return;
  }
  if (target && target.dataset.action === "estimate-v2-plan-type") {
    updateEstimateV2PlanType(target.value);
    return;
  }
  if (target && target.dataset.action === "estimate-v2-scale") {
    updateEstimateV2Scale(target.value);
    return;
  }
  if (target && target.dataset.action === "select-price-store") {
    state.activePriceStore = target.value || NEW_PRICE_STORE;
    render();
    return;
  }
  if (target && target.dataset.action === "procurement-request-status") {
    updateProcurementStatus("requests", target.dataset.id, target.value);
    return;
  }
  if (target && target.dataset.action === "purchase-order-status") {
    updateProcurementStatus("orders", target.dataset.id, target.value);
    return;
  }
  if (target && target.dataset.action === "accounting-billing-status") {
    updateAccountingStatus("billings", target.dataset.id, target.value);
    return;
  }
  if (target && target.dataset.action === "accounting-expense-status") {
    updateAccountingStatus("expenses", target.dataset.id, target.value);
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

function setSyncedJson(storageKey, value) {
  localStorage.setItem(storageKey, JSON.stringify(value));
  scheduleCloudAppDataSync();
}

function removeSyncedJson(storageKey) {
  localStorage.removeItem(storageKey);
  scheduleCloudAppDataSync();
}

function collectCloudAppData() {
  return CLOUD_APP_DATA_KEYS.reduce((data, item) => {
    data[item.dataKey] = readJson(item.storageKey, item.fallback);
    return data;
  }, {});
}

function cloudDataSignature(data) {
  return JSON.stringify(data);
}

function applyCloudAppData(data) {
  if (!data || typeof data !== "object") return;
  state.cloudSyncApplying = true;
  try {
    CLOUD_APP_DATA_KEYS.forEach((item) => {
      if (!Object.prototype.hasOwnProperty.call(data, item.dataKey)) return;
      const value = data[item.dataKey];
      if (value === null || value === undefined) {
        localStorage.removeItem(item.storageKey);
      } else {
        localStorage.setItem(item.storageKey, JSON.stringify(value));
      }
    });
    state.estimateV2Pdf = null;
    state.estimateV2PageImage = "";
    state.estimateV2PageWidth = 0;
    state.estimateV2PageHeight = 0;
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
    state.estimateV2EditingRowId = "";
    state.estimateV2DraggingPointIndex = null;
    state.estimateV2PlanExpanded = false;
    clearEstimateV2TakeoffHistory();
  } finally {
    state.cloudSyncApplying = false;
  }
  state.cloudSyncSignature = cloudDataSignature(collectCloudAppData());
}

async function initializeCloudAppData() {
  if (!sessionToken()) return false;
  try {
    const response = await apiRequest("/app-data/load", {}, { timeoutMs: 10000 });
    if (response.account) savePublicAccount(response.account);
    if (response.empty) {
      await saveCloudAppDataNow();
    } else {
      applyCloudAppData(response.data);
    }
    state.cloudSyncLoaded = true;
    return true;
  } catch (error) {
    console.warn(error);
    state.backendNotice = error.message || "Cloud data sync is unavailable.";
    toast(state.backendNotice);
    return false;
  }
}

function scheduleCloudAppDataSync() {
  if (state.cloudSyncApplying || !sessionToken()) return;
  window.clearTimeout(state.cloudSyncTimer);
  state.cloudSyncTimer = window.setTimeout(() => {
    saveCloudAppDataNow();
  }, 1200);
}

async function saveCloudAppDataNow() {
  if (state.cloudSyncApplying || !sessionToken()) return false;
  window.clearTimeout(state.cloudSyncTimer);
  state.cloudSyncTimer = null;

  if (state.cloudSyncInFlight) {
    state.cloudSyncQueued = true;
    await state.cloudSyncInFlight;
    return saveCloudAppDataNow();
  }

  const data = collectCloudAppData();
  const signature = cloudDataSignature(data);
  if (signature === state.cloudSyncSignature) return true;

  const operation = apiRequest("/app-data/save", { data }, { timeoutMs: 15000 });
  state.cloudSyncInFlight = operation;
  try {
    const response = await operation;
    if (response.account) savePublicAccount(response.account);
    state.cloudSyncSignature = signature;
    await syncGoogleDriveSnapshot(false);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  } finally {
    if (state.cloudSyncInFlight === operation) state.cloudSyncInFlight = null;
    if (state.cloudSyncQueued) {
      state.cloudSyncQueued = false;
      scheduleCloudAppDataSync();
    }
  }
}

function googleDriveStatus(account = getSessionAccount()) {
  const drive = account && account.googleDrive && typeof account.googleDrive === "object" ? account.googleDrive : null;
  return drive || { connected: false };
}

function googleDriveConnected(account = getSessionAccount()) {
  return Boolean(googleDriveStatus(account).connected);
}

async function handleGoogleDriveReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("googleDrive");
  if (!status) return;
  params.delete("googleDrive");
  params.delete("message");
  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", nextUrl);
  if (status === "connected") {
    await refreshGoogleDriveStatus(false);
    toast("Google Drive connected.");
    await syncGoogleDriveSnapshot(true);
  } else if (status === "error") {
    toast("Google Drive connection failed.");
  }
}

async function refreshGoogleDriveStatus(showNotice = false) {
  if (!sessionToken()) return false;
  try {
    const response = await apiRequest("/google/drive/status", null, { method: "GET", timeoutMs: 10000 });
    if (response.account) savePublicAccount(response.account);
    if (showNotice) toast(response.googleDrive && response.googleDrive.connected ? "Google Drive is connected." : "Google Drive is not connected.");
    render();
    return Boolean(response.googleDrive && response.googleDrive.connected);
  } catch (error) {
    if (showNotice) toast(error.message || "Google Drive status could not be checked.");
    return false;
  }
}

async function connectGoogleDrive() {
  if (!sessionToken()) {
    toast("Sign in first.");
    return;
  }
  await saveCloudAppDataNow();
  try {
    const response = await apiRequest("/google/drive/auth-url", {}, { timeoutMs: 10000 });
    if (!response.authUrl) throw new Error("Google authorization URL was not created.");
    window.location.href = response.authUrl;
  } catch (error) {
    toast(error.message || "Google Drive connection could not start.");
  }
}

async function syncGoogleDriveSnapshot(showNotice = false) {
  const account = getSessionAccount();
  if (!sessionToken() || !googleDriveConnected(account)) return false;
  try {
    const response = await apiRequest("/google/drive/sync", {}, { timeoutMs: 60000 });
    if (response.account) savePublicAccount(response.account);
    if (showNotice) {
      const linkText = response.spreadsheetUrl ? " Google Sheet updated." : " Google Drive sync complete.";
      toast(linkText.trim());
    }
    return true;
  } catch (error) {
    console.warn(error);
    if (showNotice) toast(error.message || "Google Drive sync failed.");
    return false;
  }
}

async function disconnectGoogleDrive() {
  if (!window.confirm("Disconnect Google Drive sync for this workspace? Existing Google Sheets will stay in the user's Drive.")) return;
  try {
    const response = await apiRequest("/google/drive/disconnect", {}, { timeoutMs: 10000 });
    if (response.account) savePublicAccount(response.account);
    render();
    toast("Google Drive disconnected.");
  } catch (error) {
    toast(error.message || "Google Drive could not be disconnected.");
  }
}

async function handleLogout() {
  if (sessionToken()) {
    await saveCloudAppDataNow();
    try {
      await apiRequest("/auth/logout", {});
    } catch (error) {
      console.warn("Unable to revoke backend session during logout.", error);
    }
  }
  localStorage.removeItem(STORAGE.session);
  clearLocalAppData();
  state.currentView = "welcome";
  state.cloudSyncLoaded = false;
  state.cloudSyncSignature = "";
  state.cloudSyncQueued = false;
  render();
}

function clearLocalAppData() {
  state.cloudSyncApplying = true;
  try {
    CLOUD_APP_DATA_KEYS.forEach((item) => localStorage.removeItem(item.storageKey));
    state.activeSwaSheetId = "draft";
    state.activePriceStore = "";
    state.estimateV2Pdf = null;
    state.estimateV2PageImage = "";
    state.estimateV2PageWidth = 0;
    state.estimateV2PageHeight = 0;
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
    state.estimateV2EditingRowId = "";
    state.estimateV2DraggingPointIndex = null;
    state.estimateV2PlanExpanded = false;
    clearEstimateV2TakeoffHistory();
  } finally {
    state.cloudSyncApplying = false;
  }
}

function getProjects() {
  return readJson(STORAGE.projects, []);
}

function saveProjects(projects) {
  setSyncedJson(STORAGE.projects, projects);
}

function normalizeOperationsRecord(record, defaults) {
  const source = record && typeof record === "object" ? record : {};
  const normalized = { ...source };
  Object.entries(defaults).forEach(([key, fallback]) => {
    const value = source[key];
    if (value === undefined || value === null || (typeof fallback === "string" && !String(value).trim())) {
      normalized[key] = fallback;
    }
  });
  return normalized;
}

function getProcurementState() {
  const source = readJson(STORAGE.procurement, null) || {};
  return {
    requests: Array.isArray(source.requests) ? source.requests.map((item) => normalizeOperationsRecord(item, {
      item: "Untitled Request",
      projectId: "",
      quantity: 0,
      unit: "",
      estimatedUnitCost: 0,
      neededBy: "",
      priority: "Medium",
      status: "Pending",
      enteredByName: "",
      enteredByEmail: ""
    })) : [],
    orders: Array.isArray(source.orders) ? source.orders.map((item) => normalizeOperationsRecord(item, {
      poNumber: "Unnumbered PO",
      projectId: "",
      supplierId: "",
      item: "Untitled Order",
      quantity: 0,
      unit: "",
      unitCost: 0,
      expectedDate: "",
      status: "Draft",
      enteredByName: "",
      enteredByEmail: ""
    })) : [],
    suppliers: Array.isArray(source.suppliers) ? source.suppliers.map((item) => normalizeOperationsRecord(item, {
      name: "Unnamed Supplier",
      contactPerson: "",
      email: "",
      phone: "",
      enteredByName: "",
      enteredByEmail: ""
    })) : []
  };
}

function saveProcurementState(procurement) {
  setSyncedJson(STORAGE.procurement, {
    requests: Array.isArray(procurement.requests) ? procurement.requests : [],
    orders: Array.isArray(procurement.orders) ? procurement.orders : [],
    suppliers: Array.isArray(procurement.suppliers) ? procurement.suppliers : [],
    updatedAt: new Date().toISOString()
  });
}

function getAccountingState() {
  const source = readJson(STORAGE.accounting, null) || {};
  return {
    billings: Array.isArray(source.billings) ? source.billings.map((item) => normalizeOperationsRecord(item, {
      billingNumber: "Unnumbered Billing",
      projectId: "",
      description: "Billing",
      amount: 0,
      dueDate: "",
      status: "Draft",
      enteredByName: "",
      enteredByEmail: ""
    })) : [],
    expenses: Array.isArray(source.expenses) ? source.expenses.map((item) => normalizeOperationsRecord(item, {
      projectId: "",
      date: "",
      category: "Other",
      description: "Expense",
      payee: "",
      amount: 0,
      status: "Unpaid",
      enteredByName: "",
      enteredByEmail: ""
    })) : []
  };
}

function saveAccountingState(accounting) {
  setSyncedJson(STORAGE.accounting, {
    billings: Array.isArray(accounting.billings) ? accounting.billings : [],
    expenses: Array.isArray(accounting.expenses) ? accounting.expenses : [],
    updatedAt: new Date().toISOString()
  });
}

function enteredByFields(existing = {}) {
  const account = getSessionAccount() || {};
  const now = new Date().toISOString();
  return {
    enteredById: existing.enteredById || account.id || "",
    enteredByName: existing.enteredByName || account.name || "",
    enteredByEmail: existing.enteredByEmail || account.email || "",
    createdAt: existing.createdAt || now,
    updatedById: account.id || "",
    updatedByName: account.name || "",
    updatedByEmail: account.email || "",
    updatedAt: now
  };
}

function projectSelectOptions(selectedProjectId = "") {
  return `
    <option value="" ${selectedProjectId ? "" : "selected"}>General / No project</option>
    ${getProjects().map((project) => `<option value="${project.id}" ${selectedProjectId === project.id ? "selected" : ""}>${escapeHtml(project.name)}</option>`).join("")}
  `;
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
  return {
    trialStartedAt: null,
    status: "free",
    cancelledAt: null
  };
}

function createTrialSubscription() {
  const created = {
    trialStartedAt: new Date().toISOString(),
    status: "trial",
    cancelledAt: null
  };
  setSyncedJson(STORAGE.subscription, created);
  return created;
}

function saveSubscription(subscription) {
  setSyncedJson(STORAGE.subscription, subscription);
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
  setSyncedJson(STORAGE.swa, swa);
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

function renderPreservingEstimateV2Scroll() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const planStage = document.querySelector(".estimate-v2-plan-stage");
  const planScrollLeft = planStage ? planStage.scrollLeft : 0;
  const planScrollTop = planStage ? planStage.scrollTop : 0;
  render();
  restoreEstimateV2Scroll(scrollX, scrollY, planScrollLeft, planScrollTop);
  window.requestAnimationFrame(() => restoreEstimateV2Scroll(scrollX, scrollY, planScrollLeft, planScrollTop));
}

function restoreEstimateV2Scroll(scrollX, scrollY, planScrollLeft, planScrollTop) {
  window.scrollTo(scrollX, scrollY);
  const nextPlanStage = document.querySelector(".estimate-v2-plan-stage");
  if (!nextPlanStage) return;
  nextPlanStage.scrollLeft = planScrollLeft;
  nextPlanStage.scrollTop = planScrollTop;
}

async function apiRequest(path, body, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), Number(options.timeoutMs) || 5000);
  const token = sessionToken();
  const headers = { "Content-Type": "application/json" };
  const method = String(options.method || "POST").toUpperCase();
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${API_ROOT}${path}`, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : JSON.stringify(body),
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

async function apiBinaryRequest(path, body, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), Number(options.timeoutMs) || 30000);
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
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const error = new Error(payload.error || "Backend request failed.");
      error.fromBackend = true;
      error.statusCode = response.status;
      throw error;
    }
    return response.blob();
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
    || host === "127.0.0.1";
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
          ${renderLegalLinks()}
        </div>
      </section>
    </main>
  `;
}

function renderLegalLinks() {
  return `
    <div class="legal-links" aria-label="Legal links">
      <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>
      <span aria-hidden="true">|</span>
      <a href="/terms-of-agreement.html" target="_blank" rel="noopener">Terms of Agreement</a>
    </div>
  `;
}

function renderSignupForm(invite) {
  return `
    <form class="form-stack" id="signup-form">
      <div class="field">
        <label for="signup-name">Full Name</label>
        <input id="signup-name" name="name" autocomplete="name" maxlength="120" required>
      </div>
      <div class="field">
        <label for="signup-email">Email</label>
        <input id="signup-email" name="email" type="email" autocomplete="email" maxlength="254" required>
      </div>
      <div class="field">
        <label for="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" data-password-toggle-target required>
      </div>
      <div class="field">
        <label for="signup-confirm-password">Confirm Password</label>
        <input id="signup-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="128" data-password-toggle-target required>
      </div>
      <label class="checkline">
        <input id="signup-show-password" type="checkbox" data-action="toggle-password-visibility">
        See password
      </label>
      <label class="checkline">
        <input id="signup-gmail" name="gmail" type="checkbox">
        Link this account with Gmail
      </label>
      <button class="primary-btn" data-action="signup">Create Account</button>
      <p class="auth-note">
        ${invite ? `This invited account will receive: ${escapeHtml(accessText(invite.access))}.` : "This direct signup will become an owner account and receive all module access."}
        Accounts are created directly. Email OTP verification is disabled for now.
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
        <input id="login-email" name="email" type="email" autocomplete="email" maxlength="254" required>
      </div>
      <div class="field">
        <label for="login-password">Password</label>
        <input id="login-password" name="password" type="password" autocomplete="current-password" maxlength="128" data-password-toggle-target required>
      </div>
      <label class="checkline">
        <input id="login-show-password" type="checkbox" data-action="toggle-password-visibility">
        See password
      </label>
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
      <div class="app-layout ${state.sideDockCollapsed ? "side-dock-collapsed" : ""}">
        ${renderSideDock(account)}
        <section class="main-stage">
          ${renderMainStage(account)}
        </section>
      </div>
    </main>
  `;
}

function renderMainStage(account) {
  if (state.currentView === "engineering") return renderEngineeringView(account);
  if (state.currentView === "procurement") return renderProcurementView(account);
  if (state.currentView === "accounting") return renderAccountingView(account);
  if (state.currentView === "administrative") return renderAdministrativeView(account);
  return renderWelcome(account);
}

function iconSvg(name) {
  const icons = {
    account: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.6-4.5 14.4-4.5 16 0"></path>',
    engineering: '<path d="M14.7 6.3l3 3"></path><path d="M3 21l4.5-1 10.2-10.2-3-3L4.5 17 3 21z"></path>',
    procurement: '<path d="M6 7h15l-2 8H8L6 3H3"></path><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle>',
    accounting: '<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 7h8M8 11h8M8 15h3M15 15h1M8 18h3M15 18h1"></path>',
    administrative: '<path d="M9 4h6l1 2h3v15H5V6h3l1-2z"></path><path d="M9 12h6M9 16h6"></path>',
    collapse: '<path d="M15 6l-6 6 6 6"></path>',
    expand: '<path d="M9 6l6 6-6 6"></path>',
    info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 10v7"></path><path d="M12 7h.01"></path>',
    save: '<path d="M5 3h12l2 2v16H5z"></path><path d="M8 3v6h8V3"></path><path d="M8 21v-7h8v7"></path>',
    clear: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M6 6l1 15h10l1-15"></path><path d="M10 11v6M14 11v6"></path>',
    add: '<path d="M12 5v14M5 12h14"></path>',
    check: '<path d="M20 6L9 17l-5-5"></path>',
    fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"></path>',
    exitFullscreen: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"></path>',
    undo: '<path d="M9 7H4v5"></path><path d="M4 12c2-4 6-6 10-5 3 .7 5.4 3 6 6"></path>',
    redo: '<path d="M15 7h5v5"></path><path d="M20 12c-2-4-6-6-10-5-3 .7-5.4 3-6 6"></path>',
    eraser: '<path d="M3 17l8-8 6 6-5 5H6z"></path><path d="M14 6l5 5"></path><path d="M12 20h9"></path>',
    zoomIn: '<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-5-5"></path><path d="M11 8v6M8 11h6"></path>',
    zoomOut: '<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-5-5"></path><path d="M8 11h6"></path>',
    reset: '<path d="M4 4v6h6"></path><path d="M5 10a7 7 0 1 0 2-5"></path>',
    setup: '<path d="M4 18L18 4"></path><path d="M8 20l12-12"></path><path d="M4 18l2 2 2-2-2-2z"></path>',
    architectural: '<path d="M3 21h18"></path><path d="M5 21V9l7-5 7 5v12"></path><path d="M9 21v-7h6v7"></path>',
    structural: '<path d="M4 20h16"></path><path d="M6 20V6h12v14"></path><path d="M6 10h12M6 14h12M10 6v14M14 6v14"></path>',
    steelworks: '<path d="M4 7h16M4 12h16M4 17h16"></path><path d="M7 5v14M17 5v14"></path>',
    masonry: '<path d="M4 6h16v12H4z"></path><path d="M4 10h16M4 14h16M9 6v4M15 10v4M9 14v4"></path>',
    plumbing: '<path d="M5 7h9a4 4 0 0 1 0 8H8"></path><path d="M8 12h6"></path><path d="M5 5v4M8 10v4"></path>',
    electrical: '<path d="M13 2L5 14h6l-1 8 9-13h-6z"></path>',
    calibrate: '<path d="M4 19l15-15"></path><path d="M7 16l2 2M10 13l2 2M13 10l2 2M16 7l2 2"></path>',
    door: '<path d="M7 21V4h10v17"></path><path d="M7 21h12"></path><path d="M14 13h.01"></path>',
    window: '<rect x="4" y="5" width="16" height="14" rx="1"></rect><path d="M12 5v14M4 12h16"></path>',
    curve: '<path d="M4 17c5-11 11 11 16-2"></path>',
    column: '<path d="M8 4h8v16H8z"></path><path d="M6 4h12M6 20h12"></path>',
    footing: '<path d="M4 18h16"></path><path d="M7 14h10l2 4H5z"></path><path d="M10 6h4v8h-4z"></path>',
    beam: '<path d="M4 10h16v4H4z"></path><path d="M6 7v10M18 7v10"></path>',
    slab: '<path d="M4 8l8-4 8 4-8 4z"></path><path d="M4 12l8 4 8-4"></path><path d="M4 16l8 4 8-4"></path>',
    tiles: '<path d="M4 4h7v7H4z"></path><path d="M13 4h7v7h-7z"></path><path d="M4 13h7v7H4z"></path><path d="M13 13h7v7h-7z"></path>',
    chb: '<path d="M4 6h16v12H4z"></path><path d="M4 12h16M10 6v6M14 12v6"></path>',
    pipe: '<path d="M4 8h11a5 5 0 0 1 0 10H8"></path><path d="M8 14h7"></path>',
    wire: '<path d="M6 4c8 0 4 16 12 16"></path><path d="M4 8c8 0 4 12 12 12"></path>',
    generic: '<circle cx="12" cy="12" r="8"></circle>'
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.generic}</svg>`;
}

function iconLabel(label) {
  return `<span class="sr-only">${escapeHtml(label)}</span>`;
}

function iconButton(label, iconName, className, attributes = "") {
  return `<button class="${className} icon-btn" ${attributes} aria-label="${escapeAttribute(label)}">${iconSvg(iconName)}${iconLabel(label)}</button>`;
}

function accessIcon(key) {
  return {
    engineering: "engineering",
    procurement: "procurement",
    accounting: "accounting",
    administrative: "administrative"
  }[key] || "generic";
}

function renderWelcome(account) {
  const projects = getProjects();
  const delayed = projects.filter(isDelayedProject).length;
  const subscription = getSubscription();
  return `
    <section class="welcome-card">
      <span class="eyebrow">Project Command Center</span>
      <h1>Welcome, ${escapeHtml(account.name)}</h1>
      <p>Choose an area from the left container to manage engineering, procurement, accounting, and the modules assigned to your account.</p>
      <div class="dashboard-grid">
        <div class="mini-card"><span class="eyebrow">Projects</span><div class="value">${projects.length}</div></div>
        <div class="mini-card"><span class="eyebrow">Delayed</span><div class="value">${delayed}</div></div>
        <div class="mini-card"><span class="eyebrow">Plan</span><div class="value">${accountPlanLabel(account, subscription)}</div><span class="hint">${planHint(account, subscription)}</span></div>
        <div class="mini-card"><span class="eyebrow">Role</span><div class="value">${account.role === "owner" ? "Owner" : "Member"}</div></div>
      </div>
    </section>
  `;
}

function renderSideDock(account) {
  const collapsed = state.sideDockCollapsed;
  return `
    <aside class="side-dock ${collapsed ? "collapsed" : ""}">
      <div class="dock-head">
        <div class="dock-title"><span class="dock-title-icon">${iconSvg("account")}</span><span class="dock-label">Account Controls</span></div>
        ${iconButton(collapsed ? "Expand account controls" : "Collapse account controls", collapsed ? "expand" : "collapse", "ghost-btn compact-btn dock-collapse-btn", 'data-action="toggle-side-dock"')}
      </div>
      <div class="dock-actions">
        <button class="dock-btn" data-action="open-account" aria-label="Account">${iconSvg("account")}<span class="dock-label">Account</span></button>
        ${ACCESS_KEYS.filter((item) => item.key !== "administrative" || account.role === "owner").map((item) => `
          <button class="dock-btn" data-action="main-view" data-view="${item.key}" aria-label="${escapeAttribute(item.label)}" ${hasAccess(account, item.key) ? "" : "disabled"}>
            ${iconSvg(accessIcon(item.key))}<span class="dock-label">${escapeHtml(item.label)}</span>
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
  const lockedViews = premiumLockedViews(account);
  if (lockedViews.includes(state.engineeringView)) state.engineeringView = "gantt";
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
        ].map(([view, label]) => {
          const locked = lockedViews.includes(view);
          return `
            <button class="toolbar-btn ${state.engineeringView === view ? "active" : ""} ${locked ? "locked" : ""}" data-action="engineering-tab" data-view="${view}" ${locked ? `data-premium-locked="true" aria-disabled="true"` : ""} title="${locked ? "For Premium Access Only" : ""}">${label}</button>
          `;
        }).join("")}
      </div>
      <div class="visual-container">
        ${renderEngineeringVisual(account)}
      </div>
    </section>
  `;
}

function renderEngineeringVisual(account) {
  if (state.engineeringView === "gantt") return renderGanttView();
  if (state.engineeringView === "project-list") return renderProjectList();
  if (state.engineeringView === "swa") return renderSwaView();
  if (state.engineeringView === "estimate") return renderEstimateView();
  if (premiumLockedViews(account).includes(state.engineeringView)) return renderPlanLockedView(state.engineeringView);
  if (state.engineeringView === "estimate-v2") return renderEstimateV2View();
  if (state.engineeringView === "price-list") return renderMaterialPriceListView();
  if (state.engineeringView === "dashboard") return renderDashboardView();
  if (state.engineeringView === "settings") return renderSettingsView();
  const titles = {
    milestone: "Milestone"
  };
  return `<div class="placeholder">${titles[state.engineeringView]} will be built in the next module.</div>`;
}

function renderModuleToolbar(module, activeView, views, instructionAction = "") {
  return `
    <div class="toolbar-container" aria-label="${escapeAttribute(module)} toolbar">
      <div class="module-toolbar-tabs">
        ${views.map(([view, label]) => `
          <button class="toolbar-btn ${activeView === view ? "active" : ""}" data-action="${module}-tab" data-view="${view}">${escapeHtml(label)}</button>
        `).join("")}
      </div>
      ${instructionAction ? iconButton(`${module} instructions`, "info", "ghost-btn module-instruction-btn", `data-action="${instructionAction}"`) : ""}
    </div>
  `;
}

function renderProcurementView(account) {
  if (!hasAccess(account, "procurement")) {
    return `<section class="visual-container"><div class="placeholder">Procurement access is not assigned to this account.</div></section>`;
  }
  return `
    <section>
      ${renderModuleToolbar("procurement", state.procurementView, [
        ["overview", "Dashboard"],
        ["requests", "Purchase Requests"],
        ["orders", "Purchase Orders"],
        ["suppliers", "Suppliers"]
      ], "open-procurement-instructions")}
      <div class="visual-container">${renderProcurementVisual()}</div>
    </section>
  `;
}

function renderProcurementVisual() {
  const procurement = getProcurementState();
  if (state.procurementView === "requests") return renderProcurementRequests(procurement);
  if (state.procurementView === "orders") return renderPurchaseOrders(procurement);
  if (state.procurementView === "suppliers") return renderSuppliers(procurement);
  return renderProcurementOverview(procurement);
}

function renderProcurementOverview(procurement) {
  const activeRequests = procurement.requests.filter((item) => !["Received", "Cancelled"].includes(item.status));
  const activeOrders = procurement.orders.filter((item) => !["Received", "Cancelled"].includes(item.status));
  const committed = procurement.orders.filter((item) => item.status !== "Cancelled").reduce((total, item) => total + procurementOrderTotal(item), 0);
  const received = procurement.orders.filter((item) => item.status === "Received").reduce((total, item) => total + procurementOrderTotal(item), 0);
  const overdueOrders = procurement.orders.filter((item) => isOverdueProcurementOrder(item));
  const year = analyticsLatestYear(procurement.orders, ["expectedDate", "createdAt"]);
  const monthlySpend = analyticsMonthlySeries(procurement.orders.filter((item) => item.status !== "Cancelled"), ["expectedDate", "createdAt"], procurementOrderTotal, year);
  const supplierSpend = analyticsRankedTotals(
    procurement.orders.filter((item) => item.status !== "Cancelled"),
    (item) => supplierName(procurement, item.supplierId),
    procurementOrderTotal
  );
  const orderStatuses = analyticsStatusCounts(procurement.orders, PROCUREMENT_ORDER_STATUSES);
  const requestStatuses = analyticsStatusCounts(procurement.requests, PROCUREMENT_REQUEST_STATUSES);
  const upcoming = procurement.orders
    .filter((item) => item.expectedDate && !["Received", "Cancelled"].includes(item.status))
    .sort((first, second) => String(first.expectedDate).localeCompare(String(second.expectedDate)))
    .slice(0, 6);
  return `
    <div class="visual-head analytics-title-row">
      <div><span class="eyebrow">Procurement Intelligence</span><h2>Procurement Dashboard</h2><p class="hint">Purchasing activity, supplier concentration, and delivery performance.</p></div>
      <button class="primary-btn" data-action="open-procurement-request">New Request</button>
    </div>
    <div class="analytics-kpi-grid">
      ${renderAnalyticsKpi("Open Requests", activeRequests.length, "Awaiting procurement action")}
      ${renderAnalyticsKpi("Active Orders", activeOrders.length, `${overdueOrders.length} overdue`, overdueOrders.length ? "risk" : "good")}
      ${renderAnalyticsKpi("Committed Spend", formatCurrencyCompact(committed), "All non-cancelled POs", "money")}
      ${renderAnalyticsKpi("Received Value", formatCurrencyCompact(received), `${formatAnalyticsPercent(safeDivide(received, committed))} of committed`, "good")}
      ${renderAnalyticsKpi("Suppliers", procurement.suppliers.length, "Registered vendors")}
    </div>
    <div class="analytics-dashboard-grid">
      <section class="analytics-panel analytics-panel-wide">
        ${renderAnalyticsPanelHead("Purchase Spend", `Monthly PO value | ${year}`)}
        ${renderAnalyticsVerticalBars(monthlySpend, { currency: true })}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Order Status", `${procurement.orders.length} purchase orders`)}
        ${renderAnalyticsDonut(orderStatuses, procurement.orders.length)}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Spend by Supplier", "Highest committed suppliers")}
        ${renderAnalyticsRankedBars(supplierSpend, { currency: true })}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Request Pipeline", `${procurement.requests.length} total requests`)}
        ${renderAnalyticsRankedBars(requestStatuses)}
      </section>
      <section class="analytics-panel analytics-panel-wide">
        <div class="analytics-panel-head">
          <div><span class="eyebrow">Delivery Watch</span><h3>Upcoming & Overdue Orders</h3></div>
          <button class="secondary-btn compact-btn" data-action="procurement-tab" data-view="orders">View Orders</button>
        </div>
        ${renderProcurementDeliveryWatch(upcoming)}
      </section>
    </div>
  `;
}

function renderProcurementRequests(procurement) {
  const projectGroups = procurementRequestProjectGroups(procurement.requests);
  const search = String(state.procurementProjectSearch || "").trim();
  const visibleGroups = projectGroups.filter((group) => procurementProjectGroupMatches(group, search));
  const visibleMaterials = visibleGroups.reduce((total, group) => total + group.requests.length, 0);
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Procurement</span><h2>Purchase Requests</h2><p class="hint">Materials are bundled by project with their submission dates.</p></div>
      <button class="primary-btn" data-action="open-procurement-request">Add Request</button>
    </div>
    <div class="procurement-project-filter">
      <label>
        <span>Search Project</span>
        <input
          type="search"
          role="combobox"
          list="procurement-project-options"
          data-procurement-project-filter
          value="${escapeAttribute(search)}"
          placeholder="All projects"
          autocomplete="off"
          aria-label="Search project materials"
        >
        <datalist id="procurement-project-options">
          ${projectGroups.map((group) => `<option value="${escapeAttribute(group.projectName)}">${formatInteger(group.requests.length)} materials</option>`).join("")}
        </datalist>
      </label>
      <div class="procurement-project-filter-result" data-procurement-filter-status>
        <strong>${formatInteger(visibleGroups.length)} project${visibleGroups.length === 1 ? "" : "s"}</strong>
        <span>${formatInteger(visibleMaterials)} material${visibleMaterials === 1 ? "" : "s"} shown</span>
      </div>
      <button class="ghost-btn compact-btn" data-action="clear-procurement-project-filter" ${search ? "" : "disabled"}>Clear</button>
    </div>
    <div class="table-wrap operations-table-wrap">
      <table class="operations-table procurement-request-table">
        <thead><tr><th>Material / Item</th><th>Quantity</th><th>Estimated Cost</th><th>Submitted</th><th>Needed By</th><th>Priority</th><th>Status</th><th>Entered By</th><th>Actions</th></tr></thead>
        ${projectGroups.length ? projectGroups.map((group) => renderProcurementRequestProjectGroup(group, search)).join("") : `<tbody><tr><td colspan="9">No purchase requests yet.</td></tr></tbody>`}
        <tbody data-procurement-no-matches ${visibleGroups.length || !projectGroups.length ? "hidden" : ""}><tr><td colspan="9">No project materials match this search.</td></tr></tbody>
      </table>
    </div>
  `;
}

function procurementRequestProjectGroups(requests) {
  const groups = new Map();
  (Array.isArray(requests) ? requests : []).forEach((item) => {
    const projectId = String(item.projectId || "");
    const key = projectId || "__general__";
    if (!groups.has(key)) groups.set(key, { projectId, projectName: projectName(projectId), requests: [] });
    groups.get(key).requests.push(item);
  });
  return [...groups.values()]
    .map((group) => {
      const requests = [...group.requests].sort((first, second) => {
        const dateOrder = procurementRequestTimestamp(second).localeCompare(procurementRequestTimestamp(first));
        return dateOrder || String(first.item || "").localeCompare(String(second.item || ""));
      });
      return {
        ...group,
        requests,
        estimatedTotal: requests.reduce((total, item) => total + procurementRequestEstimatedTotal(item), 0),
        latestSubmittedAt: requests.reduce((latest, item) => {
          const timestamp = procurementRequestTimestamp(item);
          return timestamp > latest ? timestamp : latest;
        }, "")
      };
    })
    .sort((first, second) => {
      if (!first.projectId) return 1;
      if (!second.projectId) return -1;
      return first.projectName.localeCompare(second.projectName);
    });
}

function renderProcurementRequestProjectGroup(group, search = "") {
  const submittedCount = group.requests.filter((item) => item.sourceType === "estimate").length;
  const hidden = procurementProjectGroupMatches(group, search) ? "" : "hidden";
  return `
    <tbody data-procurement-project-group data-project-search="${escapeAttribute(group.projectName.toLowerCase())}" ${hidden}>
      <tr class="procurement-project-group">
        <td colspan="9">
          <div class="procurement-project-summary">
            <div>
              <span class="eyebrow">Project Bundle</span>
              <strong>${escapeHtml(group.projectName)}</strong>
            </div>
            <div><span>Materials</span><strong>${formatInteger(group.requests.length)}</strong></div>
            <div><span>From Estimates</span><strong>${formatInteger(submittedCount)}</strong></div>
            <div><span>Estimated Total</span><strong>${formatCurrency(group.estimatedTotal)}</strong></div>
            <div><span>Latest Submission</span><strong>${group.latestSubmittedAt ? formatDateTime(group.latestSubmittedAt) : "-"}</strong></div>
          </div>
        </td>
      </tr>
      ${group.requests.map(renderProcurementRequestRow).join("")}
    </tbody>
  `;
}

function procurementProjectGroupMatches(group, search) {
  const query = String(search || "").trim().toLowerCase();
  return !query || String(group && group.projectName || "").toLowerCase().includes(query);
}

function updateProcurementProjectFilter(value) {
  const search = String(value || "").trim();
  state.procurementProjectSearch = search;
  const query = search.toLowerCase();
  const groups = [...document.querySelectorAll("[data-procurement-project-group]")];
  let visibleGroups = 0;
  let visibleMaterials = 0;
  groups.forEach((group) => {
    const matches = !query || String(group.dataset.projectSearch || "").includes(query);
    group.hidden = !matches;
    if (!matches) return;
    visibleGroups += 1;
    visibleMaterials += Math.max(0, group.querySelectorAll("tr").length - 1);
  });
  const noMatches = document.querySelector("[data-procurement-no-matches]");
  if (noMatches) noMatches.hidden = visibleGroups > 0 || groups.length === 0;
  const status = document.querySelector("[data-procurement-filter-status]");
  if (status) {
    status.innerHTML = `<strong>${formatInteger(visibleGroups)} project${visibleGroups === 1 ? "" : "s"}</strong><span>${formatInteger(visibleMaterials)} material${visibleMaterials === 1 ? "" : "s"} shown</span>`;
  }
  const clearButton = document.querySelector('[data-action="clear-procurement-project-filter"]');
  if (clearButton) clearButton.disabled = !search;
}

function clearProcurementProjectFilter() {
  state.procurementProjectSearch = "";
  render();
}

function renderProcurementRequestRow(item) {
  const timestamp = procurementRequestTimestamp(item);
  const sourceLabel = item.sourceType === "estimate"
    ? `Estimate ${String(item.sourceEstimateVersion || "").toUpperCase()}`
    : "Manual Request";
  return `
    <tr>
      <td>
        <strong>${escapeHtml(item.item)}</strong>
        <small>${escapeHtml(sourceLabel)}</small>
      </td>
      <td>${formatSwaNumber(item.quantity)} ${escapeHtml(item.unit)}</td>
      <td>${formatCurrency(procurementRequestEstimatedTotal(item))}</td>
      <td><strong>${timestamp ? formatDateTime(timestamp) : "-"}</strong>${item.submittedByName ? `<small>${escapeHtml(item.submittedByName)}</small>` : ""}</td>
      <td>${item.neededBy ? formatDate(item.neededBy) : "-"}</td>
      <td><span class="badge ${workflowStatusClass(item.priority)}">${escapeHtml(item.priority)}</span></td>
      <td>${renderWorkflowSelect("procurement-request-status", item.id, item.status, PROCUREMENT_REQUEST_STATUSES)}</td>
      <td>${renderEnteredBy(item)}</td>
      <td class="operations-actions"><button class="ghost-btn compact-btn" data-action="open-procurement-request" data-id="${item.id}">Edit</button><button class="ghost-btn compact-btn danger" data-action="delete-procurement-request" data-id="${item.id}">Delete</button></td>
    </tr>
  `;
}

function procurementRequestTimestamp(item) {
  return String(item && (item.submittedAt || item.createdAt || item.updatedAt) || "");
}

function procurementRequestEstimatedTotal(item) {
  return (Number(item && item.quantity) || 0) * (Number(item && item.estimatedUnitCost) || 0);
}

function renderPurchaseOrders(procurement) {
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Procurement</span><h2>Purchase Orders</h2><p class="hint">Track ordered materials, suppliers, costs, and deliveries.</p></div>
      <button class="primary-btn" data-action="open-purchase-order">Add Purchase Order</button>
    </div>
    ${renderPurchaseOrderTable(procurement.orders, procurement)}
  `;
}

function renderPurchaseOrderTable(orders, procurement) {
  return `
    <div class="table-wrap operations-table-wrap">
      <table class="operations-table">
        <thead><tr><th>PO / Project</th><th>Supplier</th><th>Item</th><th>Total</th><th>Expected</th><th>Status</th><th>Entered By</th><th>Actions</th></tr></thead>
        <tbody>
          ${orders.length ? orders.map((item) => `
            <tr>
              <td><strong>${escapeHtml(item.poNumber)}</strong><small>${escapeHtml(projectName(item.projectId))}</small></td>
              <td>${escapeHtml(supplierName(procurement, item.supplierId))}</td>
              <td><strong>${escapeHtml(item.item)}</strong><small>${formatSwaNumber(item.quantity)} ${escapeHtml(item.unit)} @ ${formatCurrency(item.unitCost)}</small></td>
              <td>${formatCurrency(procurementOrderTotal(item))}</td>
              <td>${item.expectedDate ? formatDate(item.expectedDate) : "-"}</td>
              <td>${renderWorkflowSelect("purchase-order-status", item.id, item.status, PROCUREMENT_ORDER_STATUSES)}</td>
              <td>${renderEnteredBy(item)}</td>
              <td class="operations-actions"><button class="ghost-btn compact-btn" data-action="open-purchase-order" data-id="${item.id}">Edit</button><button class="ghost-btn compact-btn danger" data-action="delete-purchase-order" data-id="${item.id}">Delete</button></td>
            </tr>
          `).join("") : `<tr><td colspan="8">No purchase orders yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderSuppliers(procurement) {
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Procurement</span><h2>Suppliers</h2><p class="hint">Maintain supplier contact information for purchase orders.</p></div>
      <button class="primary-btn" data-action="open-supplier">Add Supplier</button>
    </div>
    <div class="operations-card-grid">
      ${procurement.suppliers.length ? procurement.suppliers.map((supplier) => `
        <article class="operations-card">
          <span class="eyebrow">Supplier</span><h3>${escapeHtml(supplier.name)}</h3>
          <p>${escapeHtml(supplier.contactPerson || "No contact person")}</p>
          <small>${escapeHtml(supplier.email || "No email")} | ${escapeHtml(supplier.phone || "No phone")}</small>
          <div class="operations-actions"><button class="secondary-btn compact-btn" data-action="open-supplier" data-id="${supplier.id}">Edit</button><button class="ghost-btn compact-btn danger" data-action="delete-supplier" data-id="${supplier.id}">Delete</button></div>
        </article>
      `).join("") : `<div class="placeholder">No suppliers yet.</div>`}
    </div>
  `;
}

function renderAccountingView(account) {
  if (!hasAccess(account, "accounting")) {
    return `<section class="visual-container"><div class="placeholder">Accounting access is not assigned to this account.</div></section>`;
  }
  return `
    <section>
      ${renderModuleToolbar("accounting", state.accountingView, [
        ["overview", "Sales Dashboard"],
        ["billings", "Billings"],
        ["expenses", "Expenses"]
      ], "open-accounting-instructions")}
      <div class="visual-container">${renderAccountingVisual()}</div>
    </section>
  `;
}

function renderAccountingVisual() {
  const accounting = getAccountingState();
  if (state.accountingView === "billings") return renderAccountingBillings(accounting);
  if (state.accountingView === "expenses") return renderAccountingExpenses(accounting);
  return renderAccountingOverview(accounting);
}

function renderAccountingOverview(accounting) {
  const contractTotal = getProjects().reduce((total, item) => total + (Number(item.contractAmount) || 0), 0);
  const billed = accounting.billings.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const collected = accounting.billings.filter((item) => item.status === "Paid").reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const expenses = accounting.expenses.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const outstanding = Math.max(0, billed - collected);
  const year = analyticsLatestYear([...accounting.billings, ...accounting.expenses], ["dueDate", "date", "createdAt"]);
  const monthlyBillings = analyticsMonthlySeries(accounting.billings, ["dueDate", "createdAt"], (item) => Number(item.amount) || 0, year);
  const monthlyCollections = analyticsMonthlySeries(accounting.billings.filter((item) => item.status === "Paid"), ["dueDate", "createdAt"], (item) => Number(item.amount) || 0, year);
  const monthlyExpenses = analyticsMonthlySeries(accounting.expenses, ["date", "createdAt"], (item) => Number(item.amount) || 0, year);
  const projectRevenue = analyticsRankedTotals(accounting.billings, (item) => projectName(item.projectId), (item) => Number(item.amount) || 0);
  const billingStatuses = analyticsStatusCounts(accounting.billings, ACCOUNTING_BILLING_STATUSES);
  return `
    <div class="visual-head analytics-title-row">
      <div><span class="eyebrow">Commercial Analysis</span><h2>Sales Dashboard</h2><p class="hint">Progress billing revenue, collections, project performance, and cash movement.</p></div>
      <div class="operations-actions"><button class="secondary-btn" data-action="open-accounting-expense">Add Expense</button><button class="primary-btn" data-action="open-accounting-billing">Add Billing</button></div>
    </div>
    <div class="analytics-kpi-grid">
      ${renderAnalyticsKpi("Contract Portfolio", formatCurrencyCompact(contractTotal), `${getProjects().length} projects`, "money")}
      ${renderAnalyticsKpi("Total Billed", formatCurrencyCompact(billed), `${accounting.billings.length} billings`, "money")}
      ${renderAnalyticsKpi("Collected", formatCurrencyCompact(collected), `${formatAnalyticsPercent(safeDivide(collected, billed))} collection rate`, "good")}
      ${renderAnalyticsKpi("Outstanding", formatCurrencyCompact(outstanding), "Billed but not yet paid", outstanding ? "risk" : "good")}
      ${renderAnalyticsKpi("Net Cash", formatCurrencyCompact(collected - expenses), `${formatCurrencyCompact(expenses)} expenses`, collected - expenses >= 0 ? "good" : "risk")}
    </div>
    <div class="analytics-dashboard-grid">
      <section class="analytics-panel analytics-panel-wide">
        ${renderAnalyticsPanelHead("Revenue Evolution", `Monthly billings and collections | ${year}`)}
        ${renderAnalyticsGroupedBars(monthlyBillings, monthlyCollections, "Billed", "Collected")}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Billing Status", `${accounting.billings.length} billing records`)}
        ${renderAnalyticsDonut(billingStatuses, accounting.billings.length)}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Revenue by Project", "Highest billed projects")}
        ${renderAnalyticsRankedBars(projectRevenue, { currency: true })}
      </section>
      <section class="analytics-panel">
        ${renderAnalyticsPanelHead("Expense Movement", `Monthly expenses | ${year}`)}
        ${renderAnalyticsVerticalBars(monthlyExpenses, { currency: true, risk: true })}
      </section>
      <section class="analytics-panel analytics-panel-wide">
        <div class="analytics-panel-head">
          <div><span class="eyebrow">Recent Activity</span><h3>Latest Billings</h3></div>
          <button class="secondary-btn compact-btn" data-action="accounting-tab" data-view="billings">View Billings</button>
        </div>
        ${renderSalesBillingWatch(accounting.billings.slice(-6).reverse())}
      </section>
    </div>
  `;
}

function renderAccountingBillings(accounting) {
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Accounting</span><h2>Billings</h2><p class="hint">Track billing submissions, approvals, and collections.</p></div>
      <button class="primary-btn" data-action="open-accounting-billing">Add Billing</button>
    </div>
    ${renderAccountingBillingTable(accounting.billings)}
  `;
}

function renderAccountingBillingTable(billings) {
  return `
    <div class="table-wrap operations-table-wrap">
      <table class="operations-table">
        <thead><tr><th>Billing / Project</th><th>Description</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Entered By</th><th>Actions</th></tr></thead>
        <tbody>
          ${billings.length ? billings.map((item) => `
            <tr>
              <td><strong>${escapeHtml(item.billingNumber)}</strong><small>${escapeHtml(projectName(item.projectId))}</small></td>
              <td>${escapeHtml(item.description)}</td><td>${formatCurrency(item.amount)}</td><td>${item.dueDate ? formatDate(item.dueDate) : "-"}</td>
              <td>${renderWorkflowSelect("accounting-billing-status", item.id, item.status, ACCOUNTING_BILLING_STATUSES)}</td>
              <td>${renderEnteredBy(item)}</td>
              <td class="operations-actions"><button class="ghost-btn compact-btn" data-action="open-accounting-billing" data-id="${item.id}">Edit</button><button class="ghost-btn compact-btn danger" data-action="delete-accounting-billing" data-id="${item.id}">Delete</button></td>
            </tr>
          `).join("") : `<tr><td colspan="7">No billing records yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderAccountingExpenses(accounting) {
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Accounting</span><h2>Expenses</h2><p class="hint">Record project expenses and payment status.</p></div>
      <button class="primary-btn" data-action="open-accounting-expense">Add Expense</button>
    </div>
    <div class="table-wrap operations-table-wrap">
      <table class="operations-table">
        <thead><tr><th>Date / Project</th><th>Category</th><th>Description / Payee</th><th>Amount</th><th>Payment Status</th><th>Entered By</th><th>Actions</th></tr></thead>
        <tbody>
          ${accounting.expenses.length ? accounting.expenses.map((item) => `
            <tr>
              <td><strong>${item.date ? formatDate(item.date) : "-"}</strong><small>${escapeHtml(projectName(item.projectId))}</small></td>
              <td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(item.description)}</strong><small>${escapeHtml(item.payee || "")}</small></td><td>${formatCurrency(item.amount)}</td>
              <td>${renderWorkflowSelect("accounting-expense-status", item.id, item.status, ACCOUNTING_EXPENSE_STATUSES)}</td>
              <td>${renderEnteredBy(item)}</td>
              <td class="operations-actions"><button class="ghost-btn compact-btn" data-action="open-accounting-expense" data-id="${item.id}">Edit</button><button class="ghost-btn compact-btn danger" data-action="delete-accounting-expense" data-id="${item.id}">Delete</button></td>
            </tr>
          `).join("") : `<tr><td colspan="7">No expense records yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdministrativeView(account) {
  if (!account || account.role !== "owner") {
    return `<section class="visual-container"><div class="placeholder">Administrative is restricted to the owner account.</div></section>`;
  }
  return `
    <section>
      ${renderModuleToolbar("administrative", state.administrativeView, [["accounts", "Accounts & Access"], ["workspace", "Workspace Data"]])}
      <div class="visual-container">
        ${state.administrativeView === "workspace" ? renderAdministrativeWorkspace() : renderAdministrativeAccounts(account)}
      </div>
    </section>
  `;
}

function renderAdministrativeAccounts(owner) {
  return `
    <div class="visual-head">
      <div><span class="eyebrow">Owner Only</span><h2>Accounts & Access</h2><p class="hint">Assign Engineering, Procurement, and Accounting access. Administrative access always remains owner-only.</p></div>
      <button class="secondary-btn" data-action="refresh-admin-accounts">Refresh Accounts</button>
    </div>
    ${renderOwnerAccountTools(owner)}
  `;
}

function renderAdministrativeWorkspace() {
  const procurement = getProcurementState();
  const accounting = getAccountingState();
  return `
    <div class="visual-head"><div><span class="eyebrow">Owner Only</span><h2>Workspace Data</h2><p class="hint">This shared workspace is synchronized through the active backend storage for the owner and invited accounts.</p></div></div>
    <div class="operations-kpi-grid">
      ${renderOperationsKpi("Projects", getProjects().length)}
      ${renderOperationsKpi("Purchase Requests", procurement.requests.length)}
      ${renderOperationsKpi("Purchase Orders", procurement.orders.length)}
      ${renderOperationsKpi("Billings", accounting.billings.length)}
      ${renderOperationsKpi("Expenses", accounting.expenses.length)}
    </div>
    ${renderGoogleDrivePanel()}
    <section class="operations-panel"><span class="eyebrow">Security</span><h3>Module Access Rules</h3><p class="hint">Engineering, Procurement, and Accounting permissions are assigned by the owner. Administrative remains restricted to the owner. Each saved record stores the full name and email of the user who entered it.</p></section>
  `;
}

function renderOperationsKpi(label, value, className = "") {
  return `<div class="operations-kpi ${className}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function renderAnalyticsKpi(label, value, detail, className = "") {
  return `
    <article class="analytics-kpi ${className}">
      <span>${escapeHtml(label)}</span>
      <strong title="${escapeAttribute(String(value))}">${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function renderAnalyticsPanelHead(title, detail) {
  return `
    <div class="analytics-panel-head">
      <div><span class="eyebrow">${escapeHtml(detail)}</span><h3>${escapeHtml(title)}</h3></div>
    </div>
  `;
}

function analyticsRecordDate(record, dateKeys) {
  const value = dateKeys.map((key) => record && record[key]).find(Boolean);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function analyticsLatestYear(records, dateKeys) {
  const years = records
    .map((record) => analyticsRecordDate(record, dateKeys))
    .filter(Boolean)
    .map((date) => date.getFullYear());
  return years.length ? Math.max(...years) : new Date().getFullYear();
}

function analyticsMonthlySeries(records, dateKeys, valueForRecord, year) {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = Array(12).fill(0);
  records.forEach((record) => {
    const date = analyticsRecordDate(record, dateKeys);
    if (!date || date.getFullYear() !== year) return;
    values[date.getMonth()] += Number(valueForRecord(record)) || 0;
  });
  return monthLabels.map((label, index) => ({ label, value: values[index] }));
}

function analyticsRankedTotals(records, labelForRecord, valueForRecord) {
  const totals = new Map();
  records.forEach((record) => {
    const label = String(labelForRecord(record) || "Unassigned").trim() || "Unassigned";
    totals.set(label, (totals.get(label) || 0) + (Number(valueForRecord(record)) || 0));
  });
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((first, second) => second.value - first.value);
}

function analyticsStatusCounts(records, statuses) {
  return statuses.map((status) => ({
    label: status,
    value: records.filter((record) => record.status === status).length,
    color: analyticsStatusColor(status)
  })).filter((item) => item.value > 0);
}

function analyticsStatusColor(status) {
  const normalized = String(status || "").toLowerCase();
  if (/(received|paid|approved|completed)/.test(normalized)) return "#31d982";
  if (/(cancelled|rejected|overdue|unpaid)/.test(normalized)) return "#ff3155";
  if (/(pending|sent|submitted|partially)/.test(normalized)) return "#ffad42";
  return "#48a8ff";
}

function renderAnalyticsVerticalBars(series, options = {}) {
  const max = Math.max(0, ...series.map((item) => item.value));
  if (!max) return `<div class="analytics-empty">No dated records are available for this chart.</div>`;
  return `
    <div class="analytics-vertical-chart ${options.risk ? "risk" : ""}">
      ${series.map((item) => {
        const height = max ? Math.max(item.value ? 4 : 0, (item.value / max) * 100) : 0;
        const value = options.currency ? formatCurrencyCompact(item.value) : formatInteger(item.value);
        return `
          <div class="analytics-column" title="${escapeAttribute(`${item.label}: ${value}`)}">
            <span class="analytics-column-value">${item.value ? escapeHtml(value) : ""}</span>
            <span class="analytics-column-bar" style="--bar-height:${height.toFixed(2)}%"></span>
            <small>${escapeHtml(item.label)}</small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAnalyticsGroupedBars(firstSeries, secondSeries, firstLabel, secondLabel) {
  const max = Math.max(0, ...firstSeries.map((item) => item.value), ...secondSeries.map((item) => item.value));
  if (!max) return `<div class="analytics-empty">No dated billing records are available for this chart.</div>`;
  return `
    <div class="analytics-chart-legend"><span><i class="billed"></i>${escapeHtml(firstLabel)}</span><span><i class="collected"></i>${escapeHtml(secondLabel)}</span></div>
    <div class="analytics-grouped-chart">
      ${firstSeries.map((item, index) => {
        const second = secondSeries[index] || { value: 0 };
        const firstHeight = Math.max(item.value ? 4 : 0, safeDivide(item.value, max) * 100);
        const secondHeight = Math.max(second.value ? 4 : 0, safeDivide(second.value, max) * 100);
        return `
          <div class="analytics-group">
            <div class="analytics-group-bars">
              <span class="analytics-group-bar billed" style="--bar-height:${firstHeight.toFixed(2)}%" title="${escapeAttribute(`${firstLabel}: ${formatCurrency(item.value)}`)}"></span>
              <span class="analytics-group-bar collected" style="--bar-height:${secondHeight.toFixed(2)}%" title="${escapeAttribute(`${secondLabel}: ${formatCurrency(second.value)}`)}"></span>
            </div>
            <small>${escapeHtml(item.label)}</small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAnalyticsRankedBars(rows, options = {}) {
  const visible = rows.slice(0, 6);
  const max = Math.max(0, ...visible.map((item) => item.value));
  if (!visible.length || !max) return `<div class="analytics-empty">No data is available for this ranking.</div>`;
  return `
    <div class="analytics-ranked-list">
      ${visible.map((item) => {
        const value = options.currency ? formatCurrencyCompact(item.value) : formatInteger(item.value);
        return `
          <div class="analytics-ranked-item">
            <div class="analytics-ranked-meta"><span title="${escapeAttribute(item.label)}">${escapeHtml(item.label)}</span><strong>${escapeHtml(value)}</strong></div>
            <div class="analytics-ranked-track"><span style="--rank-width:${(item.value / max * 100).toFixed(2)}%"></span></div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAnalyticsDonut(rows, total) {
  if (!rows.length || !total) return `<div class="analytics-empty">No status data is available yet.</div>`;
  let cursor = 0;
  const gradient = rows.map((item) => {
    const start = cursor;
    cursor += safeDivide(item.value, total) * 360;
    return `${item.color} ${start.toFixed(2)}deg ${cursor.toFixed(2)}deg`;
  }).join(", ");
  return `
    <div class="analytics-donut-wrap">
      <div class="analytics-donut" style="--analytics-donut:conic-gradient(${gradient})"><span>${formatInteger(total)}<small>Total</small></span></div>
      <div class="analytics-donut-legend">
        ${rows.map((item) => `<div><i style="--legend-color:${item.color}"></i><span>${escapeHtml(item.label)}</span><strong>${formatInteger(item.value)}</strong></div>`).join("")}
      </div>
    </div>
  `;
}

function renderProcurementDeliveryWatch(orders) {
  if (!orders.length) return `<div class="analytics-empty">No active purchase-order deliveries are scheduled.</div>`;
  return `
    <div class="analytics-watch-list">
      ${orders.map((order) => {
        const overdue = isOverdueProcurementOrder(order);
        return `
          <article class="analytics-watch-item ${overdue ? "risk" : ""}">
            <div><strong>${escapeHtml(order.poNumber)}</strong><span>${escapeHtml(order.item)} | ${escapeHtml(projectName(order.projectId))}</span></div>
            <div><strong>${formatCurrencyCompact(procurementOrderTotal(order))}</strong><span>${overdue ? "Overdue" : formatDate(order.expectedDate)}</span></div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderSalesBillingWatch(billings) {
  if (!billings.length) return `<div class="analytics-empty">No billing activity is available yet.</div>`;
  return `
    <div class="analytics-watch-list">
      ${billings.map((billing) => `
        <article class="analytics-watch-item">
          <div><strong>${escapeHtml(billing.billingNumber)}</strong><span>${escapeHtml(projectName(billing.projectId))} | ${escapeHtml(billing.description)}</span></div>
          <div><strong>${formatCurrencyCompact(billing.amount)}</strong><span class="analytics-status-text ${workflowStatusClass(billing.status)}">${escapeHtml(billing.status)}</span></div>
        </article>
      `).join("")}
    </div>
  `;
}

function isOverdueProcurementOrder(order) {
  if (!order || !order.expectedDate || ["Received", "Cancelled"].includes(order.status)) return false;
  return new Date(order.expectedDate) < startOfDay(new Date());
}

function formatAnalyticsPercent(value) {
  return `${(Math.max(0, Number(value) || 0) * 100).toFixed(1)}%`;
}

function renderWorkflowSelect(action, id, status, options) {
  return `<select class="workflow-select ${workflowStatusClass(status)}" data-action="${action}" data-id="${id}" aria-label="Update status">${options.map((option) => `<option value="${escapeAttribute(option)}" ${status === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
}

function workflowStatusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (/(received|paid|approved|completed|low)/.test(normalized)) return "green";
  if (/(cancelled|rejected|high|unpaid)/.test(normalized)) return "red";
  if (/(pending|sent|submitted|partially|medium)/.test(normalized)) return "orange";
  return "blue";
}

function renderEnteredBy(item) {
  return `<strong>${escapeHtml(item.enteredByName || "-")}</strong><small>${escapeHtml(item.enteredByEmail || "")}</small>`;
}

function projectName(projectId) {
  const project = getProjects().find((item) => item.id === projectId);
  return project ? project.name : "General / No project";
}

function supplierName(procurement, supplierId) {
  const supplier = procurement.suppliers.find((item) => item.id === supplierId);
  return supplier ? supplier.name : "No supplier";
}

function procurementOrderTotal(item) {
  return (Number(item && item.quantity) || 0) * (Number(item && item.unitCost) || 0);
}

function renderPlanLockedView(view) {
  const labels = {
    estimate: "Estimate Calculator",
    "estimate-v2": "Estimate v2",
    dashboard: "Dashboard"
  };
  const label = labels[view] || "This feature";
  return `<div class="placeholder">${label} is available for subscribed accounts only. This account is currently on the Free plan.</div>`;
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

function renderGoogleDrivePanel() {
  const account = getSessionAccount();
  const drive = googleDriveStatus(account);
  const connected = Boolean(drive.connected);
  const ownerOnly = account && account.role !== "owner";
  return `
    <section class="settings-panel google-drive-panel">
      <div class="settings-panel-headline">
        <span class="eyebrow">Customer Storage</span>
        <h3>Google Drive / Gmail Sync</h3>
        <p class="hint">Project, estimate, procurement, accounting, and SWA data can be saved into the signed-in user's Google Drive as an Excel-style Google Sheet.</p>
      </div>
      <div class="google-drive-status ${connected ? "connected" : ""}">
        <span>${connected ? "Connected" : "Not Connected"}</span>
        <strong>${connected ? escapeHtml(drive.email || "Google Drive") : "Connect Google Drive"}</strong>
        ${drive.lastSyncedAt ? `<small>Last synced ${formatDateTime(drive.lastSyncedAt)}</small>` : ""}
        ${drive.lastError ? `<small class="danger-text">${escapeHtml(drive.lastError)}</small>` : ""}
      </div>
      <div class="google-drive-actions">
        ${connected && drive.spreadsheetUrl ? `<a class="secondary-btn" href="${escapeHtml(drive.spreadsheetUrl)}" target="_blank" rel="noopener">Open Sheet</a>` : ""}
        ${connected ? `<button class="primary-btn" data-action="sync-google-drive">Sync Now</button>` : `<button class="primary-btn" data-action="connect-google-drive" ${ownerOnly ? "disabled" : ""}>Connect Google Drive</button>`}
        <button class="secondary-btn" data-action="refresh-google-drive-status">Refresh</button>
        ${connected ? `<button class="danger-btn" data-action="disconnect-google-drive" ${ownerOnly ? "disabled" : ""}>Disconnect</button>` : ""}
      </div>
      ${ownerOnly ? `<p class="hint">Only the owner can connect the workspace to Google Drive. Members use the owner's connected workspace sheet.</p>` : ""}
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
        <button class="secondary-btn" data-action="submit-estimate-procurement" ${estimateProcurementRows("v1", draft).length ? "" : "disabled"}>
          ${draft.submittedToProcurementAt ? "Update Procurement Submission" : "Submit to Procurement"}
        </button>
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
      <label class="estimate-store-filter">
        <span>Project</span>
        <select data-action="select-estimate-project" aria-label="Select estimate project">
          ${projectSelectOptions(draft.selectedProjectId)}
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
  const rows = estimateV2ProjectRows(draft);
  const totalCost = estimateV2TakeoffTotal(rows);
  const totalArea = rows.filter((row) => estimateV2TakeoffTool(row.tool).type === "area").reduce((total, row) => total + (Number(row.quantity) || 0), 0);
  const totalLength = rows.filter((row) => ["linear", "curve"].includes(estimateV2TakeoffTool(row.tool).type)).reduce((total, row) => {
    if (row.tool === "beam-concrete" || row.tool === "steel-beam") return total + (Number(row.beamLength) || 0);
    if (row.tool === "steel-wall") return total + (Number(row.wallLength) || 0);
    return total + (Number(row.quantity) || 0);
  }, 0);
  const totalChb = rows.filter((row) => estimateV2TakeoffTool(row.tool).type === "chb").reduce((total, row) => total + (Number(row.quantity) || 0), 0);
  const totalConcrete = rows.reduce((total, row) => {
    const tool = estimateV2TakeoffTool(row.tool);
    return total + (Number(row.concreteVolume) || (tool.type === "concrete-count" ? Number(row.quantity) || 0 : 0));
  }, 0);
  const totalConcreteMix = concreteMixBreakdown(totalConcrete);
  const totalCount = rows.filter((row) => estimateV2TakeoffTool(row.tool).type === "count").reduce((total, row) => total + (Number(row.quantity) || 0), 0);
  return `
    <div class="visual-head">
      <div>
        <span class="eyebrow">Engineering View</span>
        <h2>Estimate v2</h2>
      </div>
      <div class="estimate-actions">
        ${iconButton("Estimate v2 Instructions", "info", "secondary-btn", 'data-action="open-estimate-v2-instructions"')}
        ${iconButton(
          draft.submittedToProcurementAt ? "Update Procurement Submission" : "Submit to Procurement",
          "procurement",
          "secondary-btn",
          `data-action="submit-estimate-v2-procurement" ${estimateProcurementRows("v2", draft).length ? "" : "disabled"}`
        )}
        ${iconButton("Save Template", "save", "secondary-btn", 'data-action="save-estimate-v2-template"')}
        ${iconButton("Clear Estimate v2", "clear", "ghost-btn danger", 'data-action="clear-estimate-v2"')}
      </div>
    </div>
    <section class="estimate-v2-summary-panel estimate-v2-summary-panel-wide">
      ${renderEstimateV2Metric("Floor Area", `${formatSwaNumber(totalArea)} m2`)}
      ${renderEstimateV2Metric("Length", `${formatSwaNumber(totalLength)} m`)}
      ${renderEstimateV2Metric("CHB", `${formatInteger(totalChb)} pcs`)}
      ${renderEstimateV2Metric("Concrete", `${formatSwaNumber(totalConcrete)} cu.m`)}
      ${renderEstimateV2Metric("Cement", `${formatInteger(totalConcreteMix.cementBags)} bags`)}
      ${renderEstimateV2Metric("Count", formatInteger(totalCount))}
      ${renderEstimateV2Metric("Total Cost", formatEstimateV2TotalCost(totalCost))}
    </section>
    ${renderEstimateV2TakeoffWorkspace(draft)}
    ${renderEstimateV2TakeoffTable(rows)}
  `;
}

function estimateV2GroupIcon(groupKey) {
  return {
    setup: "setup",
    architectural: "architectural",
    structural: "structural",
    steelworks: "steelworks",
    masonry: "masonry",
    plumbing: "plumbing",
    electrical: "electrical"
  }[groupKey] || "generic";
}

function estimateV2ToolIcon(toolKey) {
  return {
    calibrate: "calibrate",
    "door-count": "door",
    "window-count": "window",
    "curve-line": "curve",
    "column-concrete": "column",
    "footing-concrete": "footing",
    "beam-concrete": "beam",
    "floor-slab": "slab",
    "steel-column": "column",
    "steel-footing": "footing",
    "steel-beam": "beam",
    "steel-wall": "steelworks",
    "steel-slab": "slab",
    "tile-area": "tiles",
    "chb-wall": "chb",
    "pipe-length": "pipe",
    "wire-length": "wire"
  }[toolKey] || "generic";
}

function renderEstimateV2PlanToolbar(draft, activeTool) {
  const projects = getProjects();
  const finishLabel = activeTool.type === "calibrate"
    ? "Set Scale"
    : state.estimateV2EditingRowId
      ? "Update Shape"
      : "Add Takeoff";
  return `
    <div class="estimate-v2-plan-toolbar">
      <div class="estimate-v2-plan-toolbar-top">
        <label class="estimate-v2-field">
          <span>Project</span>
          <select data-estimate-v2-takeoff-input data-estimate-v2-project-select>
            <option value="" ${draft.selectedProjectId ? "" : "selected"}>${projects.length ? "Unassigned Takeoff" : "No project yet"}</option>
            ${projects.map((project) => `<option value="${escapeAttribute(project.id)}" ${project.id === draft.selectedProjectId ? "selected" : ""}>${escapeHtml(project.name)}</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-field">
          <span>Insert PDF</span>
          <input type="file" accept="application/pdf,.pdf" data-estimate-v2-file>
        </label>
        <label class="estimate-v2-field">
          <span>Current Item</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-current-name value="${escapeAttribute(draft.takeoffItemName || activeTool.defaultName)}" placeholder="Material or scope">
        </label>
      </div>
      ${renderEstimateV2ToolGroups(draft, activeTool)}
      ${renderEstimateV2LayerControls(draft)}
      <div class="estimate-v2-plan-control-row">
        ${renderEstimateV2DrawingControls(draft, activeTool)}
        ${renderEstimateV2ZoomControls(draft)}
        <div class="estimate-v2-takeoff-actions">
          ${iconButton(`${finishLabel} (Enter)`, activeTool.type === "calibrate" ? "calibrate" : "add", "primary-btn", 'data-action="finish-estimate-v2-takeoff"')}
          ${iconButton(state.estimateV2PlanExpanded ? "Exit Full PDF View" : "Full PDF View", state.estimateV2PlanExpanded ? "exitFullscreen" : "fullscreen", `secondary-btn estimate-v2-full-pdf-btn ${state.estimateV2PlanExpanded ? "active-full-pdf" : ""}`, 'data-action="toggle-estimate-v2-plan-fullscreen"')}
          ${iconButton("Undo Point (Ctrl/Cmd+Z)", "undo", "secondary-btn", 'data-action="undo-estimate-v2-point"')}
          ${iconButton("Undo Takeoff", "undo", "secondary-btn", 'data-action="undo-estimate-v2-takeoff"')}
          ${iconButton("Redo Point", "redo", "secondary-btn", 'data-action="redo-estimate-v2-point"')}
          ${iconButton("Clear Points", "eraser", "ghost-btn", 'data-action="clear-estimate-v2-points"')}
        </div>
      </div>
    </div>
  `;
}

function renderEstimateV2ToolGroups(draft, activeTool) {
  const activeGroup = estimateV2ActiveToolGroup(draft);
  const group = estimateV2ToolGroup(activeGroup);
  const memberTools = group.tools.map(estimateV2TakeoffTool).filter((tool) => !tool.hidden);
  return `
    <div class="estimate-v2-tool-groups" aria-label="Takeoff groups">
      ${ESTIMATE_V2_TAKEOFF_GROUPS.map((toolGroup) => `
        <button class="secondary-btn compact-btn icon-btn estimate-v2-tool-group ${toolGroup.key === activeGroup ? "active-group" : ""}" data-action="set-estimate-v2-tool-group" data-group="${escapeAttribute(toolGroup.key)}" title="${escapeAttribute(toolGroup.label)}" aria-label="${escapeAttribute(toolGroup.label)}">${iconSvg(estimateV2GroupIcon(toolGroup.key))}${iconLabel(toolGroup.label)}</button>
      `).join("")}
    </div>
    <div class="estimate-v2-tool-strip estimate-v2-tool-members" aria-label="${escapeAttribute(group.label)} tools">
      <span class="estimate-v2-group-title">${escapeHtml(group.label)} Tools</span>
      ${memberTools.map((tool) => `
        <button class="secondary-btn compact-btn icon-btn ${tool.key === activeTool.key ? "active-tool" : ""}" data-action="set-estimate-v2-tool" data-tool="${escapeAttribute(tool.key)}" title="${escapeAttribute(tool.label)}" aria-label="${escapeAttribute(tool.label)}">${iconSvg(estimateV2ToolIcon(tool.key))}${iconLabel(tool.label)}</button>
      `).join("")}
    </div>
  `;
}

function renderEstimateV2LayerControls(draft) {
  const layerGroups = estimateV2LayerGroups();
  const activeGroup = estimateV2ActiveToolGroup(draft);
  return `
    <details class="estimate-v2-layer-panel">
      <summary>Layers</summary>
      <div class="estimate-v2-layer-list">
        <label class="estimate-v2-layer-toggle">
          <input data-estimate-v2-takeoff-input data-estimate-v2-label-toggle type="checkbox" ${draft.showTakeoffLabels ? "checked" : ""}>
          <span>Measurement Labels</span>
        </label>
      </div>
      <div class="estimate-v2-layer-group-list">
        ${layerGroups.map((group) => {
          const visibleCount = group.tools.filter((tool) => estimateV2LayerVisible(draft, tool.key)).length;
          return `
            <details class="estimate-v2-layer-group" ${group.key === activeGroup ? "open" : ""}>
              <summary>
                <span>${escapeHtml(group.label)}</span>
                <small>${formatInteger(visibleCount)}/${formatInteger(group.tools.length)} on</small>
              </summary>
              <div class="estimate-v2-layer-list estimate-v2-layer-list-nested">
                ${group.tools.map((tool) => `
                  <label class="estimate-v2-layer-toggle">
                    <input data-estimate-v2-takeoff-input data-estimate-v2-layer-toggle value="${escapeAttribute(tool.key)}" type="checkbox" ${estimateV2LayerVisible(draft, tool.key) ? "checked" : ""}>
                    <span>${escapeHtml(tool.label)}</span>
                  </label>
                `).join("")}
              </div>
            </details>
          `;
        }).join("")}
      </div>
    </details>
  `;
}

function renderEstimateV2ZoomControls(draft) {
  const zoom = estimateV2ZoomValue(draft);
  return `
    <div class="estimate-v2-zoom-controls">
      ${iconButton("Zoom Out", "zoomOut", "secondary-btn compact-btn", 'data-action="estimate-v2-zoom-out"')}
      ${iconButton("Zoom In", "zoomIn", "secondary-btn compact-btn", 'data-action="estimate-v2-zoom-in"')}
      ${iconButton("Reset Zoom", "reset", "ghost-btn compact-btn", 'data-action="estimate-v2-zoom-reset"')}
      <span>${formatInteger(zoom * 100)}%</span>
    </div>
  `;
}

function renderEstimateV2DrawingControls(draft, activeTool) {
  const canPerpendicular = ["linear", "curve", "chb"].includes(activeTool.type);
  return `
    <div class="estimate-v2-drawing-controls">
      <label class="estimate-v2-snap-toggle" title="Shortcut: F8">
        <input data-estimate-v2-takeoff-input data-estimate-v2-ortho type="checkbox" ${draft.orthoModeEnabled ? "checked" : ""}>
        <span>Ortho F8</span>
      </label>
      <label class="estimate-v2-snap-toggle" title="Snap to existing endpoints and line segments">
        <input data-estimate-v2-takeoff-input data-estimate-v2-object-snap type="checkbox" ${draft.objectSnapEnabled ? "checked" : ""}>
        <span>Object Snap</span>
      </label>
      <label class="estimate-v2-snap-toggle" title="Shortcut: G">
        <input data-estimate-v2-takeoff-input data-estimate-v2-snap-grid type="checkbox" ${draft.snapGridEnabled ? "checked" : ""}>
        <span>Snap Grid</span>
      </label>
      <label class="estimate-v2-field compact-field">
        <span>Grid Size (px)</span>
        <input data-estimate-v2-takeoff-input data-estimate-v2-snap-size type="number" min="8" max="200" step="1" value="${numberInputValue(draft.snapGridSize)}" placeholder="32">
      </label>
      ${iconButton("Perpendicular (P)", "engineering", "secondary-btn compact-btn", `data-action="add-estimate-v2-perpendicular" ${canPerpendicular ? "" : "disabled"}`)}
    </div>
  `;
}

function renderEstimateV2TakeoffActiveInputs(draft, activeTool) {
  if (activeTool.type === "calibrate") {
    return `
      <label class="estimate-v2-field">
        <span>Known Length (m)</span>
        <input data-estimate-v2-takeoff-input data-estimate-v2-calibration-length type="number" min="0" step="0.01" value="${numberInputValue(draft.calibrationLength)}" placeholder="0.00">
      </label>
    `;
  }
  if (activeTool.type === "chb") {
    return `
      <div class="estimate-v2-chb-inputs">
        <label class="estimate-v2-field">
          <span>Wall Height (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-chb-height type="number" min="0" step="0.01" value="${numberInputValue(draft.chbWallHeight)}" placeholder="3.00">
        </label>
        <label class="estimate-v2-field">
          <span>CHB Size</span>
          <select data-estimate-v2-takeoff-input data-estimate-v2-chb-size>
            ${CHB_SIZE_OPTIONS.map((size) => `<option value="${escapeAttribute(size)}" ${size === draft.chbSize ? "selected" : ""}>${escapeHtml(size)}</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-field">
          <span>Blocks / sq.m</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-chb-blocks type="number" min="0" step="0.01" value="${numberInputValue(draft.chbBlocksPerSquareMeter)}" placeholder="12.5">
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-chb-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.chbWastePercent)}" placeholder="5">
        </label>
        <label class="estimate-v2-field">
          <span>Cost Per pc</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-current-cost type="number" min="0" step="0.01" value="${numberInputValue(draft.takeoffCostPerUnit)}" placeholder="0.00">
        </label>
      </div>
    `;
  }
  if (estimateV2IsSteelworkTool(activeTool)) {
    return `
      <div class="estimate-v2-concrete-inputs">
        ${activeTool.key === "steel-column" ? `
          <label class="estimate-v2-field">
            <span>Column Width (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-column-width type="number" min="0" step="0.01" value="${numberInputValue(draft.columnWidth)}" placeholder="0.30">
          </label>
          <label class="estimate-v2-field">
            <span>Column Length (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-column-depth type="number" min="0" step="0.01" value="${numberInputValue(draft.columnDepth)}" placeholder="0.30">
          </label>
          <label class="estimate-v2-field">
            <span>Column Height (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-column-height type="number" min="0" step="0.01" value="${numberInputValue(draft.columnHeight)}" placeholder="3.00">
          </label>
          <label class="estimate-v2-field">
            <span>Vertical Bars / Column</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-main-bars type="number" min="1" step="1" value="${numberInputValue(draft.longitudinalBarsPerColumn)}" placeholder="8">
          </label>
          <label class="estimate-v2-field">
            <span>Tie Spacing (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-tie-spacing type="number" min="0" step="0.01" value="${numberInputValue(draft.tieSpacing)}" placeholder="0.20">
          </label>
          <label class="estimate-v2-field">
            <span>Lap Allowance / Bar (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-lap-allowance type="number" min="0" step="0.01" value="${numberInputValue(draft.lapAllowancePerBar)}" placeholder="0.00">
          </label>
        ` : ""}
        ${activeTool.key === "steel-footing" ? `
          <label class="estimate-v2-field">
            <span>Footing Length (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-footing-length type="number" min="0" step="0.01" value="${numberInputValue(draft.footingLength)}" placeholder="1.50">
          </label>
          <label class="estimate-v2-field">
            <span>Footing Width (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-footing-width type="number" min="0" step="0.01" value="${numberInputValue(draft.footingWidth)}" placeholder="1.50">
          </label>
          <label class="estimate-v2-field">
            <span>Footing Depth (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-footing-thickness type="number" min="0" step="0.01" value="${numberInputValue(draft.footingThickness)}" placeholder="0.30">
          </label>
        ` : ""}
        ${activeTool.key === "steel-slab" ? `
          <label class="estimate-v2-field">
            <span>Slab Type</span>
            <select data-estimate-v2-takeoff-input data-estimate-v2-steel-slab-level>
              ${STEEL_SLAB_TYPE_OPTIONS.map((option) => `<option value="${escapeAttribute(option.key)}" ${(draft.steelSlabType || draft.steelSlabLevel) === option.key ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <label class="estimate-v2-field">
            <span>Rebar Spacing (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-slab-spacing type="number" min="0" step="0.01" value="${numberInputValue(draft.steelSlabRebarSpacing)}" placeholder="0.20">
          </label>
          <label class="estimate-v2-field">
            <span>Slab Thickness (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-slab-thickness type="number" min="0" step="0.01" value="${numberInputValue(draft.steelSlabThickness)}" placeholder="0.15">
          </label>
          <label class="estimate-v2-field">
            <span>Concrete Cover (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-slab-cover type="number" min="0" step="0.005" value="${numberInputValue(draft.steelSlabCover)}" placeholder="0.02">
          </label>
          <label class="estimate-v2-field">
            <span>Waste / Lap (%)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-slab-waste type="number" min="0" step="1" value="${numberInputValue(draft.steelSlabWastePercent)}" placeholder="10">
          </label>
        ` : ""}
        ${activeTool.key === "steel-beam" ? `
          <label class="estimate-v2-field">
            <span>Beam Width (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-width type="number" min="0" step="0.01" value="${numberInputValue(draft.beamWidth)}" placeholder="0.20">
          </label>
          <label class="estimate-v2-field">
            <span>Beam Depth (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-depth type="number" min="0" step="0.01" value="${numberInputValue(draft.beamDepth)}" placeholder="0.40">
          </label>
          <label class="estimate-v2-field">
            <span>Main Bars</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-main-bars type="number" min="1" step="1" value="${numberInputValue(draft.beamMainBars)}" placeholder="4">
          </label>
          <label class="estimate-v2-field">
            <span>Stirrup Spacing (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-stirrup-spacing type="number" min="0" step="0.01" value="${numberInputValue(draft.beamStirrupSpacing)}" placeholder="0.20">
          </label>
          <label class="estimate-v2-field">
            <span>Crank Bars</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-crank-bars type="number" min="0" step="1" value="${numberInputValue(draft.beamCrankBars)}" placeholder="2">
          </label>
          <label class="estimate-v2-field">
            <span>Crank Allowance / Bar (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-beam-crank-allowance type="number" min="0" step="0.01" value="${numberInputValue(draft.beamCrankAllowancePerBar)}" placeholder="0.00">
          </label>
        ` : ""}
        ${activeTool.key === "steel-wall" ? `
          <label class="estimate-v2-field">
            <span>Wall Height (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-wall-height type="number" min="0" step="0.01" value="${numberInputValue(draft.steelWallHeight)}" placeholder="3.00">
          </label>
          <label class="estimate-v2-field">
            <span>Vertical Bar Type</span>
            <select data-estimate-v2-takeoff-input data-estimate-v2-steel-wall-mode>
              ${STEEL_WALL_VERTICAL_MODE_OPTIONS.map((option) => `<option value="${escapeAttribute(option.key)}" ${draft.steelWallVerticalMode === option.key ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <label class="estimate-v2-field">
            <span>Vertical Spacing (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-wall-vertical-spacing type="number" min="0" step="0.01" value="${numberInputValue(draft.steelWallVerticalSpacing)}" placeholder="0.60">
          </label>
          <label class="estimate-v2-field">
            <span>Horizontal Spacing (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-wall-horizontal-spacing type="number" min="0" step="0.01" value="${numberInputValue(draft.steelWallHorizontalSpacing)}" placeholder="0.60">
          </label>
          <label class="estimate-v2-field">
            <span>Dowel Length (m)</span>
            <input data-estimate-v2-takeoff-input data-estimate-v2-steel-wall-dowel-length type="number" min="0" step="0.01" value="${numberInputValue(draft.steelWallDowelLength)}" placeholder="0.60" ${draft.steelWallVerticalMode === "dowel" ? "" : "disabled"}>
          </label>
        ` : ""}
        <label class="estimate-v2-field">
          <span>Rebar Diameter</span>
          <select data-estimate-v2-takeoff-input data-estimate-v2-rebar-diameter>
            ${REBAR_DIAMETER_OPTIONS.map((diameter) => `<option value="${escapeAttribute(diameter)}" ${Number(draft.rebarDiameter) === diameter ? "selected" : ""}>${formatSwaNumber(diameter)} mm</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-field">
          <span>Rebar Length</span>
          <select data-estimate-v2-takeoff-input data-estimate-v2-rebar-length>
            ${REBAR_LENGTH_OPTIONS.map((length) => `<option value="${escapeAttribute(length)}" ${Number(draft.rebarLength) === length ? "selected" : ""}>${formatSwaNumber(length)} m</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-field">
          <span>Cost Per pc</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-current-cost type="number" min="0" step="0.01" value="${numberInputValue(draft.takeoffCostPerUnit)}" placeholder="0.00">
        </label>
      </div>
    `;
  }
  if (activeTool.key === "tile-area") {
    return `
      <div class="estimate-v2-concrete-inputs">
        <label class="estimate-v2-field">
          <span>Tile Length (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-tile-length type="number" min="0" step="0.001" value="${numberInputValue(draft.tileLength)}" placeholder="0.60">
        </label>
        <label class="estimate-v2-field">
          <span>Tile Width (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-tile-width type="number" min="0" step="0.001" value="${numberInputValue(draft.tileWidth)}" placeholder="0.60">
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-tile-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.tileWastePercent)}" placeholder="5">
        </label>
        <label class="estimate-v2-field">
          <span>Price / tile</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-tile-price type="number" min="0" step="0.01" value="${numberInputValue(draft.tilePrice)}" placeholder="0.00">
        </label>
        <label class="estimate-v2-field">
          <span>Cost Per sq.m</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-current-cost data-estimate-v2-computed-current-cost type="number" min="0" step="0.01" value="${numberInputValue(estimateV2ComputedTakeoffCostPerUnit(draft, activeTool))}" placeholder="0.00" readonly>
        </label>
      </div>
    `;
  }
  if (activeTool.key === "floor-slab") {
    return `
      <div class="estimate-v2-concrete-inputs">
        <label class="estimate-v2-field">
          <span>Slab Thickness</span>
          <select data-estimate-v2-takeoff-input data-estimate-v2-floor-slab-thickness>
            ${FLOOR_SLAB_THICKNESS_OPTIONS.map((thickness) => `<option value="${escapeAttribute(thickness)}" ${Number(draft.floorSlabThickness) === thickness ? "selected" : ""}>${formatSwaNumber(thickness)} m</option>`).join("")}
          </select>
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.concreteWastePercent)}" placeholder="0">
        </label>
        ${renderEstimateV2ConcreteCostInputs(draft, "sq.m")}
      </div>
    `;
  }
  if (activeTool.key === "column-concrete") {
    return `
      <div class="estimate-v2-concrete-inputs">
        <label class="estimate-v2-field">
          <span>Column Type</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-mark value="${escapeAttribute(draft.concreteTypeMark)}" placeholder="C1">
        </label>
        <label class="estimate-v2-field">
          <span>Width (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-column-width type="number" min="0" step="0.01" value="${numberInputValue(draft.columnWidth)}" placeholder="0.30">
        </label>
        <label class="estimate-v2-field">
          <span>Depth (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-column-depth type="number" min="0" step="0.01" value="${numberInputValue(draft.columnDepth)}" placeholder="0.30">
        </label>
        <label class="estimate-v2-field">
          <span>Height (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-column-height type="number" min="0" step="0.01" value="${numberInputValue(draft.columnHeight)}" placeholder="3.00">
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.concreteWastePercent)}" placeholder="0">
        </label>
        ${renderEstimateV2ConcreteCostInputs(draft, "cu.m")}
      </div>
    `;
  }
  if (activeTool.key === "beam-concrete") {
    return `
      <div class="estimate-v2-concrete-inputs">
        <label class="estimate-v2-field">
          <span>Beam Type</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-mark value="${escapeAttribute(draft.beamConcreteTypeMark)}" placeholder="B1">
        </label>
        <label class="estimate-v2-field">
          <span>Width (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-beam-width type="number" min="0" step="0.01" value="${numberInputValue(draft.beamWidth)}" placeholder="0.20">
        </label>
        <label class="estimate-v2-field">
          <span>Depth (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-beam-depth type="number" min="0" step="0.01" value="${numberInputValue(draft.beamDepth)}" placeholder="0.40">
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.concreteWastePercent)}" placeholder="0">
        </label>
        ${renderEstimateV2ConcreteCostInputs(draft, "cu.m")}
      </div>
    `;
  }
  if (activeTool.key === "footing-concrete") {
    return `
      <div class="estimate-v2-concrete-inputs">
        <label class="estimate-v2-field">
          <span>Footing Type</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-mark value="${escapeAttribute(draft.footingTypeMark)}" placeholder="F1">
        </label>
        <label class="estimate-v2-field">
          <span>Length (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-footing-length type="number" min="0" step="0.01" value="${numberInputValue(draft.footingLength)}" placeholder="1.50">
        </label>
        <label class="estimate-v2-field">
          <span>Width (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-footing-width type="number" min="0" step="0.01" value="${numberInputValue(draft.footingWidth)}" placeholder="1.50">
        </label>
        <label class="estimate-v2-field">
          <span>Thickness (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-footing-thickness type="number" min="0" step="0.01" value="${numberInputValue(draft.footingThickness)}" placeholder="0.30">
        </label>
        <label class="estimate-v2-field">
          <span>Pedestal W (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-pedestal-width type="number" min="0" step="0.01" value="${numberInputValue(draft.pedestalWidth)}" placeholder="0.00">
        </label>
        <label class="estimate-v2-field">
          <span>Pedestal D (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-pedestal-depth type="number" min="0" step="0.01" value="${numberInputValue(draft.pedestalDepth)}" placeholder="0.00">
        </label>
        <label class="estimate-v2-field">
          <span>Pedestal H (m)</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-pedestal-height type="number" min="0" step="0.01" value="${numberInputValue(draft.pedestalHeight)}" placeholder="0.00">
        </label>
        <label class="estimate-v2-field">
          <span>Waste %</span>
          <input data-estimate-v2-takeoff-input data-estimate-v2-concrete-waste type="number" min="0" step="0.01" value="${numberInputValue(draft.concreteWastePercent)}" placeholder="0">
        </label>
        ${renderEstimateV2ConcreteCostInputs(draft, "cu.m")}
      </div>
    `;
  }
  return `
    <label class="estimate-v2-field">
      <span>Cost Per ${escapeHtml(activeTool.unit)}</span>
      <input data-estimate-v2-takeoff-input data-estimate-v2-current-cost type="number" min="0" step="0.01" value="${numberInputValue(draft.takeoffCostPerUnit)}" placeholder="0.00">
    </label>
  `;
}

function renderEstimateV2ConcreteCostInputs(draft, costUnit) {
  return `
    <label class="estimate-v2-field">
      <span>Concrete Ratio</span>
      <select data-estimate-v2-takeoff-input data-estimate-v2-concrete-ratio>
        ${CONCRETE_MIX_OPTIONS.map((mix) => `<option value="${escapeAttribute(mix.key)}" ${mix.key === draft.concreteMixRatio ? "selected" : ""}>${escapeHtml(mix.label)}</option>`).join("")}
      </select>
    </label>
    <label class="estimate-v2-field">
      <span>Cement Price / bag</span>
      <input data-estimate-v2-takeoff-input data-estimate-v2-cement-price type="number" min="0" step="0.01" value="${numberInputValue(draft.cementPrice)}" placeholder="0.00">
    </label>
    <label class="estimate-v2-field">
      <span>Sand Price / cu.m</span>
      <input data-estimate-v2-takeoff-input data-estimate-v2-sand-price type="number" min="0" step="0.01" value="${numberInputValue(draft.sandPrice)}" placeholder="0.00">
    </label>
    <label class="estimate-v2-field">
      <span>Gravel Price / cu.m</span>
      <input data-estimate-v2-takeoff-input data-estimate-v2-gravel-price type="number" min="0" step="0.01" value="${numberInputValue(draft.gravelPrice)}" placeholder="0.00">
    </label>
    <label class="estimate-v2-field">
      <span>Cost Per ${escapeHtml(costUnit)}</span>
      <input data-estimate-v2-takeoff-input data-estimate-v2-current-cost data-estimate-v2-computed-current-cost type="number" min="0" step="0.01" value="${numberInputValue(estimateV2ComputedTakeoffCostPerUnit(draft, estimateV2TakeoffTool(draft.takeoffTool)))}" placeholder="0.00" readonly>
    </label>
  `;
}

function renderEstimateV2TakeoffWorkspace(draft) {
  const pageImage = state.estimateV2PageImage;
  const pageWidth = state.estimateV2PageWidth || draft.takeoffPageWidth || 0;
  const pageHeight = state.estimateV2PageHeight || draft.takeoffPageHeight || 0;
  const activeTool = estimateV2TakeoffTool(draft.takeoffTool);
  const hasPage = Boolean(pageImage && pageWidth && pageHeight);
  const zoom = estimateV2ZoomValue(draft);
  const surfaceWidth = Math.max(720, pageWidth * zoom);
  return `
    <section class="estimate-v2-plan-shell ${state.estimateV2PlanExpanded ? "full-pdf-ui" : ""}">
      ${state.estimateV2PlanExpanded ? `
        <div class="estimate-v2-full-pdf-head">
          <div>
            <span class="eyebrow">Full PDF View</span>
            <strong>${draft.planFileName ? escapeHtml(draft.planFileName) : "No PDF loaded yet"}</strong>
          </div>
          <button class="primary-btn compact-btn" data-action="toggle-estimate-v2-plan-fullscreen">Exit Full PDF</button>
        </div>
      ` : ""}
      ${renderEstimateV2PlanToolbar(draft, activeTool)}
      <div class="estimate-v2-file-card estimate-v2-plan-status-card">
        <div>
          <span class="eyebrow">Current PDF</span>
          <strong>${draft.planFileName ? escapeHtml(draft.planFileName) : "No PDF loaded yet"}</strong>
        </div>
        <div>
          <span class="eyebrow">Cloud PDF</span>
          <strong>${draft.planStoragePath ? "Saved in secure storage" : "Not saved yet"}</strong>
          ${draft.planStoragePath && !hasPage ? `<button class="secondary-btn compact-btn" data-action="load-estimate-v2-stored-pdf">Load Stored PDF</button>` : ""}
        </div>
        <div>
          <span class="eyebrow">Page</span>
          <strong>${draft.takeoffPageCount ? `${formatInteger(draft.takeoffPage)} / ${formatInteger(draft.takeoffPageCount)}` : "-"}</strong>
        </div>
        <div>
          <span class="eyebrow">Scale</span>
          <strong>${draft.metersPerPixel ? `${formatSwaNumber(1 / draft.metersPerPixel)} px / m` : "Not calibrated"}</strong>
        </div>
        <div>
          <span class="eyebrow">Active Tool</span>
          <strong>${escapeHtml(activeTool.label)}</strong>
        </div>
      </div>
      <div class="estimate-v2-page-controls">
        <div class="estimate-v2-page-nav">
          <button class="secondary-btn compact-btn" data-action="estimate-v2-prev-page" ${draft.takeoffPageCount ? "" : "disabled"}>Previous Page</button>
          <span>Page ${formatInteger(draft.takeoffPage)} of ${formatInteger(draft.takeoffPageCount || 1)}</span>
          <button class="secondary-btn compact-btn" data-action="estimate-v2-next-page" ${draft.takeoffPageCount ? "" : "disabled"}>Next Page</button>
        </div>
        <div class="estimate-v2-plan-active-controls">
          ${renderEstimateV2TakeoffActiveInputs(draft, activeTool)}
        </div>
      </div>
      ${hasPage ? `
        <div class="estimate-v2-plan-stage">
          <div class="estimate-v2-plan-surface" style="width:${surfaceWidth}px">
            <img class="estimate-v2-plan-image" src="${pageImage}" alt="Uploaded plan page">
            <svg
              class="estimate-v2-plan-overlay"
              viewBox="0 0 ${pageWidth} ${pageHeight}"
              preserveAspectRatio="none"
              data-action="estimate-v2-plan-click"
              data-estimate-v2-plan-canvas
              data-width="${pageWidth}"
              data-height="${pageHeight}"
            >
              ${renderEstimateV2TakeoffOverlay(draft, pageWidth, pageHeight)}
            </svg>
          </div>
        </div>
      ` : `<div class="placeholder estimate-v2-plan-placeholder">${draft.planStoragePath ? "Load the stored PDF to continue takeoff on this device." : "Upload a floor plan PDF to begin takeoff."}</div>`}
    </section>
  `;
}

function renderEstimateV2TakeoffOverlay(draft, pageWidth, pageHeight) {
  const rows = estimateV2VisibleOverlayRows(draft).filter((row) => Number(row.page || 1) === Number(draft.takeoffPage || 1));
  const activeTool = estimateV2TakeoffTool(draft.takeoffTool);
  const activePoints = state.estimateV2ActivePoints || [];
  return `
    ${renderEstimateV2SnapGrid(draft, pageWidth, pageHeight)}
    ${rows.map(renderEstimateV2TakeoffShape).join("")}
    ${draft.showTakeoffLabels ? rows.map(renderEstimateV2TakeoffLabel).join("") : ""}
    ${renderEstimateV2ActiveShape(activeTool, activePoints)}
    ${draft.showTakeoffLabels ? renderEstimateV2ActiveLabels(activeTool, activePoints, draft) : ""}
    <rect class="estimate-v2-click-catcher" x="0" y="0" width="${pageWidth}" height="${pageHeight}"></rect>
  `;
}

function renderEstimateV2SnapGrid(draft, pageWidth, pageHeight) {
  if (!draft.snapGridEnabled) return "";
  const size = estimateV2SnapGridSize(draft);
  const patternId = `estimate-v2-grid-${formatInteger(size)}`;
  return `
    <defs>
      <pattern id="${patternId}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
        <path d="M ${size} 0 L 0 0 0 ${size}" class="estimate-v2-grid-line"></path>
      </pattern>
    </defs>
    <rect class="estimate-v2-snap-grid" x="0" y="0" width="${pageWidth}" height="${pageHeight}" fill="url(#${patternId})"></rect>
  `;
}

function renderEstimateV2TakeoffShape(row) {
  const tool = estimateV2TakeoffTool(row.tool);
  const color = row.color || tool.color;
  const points = Array.isArray(row.points) ? row.points : [];
  const selectedClass = state.estimateV2EditingRowId === row.id ? " selected" : "";
  if (!points.length) return "";
  if (tool.type === "area" && points.length >= 3) {
    return `<polygon class="estimate-v2-shape area${selectedClass}" points="${pointsToSvg(points)}" style="--takeoff-color:${escapeAttribute(color)}"></polygon>`;
  }
  if ((tool.type === "linear" || tool.type === "chb") && points.length >= 2) {
    return `<polyline class="estimate-v2-shape line${selectedClass}" points="${pointsToSvg(points)}" style="--takeoff-color:${escapeAttribute(color)}"></polyline>`;
  }
  if (tool.type === "curve" && points.length >= 2) {
    return `<path class="estimate-v2-shape line curve${selectedClass}" d="${escapeAttribute(estimateV2CurvePath(points))}" style="--takeoff-color:${escapeAttribute(color)}"></path>`;
  }
  if (tool.type === "count" || tool.type === "concrete-count") {
    return points.map((point) => `<circle class="estimate-v2-shape count${selectedClass}" cx="${point.x}" cy="${point.y}" r="10" style="--takeoff-color:${escapeAttribute(color)}"></circle>`).join("");
  }
  if (tool.type === "calibrate" && points.length >= 2) {
    return `<polyline class="estimate-v2-shape calibration${selectedClass}" points="${pointsToSvg(points.slice(0, 2))}" style="--takeoff-color:${escapeAttribute(color)}"></polyline>`;
  }
  return "";
}

function renderEstimateV2TakeoffLabel(row) {
  const tool = estimateV2TakeoffTool(row.tool);
  const points = (Array.isArray(row.points) ? row.points : []).map(normalizePoint).filter(Boolean);
  if (tool.type === "count" || tool.type === "concrete-count") {
    return points.map((point, index) => renderEstimateV2LabelNode(point, estimateV2PointLabelText(row, tool, index))).join("");
  }
  const point = estimateV2LabelPoint(row.points);
  if (!point) return "";
  const text = estimateV2LabelText(row, tool);
  if (!text) return "";
  return renderEstimateV2LabelNode(point, text);
}

function renderEstimateV2ActiveLabels(tool, points, draft) {
  if (!["count", "concrete-count"].includes(tool.type)) return "";
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  return normalizedPoints.map((point, index) => renderEstimateV2LabelNode(point, estimateV2ActivePointLabelText(tool, draft, index, normalizedPoints.length), " active-label")).join("");
}

function renderEstimateV2LabelNode(point, text, className = "") {
  if (!point || !text) return "";
  const width = Math.max(72, text.length * 7.2 + 16);
  return `
    <g class="estimate-v2-measure-label${className}">
      <rect x="${point.x - width / 2}" y="${point.y - 34}" width="${width}" height="24" rx="5"></rect>
      <text x="${point.x}" y="${point.y - 17}">${escapeHtml(text)}</text>
    </g>
  `;
}

function renderEstimateV2ActiveShape(tool, points) {
  if (!points.length) return "";
  const color = tool.color;
  const markers = points.map((point, index) => `<circle class="estimate-v2-active-point" data-estimate-v2-active-point-index="${index}" cx="${point.x}" cy="${point.y}" r="8" style="--takeoff-color:${escapeAttribute(color)}"></circle>`).join("");
  if (tool.type === "area" && points.length >= 2) {
    return `<polyline class="estimate-v2-active-line" points="${pointsToSvg(points)}" style="--takeoff-color:${escapeAttribute(color)}"></polyline>${markers}`;
  }
  if ((tool.type === "linear" || tool.type === "chb" || tool.type === "calibrate") && points.length >= 2) {
    return `<polyline class="estimate-v2-active-line" points="${pointsToSvg(points)}" style="--takeoff-color:${escapeAttribute(color)}"></polyline>${markers}`;
  }
  if (tool.type === "curve" && points.length >= 2) {
    return `<path class="estimate-v2-active-line curve" d="${escapeAttribute(estimateV2CurvePath(points))}" style="--takeoff-color:${escapeAttribute(color)}"></path>${markers}`;
  }
  return markers;
}

function renderEstimateV2TakeoffTable(rows) {
  const isEditing = Boolean(state.estimateV2EditingRowId);
  const estimateTotal = estimateV2TakeoffTotal(rows);
  return `
    <div class="table-wrap estimate-v2-table-wrap">
      <table class="estimate-v2-table estimate-v2-takeoff-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Cost / Unit</th>
            <th>Total Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map(renderEstimateV2TakeoffRow).join("") : `<tr><td colspan="7" class="empty-cell">No takeoff rows yet.</td></tr>`}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">Total Estimate</td>
            <td data-estimate-v2-takeoff-total title="${escapeAttribute(formatCurrency(estimateTotal))}">${formatEstimateV2TotalCost(estimateTotal)}</td>
            <td>${isEditing ? `<button class="ghost-btn compact-btn" data-action="cancel-estimate-v2-edit">Cancel Edit</button>` : ""}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

function renderEstimateV2TakeoffRow(row) {
  const normalized = normalizeEstimateV2TakeoffRow(row);
  const tool = estimateV2TakeoffTool(normalized.tool);
  const typeDetails = tool.type === "chb"
    ? renderEstimateV2ChbDetails(normalized)
    : tool.type === "concrete-count" || tool.key === "beam-concrete"
      ? renderEstimateV2ConcreteDetails(normalized)
      : tool.key === "floor-slab"
        ? renderEstimateV2FloorSlabDetails(normalized)
        : tool.key === "tile-area"
          ? renderEstimateV2TileDetails(normalized)
          : estimateV2IsSteelworkTool(tool)
            ? renderEstimateV2SteelworkDetails(normalized)
    : "";
  const computedCost = estimateV2RowHasComputedMaterialCost(normalized)
    ? estimateV2ComputedRowCostPerUnit(normalized)
    : normalized.costPerUnit;
  const rowTotal = estimateV2TakeoffRowTotal({ ...normalized, costPerUnit: computedCost });
  return `
    <tr data-estimate-v2-takeoff-row="${escapeAttribute(normalized.id)}" class="${state.estimateV2EditingRowId === normalized.id ? "editing-row" : ""}">
      <td><input class="estimate-input description" data-estimate-v2-takeoff-input data-field="description" value="${escapeAttribute(normalized.description)}" placeholder="Item"></td>
      <td><strong>${escapeHtml(tool.label)}</strong>${typeDetails}</td>
      <td><input class="estimate-input" data-estimate-v2-takeoff-input data-field="quantity" type="number" min="0" step="0.01" value="${numberInputValue(normalized.quantity)}" placeholder="0" ${tool.type === "chb" || tool.key === "beam-concrete" || tool.key === "steel-column" || tool.key === "steel-footing" || tool.key === "steel-slab" || tool.key === "steel-beam" || tool.key === "steel-wall" ? "readonly" : ""}></td>
      <td><input class="estimate-input" data-estimate-v2-takeoff-input data-field="unit" value="${escapeAttribute(normalized.unit)}" placeholder="unit"></td>
      <td><input class="estimate-input" data-estimate-v2-takeoff-input data-field="costPerUnit" type="number" min="0" step="0.01" value="${numberInputValue(computedCost)}" placeholder="0.00" ${estimateV2RowHasComputedMaterialCost(normalized) ? "readonly" : ""}></td>
      <td data-estimate-v2-row-total title="${escapeAttribute(formatCurrency(rowTotal))}">${formatEstimateV2TotalCost(rowTotal)}</td>
      <td>
        <button class="secondary-btn compact-btn" data-action="edit-estimate-v2-takeoff" data-id="${escapeAttribute(normalized.id)}">Edit Shape</button>
        <button class="ghost-btn danger compact-btn" data-action="delete-estimate-v2-takeoff" data-id="${escapeAttribute(normalized.id)}">Delete</button>
      </td>
    </tr>
  `;
}

function renderEstimateV2ChbDetails(row) {
  return `
    <small><span data-estimate-v2-chb-length-display>${formatSwaNumber(row.wallLength)}</span> m wall x <span data-estimate-v2-chb-height-display>${formatSwaNumber(row.chbWallHeight)}</span> m high</small>
    <small><span data-estimate-v2-chb-wall-area-display>${formatSwaNumber(row.wallArea)}</span> sq.m @ <span data-estimate-v2-chb-blocks-display>${formatSwaNumber(row.chbBlocksPerSquareMeter)}</span> CHB/sq.m + <span data-estimate-v2-chb-waste-display>${formatSwaNumber(row.chbWastePercent)}</span>% waste</small>
  `;
}

function renderEstimateV2ConcreteDetails(row) {
  const mix = concreteMixBreakdown(row.concreteVolume || row.quantity, row.concreteMixRatio);
  const materialCost = concreteMaterialCost(mix, row);
  const countText = row.concreteKind === "beam"
    ? `${formatSwaNumber(row.beamLength)} m line`
    : `${formatInteger(row.takeoffCount)} ${row.takeoffCount === 1 ? "point" : "points"}`;
  const baseText = row.concreteKind === "footing"
    ? `${formatSwaNumber(row.footingLength)} x ${formatSwaNumber(row.footingWidth)} x ${formatSwaNumber(row.footingThickness)} m footing`
    : row.concreteKind === "beam"
      ? `${formatSwaNumber(row.beamWidth)} x ${formatSwaNumber(row.beamDepth)} m beam section`
      : `${formatSwaNumber(row.columnWidth)} x ${formatSwaNumber(row.columnDepth)} x ${formatSwaNumber(row.columnHeight)} m column`;
  const pedestalText = row.concreteKind === "footing" && row.pedestalVolume
    ? `<small>Pedestal: ${formatSwaNumber(row.pedestalWidth)} x ${formatSwaNumber(row.pedestalDepth)} x ${formatSwaNumber(row.pedestalHeight)} m</small>`
    : "";
  return `
    <small>${escapeHtml(row.typeMark || "-")} | ${countText} | ${baseText}</small>
    ${pedestalText}
    <small>Concrete: ${formatSwaNumber(row.concreteVolume)} cu.m${row.concreteWastePercent ? ` incl. ${formatSwaNumber(row.concreteWastePercent)}% waste` : ""} | Ratio ${escapeHtml(row.concreteMixRatio || DEFAULT_CONCRETE_MIX_RATIO)}</small>
    <small>Cement: ${formatInteger(mix.cementBags)} bags | Sand: ${formatSwaNumber(mix.sandVolume)} cu.m | Gravel: ${formatSwaNumber(mix.gravelVolume)} cu.m${materialCost ? ` | Materials ${formatCurrency(materialCost)}` : ""}</small>
    ${renderEstimateV2ConcretePriceDetails(row)}
  `;
}

function renderEstimateV2FloorSlabDetails(row) {
  const mix = concreteMixBreakdown(row.concreteVolume, row.concreteMixRatio);
  const materialCost = concreteMaterialCost(mix, row);
  return `
    <small>${formatSwaNumber(row.quantity)} sq.m x ${formatSwaNumber(row.floorSlabThickness)} m thick</small>
    <small>Concrete: ${formatSwaNumber(row.concreteVolume)} cu.m${row.concreteWastePercent ? ` incl. ${formatSwaNumber(row.concreteWastePercent)}% waste` : ""} | Ratio ${escapeHtml(row.concreteMixRatio || DEFAULT_CONCRETE_MIX_RATIO)}</small>
    <small>Cement: ${formatInteger(mix.cementBags)} bags | Sand: ${formatSwaNumber(mix.sandVolume)} cu.m | Gravel: ${formatSwaNumber(mix.gravelVolume)} cu.m${materialCost ? ` | Materials ${formatCurrency(materialCost)}` : ""}</small>
    ${renderEstimateV2ConcretePriceDetails(row)}
  `;
}

function renderEstimateV2TileDetails(row) {
  const totalTileCost = estimateV2TileTotalCost(row);
  return `
    <small>${formatSwaNumber(row.quantity)} sq.m | ${formatSwaNumber(row.tileLength)} x ${formatSwaNumber(row.tileWidth)} m tile</small>
    <small>Tiles: <span data-estimate-v2-tile-pieces-display>${formatInteger(row.tilePieces)}</span> pcs${row.tileWastePercent ? ` incl. ${formatSwaNumber(row.tileWastePercent)}% waste` : ""}${row.tilePrice ? ` | ${formatCurrency(row.tilePrice)}/tile` : ""}</small>
    ${totalTileCost ? `<small>Tile total: <span data-estimate-v2-tile-total-display>${formatCurrency(totalTileCost)}</span></small>` : ""}
  `;
}

function renderEstimateV2SteelworkDetails(row) {
  if (row.tool === "steel-column") {
    const stockOptions = estimateV2SteelColumnStockOptionsFromRow(row);
    const stockOptionsText = stockOptions
      .map((option) => `${formatSwaNumber(option.length)}m=${formatInteger(option.totalStockBars)} pcs`)
      .join(" | ");
    const lapStockText = row.lapAllowancePerBar ? ` + Lap ${formatInteger(row.lapStockBars)} pcs` : "";
    return `
      <small>${formatInteger(row.takeoffCount)} column${row.takeoffCount === 1 ? "" : "s"} | ${formatSwaNumber(row.columnWidth)} x ${formatSwaNumber(row.columnDepth)} x ${formatSwaNumber(row.columnHeight)} m</small>
      <small>Vertical bars: ${formatInteger(row.longitudinalBarsPerColumn)} / column x ${formatInteger(row.takeoffCount)} = ${formatInteger(row.verticalBarCount)} pcs</small>
      <small>Total pieces: Vertical ${formatInteger(row.longitudinalStockBars)} pcs + Ties ${formatInteger(row.tieStockBars)} pcs${lapStockText} = ${formatInteger(row.totalStockBars)} pcs @ ${formatSwaNumber(row.rebarLength)} m</small>
      ${stockOptionsText ? `<small>Total stock options: ${escapeHtml(stockOptionsText)}</small>` : ""}
      <small>Ties: ${formatInteger(row.tiesPerColumn)} / column x ${formatInteger(row.takeoffCount)} = ${formatInteger(row.tiePieceCount)} pcs @ ${formatSwaNumber(row.tieSpacing)} m spacing</small>
      <small>Lengths: Vertical ${formatSwaNumber(row.longitudinalTotalLength)} m | Ties ${formatSwaNumber(row.tieTotalLength)} m${row.lapAllowanceTotalLength ? ` | Lap ${formatSwaNumber(row.lapAllowanceTotalLength)} m` : ""}</small>
      <small>Weight estimate: ${formatSwaNumber(row.totalRebarWeightKg)} kg | ${formatSwaNumber(row.rebarDiameter)} mm${row.lapAllowancePerBar ? ` | Lap ${formatSwaNumber(row.lapAllowancePerBar)} m/bar` : ""}</small>
    `;
  }
  if (row.tool === "steel-footing") {
    const stockOptions = estimateV2SteelFootingStockOptionsFromRow(row);
    const stockOptionsText = stockOptions
      .map((option) => `${formatSwaNumber(option.length)}m=${formatInteger(option.totalStockBars)} pcs`)
      .join(" | ");
    return `
      <small>${formatInteger(row.takeoffCount)} footing${row.takeoffCount === 1 ? "" : "s"} | ${formatSwaNumber(row.footingLength)} x ${formatSwaNumber(row.footingWidth)} x ${formatSwaNumber(row.footingThickness)} m</small>
      <small>X direction: ${formatInteger(row.footingXBarsPerFooting)} bars/footing x ${formatSwaNumber(row.footingLength)} m = ${formatSwaNumber(row.footingXTotalLength)} m</small>
      <small>Y direction: ${formatInteger(row.footingYBarsPerFooting)} bars/footing x ${formatSwaNumber(row.footingWidth)} m = ${formatSwaNumber(row.footingYTotalLength)} m</small>
      <small>Total bars: ${formatInteger(row.footingTotalBars)} pcs | Total length: ${formatSwaNumber(row.totalRebarLength)} m | Selected stock: ${formatInteger(row.totalStockBars)} pcs @ ${formatSwaNumber(row.rebarLength)} m</small>
      ${stockOptionsText ? `<small>Total stock options: ${escapeHtml(stockOptionsText)}</small>` : ""}
      <small>Spacing: ${formatSwaNumber(row.footingRebarSpacing)} m both ways | Weight estimate: ${formatSwaNumber(row.totalRebarWeightKg)} kg | ${formatSwaNumber(row.rebarDiameter)} mm</small>
    `;
  }
  if (row.tool === "steel-slab") {
    const stockOptions = estimateV2SteelSlabStockOptionsFromRow(row);
    const stockOptionsText = stockOptions
      .map((option) => `${formatSwaNumber(option.length)}m=${formatInteger(option.totalStockBars)} pcs`)
      .join(" | ");
    const slabTypeNote = row.steelSlabType === "auto"
      ? `Auto: ${row.steelSlabResolvedTypeLabel}`
      : row.steelSlabResolvedTypeLabel;
    return `
      <small>${escapeHtml(slabTypeNote)} | Ratio ${formatSwaNumber(row.steelSlabLongSpan)} ÷ ${formatSwaNumber(row.steelSlabShortSpan)} = ${formatSwaNumber(row.steelSlabSpanRatio)} | Area ${formatSwaNumber(row.slabArea)} sq.m</small>
      <small>${escapeHtml(row.slabShortBarsLabel)}: ${formatInteger(row.slabShortBarsCount)} pcs x ${formatSwaNumber(row.slabShortBarLength)} m = ${formatSwaNumber(row.slabShortTotalLength)} m</small>
      <small>${escapeHtml(row.slabLongBarsLabel)}: ${formatInteger(row.slabLongBarsCount)} pcs x ${formatSwaNumber(row.slabLongBarLength)} m = ${formatSwaNumber(row.slabLongTotalLength)} m</small>
      <small>Crank allowance: 0.42D = ${formatSwaNumber(row.steelSlabCrankAllowance)} m | D ${formatSwaNumber(row.steelSlabThickness)} - ${formatSwaNumber(row.steelSlabCover)} = ${formatSwaNumber(row.steelSlabEffectiveDepth)} m</small>
      <small>Total bars: ${formatInteger(row.slabTotalBars)} pcs | Length before waste: ${formatSwaNumber(row.slabTotalLengthBeforeWaste)} m | Final length: ${formatSwaNumber(row.totalRebarLength)} m</small>
      <small>Selected stock: ${formatInteger(row.totalStockBars)} pcs @ ${formatSwaNumber(row.rebarLength)} m | Waste/Lap: ${formatSwaNumber(row.steelSlabWastePercent)}%</small>
      ${stockOptionsText ? `<small>Total stock options: ${escapeHtml(stockOptionsText)}</small>` : ""}
      <small>Spacing: ${formatSwaNumber(row.steelSlabRebarSpacing)} m both ways | Weight estimate: ${formatSwaNumber(row.totalRebarWeightKg)} kg | ${formatSwaNumber(row.rebarDiameter)} mm</small>
    `;
  }
  if (row.tool === "steel-beam") {
    const stockOptions = estimateV2SteelBeamStockOptionsFromRow(row);
    const stockOptionsText = stockOptions
      .map((option) => `${formatSwaNumber(option.length)}m=${formatInteger(option.totalStockBars)} pcs`)
      .join(" | ");
    return `
      <small>Beam length: ${formatSwaNumber(row.beamLength)} m | Section ${formatSwaNumber(row.beamWidth)} x ${formatSwaNumber(row.beamDepth)} m</small>
      <small>Main bars: ${formatInteger(row.beamMainBars)} pcs x ${formatSwaNumber(row.beamLength)} m = ${formatSwaNumber(row.beamMainTotalLength)} m</small>
      <small>Stirrups: ${formatInteger(row.beamStirrupCount)} pcs x ${formatSwaNumber(row.beamStirrupLengthEach)} m = ${formatSwaNumber(row.beamStirrupTotalLength)} m @ ${formatSwaNumber(row.beamStirrupSpacing)} m spacing</small>
      <small>Crank bars: ${formatInteger(row.beamCrankBars)} pcs x ${formatSwaNumber(row.beamCrankLengthEach)} m = ${formatSwaNumber(row.beamCrankTotalLength)} m</small>
      <small>Total length: ${formatSwaNumber(row.totalRebarLength)} m | Selected stock: ${formatInteger(row.totalStockBars)} pcs @ ${formatSwaNumber(row.rebarLength)} m</small>
      ${stockOptionsText ? `<small>Total stock options: ${escapeHtml(stockOptionsText)}</small>` : ""}
      <small>Weight estimate: ${formatSwaNumber(row.totalRebarWeightKg)} kg | ${formatSwaNumber(row.rebarDiameter)} mm</small>
    `;
  }
  if (row.tool === "steel-wall") {
    const stockOptions = estimateV2SteelWallStockOptionsFromRow(row);
    const stockOptionsText = stockOptions
      .map((option) => `${formatSwaNumber(option.length)}m=${formatInteger(option.totalStockBars)} pcs`)
      .join(" | ");
    return `
      <small>Wall: ${formatSwaNumber(row.wallLength)} m long x ${formatSwaNumber(row.steelWallHeight)} m high | ${escapeHtml(row.steelWallVerticalModeLabel)}</small>
      <small>Vertical bars: ${formatInteger(row.steelWallVerticalBarCount)} pcs x ${formatSwaNumber(row.steelWallVerticalBarLength)} m = ${formatSwaNumber(row.steelWallVerticalTotalLength)} m</small>
      <small>Horizontal bars: ${formatInteger(row.steelWallHorizontalBarCount)} pcs x ${formatSwaNumber(row.wallLength)} m = ${formatSwaNumber(row.steelWallHorizontalTotalLength)} m</small>
      <small>Total length: ${formatSwaNumber(row.totalRebarLength)} m | Selected stock: ${formatInteger(row.totalStockBars)} pcs @ ${formatSwaNumber(row.rebarLength)} m</small>
      ${stockOptionsText ? `<small>Total stock options: ${escapeHtml(stockOptionsText)}</small>` : ""}
      <small>Spacing: V ${formatSwaNumber(row.steelWallVerticalSpacing)} m | H ${formatSwaNumber(row.steelWallHorizontalSpacing)} m | Weight estimate: ${formatSwaNumber(row.totalRebarWeightKg)} kg | ${formatSwaNumber(row.rebarDiameter)} mm</small>
    `;
  }
  return `
    <small>Rebar: ${formatSwaNumber(row.rebarDiameter)} mm dia. x ${formatSwaNumber(row.rebarLength)} m length</small>
  `;
}

function renderEstimateV2ConcretePriceDetails(row) {
  if (!row.cementPrice && !row.sandPrice && !row.gravelPrice) return "";
  return `<small>Prices: Cement ${formatCurrency(row.cementPrice)}/bag | Sand ${formatCurrency(row.sandPrice)}/cu.m | Gravel ${formatCurrency(row.gravelPrice)}/cu.m</small>`;
}

function renderEstimateV2Metric(label, value) {
  const displayValue = typeof value === "string" ? value : formatInteger(value);
  return `
    <div class="estimate-v2-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(displayValue)}</strong>
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
            <th>Detected Quantity</th>
            <th>Evidence</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${materials.map((material) => renderEstimateV2MaterialRow(material)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEstimateV2StructuralSummary(draft) {
  return `
    <section class="estimate-v2-structural-panel" data-estimate-v2-structural-summary>
      ${renderEstimateV2StructuralSummaryContent(draft)}
    </section>
  `;
}

function renderEstimateV2StructuralSummaryContent(draft) {
  const summary = estimateV2StructuralTakeoff(draft);
  return `
      <div class="visual-head compact-head">
        <div>
          <span class="eyebrow">Structural Takeoff</span>
          <h3>Concrete Mix and CHB Estimate</h3>
        </div>
      </div>
      <div class="estimate-v2-structural-grid">
        ${renderEstimateV2StructuralCard("Total Concrete Volume", `${formatSwaNumber(summary.concreteVolume)} cu.m`, "Sum of concrete, footing, column, beam, slab, and concrete wall rows with cu.m quantities.")}
        ${renderEstimateV2StructuralCard("Cement", `${formatSwaNumber(summary.cementVolume)} cu.m`, `${formatInteger(summary.cementBags)} bags approx. | 1 part`)}
        ${renderEstimateV2StructuralCard("Fine Aggregate / Sand", `${formatSwaNumber(summary.sandVolume)} cu.m`, "Default 1:2:4 mix")}
        ${renderEstimateV2StructuralCard("Coarse Aggregate / Gravel", `${formatSwaNumber(summary.gravelVolume)} cu.m`, "Default 1:2:4 mix")}
        ${renderEstimateV2StructuralCard("CHB Wall Area", `${formatSwaNumber(summary.chbArea)} sq.m`, summary.chbAreaNote)}
        ${renderEstimateV2StructuralCard("CHB Count", `${formatInteger(summary.chbPiecesWithWaste)} pcs`, `${formatInteger(summary.chbPieces)} pcs + 5% allowance`)}
      </div>
      <p class="estimate-v2-structural-note">
        Concrete takeoffs can now use selectable ratios; this summary uses the default 1:2:4 ratio and a 1.54 dry-volume factor. CHB count uses 12.5 blocks per sq.m; enter building elevation and wall length when the drawing does not provide wall area yet.
      </p>
  `;
}

function renderEstimateV2StructuralCard(label, value, note) {
  return `
    <article class="estimate-v2-structural-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note || "-")}</small>
    </article>
  `;
}

function renderEstimateV2OcrRegions(regions) {
  const visibleRegions = (Array.isArray(regions) ? regions : []).filter((region) => region.text).slice(0, 12);
  if (!visibleRegions.length) return "";
  return `
    <section class="estimate-v2-region-panel">
      <div class="visual-head compact-head">
        <div>
          <span class="eyebrow">Grouped OCR</span>
          <h3>Detected Text by Page and Region</h3>
        </div>
      </div>
      <div class="estimate-v2-region-grid">
        ${visibleRegions.map((region) => `
          <article class="estimate-v2-region-card">
            <div class="estimate-v2-region-meta">
              <strong>Page ${formatInteger(region.page || 1)}</strong>
              <span>${escapeHtml(region.region || "Region")}</span>
              <span>${formatInteger(region.lineCount || 0)} lines</span>
              <span>${formatInteger(Math.round(Number(region.confidence) || 0))}% OCR</span>
            </div>
            <pre>${escapeHtml(String(region.text || "").slice(0, 900))}</pre>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderEstimateV2MaterialRow(material) {
  const row = normalizeEstimateV2Material(material);
  return `
    <tr data-estimate-v2-row="${escapeAttribute(row.id)}">
      <td>
        <input class="estimate-input description" data-estimate-v2-input data-field="description" value="${escapeAttribute(row.description)}" placeholder="Material or item">
        <small>${(row.matchedTerms || []).map(escapeHtml).join(", ")}</small>
      </td>
      <td><input class="estimate-input" data-estimate-v2-input data-field="category" value="${escapeAttribute(row.category || "General")}" placeholder="Group"></td>
      <td>
        <div class="estimate-v2-quantity-fields">
          <input class="estimate-input" data-estimate-v2-input data-field="quantity" type="number" min="0" step="0.01" value="${numberInputValue(row.quantity)}" placeholder="Qty">
          <input class="estimate-input" data-estimate-v2-input data-field="unit" value="${escapeAttribute(row.unit)}" placeholder="unit">
        </div>
        <small>${formatEstimateV2Quantity(row)}</small>
      </td>
      <td><textarea class="estimate-input estimate-v2-notes" data-estimate-v2-input data-field="notes" placeholder="Evidence or notes">${escapeHtml(row.notes || row.source || (row.sampleLines || []).join("\n"))}</textarea></td>
      <td><input class="estimate-input" data-estimate-v2-input data-field="confidence" value="${escapeAttribute(row.confidence || "-")}" placeholder="confidence"></td>
      <td><button class="ghost-btn danger compact-btn" data-action="delete-estimate-v2-row" data-id="${escapeAttribute(row.id)}">Delete</button></td>
    </tr>
  `;
}

function formatEstimateV2Quantity(material) {
  const quantity = Number(material.quantity);
  if (Number.isFinite(quantity) && quantity > 0) {
    return `${formatSwaNumber(quantity)} ${escapeHtml(material.unit || "")}`.trim();
  }
  const mentions = Number(material.mentions) || 0;
  return mentions ? `${formatInteger(mentions)} hit${mentions === 1 ? "" : "s"}` : "-";
}

function estimateV2TakeoffTool(toolKey) {
  return ESTIMATE_V2_TAKEOFF_TOOLS.find((tool) => tool.key === toolKey) || ESTIMATE_V2_TAKEOFF_TOOLS[0];
}

function estimateV2IsSteelworkTool(toolOrKey) {
  const tool = typeof toolOrKey === "string" ? estimateV2TakeoffTool(toolOrKey) : toolOrKey;
  return Boolean(tool && tool.steelwork);
}

function visibleEstimateV2TakeoffTools() {
  return ESTIMATE_V2_TAKEOFF_TOOLS.filter((tool) => !tool.hidden);
}

function estimateV2ToolGroup(groupKey) {
  return ESTIMATE_V2_TAKEOFF_GROUPS.find((group) => group.key === groupKey) || ESTIMATE_V2_TAKEOFF_GROUPS[0];
}

function estimateV2GroupForTool(toolKey, preferredGroupKey = "") {
  const preferredGroup = estimateV2ToolGroup(preferredGroupKey);
  if (preferredGroup.tools.includes(toolKey)) return preferredGroup.key;
  const matchedGroup = ESTIMATE_V2_TAKEOFF_GROUPS.find((group) => group.tools.includes(toolKey));
  return matchedGroup ? matchedGroup.key : ESTIMATE_V2_TAKEOFF_GROUPS[0].key;
}

function estimateV2ActiveToolGroup(draft) {
  return estimateV2GroupForTool(draft.takeoffTool, state.estimateV2ToolGroup);
}

function estimateV2LayerTools() {
  return visibleEstimateV2TakeoffTools().filter((tool) => tool.type !== "calibrate");
}

function estimateV2LayerGroups() {
  return ESTIMATE_V2_TAKEOFF_GROUPS.map((group) => ({
    ...group,
    tools: group.tools.map(estimateV2TakeoffTool).filter((tool) => !tool.hidden && tool.type !== "calibrate")
  })).filter((group) => group.tools.length);
}

function defaultEstimateV2Layers() {
  return estimateV2LayerTools().reduce((layers, tool) => ({ ...layers, [tool.key]: true }), {});
}

function normalizeEstimateV2Layers(layers) {
  const source = layers && typeof layers === "object" ? layers : {};
  return estimateV2LayerTools().reduce((normalized, tool) => ({ ...normalized, [tool.key]: source[tool.key] !== false }), {});
}

function estimateV2LayerVisible(draft, toolKey) {
  const layers = draft && draft.visibleTakeoffLayers && typeof draft.visibleTakeoffLayers === "object" ? draft.visibleTakeoffLayers : {};
  return layers[toolKey] !== false;
}

function estimateV2ProjectKey(projectId) {
  return projectId || "__unassigned";
}

function sameEstimateV2Project(firstProjectId, secondProjectId) {
  return estimateV2ProjectKey(firstProjectId) === estimateV2ProjectKey(secondProjectId);
}

function estimateV2ProjectRows(draft) {
  const selectedProjectId = draft && draft.selectedProjectId || "";
  return (draft && Array.isArray(draft.takeoffRows) ? draft.takeoffRows : []).filter((row) => sameEstimateV2Project(row.projectId, selectedProjectId));
}

function estimateV2VisibleOverlayRows(draft) {
  return estimateV2ProjectRows(draft).filter((row) => estimateV2LayerVisible(draft, row.tool));
}

function estimateV2TakeoffTotal(rows) {
  return (Array.isArray(rows) ? rows : []).reduce((total, row) => total + estimateV2TakeoffRowTotal(row), 0);
}

function estimateV2TakeoffRowTotal(row) {
  const costPerUnit = estimateV2RowHasComputedMaterialCost(row)
    ? estimateV2ComputedRowCostPerUnit(row)
    : Math.max(0, Number(row && row.costPerUnit) || 0);
  return (Number(row && row.quantity) || 0) * costPerUnit;
}

function estimateV2RowHasComputedMaterialCost(row) {
  const tool = estimateV2TakeoffTool(row && row.tool);
  return tool.type === "concrete-count" || tool.key === "beam-concrete" || tool.key === "floor-slab" || tool.key === "tile-area";
}

function estimateV2ComputedRowCostPerUnit(row) {
  if (!estimateV2RowHasComputedMaterialCost(row)) return Math.max(0, Number(row && row.costPerUnit) || 0);
  const tool = estimateV2TakeoffTool(row && row.tool);
  if (tool.key === "tile-area") {
    const quantity = Math.max(0, Number(row && row.quantity) || 0);
    return quantity > 0 ? estimateV2TileTotalCost(row) / quantity : 0;
  }
  const quantity = Math.max(0, Number(row && row.quantity) || 0);
  const volume = Math.max(0, Number(row && row.concreteVolume) || quantity);
  const mix = concreteMixBreakdown(volume, row && row.concreteMixRatio);
  const materialCost = concreteMaterialCost(mix, row);
  const divisor = tool.key === "floor-slab" ? quantity : volume;
  return divisor > 0 ? materialCost / divisor : 0;
}

function estimateV2ComputedTakeoffCostPerUnit(draft, tool) {
  const activeTool = tool || estimateV2TakeoffTool(draft && draft.takeoffTool);
  if (activeTool.key === "tile-area") {
    const referenceRow = estimateV2TileTakeoffDetails(1, draft);
    return estimateV2TileTotalCost(referenceRow);
  }
  if (activeTool.type !== "concrete-count" && activeTool.key !== "beam-concrete" && activeTool.key !== "floor-slab") {
    return Math.max(0, Number(draft && draft.takeoffCostPerUnit) || 0);
  }
  const wasteFactor = 1 + (Math.max(0, Number(draft && draft.concreteWastePercent) || 0) / 100);
  const referenceVolume = activeTool.key === "floor-slab"
    ? Math.max(0, Number(draft && draft.floorSlabThickness) || FLOOR_SLAB_THICKNESS_OPTIONS[0]) * wasteFactor
    : wasteFactor;
  const mix = concreteMixBreakdown(referenceVolume, draft && draft.concreteMixRatio);
  const materialCost = concreteMaterialCost(mix, draft);
  return activeTool.key === "floor-slab" ? materialCost : materialCost / Math.max(wasteFactor, 1);
}

function rebarUnitWeight(diameter) {
  const normalizedDiameter = Number(diameter) || 0;
  return REBAR_UNIT_WEIGHTS[normalizedDiameter] || ((normalizedDiameter * normalizedDiameter) / 162);
}

function estimateV2SteelColumnStockOptions(verticalLength, tieLength, lapLength) {
  const mainLength = Math.max(0, Number(verticalLength) || 0);
  const tieTotalLength = Math.max(0, Number(tieLength) || 0);
  const lapTotalLength = Math.max(0, Number(lapLength) || 0);
  return REBAR_LENGTH_OPTIONS.map((length) => {
    const stockLength = Math.max(0, Number(length) || 0);
    const longitudinalStockBars = stockLength > 0 ? Math.ceil(mainLength / stockLength) : 0;
    const tieStockBars = stockLength > 0 ? Math.ceil(tieTotalLength / stockLength) : 0;
    const lapStockBars = stockLength > 0 ? Math.ceil(lapTotalLength / stockLength) : 0;
    return {
      length: stockLength,
      longitudinalStockBars,
      tieStockBars,
      lapStockBars,
      totalStockBars: longitudinalStockBars + tieStockBars + lapStockBars
    };
  });
}

function estimateV2SteelColumnStockOptionsFromRow(row) {
  if (Array.isArray(row && row.stockLengthOptions) && row.stockLengthOptions.length) {
    return row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      longitudinalStockBars: Math.max(0, Number(option && option.longitudinalStockBars) || 0),
      tieStockBars: Math.max(0, Number(option && option.tieStockBars) || 0),
      lapStockBars: Math.max(0, Number(option && option.lapStockBars) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || (
        (Number(option && option.longitudinalStockBars) || 0) + (Number(option && option.tieStockBars) || 0) + (Number(option && option.lapStockBars) || 0)
      ) || 0)
    })).filter((option) => option.length);
  }
  return estimateV2SteelColumnStockOptions(row && row.longitudinalTotalLength, row && row.tieTotalLength, row && row.lapAllowanceTotalLength);
}

function estimateV2SteelColumnTakeoff(source, columnCount, options = {}) {
  const takeoffCount = Math.max(0, Number(columnCount) || 0);
  const columnWidth = Math.max(0, Number(source && source.columnWidth) || 0);
  const columnDepth = Math.max(0, Number(source && source.columnDepth) || 0);
  const columnHeight = Math.max(0, Number(source && source.columnHeight) || 0);
  if (!columnWidth || !columnDepth || !columnHeight) {
    if (!options.silent) toast("Enter column width, length, and height.");
    return null;
  }
  const rebarDiameter = REBAR_DIAMETER_OPTIONS.includes(Number(source && source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0];
  const rebarLength = REBAR_LENGTH_OPTIONS.includes(Number(source && source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0];
  const longitudinalBarsPerColumn = Math.max(1, Math.ceil(Number(source && source.longitudinalBarsPerColumn) || STEEL_COLUMN_DEFAULTS.longitudinalBarsPerColumn));
  const tieSpacing = Math.max(0, Number(source && source.tieSpacing) || STEEL_COLUMN_DEFAULTS.tieSpacing);
  const lapAllowancePerBar = Math.max(0, Number(source && source.lapAllowancePerBar) || STEEL_COLUMN_DEFAULTS.lapAllowancePerBar);
  const verticalBarCount = longitudinalBarsPerColumn * takeoffCount;
  const longitudinalLengthPerBar = columnHeight;
  const longitudinalTotalLength = verticalBarCount * longitudinalLengthPerBar;
  const lapAllowanceTotalLength = verticalBarCount * lapAllowancePerBar;
  const tieLengthEach = 2 * (columnWidth + columnDepth);
  const tiesPerColumn = tieSpacing > 0 ? Math.ceil(columnHeight / tieSpacing) + 1 : 0;
  const tiePieceCount = tiesPerColumn * takeoffCount;
  const tieTotalLength = tiePieceCount * tieLengthEach;
  const stockLengthOptions = estimateV2SteelColumnStockOptions(longitudinalTotalLength, tieTotalLength, lapAllowanceTotalLength);
  const selectedStockOption = stockLengthOptions.find((option) => option.length === rebarLength) || stockLengthOptions[0] || {};
  const longitudinalStockBars = Math.max(0, Number(selectedStockOption.longitudinalStockBars) || 0);
  const tieStockBars = Math.max(0, Number(selectedStockOption.tieStockBars) || 0);
  const lapStockBars = Math.max(0, Number(selectedStockOption.lapStockBars) || 0);
  const totalRebarLength = longitudinalTotalLength + tieTotalLength + lapAllowanceTotalLength;
  const totalStockBars = longitudinalStockBars + tieStockBars + lapStockBars;
  const totalRebarWeightKg = totalRebarLength * rebarUnitWeight(rebarDiameter);
  return {
    takeoffCount,
    columnWidth,
    columnDepth,
    columnHeight,
    rebarDiameter,
    rebarLength,
    longitudinalBarsPerColumn,
    verticalBarCount,
    longitudinalLengthPerBar,
    longitudinalTotalLength,
    lapAllowancePerBar,
    lapAllowanceTotalLength,
    longitudinalWastePercent: 0,
    longitudinalStockBars,
    tieSpacing,
    tieHookAllowance: 0,
    tiesPerColumn,
    tiePieceCount,
    tieLengthEach,
    tieTotalLength,
    tieWastePercent: 0,
    tieStockBars,
    lapStockBars,
    totalRebarLength,
    totalRebarWeightKg,
    totalStockBars,
    stockLengthOptions
  };
}

function estimateV2SteelFootingStockOptions(totalLength) {
  const footingRebarLength = Math.max(0, Number(totalLength) || 0);
  return REBAR_LENGTH_OPTIONS.map((length) => {
    const stockLength = Math.max(0, Number(length) || 0);
    const totalStockBars = stockLength > 0 ? Math.ceil(footingRebarLength / stockLength) : 0;
    return {
      length: stockLength,
      totalStockBars
    };
  });
}

function estimateV2SteelFootingStockOptionsFromRow(row) {
  if (Array.isArray(row && row.stockLengthOptions) && row.stockLengthOptions.length) {
    return row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || 0)
    })).filter((option) => option.length);
  }
  return estimateV2SteelFootingStockOptions(row && row.totalRebarLength);
}

function estimateV2SteelFootingTakeoff(source, footingCount, options = {}) {
  const takeoffCount = Math.max(0, Number(footingCount) || 0);
  const footingLength = Math.max(0, Number(source && source.footingLength) || 0);
  const footingWidth = Math.max(0, Number(source && source.footingWidth) || 0);
  const footingThickness = Math.max(0, Number(source && source.footingThickness) || 0);
  if (!footingLength || !footingWidth || !footingThickness) {
    if (!options.silent) toast("Enter footing length, width, and depth.");
    return null;
  }
  const rebarDiameter = REBAR_DIAMETER_OPTIONS.includes(Number(source && source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0];
  const rebarLength = REBAR_LENGTH_OPTIONS.includes(Number(source && source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0];
  const footingRebarSpacing = Math.max(0, Number(source && source.footingRebarSpacing) || STEEL_FOOTING_DEFAULTS.rebarSpacing);
  const footingAllowancePerBar = Math.max(0, Number(source && source.footingAllowancePerBar) || STEEL_FOOTING_DEFAULTS.allowancePerBar);
  const footingXBarsPerFooting = footingRebarSpacing > 0 ? Math.ceil(footingWidth / footingRebarSpacing) + 1 : 0;
  const footingYBarsPerFooting = footingRebarSpacing > 0 ? Math.ceil(footingLength / footingRebarSpacing) + 1 : 0;
  const footingXBarsTotal = footingXBarsPerFooting * takeoffCount;
  const footingYBarsTotal = footingYBarsPerFooting * takeoffCount;
  const footingXBarLength = footingLength + footingAllowancePerBar;
  const footingYBarLength = footingWidth + footingAllowancePerBar;
  const footingXTotalLength = footingXBarsTotal * footingXBarLength;
  const footingYTotalLength = footingYBarsTotal * footingYBarLength;
  const footingTotalBars = footingXBarsTotal + footingYBarsTotal;
  const totalRebarLength = footingXTotalLength + footingYTotalLength;
  const stockLengthOptions = estimateV2SteelFootingStockOptions(totalRebarLength);
  const selectedStockOption = stockLengthOptions.find((option) => option.length === rebarLength) || stockLengthOptions[0] || {};
  const totalStockBars = Math.max(0, Number(selectedStockOption.totalStockBars) || 0);
  const totalRebarWeightKg = totalRebarLength * rebarUnitWeight(rebarDiameter);
  return {
    takeoffCount,
    footingLength,
    footingWidth,
    footingThickness,
    rebarDiameter,
    rebarLength,
    footingRebarSpacing,
    footingAllowancePerBar,
    footingXBarsPerFooting,
    footingYBarsPerFooting,
    footingXBarsTotal,
    footingYBarsTotal,
    footingXBarLength,
    footingYBarLength,
    footingXTotalLength,
    footingYTotalLength,
    footingTotalBars,
    totalRebarLength,
    totalRebarWeightKg,
    totalStockBars,
    stockLengthOptions
  };
}

function steelSlabTypeOption(typeKey) {
  const normalizedType = typeKey === "ground-floor" || typeKey === "second-floor"
    ? STEEL_SLAB_DEFAULTS.type
    : typeKey;
  return STEEL_SLAB_TYPE_OPTIONS.find((option) => option.key === normalizedType) || STEEL_SLAB_TYPE_OPTIONS[0];
}

function steelSlabLevelOption(levelKey) {
  return steelSlabTypeOption(levelKey);
}

function estimateV2SteelSlabStockOptions(totalLength) {
  const slabRebarLength = Math.max(0, Number(totalLength) || 0);
  return REBAR_LENGTH_OPTIONS.map((length) => {
    const stockLength = Math.max(0, Number(length) || 0);
    const totalStockBars = stockLength > 0 ? Math.ceil(slabRebarLength / stockLength) : 0;
    return {
      length: stockLength,
      totalStockBars
    };
  });
}

function estimateV2SteelSlabStockOptionsFromRow(row) {
  if (Array.isArray(row && row.stockLengthOptions) && row.stockLengthOptions.length) {
    return row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || 0)
    })).filter((option) => option.length);
  }
  return estimateV2SteelSlabStockOptions(row && row.totalRebarLength);
}

function estimateV2SteelSlabTakeoff(source, points, slabAreaInput, options = {}) {
  const slabArea = Math.max(0, Number(slabAreaInput) || Number(source && source.slabArea) || 0);
  const metersPerPixel = Math.max(0, Number(source && source.metersPerPixel) || 0);
  const bounds = estimateV2PointBounds(points);
  const rawLength = bounds && metersPerPixel ? (bounds.maxX - bounds.minX) * metersPerPixel : Number(source && source.slabLength) || 0;
  const rawWidth = bounds && metersPerPixel ? (bounds.maxY - bounds.minY) * metersPerPixel : Number(source && source.slabWidth) || 0;
  const fallbackSide = slabArea ? Math.sqrt(slabArea) : 0;
  const measuredLength = Math.max(0, Number(rawLength) || 0);
  const measuredWidth = Math.max(0, Number(rawWidth) || 0);
  let slabLength = Math.max(measuredLength, measuredWidth);
  let slabWidth = Math.min(measuredLength || Infinity, measuredWidth || Infinity);
  if (!Number.isFinite(slabWidth)) slabWidth = 0;
  if (slabArea && slabLength && !slabWidth) slabWidth = slabArea / slabLength;
  if (!slabLength && fallbackSide) {
    slabLength = fallbackSide;
    slabWidth = fallbackSide;
  }
  if (!slabArea || !slabLength || !slabWidth) {
    if (!options.silent) toast("Draw a slab area after calibrating the scale.");
    return null;
  }
  const rebarDiameter = REBAR_DIAMETER_OPTIONS.includes(Number(source && source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0];
  const rebarLength = REBAR_LENGTH_OPTIONS.includes(Number(source && source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0];
  const steelSlabType = steelSlabTypeOption(source && (source.steelSlabType || source.steelSlabLevel));
  const steelSlabRebarSpacing = Math.max(0, Number(source && source.steelSlabRebarSpacing) || STEEL_SLAB_DEFAULTS.rebarSpacing);
  const sourceSteelSlabThickness = Number(source && source.steelSlabThickness);
  const sourceSteelSlabCover = Number(source && source.steelSlabCover);
  const sourceSteelSlabWastePercent = Number(source && source.steelSlabWastePercent);
  const steelSlabThickness = Number.isFinite(sourceSteelSlabThickness) ? Math.max(0, sourceSteelSlabThickness) : STEEL_SLAB_DEFAULTS.thickness;
  const steelSlabCover = Number.isFinite(sourceSteelSlabCover) ? Math.max(0, sourceSteelSlabCover) : STEEL_SLAB_DEFAULTS.cover;
  const steelSlabWastePercent = Number.isFinite(sourceSteelSlabWastePercent) ? Math.max(0, sourceSteelSlabWastePercent) : STEEL_SLAB_DEFAULTS.wastePercent;
  const shortSpan = Math.min(slabLength, slabWidth);
  const longSpan = Math.max(slabLength, slabWidth);
  const steelSlabSpanRatio = shortSpan > 0 ? longSpan / shortSpan : 0;
  const detectedSlabTypeKey = steelSlabSpanRatio >= 2 ? "one-way" : "two-way";
  const resolvedSlabTypeKey = steelSlabType.key === "auto" ? detectedSlabTypeKey : steelSlabType.key;
  const resolvedSlabType = steelSlabTypeOption(resolvedSlabTypeKey);
  const effectiveDepth = Math.max(0, steelSlabThickness - steelSlabCover);
  const steelSlabCrankAllowance = 0.42 * effectiveDepth;
  const slabShortBarsCount = steelSlabRebarSpacing > 0 ? Math.ceil(longSpan / steelSlabRebarSpacing) + 1 : 0;
  const slabLongBarsCount = steelSlabRebarSpacing > 0 ? Math.ceil(shortSpan / steelSlabRebarSpacing) + 1 : 0;
  const slabShortBarLength = shortSpan + steelSlabCrankAllowance;
  const slabLongBarLength = resolvedSlabTypeKey === "one-way" ? longSpan : longSpan + steelSlabCrankAllowance;
  const slabShortTotalLength = slabShortBarsCount * slabShortBarLength;
  const slabLongTotalLength = slabLongBarsCount * slabLongBarLength;
  const slabTotalBars = slabShortBarsCount + slabLongBarsCount;
  const slabTotalLengthBeforeWaste = slabShortTotalLength + slabLongTotalLength;
  const steelSlabWasteFactor = 1 + (steelSlabWastePercent / 100);
  const totalRebarLength = slabTotalLengthBeforeWaste * steelSlabWasteFactor;
  const stockLengthOptions = estimateV2SteelSlabStockOptions(totalRebarLength);
  const selectedStockOption = stockLengthOptions.find((option) => option.length === rebarLength) || stockLengthOptions[0] || {};
  const totalStockBars = Math.max(0, Number(selectedStockOption.totalStockBars) || 0);
  const totalRebarWeightKg = totalRebarLength * rebarUnitWeight(rebarDiameter);
  return {
    slabArea,
    slabLength,
    slabWidth,
    rebarDiameter,
    rebarLength,
    steelSlabType: steelSlabType.key,
    steelSlabTypeLabel: steelSlabType.label,
    steelSlabLevel: steelSlabType.key,
    steelSlabLevelLabel: steelSlabType.label,
    steelSlabDetectedType: detectedSlabTypeKey,
    steelSlabDetectedTypeLabel: steelSlabTypeOption(detectedSlabTypeKey).label,
    steelSlabResolvedType: resolvedSlabTypeKey,
    steelSlabResolvedTypeLabel: resolvedSlabType.label,
    steelSlabFactor: 1,
    steelSlabRebarSpacing,
    steelSlabThickness,
    steelSlabCover,
    steelSlabEffectiveDepth: effectiveDepth,
    steelSlabCrankAllowance,
    steelSlabAllowancePerBar: steelSlabCrankAllowance,
    steelSlabWastePercent,
    steelSlabSpanRatio,
    steelSlabShortSpan: shortSpan,
    steelSlabLongSpan: longSpan,
    slabShortBarsLabel: resolvedSlabTypeKey === "one-way" ? "Main bars along short span" : "Short-span bars",
    slabLongBarsLabel: resolvedSlabTypeKey === "one-way" ? "Distribution bars along long span" : "Long-span bars",
    slabShortBarsCount,
    slabLongBarsCount,
    slabShortBarLength,
    slabLongBarLength,
    slabShortTotalLength,
    slabLongTotalLength,
    slabTotalLengthBeforeWaste,
    slabXBarsPerLayer: slabShortBarsCount,
    slabYBarsPerLayer: slabLongBarsCount,
    slabXBarsTotal: slabShortBarsCount,
    slabYBarsTotal: slabLongBarsCount,
    slabXBarLength: slabShortBarLength,
    slabYBarLength: slabLongBarLength,
    slabXTotalLength: slabShortTotalLength,
    slabYTotalLength: slabLongTotalLength,
    slabTotalBars,
    totalRebarLength,
    totalRebarWeightKg,
    totalStockBars,
    stockLengthOptions
  };
}

function estimateV2SteelBeamStockOptions(totalLength) {
  const beamRebarLength = Math.max(0, Number(totalLength) || 0);
  return REBAR_LENGTH_OPTIONS.map((length) => {
    const stockLength = Math.max(0, Number(length) || 0);
    const totalStockBars = stockLength > 0 ? Math.ceil(beamRebarLength / stockLength) : 0;
    return {
      length: stockLength,
      totalStockBars
    };
  });
}

function estimateV2SteelBeamStockOptionsFromRow(row) {
  if (Array.isArray(row && row.stockLengthOptions) && row.stockLengthOptions.length) {
    return row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || 0)
    })).filter((option) => option.length);
  }
  return estimateV2SteelBeamStockOptions(row && row.totalRebarLength);
}

function estimateV2SteelBeamTakeoff(source, beamLengthInput, options = {}) {
  const beamLength = Math.max(0, Number(beamLengthInput) || Number(source && source.beamLength) || 0);
  if (!beamLength) {
    if (!options.silent) toast("Draw the beam length first.");
    return null;
  }
  const beamWidth = Math.max(0, Number(source && source.beamWidth) || STEEL_BEAM_DEFAULTS.width);
  const beamDepth = Math.max(0, Number(source && source.beamDepth) || STEEL_BEAM_DEFAULTS.depth);
  if (!beamWidth || !beamDepth) {
    if (!options.silent) toast("Enter beam width and depth.");
    return null;
  }
  const rebarDiameter = REBAR_DIAMETER_OPTIONS.includes(Number(source && source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0];
  const rebarLength = REBAR_LENGTH_OPTIONS.includes(Number(source && source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0];
  const beamMainBars = Math.max(1, Math.ceil(Number(source && source.beamMainBars) || STEEL_BEAM_DEFAULTS.mainBars));
  const beamStirrupSpacing = Math.max(0, Number(source && source.beamStirrupSpacing) || STEEL_BEAM_DEFAULTS.stirrupSpacing);
  const sourceBeamCrankBars = Number(source && source.beamCrankBars);
  const beamCrankBars = Number.isFinite(sourceBeamCrankBars)
    ? Math.max(0, Math.ceil(sourceBeamCrankBars))
    : STEEL_BEAM_DEFAULTS.crankBars;
  const beamCrankAllowancePerBar = Math.max(0, Number(source && source.beamCrankAllowancePerBar) || STEEL_BEAM_DEFAULTS.crankAllowancePerBar);
  const beamMainTotalLength = beamMainBars * beamLength;
  const beamStirrupCount = beamStirrupSpacing > 0 ? Math.ceil(beamLength / beamStirrupSpacing) + 1 : 0;
  const beamStirrupLengthEach = 2 * (beamWidth + beamDepth);
  const beamStirrupTotalLength = beamStirrupCount * beamStirrupLengthEach;
  const beamCrankLengthEach = beamLength + beamCrankAllowancePerBar;
  const beamCrankTotalLength = beamCrankBars * beamCrankLengthEach;
  const totalRebarLength = beamMainTotalLength + beamStirrupTotalLength + beamCrankTotalLength;
  const stockLengthOptions = estimateV2SteelBeamStockOptions(totalRebarLength);
  const selectedStockOption = stockLengthOptions.find((option) => option.length === rebarLength) || stockLengthOptions[0] || {};
  const totalStockBars = Math.max(0, Number(selectedStockOption.totalStockBars) || 0);
  const totalRebarWeightKg = totalRebarLength * rebarUnitWeight(rebarDiameter);
  return {
    beamLength,
    beamWidth,
    beamDepth,
    rebarDiameter,
    rebarLength,
    beamMainBars,
    beamMainTotalLength,
    beamStirrupSpacing,
    beamStirrupCount,
    beamStirrupLengthEach,
    beamStirrupTotalLength,
    beamCrankBars,
    beamCrankAllowancePerBar,
    beamCrankLengthEach,
    beamCrankTotalLength,
    totalRebarLength,
    totalRebarWeightKg,
    totalStockBars,
    stockLengthOptions
  };
}

function steelWallVerticalModeOption(modeKey) {
  if (modeKey === "market-length") return STEEL_WALL_VERTICAL_MODE_OPTIONS[0];
  return STEEL_WALL_VERTICAL_MODE_OPTIONS.find((option) => option.key === modeKey) || STEEL_WALL_VERTICAL_MODE_OPTIONS[0];
}

function estimateV2SteelWallStockOptions(totalLength) {
  const wallRebarLength = Math.max(0, Number(totalLength) || 0);
  return REBAR_LENGTH_OPTIONS.map((length) => {
    const stockLength = Math.max(0, Number(length) || 0);
    const totalStockBars = stockLength > 0 ? Math.ceil(wallRebarLength / stockLength) : 0;
    return {
      length: stockLength,
      totalStockBars
    };
  });
}

function estimateV2SteelWallStockOptionsFromRow(row) {
  if (Array.isArray(row && row.stockLengthOptions) && row.stockLengthOptions.length) {
    return row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || 0)
    })).filter((option) => option.length);
  }
  return estimateV2SteelWallStockOptions(row && row.totalRebarLength);
}

function estimateV2SteelWallTakeoff(source, wallLengthInput, options = {}) {
  const wallLength = Math.max(0, Number(wallLengthInput) || Number(source && source.wallLength) || 0);
  const steelWallHeight = Math.max(0, Number(source && source.steelWallHeight) || Number(source && source.chbWallHeight) || STEEL_WALL_DEFAULTS.height);
  if (!wallLength || !steelWallHeight) {
    if (!options.silent) toast("Draw the wall length and enter wall height.");
    return null;
  }
  const rebarDiameter = REBAR_DIAMETER_OPTIONS.includes(Number(source && source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0];
  const rebarLength = REBAR_LENGTH_OPTIONS.includes(Number(source && source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0];
  const steelWallVerticalMode = steelWallVerticalModeOption(source && source.steelWallVerticalMode);
  const steelWallVerticalSpacing = Math.max(0, Number(source && source.steelWallVerticalSpacing) || STEEL_WALL_DEFAULTS.verticalSpacing);
  const steelWallHorizontalSpacing = Math.max(0, Number(source && source.steelWallHorizontalSpacing) || STEEL_WALL_DEFAULTS.horizontalSpacing);
  const steelWallDowelLength = Math.max(0, Number(source && source.steelWallDowelLength) || STEEL_WALL_DEFAULTS.dowelLength);
  const steelWallAllowancePerBar = Math.max(0, Number(source && source.steelWallAllowancePerBar) || STEEL_WALL_DEFAULTS.allowancePerBar);
  const steelWallVerticalBarCount = steelWallVerticalSpacing > 0 ? Math.ceil(wallLength / steelWallVerticalSpacing) + 1 : 0;
  const steelWallHorizontalBarCount = steelWallHorizontalSpacing > 0 ? Math.ceil(steelWallHeight / steelWallHorizontalSpacing) + 1 : 0;
  const steelWallVerticalBarLength = steelWallVerticalMode.key === "dowel"
    ? steelWallDowelLength
    : steelWallHeight + steelWallAllowancePerBar;
  const steelWallHorizontalBarLength = wallLength + steelWallAllowancePerBar;
  const steelWallVerticalTotalLength = steelWallVerticalBarCount * steelWallVerticalBarLength;
  const steelWallHorizontalTotalLength = steelWallHorizontalBarCount * steelWallHorizontalBarLength;
  const steelWallTotalBars = steelWallVerticalBarCount + steelWallHorizontalBarCount;
  const totalRebarLength = steelWallVerticalTotalLength + steelWallHorizontalTotalLength;
  const stockLengthOptions = estimateV2SteelWallStockOptions(totalRebarLength);
  const selectedStockOption = stockLengthOptions.find((option) => option.length === rebarLength) || stockLengthOptions[0] || {};
  const totalStockBars = Math.max(0, Number(selectedStockOption.totalStockBars) || 0);
  const totalRebarWeightKg = totalRebarLength * rebarUnitWeight(rebarDiameter);
  return {
    wallLength,
    steelWallHeight,
    rebarDiameter,
    rebarLength,
    steelWallVerticalMode: steelWallVerticalMode.key,
    steelWallVerticalModeLabel: steelWallVerticalMode.label,
    steelWallVerticalSpacing,
    steelWallHorizontalSpacing,
    steelWallDowelLength,
    steelWallAllowancePerBar,
    steelWallVerticalBarCount,
    steelWallHorizontalBarCount,
    steelWallVerticalBarLength,
    steelWallHorizontalBarLength,
    steelWallVerticalTotalLength,
    steelWallHorizontalTotalLength,
    steelWallTotalBars,
    totalRebarLength,
    totalRebarWeightKg,
    totalStockBars,
    stockLengthOptions
  };
}

function estimateV2TileTakeoffDetails(area, source) {
  const tileArea = Math.max(0, Number(area) || 0);
  const tileLength = Math.max(0, Number(source && source.tileLength) || TILE_TAKEOFF.defaultLength);
  const tileWidth = Math.max(0, Number(source && source.tileWidth) || TILE_TAKEOFF.defaultWidth);
  const tileWastePercent = Math.max(0, Number(source && source.tileWastePercent) || 0);
  const tilePrice = Math.max(0, Number(source && source.tilePrice) || 0);
  return {
    tileLength,
    tileWidth,
    tileWastePercent,
    tilePrice,
    tileArea,
    tilePieces: estimateV2TilePieces(tileArea, tileLength, tileWidth, tileWastePercent)
  };
}

function estimateV2TilePieces(area, tileLength, tileWidth, wastePercent) {
  const tileArea = Math.max(0, Number(tileLength) || 0) * Math.max(0, Number(tileWidth) || 0);
  if (!tileArea) return 0;
  return Math.ceil(Math.max(0, Number(area) || 0) / tileArea * (1 + (Math.max(0, Number(wastePercent) || 0) / 100)));
}

function estimateV2TileTotalCost(source) {
  return (Number(source && source.tilePieces) || 0) * (Number(source && source.tilePrice) || 0);
}

function estimateV2ZoomValue(draft) {
  return Math.max(0.5, Math.min(3, Number(draft && draft.takeoffZoom) || 1));
}

function estimateV2ChbPieces(wallArea, blocksPerSquareMeter, wastePercent) {
  const area = Math.max(0, Number(wallArea) || 0);
  const blocks = Math.max(0, Number(blocksPerSquareMeter) || 0);
  const waste = Math.max(0, Number(wastePercent) || 0);
  return area > 0 && blocks > 0 ? Math.ceil(area * blocks * (1 + waste / 100)) : 0;
}

function pointsToSvg(points) {
  return (Array.isArray(points) ? points : []).map((point) => `${Number(point.x) || 0},${Number(point.y) || 0}`).join(" ");
}

function estimateV2LabelPoint(points) {
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  if (!normalizedPoints.length) return null;
  const center = normalizedPoints.reduce((total, point) => ({ x: total.x + point.x, y: total.y + point.y }), { x: 0, y: 0 });
  return {
    x: center.x / normalizedPoints.length,
    y: center.y / normalizedPoints.length
  };
}

function estimateV2LabelText(row, tool) {
  const quantity = Number(row && row.quantity) || 0;
  if (tool.type === "chb") return `${formatInteger(quantity)} CHB`;
  if (tool.type === "concrete-count") return `${formatSwaNumber(row.concreteVolume || quantity)} cu.m`;
  if (tool.type === "count") return `${formatInteger(quantity)} pcs`;
  return `${formatSwaNumber(quantity)} ${tool.unit}`;
}

function estimateV2PointLabelText(row, tool, index) {
  if (tool.key === "column-concrete") return String(row.typeMark || "Column").trim();
  if (tool.key === "footing-concrete") return String(row.typeMark || "Footing").trim();
  const baseName = String(row.description || tool.defaultName || tool.label).trim();
  const points = Array.isArray(row.points) ? row.points : [];
  return points.length > 1 ? `${baseName} ${index + 1}` : baseName;
}

function estimateV2ActivePointLabelText(tool, draft, index, pointCount) {
  if (tool.key === "column-concrete") return String(draft.concreteTypeMark || "Column").trim();
  if (tool.key === "footing-concrete") return String(draft.footingTypeMark || "Footing").trim();
  const baseName = String(draft.takeoffItemName || tool.defaultName || tool.label).trim();
  return pointCount > 1 ? `${baseName} ${index + 1}` : baseName;
}

function estimateV2CurvePath(points) {
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  if (!normalizedPoints.length) return "";
  if (normalizedPoints.length === 1) return `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`;
  if (normalizedPoints.length === 2) return `M ${normalizedPoints[0].x} ${normalizedPoints[0].y} L ${normalizedPoints[1].x} ${normalizedPoints[1].y}`;
  const segments = estimateV2CurveSegments(normalizedPoints);
  return segments.reduce((path, segment) => {
    return `${path} Q ${segment.control.x} ${segment.control.y} ${segment.end.x} ${segment.end.y}`;
  }, `M ${segments[0].start.x} ${segments[0].start.y}`);
}

function estimateV2CurveSegments(points) {
  if (!Array.isArray(points) || points.length < 3) return [];
  const segments = [];
  let start = points[0];
  for (let index = 1; index < points.length - 1; index += 1) {
    const control = points[index];
    const isLast = index === points.length - 2;
    const end = isLast
      ? points[index + 1]
      : {
          x: (points[index].x + points[index + 1].x) / 2,
          y: (points[index].y + points[index + 1].y) / 2
        };
    segments.push({ start, control, end });
    start = end;
  }
  return segments;
}

function estimateV2PolylinePixels(points) {
  if (!Array.isArray(points) || points.length < 2) return 0;
  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.hypot(point.x - previous.x, point.y - previous.y);
  }, 0);
}

function estimateV2CurvePixels(points) {
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  if (normalizedPoints.length < 2) return 0;
  if (normalizedPoints.length === 2) return estimateV2PolylinePixels(normalizedPoints);
  return estimateV2CurveSegments(normalizedPoints).reduce((total, segment) => {
    return total + estimateV2QuadraticLength(segment.start, segment.control, segment.end);
  }, 0);
}

function estimateV2QuadraticLength(start, control, end) {
  const samples = 24;
  let previous = start;
  let length = 0;
  for (let index = 1; index <= samples; index += 1) {
    const t = index / samples;
    const point = {
      x: ((1 - t) ** 2 * start.x) + (2 * (1 - t) * t * control.x) + (t ** 2 * end.x),
      y: ((1 - t) ** 2 * start.y) + (2 * (1 - t) * t * control.y) + (t ** 2 * end.y)
    };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

function estimateV2PolygonPixels(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  const area = points.reduce((total, point, index) => {
    const next = points[(index + 1) % points.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0);
  return Math.abs(area) / 2;
}

function estimateV2PointBounds(points) {
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  if (!normalizedPoints.length) return null;
  return normalizedPoints.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    maxX: Math.max(bounds.maxX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxY: Math.max(bounds.maxY, point.y)
  }), {
    minX: normalizedPoints[0].x,
    maxX: normalizedPoints[0].x,
    minY: normalizedPoints[0].y,
    maxY: normalizedPoints[0].y
  });
}

function estimateV2StructuralTakeoff(draft) {
  const projectTakeoffRows = estimateV2ProjectRows(draft);
  const rows = projectTakeoffRows.length ? projectTakeoffRows : (draft.materials || []).map(normalizeEstimateV2Material);
  const concreteVolume = rows
    .reduce((total, row) => total + (Number(row.concreteVolume) || (isConcreteVolumeRow(row) ? Number(row.quantity) || 0 : 0)), 0);
  const mix = concreteMixBreakdown(concreteVolume);
  const chb = estimateChbTakeoff(rows, draft);
  return {
    concreteVolume,
    ...mix,
    ...chb
  };
}

function updateEstimateV2StructuralSummary() {
  const summaryNode = document.querySelector("[data-estimate-v2-structural-summary]");
  if (!summaryNode) return;
  summaryNode.innerHTML = renderEstimateV2StructuralSummaryContent(collectEstimateV2DraftFromDom());
}

function concreteMixOption(mixKey) {
  return CONCRETE_MIX_OPTIONS.find((mix) => mix.key === mixKey) || CONCRETE_MIX_OPTIONS[0];
}

function concreteMixBreakdown(concreteVolume, mixKey = DEFAULT_CONCRETE_MIX_RATIO) {
  const wetVolume = Math.max(0, Number(concreteVolume) || 0);
  const mix = concreteMixOption(mixKey);
  const dryVolume = wetVolume * CONCRETE_MIX_DEFAULT.dryVolumeFactor;
  const totalParts = mix.cement + mix.sand + mix.gravel;
  const cementVolume = dryVolume * mix.cement / totalParts;
  const sandVolume = dryVolume * mix.sand / totalParts;
  const gravelVolume = dryVolume * mix.gravel / totalParts;
  return {
    mixKey: mix.key,
    dryVolume,
    cementVolume,
    sandVolume,
    gravelVolume,
    cementBagsExact: cementVolume > 0 ? cementVolume / CONCRETE_MIX_DEFAULT.cementBagVolume : 0,
    cementBags: cementVolume > 0 ? Math.ceil(cementVolume / CONCRETE_MIX_DEFAULT.cementBagVolume) : 0
  };
}

function concreteMaterialCost(mix, source) {
  const cementPrice = Math.max(0, Number(source && source.cementPrice) || 0);
  const sandPrice = Math.max(0, Number(source && source.sandPrice) || 0);
  const gravelPrice = Math.max(0, Number(source && source.gravelPrice) || 0);
  const cementBagsForCost = mix && mix.cementBagsExact !== undefined ? mix.cementBagsExact : mix && mix.cementBags;
  return ((Number(cementBagsForCost) || 0) * cementPrice)
    + ((Number(mix && mix.sandVolume) || 0) * sandPrice)
    + ((Number(mix && mix.gravelVolume) || 0) * gravelPrice);
}

function estimateChbTakeoff(rows, draft) {
  const elevation = Math.max(0, Number(draft.structuralElevation) || 0);
  const manualLength = Math.max(0, Number(draft.chbWallLength) || 0);
  let detectedArea = 0;
  let detectedLength = 0;
  let detectedPieces = 0;

  rows.filter(isChbRow).forEach((row) => {
    const quantity = Math.max(0, Number(row.quantity) || 0);
    if (!quantity) return;
    const unit = normalizeTakeoffUnit(row.unit);
    if (unit === "sq.m") detectedArea += quantity;
    if (unit === "lm") detectedLength += quantity;
    if (unit === "pcs") detectedPieces += quantity;
  });

  const totalLength = detectedLength + manualLength;
  const areaFromLength = elevation > 0 ? totalLength * elevation : 0;
  const chbArea = detectedArea + areaFromLength;
  const areaPieces = chbArea > 0 ? Math.ceil(chbArea * CHB_TAKEOFF.blocksPerSquareMeter) : 0;
  const chbPieces = Math.ceil(areaPieces + detectedPieces);
  const chbPiecesWithWaste = chbPieces > 0 ? Math.ceil(chbPieces * CHB_TAKEOFF.wasteFactor) : 0;
  const noteParts = [];
  if (detectedArea > 0) noteParts.push(`${formatSwaNumber(detectedArea)} sq.m detected`);
  if (totalLength > 0 && elevation > 0) noteParts.push(`${formatSwaNumber(totalLength)} m length x ${formatSwaNumber(elevation)} m elevation`);
  if (detectedPieces > 0) noteParts.push(`${formatInteger(detectedPieces)} pcs detected`);
  return {
    chbArea,
    chbPieces,
    chbPiecesWithWaste,
    chbAreaNote: noteParts.length ? noteParts.join(" | ") : "Add CHB sq.m, CHB wall length, or elevation to estimate blocks."
  };
}

function isConcreteVolumeRow(row) {
  const text = `${row.description} ${row.category} ${(row.matchedTerms || []).join(" ")}`.toLowerCase();
  if (/hollow block|chb|masonry/.test(text)) return false;
  if (!/(concrete|footing|foundation|column|beam|girder|slab|retaining wall|structural wall)/.test(text)) return false;
  return normalizeTakeoffUnit(row.unit) === "cu.m" && Number(row.quantity) > 0;
}

function isChbRow(row) {
  const text = `${row.description} ${row.category} ${(row.matchedTerms || []).join(" ")}`.toLowerCase();
  return /(concrete hollow block|hollow block|chb|masonry block)/.test(text);
}

function normalizeTakeoffUnit(unit) {
  const normalized = normalizeEstimateV2Unit(unit);
  if (normalized) return normalized;
  const value = String(unit || "").toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
  if (["m", "meter", "meters", "linemeter", "linearmeter", "linearmeters"].includes(value)) return "lm";
  return value;
}

function isStructuralPlanType(planType) {
  return ["Structural", "Civil"].includes(planType);
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
  const linkedBilling = activeSheet
    ? getAccountingState().billings.find((billing) => billing.sourceType === "swa" && billing.sourceSwaSheetId === activeSheet.id) || null
    : null;
  const accountingStatus = linkedBilling ? linkedBilling.status : activeSheet && activeSheet.accountingStatus || "";
  const accountingSubmissionLocked = ["Approved", "Paid"].includes(accountingStatus);
  const accountingSubmitLabel = accountingSubmissionLocked
    ? `${accountingStatus} in Accounting`
    : accountingStatus
      ? "Update Accounting Submission"
      : "Submit to Accounting";
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
        <button class="secondary-btn" data-action="submit-swa-accounting" ${activeSheet && !accountingSubmissionLocked ? "" : "disabled"}>${escapeHtml(accountingSubmitLabel)}</button>
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
  const account = getSessionAccount();
  if (!account || !hasAccess(account, view)) {
    toast(`${labelForAccess(view)} access is not assigned to this account.`);
    return;
  }
  state.currentView = view;
  if (view === "engineering") {
    state.engineeringView = "gantt";
  }
  render();
  if (view === "administrative") refreshOwnerAccounts();
}

async function handleSignup() {
  const form = document.getElementById("signup-form");
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const email = String(formData.get("email")).trim().toLowerCase();
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));
  if (password !== confirmPassword) {
    toast("Passwords do not match.");
    return;
  }
  const payload = {
    name: String(formData.get("name")).trim(),
    email,
    password,
    confirmPassword,
    gmailLinked: formData.get("gmail") === "on",
    inviteToken: state.inviteToken
  };

  try {
    const response = await apiRequest("/auth/signup", payload);
    savePublicAccount(response.account);
    localStorage.setItem(STORAGE.session, JSON.stringify({ accountId: response.account.id, token: response.session.token }));
    await initializeCloudAppData();
    state.pendingSignupEmail = null;
    state.backendNotice = "";
    state.currentView = "welcome";
    if (state.inviteToken) {
      state.inviteToken = null;
      window.history.replaceState(null, "", window.location.pathname);
    }
    render();
    toast(response.message || "Account created.");
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
  if (state.inviteToken && !invite) {
    toast("This invitation is invalid, expired, or already used.");
    return;
  }
  if (invite && invite.email && invite.email !== email) {
    toast("This invitation was sent to a different email address.");
    return;
  }
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
    plan: "free",
    invitedBy: invite ? invite.createdBy : null,
    createdAt: new Date().toISOString()
  };

  accounts.push(account);
  saveAccounts(accounts);
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
    await initializeCloudAppData();
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

function openEstimateV2InstructionModal() {
  openModal(`
    <div class="modal estimate-v2-instruction-modal">
      <div class="modal-head">
        <h3>${iconSvg("info")} Estimate v2 Instructions</h3>
        <button class="ghost-btn icon-btn" data-action="close-modal" title="Close" aria-label="Close">${iconSvg("clear")}${iconLabel("Close")}</button>
      </div>
      <div class="modal-body">
        <div class="instruction-grid">
          <article class="instruction-card">
            <strong>1. Insert PDF</strong>
            <p>Upload the floor plan PDF inside the PDF container. Use page controls to move between sheets.</p>
          </article>
          <article class="instruction-card">
            <strong>2. Calibrate Scale</strong>
            <p>Select Setup, choose Calibrate, click two known points, enter the real length, then press Set Scale.</p>
          </article>
          <article class="instruction-card">
            <strong>3. Choose Tool Group</strong>
            <p>Open Architectural, Structural, Steelworks, Masonry, Plumbing, or Electrical, then choose the icon for the item to measure.</p>
          </article>
          <article class="instruction-card">
            <strong>4. Draw Takeoff</strong>
            <p>Click points on the plan. Use Enter to add the takeoff, Ctrl/Cmd+Z to undo points, and F8 for Ortho mode.</p>
          </article>
          <article class="instruction-card">
            <strong>5. Fill Properties</strong>
            <p>Enter dimensions, ratios, waste, and prices in the controls. Computed quantities and cost per unit update from the calculator.</p>
          </article>
          <article class="instruction-card">
            <strong>6. Manage Layers</strong>
            <p>Use bundled Layers to hide or show measurements by group while keeping the takeoff table saved below.</p>
          </article>
        </div>
      </div>
      <div class="modal-foot">
        <button class="primary-btn" data-action="close-modal">Got it</button>
      </div>
    </div>
  `);
}

function openProcurementInstructionModal() {
  openOperationsInstructionModal({
    title: "Procurement Instructions",
    cards: [
      {
        title: "1. Register Suppliers",
        text: "Open Suppliers and add each store or vendor before creating purchase orders. Supplier names are used in spend rankings and purchase-order records."
      },
      {
        title: "2. Create Purchase Requests",
        text: "Use Purchase Requests to record materials before purchasing. Estimate submissions are automatically bundled by project; use Search Project to select or type a project name and show only its materials."
      },
      {
        title: "3. Approve the Request",
        text: "Update the request status as it moves through review. Use Pending, Approved, Ordered, Received, or Cancelled so the request pipeline remains accurate."
      },
      {
        title: "4. Create Purchase Orders",
        text: "After approval, open Purchase Orders and enter the supplier, PO number, actual quantity, unit cost, expected delivery date, and current order status."
      },
      {
        title: "5. Track Deliveries",
        text: "Keep expected delivery dates and statuses updated. Active orders past their expected date automatically appear as overdue in Delivery Watch."
      },
      {
        title: "6. Read the Dashboard",
        text: "The dashboard summarizes committed spend, received value, supplier concentration, request status, order status, and monthly purchase activity from saved records."
      }
    ],
    flow: ["Pending", "Approved", "Ordered", "Received"]
  });
}

function openAccountingInstructionModal() {
  openOperationsInstructionModal({
    title: "Accounting Instructions",
    cards: [
      {
        title: "1. Add Progress Billings",
        text: "Open Billings and record the billing number, related project, description, amount, due date, and status. These records power the Sales Dashboard."
      },
      {
        title: "2. Update Billing Status",
        text: "Move each billing through Draft, Submitted, Approved, and Paid. Paid billings are counted as collected revenue; all other billed amounts remain outstanding."
      },
      {
        title: "3. Record Expenses",
        text: "Open Expenses and enter the project, date, category, payee, description, amount, and payment status for every construction cost."
      },
      {
        title: "4. Maintain Payment Status",
        text: "Use Unpaid, Partially Paid, or Paid to show the current payment condition. Keep the expense date accurate for monthly expense reporting."
      },
      {
        title: "5. Review Commercial Results",
        text: "The Sales Dashboard compares contract portfolio, total billed, collected revenue, outstanding billings, expenses, and net cash."
      },
      {
        title: "6. Keep Records Current",
        text: "Edit existing billings and expenses instead of duplicating them. Every saved record keeps the name and email of the user who entered it."
      }
    ],
    flow: ["Draft", "Submitted", "Approved", "Paid"]
  });
}

function openOperationsInstructionModal({ title, cards, flow }) {
  openModal(`
    <div class="modal operations-instruction-modal">
      <div class="modal-head">
        <h3>${iconSvg("info")} ${escapeHtml(title)}</h3>
        ${iconButton("Close", "clear", "ghost-btn", 'data-action="close-modal"')}
      </div>
      <div class="modal-body">
        <div class="instruction-flow" aria-label="Recommended status flow">
          <strong>Recommended Flow</strong>
          <div>${flow.map((step, index) => `<span>${escapeHtml(step)}</span>${index < flow.length - 1 ? `<i aria-hidden="true">&rarr;</i>` : ""}`).join("")}</div>
        </div>
        <div class="instruction-grid">
          ${cards.map((card) => `
            <article class="instruction-card">
              <strong>${escapeHtml(card.title)}</strong>
              <p>${escapeHtml(card.text)}</p>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="modal-foot">
        <button class="primary-btn" data-action="close-modal">Got it</button>
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
    await initializeCloudAppData();
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

async function submitSwaToAccounting() {
  if (state.activeSwaSheetId === "draft") {
    toast("Save the SWA before submitting it to Accounting.");
    return;
  }

  const swa = getSwaState();
  const sheet = swa.sheets.find((item) => item.id === state.activeSwaSheetId);
  if (!sheet) {
    toast("The saved SWA sheet could not be found.");
    return;
  }

  const amount = dashboardSheetThisPeriodTotal(sheet);
  if (amount <= 0) {
    toast("This SWA has no payment-period amount to submit.");
    return;
  }

  const accounting = getAccountingState();
  const existing = accounting.billings.find((item) => item.sourceType === "swa" && item.sourceSwaSheetId === sheet.id) || null;
  if (existing && ["Approved", "Paid"].includes(existing.status)) {
    toast(`This billing is already ${existing.status.toLowerCase()} in Accounting and cannot be resubmitted.`);
    return;
  }

  if (sessionToken()) {
    try {
      await saveCloudAppDataNow();
      const response = await apiRequest("/swa/submit-accounting", { sheetId: sheet.id }, { timeoutMs: 15000 });
      if (response.accounting) saveAccountingState(response.accounting);
      if (response.submission) {
        const latestSwa = getSwaState();
        latestSwa.sheets = latestSwa.sheets.map((item) => item.id === sheet.id ? {
          ...item,
          accountingBillingId: response.submission.billingId,
          accountingStatus: response.submission.status,
          submittedToAccountingAt: response.submission.submittedAt,
          submittedToAccountingByName: response.submission.submittedByName,
          submittedToAccountingByEmail: response.submission.submittedByEmail
        } : item);
        saveSwaState(latestSwa);
      }
      render();
      toast(response.action === "updated" ? "Accounting submission updated." : "SWA submitted to Accounting.");
      return;
    } catch (error) {
      toast(error.message || "SWA could not be submitted to Accounting.");
      return;
    }
  }

  const result = upsertSwaAccountingBilling(accounting, sheet);
  if (result.locked) {
    toast(`This billing is already ${result.billing.status.toLowerCase()} in Accounting and cannot be resubmitted.`);
    return;
  }
  saveAccountingState(accounting);
  swa.sheets = swa.sheets.map((item) => item.id === sheet.id ? {
    ...item,
    accountingBillingId: result.billing.id,
    accountingStatus: result.billing.status,
    submittedToAccountingAt: result.billing.submittedAt,
    submittedToAccountingByName: result.billing.submittedByName,
    submittedToAccountingByEmail: result.billing.submittedByEmail
  } : item);
  saveSwaState(swa);
  render();
  toast(result.action === "updated" ? "Accounting submission updated." : "SWA submitted to Accounting.");
}

function upsertSwaAccountingBilling(accounting, sheet) {
  const existing = accounting.billings.find((item) => item.sourceType === "swa" && item.sourceSwaSheetId === sheet.id) || null;
  if (existing && ["Approved", "Paid"].includes(existing.status)) {
    return { action: "locked", billing: existing, locked: true };
  }

  const account = getSessionAccount() || {};
  const submittedAt = new Date().toISOString();
  const billing = {
    ...(existing || {}),
    id: existing ? existing.id : cryptoId(),
    billingNumber: sheet.name || "Progress Billing",
    projectId: sheet.projectId || "",
    description: `Statement of Work Accomplished - ${sheet.name || "Progress Billing"}`,
    amount: dashboardSheetThisPeriodTotal(sheet),
    dueDate: existing && existing.dueDate || "",
    status: "Submitted",
    notes: existing && existing.notes || "Submitted directly from the SWA Chart.",
    sourceType: "swa",
    sourceSwaSheetId: sheet.id,
    sourceSwaProjectId: sheet.projectId || "",
    submittedAt,
    submittedById: account.id || "",
    submittedByName: account.name || "",
    submittedByEmail: account.email || "",
    ...enteredByFields(existing || {})
  };
  accounting.billings = existing
    ? accounting.billings.map((item) => item.id === existing.id ? billing : item)
    : [...accounting.billings, billing];
  return { action: existing ? "updated" : "created", billing, locked: false };
}

async function submitEstimateToProcurement(version) {
  const draft = version === "v2" ? collectEstimateV2DraftFromDom() : collectEstimateDraftFromDom();
  const rows = estimateProcurementRows(version, draft);
  if (!rows.length) {
    toast("Add at least one material with a quantity before submitting to Procurement.");
    return;
  }

  if (version === "v2") saveEstimateV2Draft(draft);
  else saveEstimateDraft(draft);

  if (sessionToken()) {
    try {
      const synced = await saveCloudAppDataNow();
      if (!synced) throw new Error("The estimate could not be synced before submission.");
      const response = await apiRequest("/estimate/submit-procurement", {
        version,
        submissionId: draft.submissionId
      }, { timeoutMs: 15000 });
      if (response.procurement) saveProcurementState(response.procurement);
      applyEstimateProcurementSubmission(version, response.submission);
      render();
      toast(estimateProcurementSubmissionMessage(response.submission));
      return;
    } catch (error) {
      toast(error.message || "The estimate could not be submitted to Procurement.");
      return;
    }
  }

  const procurement = getProcurementState();
  const result = upsertEstimateProcurementRequests(procurement, version, draft, rows);
  saveProcurementState(procurement);
  applyEstimateProcurementSubmission(version, result.submission);
  render();
  toast(estimateProcurementSubmissionMessage(result.submission));
}

function estimateProcurementRows(version, draft) {
  if (version === "v2") {
    const projectId = draft && draft.selectedProjectId || "";
    const takeoffRows = estimateV2ProjectRows(draft).map((row) => ({
      id: `takeoff:${row.id}`,
      description: row.description,
      projectId: row.projectId || projectId,
      quantity: Math.max(0, Number(row.quantity) || 0),
      unit: row.unit || "unit",
      costPerUnit: estimateV2RowHasComputedMaterialCost(row)
        ? estimateV2ComputedRowCostPerUnit(row)
        : Math.max(0, Number(row.costPerUnit) || 0)
    }));
    const materialRows = (Array.isArray(draft && draft.materials) ? draft.materials : []).map((row) => ({
      id: `material:${row.id}`,
      description: row.description,
      projectId,
      quantity: Math.max(0, Number(row.quantity) || 0),
      unit: row.unit || "unit",
      costPerUnit: Math.max(0, Number(row.costPerUnit) || 0)
    }));
    return [...takeoffRows, ...materialRows].filter(isUsableEstimateProcurementRow);
  }

  return (Array.isArray(draft && draft.rows) ? draft.rows : []).map((row) => ({
    id: row.id,
    description: row.description,
    projectId: draft.selectedProjectId || "",
    quantity: Math.max(0, Number(row.quantity) || 0),
    unit: row.unit || "unit",
    costPerUnit: Math.max(0, Number(row.costPerUnit) || 0)
  })).filter(isUsableEstimateProcurementRow);
}

function isUsableEstimateProcurementRow(row) {
  return Boolean(String(row && row.description || "").trim()) && Number(row && row.quantity) > 0;
}

function upsertEstimateProcurementRequests(procurement, version, draft, rows) {
  const account = getSessionAccount() || {};
  const submittedAt = new Date().toISOString();
  let createdCount = 0;
  let updatedCount = 0;
  let lockedCount = 0;

  rows.forEach((row) => {
    const existing = procurement.requests.find((item) => item.sourceType === "estimate"
      && item.sourceEstimateVersion === version
      && item.sourceEstimateId === draft.submissionId
      && item.sourceEstimateRowId === row.id) || null;
    if (existing && ["Approved", "Ordered", "Received"].includes(existing.status)) {
      lockedCount += 1;
      return;
    }
    const request = {
      ...(existing || {}),
      id: existing ? existing.id : cryptoId(),
      projectId: row.projectId || "",
      item: String(row.description || "").trim(),
      quantity: Math.max(0, Number(row.quantity) || 0),
      unit: String(row.unit || "unit").trim() || "unit",
      estimatedUnitCost: Math.max(0, Number(row.costPerUnit) || 0),
      neededBy: existing && existing.neededBy || "",
      priority: existing && existing.priority || "Medium",
      status: "Pending",
      notes: existing && existing.notes || `Submitted directly from Estimate ${version.toUpperCase()}.`,
      sourceType: "estimate",
      sourceEstimateVersion: version,
      sourceEstimateId: draft.submissionId,
      sourceEstimateRowId: row.id,
      submittedAt,
      submittedById: account.id || "",
      submittedByName: account.name || "",
      submittedByEmail: account.email || "",
      ...enteredByFields(existing || {})
    };
    procurement.requests = existing
      ? procurement.requests.map((item) => item.id === existing.id ? request : item)
      : [...procurement.requests, request];
    if (existing) updatedCount += 1;
    else createdCount += 1;
  });

  return {
    submission: {
      submittedAt,
      submittedByName: account.name || "",
      submittedByEmail: account.email || "",
      requestCount: rows.length,
      createdCount,
      updatedCount,
      lockedCount
    }
  };
}

function applyEstimateProcurementSubmission(version, submission = {}) {
  const draft = version === "v2" ? getEstimateV2Draft() : getEstimateDraft();
  Object.assign(draft, {
    submittedToProcurementAt: submission.submittedAt || new Date().toISOString(),
    submittedToProcurementByName: submission.submittedByName || "",
    submittedToProcurementByEmail: submission.submittedByEmail || "",
    submittedRequestCount: Math.max(0, Number(submission.requestCount) || 0)
  });
  if (version === "v2") saveEstimateV2Draft(draft);
  else saveEstimateDraft(draft);
}

function estimateProcurementSubmissionMessage(submission = {}) {
  const locked = Math.max(0, Number(submission.lockedCount) || 0);
  const changed = Math.max(0, Number(submission.createdCount) || 0) + Math.max(0, Number(submission.updatedCount) || 0);
  if (locked && !changed) return "Procurement has already processed these estimate requests.";
  if (locked) return `Estimate submitted to Procurement. ${locked} processed request${locked === 1 ? " was" : "s were"} left unchanged.`;
  return "Estimate submitted to Procurement.";
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

function updateEstimateProject(projectId) {
  const draft = collectEstimateDraftFromDom();
  draft.selectedProjectId = projectId || "";
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
    submissionId: cryptoId(),
    title: template.title,
    selectedStore: template.selectedStore || "",
    selectedProjectId: "",
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
      ...collectEstimateV2DraftFromDom(),
      planType,
      fileName: response.fileName || file.name,
      extractedAt: response.extractedAt || new Date().toISOString(),
      pageCount: response.pageCount || 0,
      characterCount: response.characterCount || 0,
      lineCount: response.lineCount || 0,
      textPreview: response.textPreview || "",
      extractionMode: response.extractionMode || "Readable PDF",
      materials: response.materials || []
    }));
    render();
    toast(`${formatInteger((response.materials || []).length)} materials detected.`);
  } catch (error) {
    toast(error.message || "PDF extraction failed.");
  }
}

async function extractEstimateV2Ai() {
  const fileInput = document.querySelector("[data-estimate-v2-file]");
  const planTypeInput = document.querySelector('[data-action="estimate-v2-plan-type"]');
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (!file) {
    toast("Choose a PDF file first.");
    return;
  }
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    toast("AI Vision accepts PDF files only.");
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast("Use a PDF below 8 MB for AI Vision extraction.");
    return;
  }

  const planType = PLAN_TYPES.includes(planTypeInput && planTypeInput.value) ? planTypeInput.value : PLAN_TYPES[0];
  toast("Running AI Vision extraction...");
  try {
    const data = await fileToBase64(file);
    const response = await apiRequest("/estimate-v2/extract-ai", {
      fileName: file.name,
      planType,
      data
    }, { timeoutMs: 90000 });
    saveEstimateV2Draft(normalizeEstimateV2Draft({
      ...collectEstimateV2DraftFromDom(),
      planType,
      fileName: response.fileName || file.name,
      extractedAt: response.extractedAt || new Date().toISOString(),
      pageCount: response.pageCount || 0,
      characterCount: response.characterCount || 0,
      lineCount: response.lineCount || 0,
      textPreview: response.textPreview || "",
      extractionMode: response.extractionMode || "AI Vision",
      materials: response.materials || []
    }));
    render();
    toast(`${formatInteger((response.materials || []).length)} AI materials detected.`);
  } catch (error) {
    toast(error.message || "AI Vision extraction failed.");
  }
}

async function extractEstimateV2LocalVision() {
  const fileInput = document.querySelector("[data-estimate-v2-file]");
  const planTypeInput = document.querySelector('[data-action="estimate-v2-plan-type"]');
  const scaleInput = document.querySelector('[data-action="estimate-v2-scale"]');
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  if (!file) {
    toast("Choose a PDF file first.");
    return;
  }
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    toast("Local Vision OCR accepts PDF files only.");
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast("Use a PDF below 8 MB for Local Vision OCR.");
    return;
  }

  const planType = PLAN_TYPES.includes(planTypeInput && planTypeInput.value) ? planTypeInput.value : PLAN_TYPES[0];
  const drawingScale = DRAWING_SCALES.includes(scaleInput && scaleInput.value) ? scaleInput.value : "1:100";
  toast("Loading Local Vision OCR v1.5...");
  try {
    const ocrResult = await runLocalVisionOcr(file);
    const { text, pageCount, processedPages, regionCount, confidence, regions } = ocrResult;
    const detectedMaterials = detectEstimateV2MaterialsFromRegions(regions, planType, "Local Vision OCR v1.5");
    saveEstimateV2Draft(normalizeEstimateV2Draft({
      ...collectEstimateV2DraftFromDom(),
      planType,
      drawingScale,
      fileName: file.name,
      extractedAt: new Date().toISOString(),
      extractionMode: "Local Vision OCR v1.5",
      pageCount,
      processedPages,
      regionCount,
      characterCount: text.length,
      lineCount: text ? text.split(/\n+/).filter(Boolean).length : 0,
      textPreview: text || "Local OCR finished, but no readable text was found on the processed pages.",
      ocrRegions: regions,
      materials: detectedMaterials.length ? detectedMaterials : [{
        description: "No OCR materials detected",
        category: planType,
        quantity: 0,
        unit: "",
        confidence: confidence ? `${Math.round(confidence)}% OCR` : "low",
        source: "Local Vision OCR v1.5",
        notes: "OCR ran locally with high-resolution rendering and region preprocessing, but did not find known material keywords. Add rows manually or try a clearer/scaled PDF page."
      }]
    }));
    render();
    toast(`${formatInteger(detectedMaterials.length)} local OCR materials detected.`);
  } catch (error) {
    toast(error.message || "Local Vision OCR failed.");
  }
}

function updateEstimateV2PlanType(planType) {
  const draft = getEstimateV2Draft();
  draft.planType = PLAN_TYPES.includes(planType) ? planType : PLAN_TYPES[0];
  saveEstimateV2Draft(draft);
  render();
}

function updateEstimateV2Scale(scale) {
  const draft = collectEstimateV2DraftFromDom();
  draft.drawingScale = DRAWING_SCALES.includes(scale) ? scale : "Custom";
  saveEstimateV2Draft(draft);
  render();
}

function setEstimateV2TakeoffTool(toolKey) {
  const tool = estimateV2TakeoffTool(toolKey);
  if (tool.hidden) return;
  const draft = collectEstimateV2DraftFromDom();
  draft.takeoffTool = tool.key;
  draft.takeoffItemName = tool.defaultName;
  if (tool.type === "calibrate") draft.takeoffCostPerUnit = 0;
  state.estimateV2ToolGroup = estimateV2GroupForTool(tool.key, state.estimateV2ToolGroup);
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2EditingRowId = "";
  state.estimateV2DraggingPointIndex = null;
  clearEstimateV2TakeoffHistory();
  saveEstimateV2Draft(draft);
  render();
}

function setEstimateV2TakeoffGroup(groupKey) {
  const group = estimateV2ToolGroup(groupKey);
  state.estimateV2ToolGroup = group.key;
  const draft = collectEstimateV2DraftFromDom();
  if (!group.tools.includes(draft.takeoffTool)) {
    const nextTool = group.tools.map(estimateV2TakeoffTool).find((tool) => !tool.hidden);
    if (nextTool) {
      draft.takeoffTool = nextTool.key;
      draft.takeoffItemName = nextTool.defaultName;
      if (nextTool.type === "calibrate") draft.takeoffCostPerUnit = 0;
      state.estimateV2ActivePoints = [];
      state.estimateV2RedoPoints = [];
      state.estimateV2EditingRowId = "";
      state.estimateV2DraggingPointIndex = null;
      clearEstimateV2TakeoffHistory();
      saveEstimateV2Draft(draft);
    }
  }
  render();
}

async function loadEstimateV2TakeoffPdf(file, options = {}) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    toast("Estimate v2 accepts PDF files only.");
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    toast("Use a PDF below 12 MB for takeoff.");
    return;
  }
  toast("Loading floor plan PDF...");
  try {
    await loadPdfJs();
    const pdfBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
    state.estimateV2Pdf = pdf;
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
    state.estimateV2EditingRowId = "";
    state.estimateV2DraggingPointIndex = null;
    clearEstimateV2TakeoffHistory();
    const draft = collectEstimateV2DraftFromDom();
    draft.planFileName = file.name;
    if (!options.skipUpload) {
      draft.planStoragePath = "";
      draft.planStorageFileName = "";
      draft.planStorageSize = 0;
      draft.planUploadedAt = "";
      draft.planUploadedByName = "";
      draft.planUploadedByEmail = "";
    }
    draft.takeoffPage = 1;
    draft.takeoffPageCount = pdf.numPages || 1;
    await renderEstimateV2TakeoffPage(draft, 1);
    if (options.skipUpload) {
      toast("Stored PDF loaded for takeoff.");
      return;
    }
    await saveEstimateV2PlanToSupabase(file);
  } catch (error) {
    toast(error.message || "PDF takeoff preview failed.");
  }
}

async function saveEstimateV2PlanToSupabase(file) {
  toast("Saving PDF in secure storage...");
  try {
    const response = await apiRequest("/estimate-v2/plan/upload", {
      fileName: file.name,
      data: await fileToBase64(file)
    }, { timeoutMs: 60000 });
    const plan = response.plan || {};
    saveEstimateV2Draft({
      ...getEstimateV2Draft(),
      planFileName: plan.fileName || file.name,
      planStoragePath: plan.path || "",
      planStorageFileName: plan.fileName || file.name,
      planStorageSize: Number(plan.size) || file.size || 0,
      planUploadedAt: plan.uploadedAt || new Date().toISOString(),
      planUploadedByName: plan.uploadedByName || "",
      planUploadedByEmail: plan.uploadedByEmail || ""
    });
    const synced = await saveCloudAppDataNow();
    if (!synced) scheduleCloudAppDataSync();
    render();
    toast(synced
      ? "PDF loaded and saved in secure storage."
      : "PDF saved in secure storage. Its estimate reference will sync again shortly.");
  } catch (error) {
    console.warn(error);
    toast(`${error.message || "Secure PDF upload failed."} The PDF remains available on this device.`);
  }
}

async function loadEstimateV2StoredPdf() {
  const draft = getEstimateV2Draft();
  if (!draft.planStoragePath) {
    toast("No stored PDF is available for this estimate.");
    return;
  }
  toast("Loading PDF from secure storage...");
  try {
    const blob = await apiBinaryRequest("/estimate-v2/plan/download", {
      path: draft.planStoragePath
    }, { timeoutMs: 60000 });
    const fileName = draft.planStorageFileName || draft.planFileName || "Stored Plan.pdf";
    const file = new File([blob], fileName, { type: "application/pdf" });
    await loadEstimateV2TakeoffPdf(file, { skipUpload: true });
  } catch (error) {
    toast(error.message || "Stored PDF could not be loaded.");
  }
}

async function changeEstimateV2Page(delta) {
  const pdf = state.estimateV2Pdf;
  if (!pdf) {
    toast("Load or upload the PDF to change pages.");
    return;
  }
  const draft = collectEstimateV2DraftFromDom();
  const nextPage = Math.min(Math.max(1, (Number(draft.takeoffPage) || 1) + delta), pdf.numPages || 1);
  if (nextPage === draft.takeoffPage) return;
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2EditingRowId = "";
  state.estimateV2DraggingPointIndex = null;
  clearEstimateV2TakeoffHistory();
  await renderEstimateV2TakeoffPage(draft, nextPage);
}

async function renderEstimateV2TakeoffPage(draft, pageNumber) {
  const pdf = state.estimateV2Pdf;
  if (!pdf) return;
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const maxSide = 1600;
  const renderScale = Math.min(2.25, Math.max(1, maxSide / Math.max(baseViewport.width, baseViewport.height)));
  const viewport = page.getViewport({ scale: renderScale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to render PDF page.");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  state.estimateV2PageImage = canvas.toDataURL("image/png");
  state.estimateV2PageWidth = canvas.width;
  state.estimateV2PageHeight = canvas.height;
  draft.takeoffPage = pageNumber;
  draft.takeoffPageCount = pdf.numPages || 1;
  draft.takeoffPageWidth = canvas.width;
  draft.takeoffPageHeight = canvas.height;
  saveEstimateV2Draft(draft);
  render();
}

function handleEstimateV2PlanClick(event) {
  if (state.estimateV2SuppressNextPlanClick) {
    state.estimateV2SuppressNextPlanClick = false;
    return;
  }
  if (event.target.closest("[data-estimate-v2-active-point-index]")) return;
  const canvasNode = event.target.closest("[data-estimate-v2-plan-canvas]");
  if (!canvasNode) return;
  const draft = collectEstimateV2DraftFromDom();
  const tool = estimateV2TakeoffTool(draft.takeoffTool);
  const point = estimateV2PointFromCanvasEvent(event, canvasNode, draft, tool);
  if (!point) return;
  if (tool.type === "calibrate" && state.estimateV2ActivePoints.length >= 2) {
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
  }
  state.estimateV2ActivePoints.push(point);
  state.estimateV2RedoPoints = [];
  saveEstimateV2Draft(draft);
  renderPreservingEstimateV2Scroll();
}

function estimateV2PointFromCanvasEvent(event, canvasNode, draft, tool, options = {}) {
  const rect = canvasNode.getBoundingClientRect();
  const width = Number(canvasNode.dataset.width) || state.estimateV2PageWidth || draft.takeoffPageWidth;
  const height = Number(canvasNode.dataset.height) || state.estimateV2PageHeight || draft.takeoffPageHeight;
  if (!rect.width || !rect.height || !width || !height) return null;
  const screenToPlan = Math.max(width / rect.width, height / rect.height);
  const snapTolerance = Math.max(8, OBJECT_SNAP_SCREEN_TOLERANCE * screenToPlan);
  const rawPoint = normalizePoint({
    x: (event.clientX - rect.left) * width / rect.width,
    y: (event.clientY - rect.top) * height / rect.height
  });
  return estimateV2ApplyDraftingConstraints(rawPoint, draft, tool, width, height, snapTolerance, options);
}

function estimateV2ApplyDraftingConstraints(rawPoint, draft, tool, width, height, snapTolerance, options = {}) {
  const clamped = estimateV2ClampPoint(rawPoint, width, height);
  if (!clamped) return null;
  const objectSnap = estimateV2ObjectSnapPoint(clamped, draft, tool, snapTolerance);
  let nextPoint = objectSnap ? objectSnap.point : clamped;
  if (options.useOrtho !== false) {
    nextPoint = estimateV2OrthoPoint(nextPoint, draft, tool);
  }
  if (!objectSnap || (draft.orthoModeEnabled && options.useOrtho !== false)) {
    nextPoint = estimateV2SnapPoint(nextPoint, draft, tool);
  }
  return estimateV2ClampPoint(nextPoint, width, height);
}

function handleEstimateV2PointPointerDown(event) {
  const pointNode = event.target.closest("[data-estimate-v2-active-point-index]");
  if (!pointNode) return;
  const canvasNode = pointNode.closest("[data-estimate-v2-plan-canvas]");
  if (!canvasNode) return;
  event.preventDefault();
  event.stopPropagation();
  const pointIndex = Number(pointNode.dataset.estimateV2ActivePointIndex);
  if (!Number.isInteger(pointIndex)) return;
  state.estimateV2DraggingPointIndex = pointIndex;
  state.estimateV2SuppressNextPlanClick = true;
  if (typeof pointNode.setPointerCapture === "function") {
    pointNode.setPointerCapture(event.pointerId);
  }
}

function handleEstimateV2PointPointerMove(event) {
  if (state.estimateV2DraggingPointIndex === null) return;
  const canvasNode = document.querySelector("[data-estimate-v2-plan-canvas]");
  if (!canvasNode) return;
  event.preventDefault();
  const draft = collectEstimateV2DraftFromDom();
  const tool = estimateV2TakeoffTool(draft.takeoffTool);
  const point = estimateV2PointFromCanvasEvent(event, canvasNode, draft, tool, { useOrtho: false });
  if (!point) return;
  const points = [...(state.estimateV2ActivePoints || [])];
  if (!points[state.estimateV2DraggingPointIndex]) return;
  points[state.estimateV2DraggingPointIndex] = point;
  state.estimateV2ActivePoints = points;
  state.estimateV2RedoPoints = [];
  renderPreservingEstimateV2Scroll();
}

function handleEstimateV2PointPointerUp() {
  if (state.estimateV2DraggingPointIndex === null) return;
  state.estimateV2DraggingPointIndex = null;
  saveEstimateV2Draft(collectEstimateV2DraftFromDom());
  window.setTimeout(() => {
    state.estimateV2SuppressNextPlanClick = false;
  }, 120);
}

function estimateV2SnapGridSize(draft) {
  return Math.max(8, Math.min(200, Number(draft.snapGridSize) || 32));
}

function estimateV2OrthoPoint(point, draft, tool) {
  if (!point || !draft.orthoModeEnabled || !ORTHO_TOOL_TYPES.has(tool.type)) return point;
  const points = (state.estimateV2ActivePoints || []).map(normalizePoint).filter(Boolean);
  const last = points[points.length - 1];
  if (!last) return point;
  const dx = point.x - last.x;
  const dy = point.y - last.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: point.x, y: last.y };
  }
  return { x: last.x, y: point.y };
}

function estimateV2ObjectSnapPoint(point, draft, tool, tolerance) {
  if (!point || !draft.objectSnapEnabled || !OBJECT_SNAP_TOOL_TYPES.has(tool.type)) return null;
  const geometry = estimateV2ObjectSnapGeometry(draft);
  const snapTolerance = Math.max(4, Number(tolerance) || OBJECT_SNAP_SCREEN_TOLERANCE);
  let bestEndpoint = null;
  geometry.points.forEach((target) => {
    const distance = estimateV2Distance(point, target);
    if (distance <= snapTolerance * 1.15 && (!bestEndpoint || distance < bestEndpoint.distance)) {
      bestEndpoint = { point: target, distance };
    }
  });
  if (bestEndpoint) return bestEndpoint;

  let bestSegment = null;
  geometry.segments.forEach((segment) => {
    const projected = estimateV2NearestPointOnSegment(point, segment.start, segment.end);
    const distance = estimateV2Distance(point, projected);
    if (distance <= snapTolerance && (!bestSegment || distance < bestSegment.distance)) {
      bestSegment = { point: projected, distance };
    }
  });
  return bestSegment;
}

function estimateV2ObjectSnapGeometry(draft) {
  const geometry = { points: [], segments: [] };
  const currentPage = Number(draft.takeoffPage || 1);
  estimateV2ProjectRows(draft)
    .filter((row) => row.id !== state.estimateV2EditingRowId && Number(row.page || 1) === currentPage)
    .forEach((row) => {
      const tool = estimateV2TakeoffTool(row.tool);
      if (!OBJECT_SNAP_TOOL_TYPES.has(tool.type)) return;
      estimateV2AddSnapGeometry(geometry, row.points, tool.type === "area");
    });
  const activeTool = estimateV2TakeoffTool(draft.takeoffTool);
  estimateV2AddSnapGeometry(geometry, state.estimateV2ActivePoints, activeTool.type === "area");
  return geometry;
}

function estimateV2AddSnapGeometry(geometry, points, closeShape = false) {
  const normalizedPoints = (Array.isArray(points) ? points : []).map(normalizePoint).filter(Boolean);
  normalizedPoints.forEach((point) => geometry.points.push(point));
  normalizedPoints.forEach((point, index) => {
    const nextPoint = normalizedPoints[index + 1];
    if (nextPoint) geometry.segments.push({ start: point, end: nextPoint });
  });
  if (closeShape && normalizedPoints.length > 2) {
    geometry.segments.push({ start: normalizedPoints[normalizedPoints.length - 1], end: normalizedPoints[0] });
  }
}

function estimateV2NearestPointOnSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return start;
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return {
    x: start.x + t * dx,
    y: start.y + t * dy
  };
}

function estimateV2Distance(firstPoint, secondPoint) {
  const dx = firstPoint.x - secondPoint.x;
  const dy = firstPoint.y - secondPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function estimateV2SnapPoint(point, draft, tool) {
  if (!point) return null;
  if (!draft.snapGridEnabled || !SNAP_GRID_TOOL_TYPES.has(tool.type)) return point;
  const size = estimateV2SnapGridSize(draft);
  return normalizePoint({
    x: Math.round(point.x / size) * size,
    y: Math.round(point.y / size) * size
  });
}

function estimateV2ClampPoint(point, width, height) {
  if (!point) return null;
  return normalizePoint({
    x: Math.min(Math.max(0, point.x), Math.max(0, Number(width) || point.x)),
    y: Math.min(Math.max(0, point.y), Math.max(0, Number(height) || point.y))
  });
}

function toggleEstimateV2SnapGrid() {
  const draft = collectEstimateV2DraftFromDom();
  draft.snapGridEnabled = !draft.snapGridEnabled;
  saveEstimateV2Draft(draft);
  render();
  toast(draft.snapGridEnabled ? "Snap Grid on." : "Snap Grid off.");
}

function toggleEstimateV2OrthoMode() {
  const draft = collectEstimateV2DraftFromDom();
  draft.orthoModeEnabled = !draft.orthoModeEnabled;
  saveEstimateV2Draft(draft);
  render();
  toast(draft.orthoModeEnabled ? "Ortho F8 on." : "Ortho F8 off.");
}

function toggleEstimateV2PlanExpanded() {
  state.estimateV2PlanExpanded = !state.estimateV2PlanExpanded;
  renderPreservingEstimateV2Scroll();
  toast(state.estimateV2PlanExpanded ? "Full PDF view on." : "Full PDF view off.");
}

function changeEstimateV2Zoom(delta) {
  const draft = collectEstimateV2DraftFromDom();
  draft.takeoffZoom = Math.round((estimateV2ZoomValue(draft) + delta) * 100) / 100;
  saveEstimateV2Draft(draft);
  render();
}

function resetEstimateV2Zoom() {
  const draft = collectEstimateV2DraftFromDom();
  draft.takeoffZoom = 1;
  saveEstimateV2Draft(draft);
  render();
}

function addEstimateV2PerpendicularPoint(reverse = false) {
  const draft = collectEstimateV2DraftFromDom();
  const tool = estimateV2TakeoffTool(draft.takeoffTool);
  if (!["linear", "curve", "chb"].includes(tool.type)) {
    toast("Use a line tool before adding a perpendicular line.");
    return;
  }
  const points = (state.estimateV2ActivePoints || []).map(normalizePoint).filter(Boolean);
  if (points.length < 2) {
    toast("Add at least two line points first.");
    return;
  }
  const last = points[points.length - 1];
  const previous = points[points.length - 2];
  const dx = last.x - previous.x;
  const dy = last.y - previous.y;
  if (!dx && !dy) {
    toast("The last line segment is too short.");
    return;
  }
  const next = reverse
    ? { x: last.x + dy, y: last.y - dx }
    : { x: last.x - dy, y: last.y + dx };
  const clamped = estimateV2ClampPoint(next, state.estimateV2PageWidth || draft.takeoffPageWidth, state.estimateV2PageHeight || draft.takeoffPageHeight);
  const snapped = estimateV2ClampPoint(estimateV2SnapPoint(clamped, draft, tool), state.estimateV2PageWidth || draft.takeoffPageWidth, state.estimateV2PageHeight || draft.takeoffPageHeight);
  if (!snapped) return;
  state.estimateV2ActivePoints.push(snapped);
  state.estimateV2RedoPoints = [];
  saveEstimateV2Draft(draft);
  renderPreservingEstimateV2Scroll();
  toast("Perpendicular point added.");
}

function finishEstimateV2Takeoff() {
  const draft = collectEstimateV2DraftFromDom();
  const tool = estimateV2TakeoffTool(draft.takeoffTool);
  const points = (state.estimateV2ActivePoints || []).map(normalizePoint).filter(Boolean);
  if (!points.length) {
    toast("Click the plan first.");
    return;
  }
  if (tool.type === "calibrate") {
    if (points.length < 2) {
      toast("Pick two points for scale calibration.");
      return;
    }
    const pixelLength = estimateV2PolylinePixels(points.slice(0, 2));
    if (!pixelLength || !draft.calibrationLength) {
      toast("Enter the known length in meters.");
      return;
    }
    draft.metersPerPixel = draft.calibrationLength / pixelLength;
    draft.calibrationPoints = points.slice(0, 2);
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
    saveEstimateV2Draft(draft);
    render();
    toast("Scale calibrated.");
    return;
  }
  if ((tool.type === "area" || tool.type === "linear" || tool.type === "curve" || tool.type === "chb") && !draft.metersPerPixel) {
    toast("Calibrate scale first.");
    return;
  }
  let quantity = 0;
  let description = draft.takeoffItemName || tool.defaultName;
  let unit = tool.unit;
  let costPerUnit = estimateV2ComputedTakeoffCostPerUnit(draft, tool);
  const takeoffDetails = {};
  if (tool.type === "area") {
    if (points.length < 3) {
      toast("Area takeoff needs at least 3 points.");
      return;
    }
    quantity = estimateV2PolygonPixels(points) * draft.metersPerPixel * draft.metersPerPixel;
    if (tool.key === "floor-slab") {
      const floorSlabThickness = Math.max(0, Number(draft.floorSlabThickness) || FLOOR_SLAB_THICKNESS_OPTIONS[0]);
      const concreteWastePercent = Math.max(0, Number(draft.concreteWastePercent) || 0);
      const concreteVolumeBase = quantity * floorSlabThickness;
      Object.assign(takeoffDetails, {
        concreteKind: "floor-slab",
        floorSlabThickness,
        concreteMixRatio: draft.concreteMixRatio,
        cementPrice: draft.cementPrice,
        sandPrice: draft.sandPrice,
        gravelPrice: draft.gravelPrice,
        concreteWastePercent,
        concreteVolumeBase,
        concreteVolume: concreteVolumeBase * (1 + concreteWastePercent / 100)
      });
      costPerUnit = estimateV2ComputedRowCostPerUnit({
        tool: tool.key,
        quantity,
        ...takeoffDetails
      });
    } else if (tool.key === "tile-area") {
      Object.assign(takeoffDetails, estimateV2TileTakeoffDetails(quantity, draft));
      costPerUnit = estimateV2ComputedRowCostPerUnit({
        tool: tool.key,
        quantity,
        ...takeoffDetails
      });
    } else if (tool.key === "steel-slab") {
      const steelSlab = estimateV2SteelSlabTakeoff(draft, points, quantity);
      if (!steelSlab) return;
      quantity = steelSlab.totalStockBars;
      unit = "pcs";
      Object.assign(takeoffDetails, steelSlab);
      costPerUnit = draft.takeoffCostPerUnit;
    } else {
      costPerUnit = draft.takeoffCostPerUnit;
    }
  } else if (tool.type === "linear") {
    if (points.length < 2) {
      toast("Length takeoff needs at least 2 points.");
      return;
    }
    quantity = estimateV2PolylinePixels(points) * draft.metersPerPixel;
    if (tool.key === "steel-beam") {
      const steelBeam = estimateV2SteelBeamTakeoff(draft, quantity);
      if (!steelBeam) return;
      quantity = steelBeam.totalStockBars;
      unit = "pcs";
      Object.assign(takeoffDetails, steelBeam);
    } else if (tool.key === "steel-wall") {
      const steelWall = estimateV2SteelWallTakeoff(draft, quantity);
      if (!steelWall) return;
      quantity = steelWall.totalStockBars;
      unit = "pcs";
      Object.assign(takeoffDetails, steelWall);
    } else if (tool.key === "beam-concrete") {
      const concreteBeam = estimateV2ConcreteBeamTakeoff(draft, quantity);
      if (!concreteBeam) return;
      quantity = concreteBeam.concreteVolume;
      unit = "cu.m";
      description = `${description} ${concreteBeam.typeMark}`.trim();
      Object.assign(takeoffDetails, concreteBeam);
    }
    costPerUnit = tool.key === "beam-concrete"
      ? estimateV2ComputedRowCostPerUnit({
        tool: tool.key,
        quantity,
        ...takeoffDetails
      })
      : draft.takeoffCostPerUnit;
  } else if (tool.type === "curve") {
    if (points.length < 2) {
      toast("Curve takeoff needs at least 2 points.");
      return;
    }
    quantity = estimateV2CurvePixels(points) * draft.metersPerPixel;
    costPerUnit = draft.takeoffCostPerUnit;
  } else if (tool.type === "chb") {
    if (points.length < 2) {
      toast("CHB wall takeoff needs at least 2 points.");
      return;
    }
    const wallLength = estimateV2PolylinePixels(points) * draft.metersPerPixel;
    const wallHeight = Math.max(0, Number(draft.chbWallHeight) || 0);
    if (!wallHeight) {
      toast("Enter wall height for CHB takeoff.");
      return;
    }
    const wallArea = wallLength * wallHeight;
    const blocksPerSquareMeter = Math.max(0, Number(draft.chbBlocksPerSquareMeter) || CHB_TAKEOFF.blocksPerSquareMeter);
    const wastePercent = Math.max(0, Number(draft.chbWastePercent) || 0);
    quantity = estimateV2ChbPieces(wallArea, blocksPerSquareMeter, wastePercent);
    unit = "pcs";
    description = `${description} ${draft.chbSize || ""}`.trim();
    Object.assign(takeoffDetails, {
      wallLength,
      wallArea,
      chbWallHeight: wallHeight,
      chbWastePercent: wastePercent,
      chbBlocksPerSquareMeter: blocksPerSquareMeter,
      chbSize: draft.chbSize
    });
    costPerUnit = draft.takeoffCostPerUnit;
  } else if (tool.type === "concrete-count") {
    const concrete = estimateV2ConcreteCountTakeoff(tool, draft, points.length);
    if (!concrete) return;
    quantity = concrete.concreteVolume;
    unit = "cu.m";
    description = `${description} ${concrete.typeMark}`.trim();
    Object.assign(takeoffDetails, concrete);
    costPerUnit = estimateV2ComputedRowCostPerUnit({
      tool: tool.key,
      quantity,
      ...takeoffDetails
    });
  } else if (tool.type === "count") {
    const pointCount = points.length;
    quantity = pointCount;
    if (tool.key === "steel-column") {
      const steelColumn = estimateV2SteelColumnTakeoff(draft, pointCount);
      if (!steelColumn) return;
      quantity = steelColumn.totalStockBars;
      unit = "pcs";
      Object.assign(takeoffDetails, steelColumn);
    } else if (tool.key === "steel-footing") {
      const steelFooting = estimateV2SteelFootingTakeoff(draft, pointCount);
      if (!steelFooting) return;
      quantity = steelFooting.totalStockBars;
      unit = "pcs";
      Object.assign(takeoffDetails, steelFooting);
    } else if (estimateV2IsSteelworkTool(tool)) {
      Object.assign(takeoffDetails, {
        takeoffCount: pointCount,
        rebarDiameter: draft.rebarDiameter,
        rebarLength: draft.rebarLength
      });
    }
    costPerUnit = draft.takeoffCostPerUnit;
  }
  const editingRowId = state.estimateV2EditingRowId;
  const previousRow = editingRowId ? draft.takeoffRows.find((row) => row.id === editingRowId) : null;
  const takeoffRow = normalizeEstimateV2TakeoffRow({
    id: editingRowId || cryptoId(),
    projectId: draft.selectedProjectId,
    description,
    tool: tool.key,
    quantity,
    unit,
    costPerUnit,
    points,
    page: draft.takeoffPage,
    color: tool.color,
    ...takeoffDetails
  });
  if (editingRowId) {
    draft.takeoffRows = draft.takeoffRows.map((row) => row.id === editingRowId ? takeoffRow : row);
  } else {
    draft.takeoffRows.push(takeoffRow);
  }
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2EditingRowId = "";
  state.estimateV2DraggingPointIndex = null;
  recordEstimateV2TakeoffHistory({
    type: editingRowId ? "update" : "add",
    row: takeoffRow,
    previousRow
  });
  saveEstimateV2Draft(draft);
  renderPreservingEstimateV2Scroll();
  toast(`${tool.label} takeoff ${editingRowId ? "updated" : "added"}.`);
}

function estimateV2ConcreteCountTakeoff(tool, draft, count) {
  const takeoffCount = Math.max(0, Number(count) || 0);
  const concreteWastePercent = Math.max(0, Number(draft.concreteWastePercent) || 0);
  if (tool.key === "column-concrete") {
    const columnWidth = Math.max(0, Number(draft.columnWidth) || 0);
    const columnDepth = Math.max(0, Number(draft.columnDepth) || 0);
    const columnHeight = Math.max(0, Number(draft.columnHeight) || 0);
    if (!columnWidth || !columnDepth || !columnHeight) {
      toast("Enter column width, depth, and height.");
      return null;
    }
    const concreteVolumeBase = columnWidth * columnDepth * columnHeight * takeoffCount;
    return {
      concreteKind: "column",
      typeMark: draft.concreteTypeMark || "C1",
      takeoffCount,
      columnWidth,
      columnDepth,
      columnHeight,
      concreteMixRatio: draft.concreteMixRatio,
      cementPrice: draft.cementPrice,
      sandPrice: draft.sandPrice,
      gravelPrice: draft.gravelPrice,
      concreteWastePercent,
      concreteVolumeBase,
      concreteVolume: concreteVolumeBase * (1 + concreteWastePercent / 100)
    };
  }
  const footingLength = Math.max(0, Number(draft.footingLength) || 0);
  const footingWidth = Math.max(0, Number(draft.footingWidth) || 0);
  const footingThickness = Math.max(0, Number(draft.footingThickness) || 0);
  if (!footingLength || !footingWidth || !footingThickness) {
    toast("Enter footing length, width, and thickness.");
    return null;
  }
  const pedestalWidth = Math.max(0, Number(draft.pedestalWidth) || 0);
  const pedestalDepth = Math.max(0, Number(draft.pedestalDepth) || 0);
  const pedestalHeight = Math.max(0, Number(draft.pedestalHeight) || 0);
  const footingVolumeEach = footingLength * footingWidth * footingThickness;
  const pedestalVolumeEach = pedestalWidth * pedestalDepth * pedestalHeight;
  const concreteVolumeBase = (footingVolumeEach + pedestalVolumeEach) * takeoffCount;
  return {
    concreteKind: "footing",
    typeMark: draft.footingTypeMark || "F1",
    takeoffCount,
    footingLength,
    footingWidth,
    footingThickness,
    footingVolume: footingVolumeEach * takeoffCount,
    pedestalWidth,
    pedestalDepth,
    pedestalHeight,
    pedestalVolume: pedestalVolumeEach * takeoffCount,
    concreteMixRatio: draft.concreteMixRatio,
    cementPrice: draft.cementPrice,
    sandPrice: draft.sandPrice,
    gravelPrice: draft.gravelPrice,
    concreteWastePercent,
    concreteVolumeBase,
    concreteVolume: concreteVolumeBase * (1 + concreteWastePercent / 100)
  };
}

function estimateV2ConcreteBeamTakeoff(draft, beamLengthInput, options = {}) {
  const beamLength = Math.max(0, Number(beamLengthInput) || Number(draft && draft.beamLength) || 0);
  const beamWidth = Math.max(0, Number(draft && draft.beamWidth) || 0);
  const beamDepth = Math.max(0, Number(draft && draft.beamDepth) || 0);
  const concreteWastePercent = Math.max(0, Number(draft && draft.concreteWastePercent) || 0);
  if (!beamLength || !beamWidth || !beamDepth) {
    if (!options.silent) toast("Draw the beam length and enter beam width and depth.");
    return null;
  }
  const concreteVolumeBase = beamLength * beamWidth * beamDepth;
  return {
    concreteKind: "beam",
    typeMark: draft.beamConcreteTypeMark || "B1",
    beamLength,
    beamWidth,
    beamDepth,
    concreteMixRatio: draft.concreteMixRatio,
    cementPrice: draft.cementPrice,
    sandPrice: draft.sandPrice,
    gravelPrice: draft.gravelPrice,
    concreteWastePercent,
    concreteVolumeBase,
    concreteVolume: concreteVolumeBase * (1 + concreteWastePercent / 100)
  };
}

function undoEstimateV2Point() {
  const point = state.estimateV2ActivePoints.pop();
  if (point) state.estimateV2RedoPoints.push(point);
  renderPreservingEstimateV2Scroll();
}

function redoEstimateV2Point() {
  const point = state.estimateV2RedoPoints.pop();
  if (point) state.estimateV2ActivePoints.push(point);
  renderPreservingEstimateV2Scroll();
}

function undoEstimateV2PointOrTakeoff() {
  if ((state.estimateV2ActivePoints || []).length) {
    undoEstimateV2Point();
    return;
  }
  undoEstimateV2GeneratedTakeoff();
}

function redoEstimateV2PointOrTakeoff() {
  if ((state.estimateV2RedoPoints || []).length) {
    redoEstimateV2Point();
    return;
  }
  redoEstimateV2GeneratedTakeoff();
}

function recordEstimateV2TakeoffHistory(action) {
  if (!action || !action.row) return;
  state.estimateV2TakeoffUndoStack.push(action);
  if (state.estimateV2TakeoffUndoStack.length > 40) state.estimateV2TakeoffUndoStack.shift();
  state.estimateV2TakeoffRedoStack = [];
}

function clearEstimateV2TakeoffHistory() {
  state.estimateV2TakeoffUndoStack = [];
  state.estimateV2TakeoffRedoStack = [];
}

function undoEstimateV2GeneratedTakeoff() {
  const draft = collectEstimateV2DraftFromDom();
  const action = state.estimateV2TakeoffUndoStack.pop() || estimateV2FallbackUndoAction(draft);
  if (!action) {
    toast("No generated takeoff to undo.");
    return;
  }
  applyEstimateV2TakeoffUndo(draft, action);
  state.estimateV2TakeoffRedoStack.push(action);
  saveEstimateV2Draft(draft);
  renderPreservingEstimateV2Scroll();
  toast("Generated takeoff undone.");
}

function redoEstimateV2GeneratedTakeoff() {
  const draft = collectEstimateV2DraftFromDom();
  const action = state.estimateV2TakeoffRedoStack.pop();
  if (!action) {
    toast("No generated takeoff to redo.");
    return;
  }
  applyEstimateV2TakeoffRedo(draft, action);
  state.estimateV2TakeoffUndoStack.push(action);
  saveEstimateV2Draft(draft);
  renderPreservingEstimateV2Scroll();
  toast("Generated takeoff restored.");
}

function estimateV2FallbackUndoAction(draft) {
  const currentPage = Number(draft.takeoffPage || 1);
  const rows = estimateV2ProjectRows(draft).filter((row) => Number(row.page || 1) === currentPage);
  const row = rows[rows.length - 1];
  return row ? { type: "add", row, previousRow: null } : null;
}

function applyEstimateV2TakeoffUndo(draft, action) {
  if (action.type === "update" && action.previousRow) {
    draft.takeoffRows = draft.takeoffRows.map((row) => row.id === action.row.id ? action.previousRow : row);
    return;
  }
  draft.takeoffRows = draft.takeoffRows.filter((row) => row.id !== action.row.id);
}

function applyEstimateV2TakeoffRedo(draft, action) {
  if (action.type === "update") {
    draft.takeoffRows = draft.takeoffRows.map((row) => row.id === action.row.id ? action.row : row);
    return;
  }
  if (draft.takeoffRows.some((row) => row.id === action.row.id)) return;
  draft.takeoffRows.push(action.row);
}

function clearEstimateV2Points() {
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2DraggingPointIndex = null;
  renderPreservingEstimateV2Scroll();
}

async function editEstimateV2Takeoff(rowId) {
  const draft = collectEstimateV2DraftFromDom();
  const row = draft.takeoffRows.find((item) => item.id === rowId);
  if (!row) return;
  const previousPage = draft.takeoffPage;
  const nextPage = row.page || draft.takeoffPage;
  draft.selectedProjectId = row.projectId || "";
  draft.takeoffTool = row.tool;
  draft.takeoffItemName = row.description || estimateV2TakeoffTool(row.tool).defaultName;
  draft.takeoffCostPerUnit = row.costPerUnit || 0;
  draft.takeoffPage = nextPage;
  draft.concreteMixRatio = row.concreteMixRatio || draft.concreteMixRatio;
  draft.cementPrice = row.cementPrice || draft.cementPrice;
  draft.sandPrice = row.sandPrice || draft.sandPrice;
  draft.gravelPrice = row.gravelPrice || draft.gravelPrice;
  if (row.concreteWastePercent || row.concreteWastePercent === 0) draft.concreteWastePercent = row.concreteWastePercent;
  if (row.floorSlabThickness) draft.floorSlabThickness = row.floorSlabThickness;
  if (row.tileLength) draft.tileLength = row.tileLength;
  if (row.tileWidth) draft.tileWidth = row.tileWidth;
  if (row.tileWastePercent || row.tileWastePercent === 0) draft.tileWastePercent = row.tileWastePercent;
  if (row.tilePrice || row.tilePrice === 0) draft.tilePrice = row.tilePrice;
  if (row.rebarDiameter) draft.rebarDiameter = row.rebarDiameter;
  if (row.rebarLength) draft.rebarLength = row.rebarLength;
  if (row.tool === "steel-column") {
    draft.columnWidth = row.columnWidth || draft.columnWidth;
    draft.columnDepth = row.columnDepth || draft.columnDepth;
    draft.columnHeight = row.columnHeight || draft.columnHeight;
    draft.longitudinalBarsPerColumn = row.longitudinalBarsPerColumn || draft.longitudinalBarsPerColumn;
    draft.tieSpacing = row.tieSpacing || draft.tieSpacing;
    draft.lapAllowancePerBar = row.lapAllowancePerBar || draft.lapAllowancePerBar;
  }
  if (row.tool === "steel-footing") {
    draft.footingLength = row.footingLength || draft.footingLength;
    draft.footingWidth = row.footingWidth || draft.footingWidth;
    draft.footingThickness = row.footingThickness || draft.footingThickness;
  }
  if (row.tool === "steel-slab") {
    draft.steelSlabType = row.steelSlabType || row.steelSlabLevel || draft.steelSlabType;
    draft.steelSlabLevel = draft.steelSlabType;
    draft.steelSlabRebarSpacing = row.steelSlabRebarSpacing || draft.steelSlabRebarSpacing;
    draft.steelSlabThickness = row.steelSlabThickness || draft.steelSlabThickness;
    draft.steelSlabCover = row.steelSlabCover || draft.steelSlabCover;
    if (row.steelSlabWastePercent || row.steelSlabWastePercent === 0) draft.steelSlabWastePercent = row.steelSlabWastePercent;
  }
  if (row.tool === "steel-beam") {
    draft.beamWidth = row.beamWidth || draft.beamWidth;
    draft.beamDepth = row.beamDepth || draft.beamDepth;
    draft.beamMainBars = row.beamMainBars || draft.beamMainBars;
    draft.beamStirrupSpacing = row.beamStirrupSpacing || draft.beamStirrupSpacing;
    draft.beamCrankBars = row.beamCrankBars || draft.beamCrankBars;
    draft.beamCrankAllowancePerBar = row.beamCrankAllowancePerBar || draft.beamCrankAllowancePerBar;
  }
  if (row.tool === "steel-wall") {
    draft.steelWallHeight = row.steelWallHeight || draft.steelWallHeight;
    draft.steelWallVerticalMode = row.steelWallVerticalMode || draft.steelWallVerticalMode;
    draft.steelWallVerticalSpacing = row.steelWallVerticalSpacing || draft.steelWallVerticalSpacing;
    draft.steelWallHorizontalSpacing = row.steelWallHorizontalSpacing || draft.steelWallHorizontalSpacing;
    draft.steelWallDowelLength = row.steelWallDowelLength || draft.steelWallDowelLength;
  }
  if (row.chbWallHeight) draft.chbWallHeight = row.chbWallHeight;
  if (row.chbWastePercent || row.chbWastePercent === 0) draft.chbWastePercent = row.chbWastePercent;
  if (row.chbBlocksPerSquareMeter) draft.chbBlocksPerSquareMeter = row.chbBlocksPerSquareMeter;
  if (row.chbSize) draft.chbSize = row.chbSize;
  if (row.concreteKind === "column") {
    draft.concreteTypeMark = row.typeMark || draft.concreteTypeMark;
    draft.columnWidth = row.columnWidth || draft.columnWidth;
    draft.columnDepth = row.columnDepth || draft.columnDepth;
    draft.columnHeight = row.columnHeight || draft.columnHeight;
  }
  if (row.concreteKind === "footing") {
    draft.footingTypeMark = row.typeMark || draft.footingTypeMark;
    draft.footingLength = row.footingLength || draft.footingLength;
    draft.footingWidth = row.footingWidth || draft.footingWidth;
    draft.footingThickness = row.footingThickness || draft.footingThickness;
    draft.pedestalWidth = row.pedestalWidth || 0;
    draft.pedestalDepth = row.pedestalDepth || 0;
    draft.pedestalHeight = row.pedestalHeight || 0;
  }
  if (row.concreteKind === "beam") {
    draft.beamConcreteTypeMark = row.typeMark || draft.beamConcreteTypeMark;
    draft.beamWidth = row.beamWidth || draft.beamWidth;
    draft.beamDepth = row.beamDepth || draft.beamDepth;
  }
  state.estimateV2ToolGroup = estimateV2GroupForTool(row.tool, state.estimateV2ToolGroup);
  state.estimateV2EditingRowId = row.id;
  state.estimateV2ActivePoints = Array.isArray(row.points) ? row.points.map(normalizePoint).filter(Boolean) : [];
  state.estimateV2RedoPoints = [];
  state.estimateV2DraggingPointIndex = null;
  saveEstimateV2Draft(draft);
  if (state.estimateV2Pdf && Number(nextPage) !== Number(previousPage)) {
    await renderEstimateV2TakeoffPage(draft, nextPage);
  } else {
    render();
  }
  toast("Shape loaded for editing.");
}

function cancelEstimateV2ShapeEdit() {
  state.estimateV2EditingRowId = "";
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2DraggingPointIndex = null;
  render();
  toast("Shape editing cancelled.");
}

function deleteEstimateV2Takeoff(rowId) {
  const draft = collectEstimateV2DraftFromDom();
  draft.takeoffRows = draft.takeoffRows.filter((row) => row.id !== rowId);
  if (state.estimateV2EditingRowId === rowId) {
    state.estimateV2EditingRowId = "";
    state.estimateV2ActivePoints = [];
    state.estimateV2RedoPoints = [];
    state.estimateV2DraggingPointIndex = null;
  }
  saveEstimateV2Draft(draft);
  render();
  toast("Takeoff row deleted.");
}

function updateEstimateV2TakeoffTotals() {
  const draft = collectEstimateV2DraftFromDom();
  const rows = estimateV2ProjectRows(draft);
  const activeTool = estimateV2TakeoffTool(draft.takeoffTool);
  const activeCostNode = document.querySelector("[data-estimate-v2-computed-current-cost]");
  if (activeCostNode) activeCostNode.value = numberInputValue(estimateV2ComputedTakeoffCostPerUnit(draft, activeTool));
  document.querySelectorAll("[data-estimate-v2-takeoff-row]").forEach((rowNode) => {
    const row = rows.find((item) => item.id === rowNode.dataset.estimateV2TakeoffRow);
    const totalNode = rowNode.querySelector("[data-estimate-v2-row-total]");
    const quantityInput = rowNode.querySelector('[data-field="quantity"]');
    const costInput = rowNode.querySelector('[data-field="costPerUnit"]');
    const heightNode = rowNode.querySelector("[data-estimate-v2-chb-height-display]");
    const blocksNode = rowNode.querySelector("[data-estimate-v2-chb-blocks-display]");
    const wasteNode = rowNode.querySelector("[data-estimate-v2-chb-waste-display]");
    const wallAreaNode = rowNode.querySelector("[data-estimate-v2-chb-wall-area-display]");
    const tilePiecesNode = rowNode.querySelector("[data-estimate-v2-tile-pieces-display]");
    const tileTotalNode = rowNode.querySelector("[data-estimate-v2-tile-total-display]");
    if (row && estimateV2TakeoffTool(row.tool).type === "chb" && quantityInput) quantityInput.value = numberInputValue(row.quantity);
    if (row && costInput && estimateV2RowHasComputedMaterialCost(row)) costInput.value = numberInputValue(row.costPerUnit);
    if (row && heightNode) heightNode.textContent = formatSwaNumber(row.chbWallHeight);
    if (row && blocksNode) blocksNode.textContent = formatSwaNumber(row.chbBlocksPerSquareMeter);
    if (row && wasteNode) wasteNode.textContent = formatSwaNumber(row.chbWastePercent);
    if (row && wallAreaNode) wallAreaNode.textContent = formatSwaNumber(row.wallArea);
    if (row && tilePiecesNode) tilePiecesNode.textContent = formatInteger(row.tilePieces);
    if (row && tileTotalNode) tileTotalNode.textContent = formatCurrency(estimateV2TileTotalCost(row));
    if (row && totalNode) {
      const rowTotal = estimateV2TakeoffRowTotal(row);
      totalNode.textContent = formatEstimateV2TotalCost(rowTotal);
      totalNode.title = formatCurrency(rowTotal);
    }
  });
  document.querySelectorAll("[data-estimate-v2-takeoff-total]").forEach((node) => {
    const total = estimateV2TakeoffTotal(rows);
    node.textContent = formatEstimateV2TotalCost(total);
    node.title = formatCurrency(total);
  });
}

function addEstimateV2Row() {
  const draft = collectEstimateV2DraftFromDom();
  draft.materials.push(blankEstimateV2Material());
  saveEstimateV2Draft(draft);
  render();
}

function deleteEstimateV2Row(rowId) {
  const draft = collectEstimateV2DraftFromDom();
  draft.materials = draft.materials.filter((row) => row.id !== rowId);
  saveEstimateV2Draft(draft);
  render();
  toast("Estimate v2 row deleted.");
}

function saveEstimateV2Template() {
  const draft = collectEstimateV2DraftFromDom();
  const takeoffRows = (draft.takeoffRows || []).filter((row) => row.description);
  const rows = takeoffRows.length ? takeoffRows : draft.materials.filter((row) => row.description && row.description !== "No OCR materials detected");
  if (!rows.length) {
    toast("Add at least one takeoff row before saving a template.");
    return;
  }
  const templates = getEstimateTemplates();
  const titleBase = draft.planFileName ? draft.planFileName.replace(/\.pdf$/i, "") : `${draft.planType} Takeoff`;
  const title = `${titleBase} Template`;
  const template = {
    id: cryptoId(),
    title,
    selectedStore: "",
    rows: rows.map((row) => normalizeEstimateRow({
      id: cryptoId(),
      description: row.description,
      unit: row.unit,
      quantity: row.quantity,
      costPerUnit: row.costPerUnit || 0
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveEstimateTemplates([...templates, template]);
  toast(`${title} saved as an estimate template.`);
}

function clearEstimateV2Draft() {
  state.estimateV2Pdf = null;
  state.estimateV2PageImage = "";
  state.estimateV2PageWidth = 0;
  state.estimateV2PageHeight = 0;
  state.estimateV2ActivePoints = [];
  state.estimateV2RedoPoints = [];
  state.estimateV2EditingRowId = "";
  state.estimateV2DraggingPointIndex = null;
  state.estimateV2PlanExpanded = false;
  clearEstimateV2TakeoffHistory();
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
    ...current,
    title: titleInput ? titleInput.value.trim() : current.title,
    selectedStore: estimateSelectedStoreFromDom(),
    selectedProjectId: estimateSelectedProjectFromDom(),
    rows: collectEstimateRowsFromDom(),
    updatedAt: new Date().toISOString()
  };
}

function collectEstimateV2DraftFromDom() {
  const current = getEstimateV2Draft();
  const projectInput = document.querySelector("[data-estimate-v2-project-select]");
  const planTypeInput = document.querySelector('[data-action="estimate-v2-plan-type"]');
  const scaleInput = document.querySelector('[data-action="estimate-v2-scale"]');
  const elevationInput = document.querySelector("[data-estimate-v2-structural-elevation]");
  const chbLengthInput = document.querySelector("[data-estimate-v2-chb-wall-length]");
  const currentNameInput = document.querySelector("[data-estimate-v2-current-name]");
  const currentCostInput = document.querySelector("[data-estimate-v2-current-cost]");
  const calibrationLengthInput = document.querySelector("[data-estimate-v2-calibration-length]");
  const chbHeightInput = document.querySelector("[data-estimate-v2-chb-height]");
  const chbWasteInput = document.querySelector("[data-estimate-v2-chb-waste]");
  const chbBlocksInput = document.querySelector("[data-estimate-v2-chb-blocks]");
  const chbSizeInput = document.querySelector("[data-estimate-v2-chb-size]");
  const concreteMarkInput = document.querySelector("[data-estimate-v2-concrete-mark]");
  const columnWidthInput = document.querySelector("[data-estimate-v2-column-width]");
  const columnDepthInput = document.querySelector("[data-estimate-v2-column-depth]");
  const columnHeightInput = document.querySelector("[data-estimate-v2-column-height]");
  const footingLengthInput = document.querySelector("[data-estimate-v2-footing-length]");
  const footingWidthInput = document.querySelector("[data-estimate-v2-footing-width]");
  const footingThicknessInput = document.querySelector("[data-estimate-v2-footing-thickness]");
  const pedestalWidthInput = document.querySelector("[data-estimate-v2-pedestal-width]");
  const pedestalDepthInput = document.querySelector("[data-estimate-v2-pedestal-depth]");
  const pedestalHeightInput = document.querySelector("[data-estimate-v2-pedestal-height]");
  const concreteWasteInput = document.querySelector("[data-estimate-v2-concrete-waste]");
  const concreteRatioInput = document.querySelector("[data-estimate-v2-concrete-ratio]");
  const cementPriceInput = document.querySelector("[data-estimate-v2-cement-price]");
  const sandPriceInput = document.querySelector("[data-estimate-v2-sand-price]");
  const gravelPriceInput = document.querySelector("[data-estimate-v2-gravel-price]");
  const floorSlabThicknessInput = document.querySelector("[data-estimate-v2-floor-slab-thickness]");
  const tileLengthInput = document.querySelector("[data-estimate-v2-tile-length]");
  const tileWidthInput = document.querySelector("[data-estimate-v2-tile-width]");
  const tileWasteInput = document.querySelector("[data-estimate-v2-tile-waste]");
  const tilePriceInput = document.querySelector("[data-estimate-v2-tile-price]");
  const rebarDiameterInput = document.querySelector("[data-estimate-v2-rebar-diameter]");
  const rebarLengthInput = document.querySelector("[data-estimate-v2-rebar-length]");
  const longitudinalBarsInput = document.querySelector("[data-estimate-v2-main-bars]");
  const tieSpacingInput = document.querySelector("[data-estimate-v2-tie-spacing]");
  const lapAllowanceInput = document.querySelector("[data-estimate-v2-lap-allowance]");
  const steelSlabLevelInput = document.querySelector("[data-estimate-v2-steel-slab-level]");
  const steelSlabSpacingInput = document.querySelector("[data-estimate-v2-steel-slab-spacing]");
  const steelSlabThicknessInput = document.querySelector("[data-estimate-v2-steel-slab-thickness]");
  const steelSlabCoverInput = document.querySelector("[data-estimate-v2-steel-slab-cover]");
  const steelSlabWasteInput = document.querySelector("[data-estimate-v2-steel-slab-waste]");
  const beamWidthInput = document.querySelector("[data-estimate-v2-beam-width]");
  const beamDepthInput = document.querySelector("[data-estimate-v2-beam-depth]");
  const beamMainBarsInput = document.querySelector("[data-estimate-v2-beam-main-bars]");
  const beamStirrupSpacingInput = document.querySelector("[data-estimate-v2-beam-stirrup-spacing]");
  const beamCrankBarsInput = document.querySelector("[data-estimate-v2-beam-crank-bars]");
  const beamCrankAllowanceInput = document.querySelector("[data-estimate-v2-beam-crank-allowance]");
  const steelWallHeightInput = document.querySelector("[data-estimate-v2-steel-wall-height]");
  const steelWallModeInput = document.querySelector("[data-estimate-v2-steel-wall-mode]");
  const steelWallVerticalSpacingInput = document.querySelector("[data-estimate-v2-steel-wall-vertical-spacing]");
  const steelWallHorizontalSpacingInput = document.querySelector("[data-estimate-v2-steel-wall-horizontal-spacing]");
  const steelWallDowelLengthInput = document.querySelector("[data-estimate-v2-steel-wall-dowel-length]");
  const orthoModeInput = document.querySelector("[data-estimate-v2-ortho]");
  const objectSnapInput = document.querySelector("[data-estimate-v2-object-snap]");
  const snapGridInput = document.querySelector("[data-estimate-v2-snap-grid]");
  const snapGridSizeInput = document.querySelector("[data-estimate-v2-snap-size]");
  const labelToggle = document.querySelector("[data-estimate-v2-label-toggle]");
  const layerToggles = [...document.querySelectorAll("[data-estimate-v2-layer-toggle]")];
  const activeTool = estimateV2TakeoffTool(current.takeoffTool);
  const nextChbWallHeight = chbHeightInput ? chbHeightInput.value : current.chbWallHeight;
  const nextChbWastePercent = chbWasteInput ? chbWasteInput.value : current.chbWastePercent;
  const nextChbBlocksPerSquareMeter = chbBlocksInput ? chbBlocksInput.value : current.chbBlocksPerSquareMeter;
  const draft = normalizeEstimateV2Draft({
    ...current,
    selectedProjectId: projectInput ? projectInput.value : current.selectedProjectId,
    planType: planTypeInput ? planTypeInput.value : current.planType,
    drawingScale: scaleInput ? scaleInput.value : current.drawingScale,
    structuralElevation: elevationInput ? elevationInput.value : current.structuralElevation,
    chbWallLength: chbLengthInput ? chbLengthInput.value : current.chbWallLength,
    chbWallHeight: nextChbWallHeight,
    chbWastePercent: nextChbWastePercent,
    chbBlocksPerSquareMeter: nextChbBlocksPerSquareMeter,
    chbSize: chbSizeInput ? chbSizeInput.value : current.chbSize,
    concreteTypeMark: concreteMarkInput && activeTool.key === "column-concrete" ? concreteMarkInput.value : current.concreteTypeMark,
    footingTypeMark: concreteMarkInput && activeTool.key === "footing-concrete" ? concreteMarkInput.value : current.footingTypeMark,
    beamConcreteTypeMark: concreteMarkInput && activeTool.key === "beam-concrete" ? concreteMarkInput.value : current.beamConcreteTypeMark,
    columnWidth: columnWidthInput ? columnWidthInput.value : current.columnWidth,
    columnDepth: columnDepthInput ? columnDepthInput.value : current.columnDepth,
    columnHeight: columnHeightInput ? columnHeightInput.value : current.columnHeight,
    footingLength: footingLengthInput ? footingLengthInput.value : current.footingLength,
    footingWidth: footingWidthInput ? footingWidthInput.value : current.footingWidth,
    footingThickness: footingThicknessInput ? footingThicknessInput.value : current.footingThickness,
    pedestalWidth: pedestalWidthInput ? pedestalWidthInput.value : current.pedestalWidth,
    pedestalDepth: pedestalDepthInput ? pedestalDepthInput.value : current.pedestalDepth,
    pedestalHeight: pedestalHeightInput ? pedestalHeightInput.value : current.pedestalHeight,
    concreteWastePercent: concreteWasteInput ? concreteWasteInput.value : current.concreteWastePercent,
    concreteMixRatio: concreteRatioInput ? concreteRatioInput.value : current.concreteMixRatio,
    cementPrice: cementPriceInput ? cementPriceInput.value : current.cementPrice,
    sandPrice: sandPriceInput ? sandPriceInput.value : current.sandPrice,
    gravelPrice: gravelPriceInput ? gravelPriceInput.value : current.gravelPrice,
    floorSlabThickness: floorSlabThicknessInput ? floorSlabThicknessInput.value : current.floorSlabThickness,
    tileLength: tileLengthInput ? tileLengthInput.value : current.tileLength,
    tileWidth: tileWidthInput ? tileWidthInput.value : current.tileWidth,
    tileWastePercent: tileWasteInput ? tileWasteInput.value : current.tileWastePercent,
    tilePrice: tilePriceInput ? tilePriceInput.value : current.tilePrice,
    rebarDiameter: rebarDiameterInput ? rebarDiameterInput.value : current.rebarDiameter,
    rebarLength: rebarLengthInput ? rebarLengthInput.value : current.rebarLength,
    longitudinalBarsPerColumn: longitudinalBarsInput ? longitudinalBarsInput.value : current.longitudinalBarsPerColumn,
    tieSpacing: tieSpacingInput ? tieSpacingInput.value : current.tieSpacing,
    lapAllowancePerBar: lapAllowanceInput ? lapAllowanceInput.value : current.lapAllowancePerBar,
    steelSlabType: steelSlabLevelInput ? steelSlabLevelInput.value : current.steelSlabType,
    steelSlabLevel: steelSlabLevelInput ? steelSlabLevelInput.value : current.steelSlabLevel,
    steelSlabRebarSpacing: steelSlabSpacingInput ? steelSlabSpacingInput.value : current.steelSlabRebarSpacing,
    steelSlabThickness: steelSlabThicknessInput ? steelSlabThicknessInput.value : current.steelSlabThickness,
    steelSlabCover: steelSlabCoverInput ? steelSlabCoverInput.value : current.steelSlabCover,
    steelSlabWastePercent: steelSlabWasteInput ? steelSlabWasteInput.value : current.steelSlabWastePercent,
    beamWidth: beamWidthInput ? beamWidthInput.value : current.beamWidth,
    beamDepth: beamDepthInput ? beamDepthInput.value : current.beamDepth,
    beamMainBars: beamMainBarsInput ? beamMainBarsInput.value : current.beamMainBars,
    beamStirrupSpacing: beamStirrupSpacingInput ? beamStirrupSpacingInput.value : current.beamStirrupSpacing,
    beamCrankBars: beamCrankBarsInput ? beamCrankBarsInput.value : current.beamCrankBars,
    beamCrankAllowancePerBar: beamCrankAllowanceInput ? beamCrankAllowanceInput.value : current.beamCrankAllowancePerBar,
    steelWallHeight: steelWallHeightInput ? steelWallHeightInput.value : current.steelWallHeight,
    steelWallVerticalMode: steelWallModeInput ? steelWallModeInput.value : current.steelWallVerticalMode,
    steelWallVerticalSpacing: steelWallVerticalSpacingInput ? steelWallVerticalSpacingInput.value : current.steelWallVerticalSpacing,
    steelWallHorizontalSpacing: steelWallHorizontalSpacingInput ? steelWallHorizontalSpacingInput.value : current.steelWallHorizontalSpacing,
    steelWallDowelLength: steelWallDowelLengthInput ? steelWallDowelLengthInput.value : current.steelWallDowelLength,
    orthoModeEnabled: orthoModeInput ? orthoModeInput.checked : current.orthoModeEnabled,
    objectSnapEnabled: objectSnapInput ? objectSnapInput.checked : current.objectSnapEnabled,
    snapGridEnabled: snapGridInput ? snapGridInput.checked : current.snapGridEnabled,
    snapGridSize: snapGridSizeInput ? snapGridSizeInput.value : current.snapGridSize,
    showTakeoffLabels: labelToggle ? labelToggle.checked : current.showTakeoffLabels,
    visibleTakeoffLayers: layerToggles.length
      ? layerToggles.reduce((layers, input) => ({ ...layers, [input.value]: input.checked }), {})
      : current.visibleTakeoffLayers,
    takeoffItemName: currentNameInput ? currentNameInput.value : current.takeoffItemName,
    takeoffCostPerUnit: currentCostInput ? currentCostInput.value : current.takeoffCostPerUnit,
    calibrationLength: calibrationLengthInput ? calibrationLengthInput.value : current.calibrationLength,
    takeoffRows: collectEstimateV2TakeoffRowsFromDom(current.takeoffRows, {
      chbWallHeight: nextChbWallHeight,
      chbWastePercent: nextChbWastePercent,
      chbBlocksPerSquareMeter: nextChbBlocksPerSquareMeter
    }),
    materials: [...document.querySelectorAll("[data-estimate-v2-row]")].map(readEstimateV2RowFromDom)
  });
  draft.takeoffCostPerUnit = estimateV2ComputedTakeoffCostPerUnit(draft, estimateV2TakeoffTool(draft.takeoffTool));
  return draft;
}

function collectEstimateV2TakeoffRowsFromDom(fallbackRows = [], activeSettings = {}) {
  const rowNodes = [...document.querySelectorAll("[data-estimate-v2-takeoff-row]")];
  if (!rowNodes.length) return fallbackRows;
  const updatedRows = rowNodes.map((rowNode) => {
    const previous = fallbackRows.find((row) => row.id === rowNode.dataset.estimateV2TakeoffRow) || {};
    const tool = estimateV2TakeoffTool(previous.tool);
    let quantity = getRowInputNumber(rowNode, "quantity");
    const takeoffDetails = {};
    if (tool.type === "chb") {
      const wallLength = Math.max(0, Number(previous.wallLength) || 0);
      const chbWallHeight = Math.max(0, Number(activeSettings.chbWallHeight) || 0);
      const chbBlocksPerSquareMeter = Math.max(0, Number(activeSettings.chbBlocksPerSquareMeter) || CHB_TAKEOFF.blocksPerSquareMeter);
      const chbWastePercent = Math.max(0, Number(activeSettings.chbWastePercent) || 0);
      const wallArea = wallLength * chbWallHeight;
      quantity = estimateV2ChbPieces(wallArea, chbBlocksPerSquareMeter, chbWastePercent);
      Object.assign(takeoffDetails, {
        wallLength,
        wallArea,
        chbWallHeight,
        chbBlocksPerSquareMeter,
        chbWastePercent
      });
    }
    if (tool.key === "floor-slab") {
      const floorSlabThickness = Math.max(0, Number(previous.floorSlabThickness) || FLOOR_SLAB_THICKNESS_OPTIONS[0]);
      const concreteWastePercent = Math.max(0, Number(previous.concreteWastePercent) || 0);
      const concreteVolumeBase = quantity * floorSlabThickness;
      Object.assign(takeoffDetails, {
        concreteVolumeBase,
        concreteVolume: concreteVolumeBase * (1 + concreteWastePercent / 100)
      });
    }
    if (tool.key === "tile-area") {
      Object.assign(takeoffDetails, estimateV2TileTakeoffDetails(quantity, previous));
    }
    if (tool.key === "beam-concrete") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const previousBeamLength = previous.beamLength || (previous.metersPerPixel ? estimateV2PolylinePixels(previousPoints) * previous.metersPerPixel : 0);
      const concreteBeam = estimateV2ConcreteBeamTakeoff(previous, previousBeamLength, { silent: true });
      if (concreteBeam) {
        quantity = concreteBeam.concreteVolume;
        Object.assign(takeoffDetails, concreteBeam);
      }
    }
    if (tool.key === "steel-column") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const steelColumn = estimateV2SteelColumnTakeoff(previous, previous.takeoffCount || previousPoints.length || 0, { silent: true });
      if (steelColumn) {
        quantity = steelColumn.totalStockBars;
        Object.assign(takeoffDetails, steelColumn);
      }
    }
    if (tool.key === "steel-footing") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const steelFooting = estimateV2SteelFootingTakeoff(previous, previous.takeoffCount || previousPoints.length || 0, { silent: true });
      if (steelFooting) {
        quantity = steelFooting.totalStockBars;
        Object.assign(takeoffDetails, steelFooting);
      }
    }
    if (tool.key === "steel-slab") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const steelSlab = estimateV2SteelSlabTakeoff(previous, previousPoints, previous.slabArea || previous.quantity, { silent: true });
      if (steelSlab) {
        quantity = steelSlab.totalStockBars;
        Object.assign(takeoffDetails, steelSlab);
      }
    }
    if (tool.key === "steel-beam") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const previousBeamLength = previous.beamLength || (previous.metersPerPixel ? estimateV2PolylinePixels(previousPoints) * previous.metersPerPixel : 0);
      const steelBeam = estimateV2SteelBeamTakeoff(previous, previousBeamLength, { silent: true });
      if (steelBeam) {
        quantity = steelBeam.totalStockBars;
        Object.assign(takeoffDetails, steelBeam);
      }
    }
    if (tool.key === "steel-wall") {
      const previousPoints = Array.isArray(previous.points) ? previous.points : [];
      const previousWallLength = previous.wallLength || (previous.metersPerPixel ? estimateV2PolylinePixels(previousPoints) * previous.metersPerPixel : 0);
      const steelWall = estimateV2SteelWallTakeoff(previous, previousWallLength, { silent: true });
      if (steelWall) {
        quantity = steelWall.totalStockBars;
        Object.assign(takeoffDetails, steelWall);
      }
    }
    if (tool.type === "concrete-count") {
      Object.assign(takeoffDetails, {
        concreteVolume: quantity
      });
    }
    const computedRow = normalizeEstimateV2TakeoffRow({
      ...previous,
      ...takeoffDetails,
      quantity
    });
    const nextCostPerUnit = estimateV2RowHasComputedMaterialCost(computedRow)
      ? estimateV2ComputedRowCostPerUnit(computedRow)
      : getRowInputNumber(rowNode, "costPerUnit");
    return normalizeEstimateV2TakeoffRow({
      ...previous,
      ...takeoffDetails,
      id: rowNode.dataset.estimateV2TakeoffRow || cryptoId(),
      description: getRowInputValue(rowNode, "description"),
      quantity,
      concreteVolume: takeoffDetails.concreteVolume ?? previous.concreteVolume,
      unit: getRowInputValue(rowNode, "unit"),
      costPerUnit: nextCostPerUnit
    });
  });
  const updatedIds = new Set(updatedRows.map((row) => row.id));
  return [
    ...fallbackRows.filter((row) => !updatedIds.has(row.id)),
    ...updatedRows
  ];
}

function readEstimateV2RowFromDom(rowNode) {
  return normalizeEstimateV2Material({
    id: rowNode.dataset.estimateV2Row || cryptoId(),
    description: getRowInputValue(rowNode, "description"),
    category: getRowInputValue(rowNode, "category"),
    quantity: getRowInputNumber(rowNode, "quantity"),
    unit: getRowInputValue(rowNode, "unit"),
    notes: getRowInputValue(rowNode, "notes"),
    confidence: getRowInputValue(rowNode, "confidence"),
    source: "Edited",
    matchedTerms: []
  });
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

function estimateSelectedProjectFromDom() {
  const select = document.querySelector('[data-action="select-estimate-project"]');
  return select ? String(select.value || "").trim() : getEstimateDraft().selectedProjectId || "";
}

function priceStoreNameFromDom() {
  const input = document.querySelector("[data-price-store-name]");
  if (input) return String(input.value || "").trim();
  if (state.activePriceStore === NEW_PRICE_STORE) return "";
  return state.activePriceStore || selectedPriceStore(materialStoreOptions());
}

function openProcurementRequestModal(requestId = "") {
  const request = getProcurementState().requests.find((item) => item.id === requestId) || {};
  openModal(`
    <div class="modal">
      <div class="modal-head"><h3>${request.id ? "Edit Purchase Request" : "New Purchase Request"}</h3><button class="ghost-btn" data-action="close-modal">Close</button></div>
      <div class="modal-body">
        <form id="procurement-request-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeAttribute(request.id || "")}">
          <div class="field full"><label>Project</label><select name="projectId">${projectSelectOptions(request.projectId)}</select></div>
          <div class="field full"><label>Material / Item</label><input name="item" value="${escapeAttribute(request.item || "")}" required></div>
          <div class="field"><label>Quantity</label><input name="quantity" type="number" min="0" step="0.01" value="${numberInputValue(request.quantity)}" required></div>
          <div class="field"><label>Unit</label><input name="unit" value="${escapeAttribute(request.unit || "")}" placeholder="pcs, bags, cu.m" required></div>
          <div class="field"><label>Estimated Unit Cost</label><input name="estimatedUnitCost" type="number" min="0" step="0.01" value="${numberInputValue(request.estimatedUnitCost)}"></div>
          <div class="field"><label>Needed By</label><input name="neededBy" type="date" value="${escapeAttribute(request.neededBy || "")}"></div>
          <div class="field"><label>Priority</label><select name="priority">${["Low", "Medium", "High"].map((item) => `<option ${request.priority === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
          <div class="field"><label>Status</label><select name="status">${PROCUREMENT_REQUEST_STATUSES.map((item) => `<option ${request.status === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
          <div class="field full"><label>Notes</label><textarea name="notes">${escapeHtml(request.notes || "")}</textarea></div>
        </form>
      </div>
      <div class="modal-foot"><button class="ghost-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-procurement-request">Save Request</button></div>
    </div>
  `);
}

function saveProcurementRequest() {
  const form = document.getElementById("procurement-request-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const procurement = getProcurementState();
  const id = String(formData.get("id") || "") || cryptoId();
  const existing = procurement.requests.find((item) => item.id === id) || {};
  const request = {
    ...existing,
    id,
    projectId: String(formData.get("projectId") || ""),
    item: String(formData.get("item") || "").trim(),
    quantity: Math.max(0, Number(formData.get("quantity")) || 0),
    unit: String(formData.get("unit") || "").trim(),
    estimatedUnitCost: Math.max(0, Number(formData.get("estimatedUnitCost")) || 0),
    neededBy: String(formData.get("neededBy") || ""),
    priority: String(formData.get("priority") || "Medium"),
    status: String(formData.get("status") || "Pending"),
    notes: String(formData.get("notes") || "").trim(),
    ...enteredByFields(existing)
  };
  procurement.requests = procurement.requests.some((item) => item.id === id) ? procurement.requests.map((item) => item.id === id ? request : item) : [...procurement.requests, request];
  saveProcurementState(procurement);
  closeModal();
  render();
  toast("Purchase request saved.");
}

function openPurchaseOrderModal(orderId = "") {
  const procurement = getProcurementState();
  const order = procurement.orders.find((item) => item.id === orderId) || {};
  openModal(`
    <div class="modal">
      <div class="modal-head"><h3>${order.id ? "Edit Purchase Order" : "New Purchase Order"}</h3><button class="ghost-btn" data-action="close-modal">Close</button></div>
      <div class="modal-body">
        <form id="purchase-order-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeAttribute(order.id || "")}">
          <div class="field"><label>PO Number</label><input name="poNumber" value="${escapeAttribute(order.poNumber || nextPurchaseOrderNumber(procurement))}" required></div>
          <div class="field"><label>Project</label><select name="projectId">${projectSelectOptions(order.projectId)}</select></div>
          <div class="field full"><label>Supplier</label><select name="supplierId"><option value="">No supplier selected</option>${procurement.suppliers.map((supplier) => `<option value="${supplier.id}" ${order.supplierId === supplier.id ? "selected" : ""}>${escapeHtml(supplier.name)}</option>`).join("")}</select></div>
          <div class="field full"><label>Material / Item</label><input name="item" value="${escapeAttribute(order.item || "")}" required></div>
          <div class="field"><label>Quantity</label><input name="quantity" type="number" min="0" step="0.01" value="${numberInputValue(order.quantity)}" required></div>
          <div class="field"><label>Unit</label><input name="unit" value="${escapeAttribute(order.unit || "")}" required></div>
          <div class="field"><label>Unit Cost</label><input name="unitCost" type="number" min="0" step="0.01" value="${numberInputValue(order.unitCost)}" required></div>
          <div class="field"><label>Expected Delivery</label><input name="expectedDate" type="date" value="${escapeAttribute(order.expectedDate || "")}"></div>
          <div class="field"><label>Status</label><select name="status">${PROCUREMENT_ORDER_STATUSES.map((item) => `<option ${order.status === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
          <div class="field full"><label>Notes</label><textarea name="notes">${escapeHtml(order.notes || "")}</textarea></div>
        </form>
      </div>
      <div class="modal-foot"><button class="ghost-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-purchase-order">Save Purchase Order</button></div>
    </div>
  `);
}

function savePurchaseOrder() {
  const form = document.getElementById("purchase-order-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const procurement = getProcurementState();
  const id = String(formData.get("id") || "") || cryptoId();
  const existing = procurement.orders.find((item) => item.id === id) || {};
  const order = {
    ...existing,
    id,
    poNumber: String(formData.get("poNumber") || "").trim(),
    projectId: String(formData.get("projectId") || ""),
    supplierId: String(formData.get("supplierId") || ""),
    item: String(formData.get("item") || "").trim(),
    quantity: Math.max(0, Number(formData.get("quantity")) || 0),
    unit: String(formData.get("unit") || "").trim(),
    unitCost: Math.max(0, Number(formData.get("unitCost")) || 0),
    expectedDate: String(formData.get("expectedDate") || ""),
    status: String(formData.get("status") || "Draft"),
    notes: String(formData.get("notes") || "").trim(),
    ...enteredByFields(existing)
  };
  procurement.orders = procurement.orders.some((item) => item.id === id) ? procurement.orders.map((item) => item.id === id ? order : item) : [...procurement.orders, order];
  saveProcurementState(procurement);
  closeModal();
  render();
  toast("Purchase order saved.");
}

function nextPurchaseOrderNumber(procurement) {
  return `PO-${new Date().getFullYear()}-${String(procurement.orders.length + 1).padStart(3, "0")}`;
}

function openSupplierModal(supplierId = "") {
  const supplier = getProcurementState().suppliers.find((item) => item.id === supplierId) || {};
  openModal(`
    <div class="modal">
      <div class="modal-head"><h3>${supplier.id ? "Edit Supplier" : "Add Supplier"}</h3><button class="ghost-btn" data-action="close-modal">Close</button></div>
      <div class="modal-body">
        <form id="supplier-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeAttribute(supplier.id || "")}">
          <div class="field full"><label>Store / Supplier Name</label><input name="name" value="${escapeAttribute(supplier.name || "")}" required></div>
          <div class="field"><label>Contact Person</label><input name="contactPerson" value="${escapeAttribute(supplier.contactPerson || "")}"></div>
          <div class="field"><label>Phone</label><input name="phone" value="${escapeAttribute(supplier.phone || "")}"></div>
          <div class="field full"><label>Email</label><input name="email" type="email" value="${escapeAttribute(supplier.email || "")}"></div>
          <div class="field full"><label>Address</label><textarea name="address">${escapeHtml(supplier.address || "")}</textarea></div>
        </form>
      </div>
      <div class="modal-foot"><button class="ghost-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-supplier">Save Supplier</button></div>
    </div>
  `);
}

function saveSupplier() {
  const form = document.getElementById("supplier-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const procurement = getProcurementState();
  const id = String(formData.get("id") || "") || cryptoId();
  const existing = procurement.suppliers.find((item) => item.id === id) || {};
  const supplier = {
    ...existing,
    id,
    name: String(formData.get("name") || "").trim(),
    contactPerson: String(formData.get("contactPerson") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    address: String(formData.get("address") || "").trim(),
    ...enteredByFields(existing)
  };
  procurement.suppliers = procurement.suppliers.some((item) => item.id === id) ? procurement.suppliers.map((item) => item.id === id ? supplier : item) : [...procurement.suppliers, supplier];
  saveProcurementState(procurement);
  closeModal();
  render();
  toast("Supplier saved.");
}

function updateProcurementStatus(collection, id, status) {
  const procurement = getProcurementState();
  procurement[collection] = procurement[collection].map((item) => item.id === id ? { ...item, status, ...enteredByFields(item) } : item);
  saveProcurementState(procurement);
  render();
}

function deleteProcurementRecord(collection, id) {
  const procurement = getProcurementState();
  procurement[collection] = procurement[collection].filter((item) => item.id !== id);
  saveProcurementState(procurement);
  render();
  toast("Procurement record deleted.");
}

function openAccountingBillingModal(billingId = "") {
  const billing = getAccountingState().billings.find((item) => item.id === billingId) || {};
  openModal(`
    <div class="modal">
      <div class="modal-head"><h3>${billing.id ? "Edit Billing" : "Add Billing"}</h3><button class="ghost-btn" data-action="close-modal">Close</button></div>
      <div class="modal-body">
        <form id="accounting-billing-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeAttribute(billing.id || "")}">
          <div class="field"><label>Billing Number</label><input name="billingNumber" value="${escapeAttribute(billing.billingNumber || "")}" placeholder="Progress Billing No. 1" required></div>
          <div class="field"><label>Project</label><select name="projectId">${projectSelectOptions(billing.projectId)}</select></div>
          <div class="field full"><label>Description</label><input name="description" value="${escapeAttribute(billing.description || "")}" required></div>
          <div class="field"><label>Amount</label><input name="amount" type="number" min="0" step="0.01" value="${numberInputValue(billing.amount)}" required></div>
          <div class="field"><label>Due Date</label><input name="dueDate" type="date" value="${escapeAttribute(billing.dueDate || "")}"></div>
          <div class="field"><label>Status</label><select name="status">${ACCOUNTING_BILLING_STATUSES.map((item) => `<option ${billing.status === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
          <div class="field full"><label>Notes</label><textarea name="notes">${escapeHtml(billing.notes || "")}</textarea></div>
        </form>
      </div>
      <div class="modal-foot"><button class="ghost-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-accounting-billing">Save Billing</button></div>
    </div>
  `);
}

function saveAccountingBilling() {
  const form = document.getElementById("accounting-billing-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const accounting = getAccountingState();
  const id = String(formData.get("id") || "") || cryptoId();
  const existing = accounting.billings.find((item) => item.id === id) || {};
  const billing = {
    ...existing,
    id,
    billingNumber: String(formData.get("billingNumber") || "").trim(),
    projectId: String(formData.get("projectId") || ""),
    description: String(formData.get("description") || "").trim(),
    amount: Math.max(0, Number(formData.get("amount")) || 0),
    dueDate: String(formData.get("dueDate") || ""),
    status: String(formData.get("status") || "Draft"),
    notes: String(formData.get("notes") || "").trim(),
    ...enteredByFields(existing)
  };
  accounting.billings = accounting.billings.some((item) => item.id === id) ? accounting.billings.map((item) => item.id === id ? billing : item) : [...accounting.billings, billing];
  saveAccountingState(accounting);
  closeModal();
  render();
  toast("Billing saved.");
}

function openAccountingExpenseModal(expenseId = "") {
  const expense = getAccountingState().expenses.find((item) => item.id === expenseId) || {};
  openModal(`
    <div class="modal">
      <div class="modal-head"><h3>${expense.id ? "Edit Expense" : "Add Expense"}</h3><button class="ghost-btn" data-action="close-modal">Close</button></div>
      <div class="modal-body">
        <form id="accounting-expense-form" class="form-grid">
          <input type="hidden" name="id" value="${escapeAttribute(expense.id || "")}">
          <div class="field"><label>Project</label><select name="projectId">${projectSelectOptions(expense.projectId)}</select></div>
          <div class="field"><label>Date</label><input name="date" type="date" value="${escapeAttribute(expense.date || new Date().toISOString().slice(0, 10))}"></div>
          <div class="field"><label>Category</label><input name="category" value="${escapeAttribute(expense.category || "")}" placeholder="Materials, Labor, Equipment" required></div>
          <div class="field"><label>Payee</label><input name="payee" value="${escapeAttribute(expense.payee || "")}"></div>
          <div class="field full"><label>Description</label><input name="description" value="${escapeAttribute(expense.description || "")}" required></div>
          <div class="field"><label>Amount</label><input name="amount" type="number" min="0" step="0.01" value="${numberInputValue(expense.amount)}" required></div>
          <div class="field"><label>Payment Status</label><select name="status">${ACCOUNTING_EXPENSE_STATUSES.map((item) => `<option ${expense.status === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
          <div class="field full"><label>Notes</label><textarea name="notes">${escapeHtml(expense.notes || "")}</textarea></div>
        </form>
      </div>
      <div class="modal-foot"><button class="ghost-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-accounting-expense">Save Expense</button></div>
    </div>
  `);
}

function saveAccountingExpense() {
  const form = document.getElementById("accounting-expense-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const accounting = getAccountingState();
  const id = String(formData.get("id") || "") || cryptoId();
  const existing = accounting.expenses.find((item) => item.id === id) || {};
  const expense = {
    ...existing,
    id,
    projectId: String(formData.get("projectId") || ""),
    date: String(formData.get("date") || ""),
    category: String(formData.get("category") || "").trim(),
    payee: String(formData.get("payee") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    amount: Math.max(0, Number(formData.get("amount")) || 0),
    status: String(formData.get("status") || "Unpaid"),
    notes: String(formData.get("notes") || "").trim(),
    ...enteredByFields(existing)
  };
  accounting.expenses = accounting.expenses.some((item) => item.id === id) ? accounting.expenses.map((item) => item.id === id ? expense : item) : [...accounting.expenses, expense];
  saveAccountingState(accounting);
  closeModal();
  render();
  toast("Expense saved.");
}

function updateAccountingStatus(collection, id, status) {
  const accounting = getAccountingState();
  accounting[collection] = accounting[collection].map((item) => item.id === id ? { ...item, status, ...enteredByFields(item) } : item);
  saveAccountingState(accounting);
  render();
}

function deleteAccountingRecord(collection, id) {
  const accounting = getAccountingState();
  accounting[collection] = accounting[collection].filter((item) => item.id !== id);
  saveAccountingState(accounting);
  render();
  toast("Accounting record deleted.");
}

function openAccountModal() {
  const account = getSessionAccount();
  const subscription = getSubscription();
  const isOwner = account.role === "owner";
  const drive = googleDriveStatus(account);
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
            <p class="hint">${escapeHtml(account.email)} | ${drive.connected ? `Google Drive connected to ${escapeHtml(drive.email || account.email)}` : "Google Drive not connected"}</p>
          </div>
          ${renderGoogleDrivePanel()}
          <div class="mini-card">
            <span class="eyebrow">Plan</span>
            <h3>${accountPlanLabel(account, subscription)}</h3>
            <p class="hint">${planHint(account, subscription)}</p>
            ${hasPremiumPlan(account) ? `<button class="secondary-btn" data-action="cancel-subscription">Cancel Subscription</button>` : ""}
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
          ${ASSIGNABLE_ACCESS_KEYS.map((item) => `
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
          ${ASSIGNABLE_ACCESS_KEYS.map((item) => `
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

async function createInvite() {
  const form = document.getElementById("invite-form");
  if (!form || !form.reportValidity()) return;
  const formData = new FormData(form);
  const account = getSessionAccount();
  const access = {};
  ASSIGNABLE_ACCESS_KEYS.forEach((item) => {
    access[item.key] = formData.get(item.key) === "on";
  });
  access.administrative = false;
  const invite = {
    token: cryptoId(),
    email: String(formData.get("email")).trim().toLowerCase(),
    access,
    createdBy: account.id,
    createdAt: new Date().toISOString(),
    expiresAt: addDays(new Date(), 7).toISOString(),
    acceptedBy: null
  };
  if (sessionToken()) {
    try {
      const response = await apiRequest("/invites/create", { email: invite.email, access });
      saveInvites([response.invite, ...getInvites().filter((item) => item.token !== response.invite.token)]);
      render();
      toast("Invitation link created.");
      return;
    } catch (error) {
      toast(error.message || "Invitation could not be created.");
      return;
    }
  }
  const invites = getInvites();
  invites.push(invite);
  saveInvites(invites);
  openAccountModal();
  toast("Invitation link created.");
}

async function updateAccess(accountId) {
  const accounts = getAccounts();
  const account = accounts.find((item) => item.id === accountId);
  if (!account || account.role === "owner") return;
  const access = {};
  ASSIGNABLE_ACCESS_KEYS.forEach((item) => {
    const checkbox = document.querySelector(`input[data-account="${accountId}"][data-access="${item.key}"]`);
    access[item.key] = Boolean(checkbox && checkbox.checked);
  });
  access.administrative = false;
  if (sessionToken()) {
    try {
      const response = await apiRequest("/accounts/access", { accountId, access });
      savePublicAccount(response.account);
      await refreshOwnerAccounts(false);
      toast("Access updated.");
      return;
    } catch (error) {
      toast(error.message || "Access could not be updated.");
      return;
    }
  }
  account.access = access;
  saveAccounts(accounts);
  toast("Access updated.");
  render();
  openAccountModal();
}

async function refreshOwnerAccounts(showNotice = true) {
  const account = getSessionAccount();
  if (!account || account.role !== "owner" || !sessionToken()) return;
  try {
    const response = await apiRequest("/accounts", null, { method: "GET", timeoutMs: 10000 });
    saveAccounts(Array.isArray(response.accounts) ? response.accounts : []);
    if (Array.isArray(response.invites)) saveInvites(response.invites);
    render();
    if (showNotice) toast("Accounts refreshed.");
  } catch (error) {
    if (showNotice) toast(error.message || "Accounts could not be refreshed.");
  }
}

function cancelSubscription() {
  const subscription = getSubscription();
  subscription.status = "cancelled";
  subscription.cancelledAt = new Date().toISOString();
  saveSubscription(subscription);
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

function showPremiumAccessNotice() {
  let notice = document.querySelector(".premium-access-notice");
  if (notice) notice.remove();

  notice = document.createElement("div");
  notice.className = "premium-access-notice";
  notice.setAttribute("role", "status");
  notice.textContent = "For Premium Access Only";
  document.body.appendChild(notice);
  window.setTimeout(() => notice.remove(), 2200);
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
  if (key === "administrative") return account.role === "owner";
  return account.role === "owner" || Boolean(account.access && account.access[key]);
}

function hasPremiumPlan(account) {
  return account && account.plan !== "free";
}

function premiumLockedViews(account) {
  return hasPremiumPlan(account) ? [] : ["estimate", "estimate-v2", "dashboard"];
}

function accountPlanLabel(account, subscription = getSubscription()) {
  if (account && account.plan === "free") return "Free";
  if (subscription.status === "trial") return "Trial";
  if (subscription.status === "cancelled") return "Cancelled";
  return "Subscribed";
}

function planHint(account, subscription = getSubscription()) {
  if (account && account.plan === "free") return "Estimate v2 and Dashboard locked";
  if (subscription.status === "trial") return `${trialDaysLeft(subscription)} day(s) left`;
  if (subscription.status === "cancelled") return "Subscription access cancelled";
  return "Full feature access";
}

function togglePasswordVisibility(toggle) {
  const form = toggle.closest("form");
  if (!form) return;
  form.querySelectorAll("[data-password-toggle-target]").forEach((input) => {
    input.type = toggle.checked ? "text" : "password";
  });
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

function isTypingTarget(target) {
  if (!target) return false;
  const tagName = String(target.tagName || "").toLowerCase();
  return target.isContentEditable || ["input", "textarea", "select"].includes(tagName);
}

function accessText(access) {
  const labels = ACCESS_KEYS.filter((item) => access && access[item.key]).map((item) => item.label);
  return labels.length ? labels.join(", ") : "No module access";
}

function getInviteByToken(token) {
  if (!token) return null;
  return getInvites().find((invite) => {
    return invite.token === token
      && !invite.acceptedBy
      && (!invite.expiresAt || new Date(invite.expiresAt) > new Date());
  }) || null;
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
      submissionId: saved.submissionId || cryptoId(),
      title: saved.title || "Untitled Estimate",
      selectedStore: saved.selectedStore || "",
      selectedProjectId: saved.selectedProjectId || "",
      rows: saved.rows.map(normalizeEstimateRow).filter(hasEstimateRowData),
      submittedToProcurementAt: saved.submittedToProcurementAt || "",
      submittedToProcurementByName: saved.submittedToProcurementByName || "",
      submittedToProcurementByEmail: saved.submittedToProcurementByEmail || "",
      submittedRequestCount: Math.max(0, Number(saved.submittedRequestCount) || 0),
      updatedAt: saved.updatedAt || new Date().toISOString()
    };
  }
  const created = defaultEstimateDraft();
  saveEstimateDraft(created);
  return created;
}

function saveEstimateDraft(draft) {
  setSyncedJson(STORAGE.estimateDraft, {
    submissionId: draft.submissionId || cryptoId(),
    title: draft.title || "Untitled Estimate",
    selectedStore: draft.selectedStore || "",
    selectedProjectId: draft.selectedProjectId || "",
    rows: Array.isArray(draft.rows) ? draft.rows.map(normalizeEstimateRow).filter(hasEstimateRowData) : [],
    submittedToProcurementAt: draft.submittedToProcurementAt || "",
    submittedToProcurementByName: draft.submittedToProcurementByName || "",
    submittedToProcurementByEmail: draft.submittedToProcurementByEmail || "",
    submittedRequestCount: Math.max(0, Number(draft.submittedRequestCount) || 0),
    updatedAt: draft.updatedAt || new Date().toISOString()
  });
}

function defaultEstimateDraft() {
  return {
    submissionId: cryptoId(),
    title: "Untitled Estimate",
    selectedStore: "",
    selectedProjectId: "",
    rows: [],
    submittedToProcurementAt: "",
    submittedToProcurementByName: "",
    submittedToProcurementByEmail: "",
    submittedRequestCount: 0,
    updatedAt: new Date().toISOString()
  };
}

function getEstimateV2Draft() {
  return normalizeEstimateV2Draft(readJson(STORAGE.estimateV2Draft, defaultEstimateV2Draft()));
}

function saveEstimateV2Draft(draft) {
  setSyncedJson(STORAGE.estimateV2Draft, normalizeEstimateV2Draft(draft));
}

function defaultEstimateV2Draft() {
  return {
    submissionId: cryptoId(),
    selectedProjectId: "",
    submittedToProcurementAt: "",
    submittedToProcurementByName: "",
    submittedToProcurementByEmail: "",
    submittedRequestCount: 0,
    planType: PLAN_TYPES[0],
    drawingScale: "1:100",
    structuralElevation: 0,
    chbWallLength: 0,
    chbWallHeight: 3,
    chbWastePercent: CHB_TAKEOFF.defaultWastePercent,
    chbBlocksPerSquareMeter: CHB_TAKEOFF.blocksPerSquareMeter,
    chbSize: CHB_SIZE_OPTIONS[1],
    concreteTypeMark: "C1",
    footingTypeMark: "F1",
    beamConcreteTypeMark: "B1",
    columnWidth: 0.3,
    columnDepth: 0.3,
    columnHeight: 3,
    footingLength: 1.5,
    footingWidth: 1.5,
    footingThickness: 0.3,
    pedestalWidth: 0,
    pedestalDepth: 0,
    pedestalHeight: 0,
    concreteWastePercent: 0,
    concreteMixRatio: DEFAULT_CONCRETE_MIX_RATIO,
    cementPrice: 0,
    sandPrice: 0,
    gravelPrice: 0,
    floorSlabThickness: FLOOR_SLAB_THICKNESS_OPTIONS[0],
    tileLength: TILE_TAKEOFF.defaultLength,
    tileWidth: TILE_TAKEOFF.defaultWidth,
    tileWastePercent: TILE_TAKEOFF.defaultWastePercent,
    tilePrice: 0,
    rebarDiameter: REBAR_DIAMETER_OPTIONS[0],
    rebarLength: REBAR_LENGTH_OPTIONS[0],
    longitudinalBarsPerColumn: STEEL_COLUMN_DEFAULTS.longitudinalBarsPerColumn,
    tieSpacing: STEEL_COLUMN_DEFAULTS.tieSpacing,
    lapAllowancePerBar: STEEL_COLUMN_DEFAULTS.lapAllowancePerBar,
    steelSlabType: STEEL_SLAB_DEFAULTS.type,
    steelSlabLevel: STEEL_SLAB_DEFAULTS.type,
    steelSlabRebarSpacing: STEEL_SLAB_DEFAULTS.rebarSpacing,
    steelSlabThickness: STEEL_SLAB_DEFAULTS.thickness,
    steelSlabCover: STEEL_SLAB_DEFAULTS.cover,
    steelSlabWastePercent: STEEL_SLAB_DEFAULTS.wastePercent,
    beamWidth: STEEL_BEAM_DEFAULTS.width,
    beamDepth: STEEL_BEAM_DEFAULTS.depth,
    beamMainBars: STEEL_BEAM_DEFAULTS.mainBars,
    beamStirrupSpacing: STEEL_BEAM_DEFAULTS.stirrupSpacing,
    beamCrankBars: STEEL_BEAM_DEFAULTS.crankBars,
    beamCrankAllowancePerBar: STEEL_BEAM_DEFAULTS.crankAllowancePerBar,
    steelWallHeight: STEEL_WALL_DEFAULTS.height,
    steelWallVerticalMode: STEEL_WALL_DEFAULTS.verticalMode,
    steelWallVerticalSpacing: STEEL_WALL_DEFAULTS.verticalSpacing,
    steelWallHorizontalSpacing: STEEL_WALL_DEFAULTS.horizontalSpacing,
    steelWallDowelLength: STEEL_WALL_DEFAULTS.dowelLength,
    planFileName: "",
    planStoragePath: "",
    planStorageFileName: "",
    planStorageSize: 0,
    planUploadedAt: "",
    planUploadedByName: "",
    planUploadedByEmail: "",
    takeoffPage: 1,
    takeoffPageCount: 0,
    takeoffPageWidth: 0,
    takeoffPageHeight: 0,
    takeoffZoom: 1,
    metersPerPixel: 0,
    calibrationLength: 0,
    calibrationPoints: [],
    takeoffTool: "calibrate",
    takeoffItemName: "Scale Reference",
    takeoffCostPerUnit: 0,
    orthoModeEnabled: false,
    objectSnapEnabled: true,
    snapGridEnabled: false,
    snapGridSize: 32,
    showTakeoffLabels: true,
    visibleTakeoffLayers: defaultEstimateV2Layers(),
    takeoffRows: [],
    fileName: "",
    extractedAt: "",
    extractionMode: "",
    pageCount: 0,
    processedPages: 0,
    regionCount: 0,
    characterCount: 0,
    lineCount: 0,
    textPreview: "",
    ocrRegions: [],
    materials: []
  };
}

function normalizeEstimateV2Draft(draft) {
  const source = draft && typeof draft === "object" ? draft : {};
  const sourceTakeoffTool = estimateV2TakeoffTool(source.takeoffTool);
  const activeTakeoffTool = sourceTakeoffTool.hidden ? ESTIMATE_V2_TAKEOFF_TOOLS[0] : sourceTakeoffTool;
  const chbWallHeight = Number(source.chbWallHeight);
  const chbWastePercent = Number(source.chbWastePercent);
  const concreteWastePercent = Number(source.concreteWastePercent);
  const floorSlabThickness = Number(source.floorSlabThickness);
  const tileWastePercent = Number(source.tileWastePercent);
  const beamCrankBars = Number(source.beamCrankBars);
  const steelSlabType = steelSlabTypeOption(source.steelSlabType || source.steelSlabLevel);
  const steelSlabThickness = Number(source.steelSlabThickness);
  const steelSlabCover = Number(source.steelSlabCover);
  const steelSlabWastePercent = Number(source.steelSlabWastePercent);
  return {
    submissionId: String(source.submissionId || cryptoId()).trim(),
    selectedProjectId: String(source.selectedProjectId || "").trim(),
    submittedToProcurementAt: String(source.submittedToProcurementAt || "").trim(),
    submittedToProcurementByName: String(source.submittedToProcurementByName || "").trim(),
    submittedToProcurementByEmail: String(source.submittedToProcurementByEmail || "").trim(),
    submittedRequestCount: Math.max(0, Number(source.submittedRequestCount) || 0),
    planType: PLAN_TYPES.includes(source.planType) ? source.planType : PLAN_TYPES[0],
    drawingScale: DRAWING_SCALES.includes(source.drawingScale) ? source.drawingScale : "1:100",
    structuralElevation: Math.max(0, Number(source.structuralElevation) || 0),
    chbWallLength: Math.max(0, Number(source.chbWallLength) || 0),
    chbWallHeight: Number.isFinite(chbWallHeight) ? Math.max(0, chbWallHeight) : 3,
    chbWastePercent: Number.isFinite(chbWastePercent) ? Math.max(0, chbWastePercent) : CHB_TAKEOFF.defaultWastePercent,
    chbBlocksPerSquareMeter: Math.max(0, Number(source.chbBlocksPerSquareMeter) || CHB_TAKEOFF.blocksPerSquareMeter),
    chbSize: CHB_SIZE_OPTIONS.includes(source.chbSize) ? source.chbSize : CHB_SIZE_OPTIONS[1],
    concreteTypeMark: String(source.concreteTypeMark || "C1").trim(),
    footingTypeMark: String(source.footingTypeMark || "F1").trim(),
    beamConcreteTypeMark: String(source.beamConcreteTypeMark || "B1").trim(),
    columnWidth: Math.max(0, Number(source.columnWidth) || 0.3),
    columnDepth: Math.max(0, Number(source.columnDepth) || 0.3),
    columnHeight: Math.max(0, Number(source.columnHeight) || 3),
    footingLength: Math.max(0, Number(source.footingLength) || 1.5),
    footingWidth: Math.max(0, Number(source.footingWidth) || 1.5),
    footingThickness: Math.max(0, Number(source.footingThickness) || 0.3),
    pedestalWidth: Math.max(0, Number(source.pedestalWidth) || 0),
    pedestalDepth: Math.max(0, Number(source.pedestalDepth) || 0),
    pedestalHeight: Math.max(0, Number(source.pedestalHeight) || 0),
    concreteWastePercent: Number.isFinite(concreteWastePercent) ? Math.max(0, concreteWastePercent) : 0,
    concreteMixRatio: concreteMixOption(source.concreteMixRatio).key,
    cementPrice: Math.max(0, Number(source.cementPrice) || 0),
    sandPrice: Math.max(0, Number(source.sandPrice) || 0),
    gravelPrice: Math.max(0, Number(source.gravelPrice) || 0),
    floorSlabThickness: FLOOR_SLAB_THICKNESS_OPTIONS.includes(floorSlabThickness) ? floorSlabThickness : FLOOR_SLAB_THICKNESS_OPTIONS[0],
    tileLength: Math.max(0, Number(source.tileLength) || TILE_TAKEOFF.defaultLength),
    tileWidth: Math.max(0, Number(source.tileWidth) || TILE_TAKEOFF.defaultWidth),
    tileWastePercent: Number.isFinite(tileWastePercent) ? Math.max(0, tileWastePercent) : TILE_TAKEOFF.defaultWastePercent,
    tilePrice: Math.max(0, Number(source.tilePrice) || 0),
    rebarDiameter: REBAR_DIAMETER_OPTIONS.includes(Number(source.rebarDiameter)) ? Number(source.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0],
    rebarLength: REBAR_LENGTH_OPTIONS.includes(Number(source.rebarLength)) ? Number(source.rebarLength) : REBAR_LENGTH_OPTIONS[0],
    longitudinalBarsPerColumn: Math.max(1, Math.ceil(Number(source.longitudinalBarsPerColumn) || STEEL_COLUMN_DEFAULTS.longitudinalBarsPerColumn)),
    tieSpacing: Math.max(0, Number(source.tieSpacing) || STEEL_COLUMN_DEFAULTS.tieSpacing),
    lapAllowancePerBar: Math.max(0, Number(source.lapAllowancePerBar) || STEEL_COLUMN_DEFAULTS.lapAllowancePerBar),
    steelSlabType: steelSlabType.key,
    steelSlabLevel: steelSlabType.key,
    steelSlabRebarSpacing: Math.max(0, Number(source.steelSlabRebarSpacing) || STEEL_SLAB_DEFAULTS.rebarSpacing),
    steelSlabThickness: Number.isFinite(steelSlabThickness) ? Math.max(0, steelSlabThickness) : STEEL_SLAB_DEFAULTS.thickness,
    steelSlabCover: Number.isFinite(steelSlabCover) ? Math.max(0, steelSlabCover) : STEEL_SLAB_DEFAULTS.cover,
    steelSlabWastePercent: Number.isFinite(steelSlabWastePercent) ? Math.max(0, steelSlabWastePercent) : STEEL_SLAB_DEFAULTS.wastePercent,
    beamWidth: Math.max(0, Number(source.beamWidth) || STEEL_BEAM_DEFAULTS.width),
    beamDepth: Math.max(0, Number(source.beamDepth) || STEEL_BEAM_DEFAULTS.depth),
    beamMainBars: Math.max(1, Math.ceil(Number(source.beamMainBars) || STEEL_BEAM_DEFAULTS.mainBars)),
    beamStirrupSpacing: Math.max(0, Number(source.beamStirrupSpacing) || STEEL_BEAM_DEFAULTS.stirrupSpacing),
    beamCrankBars: Number.isFinite(beamCrankBars) ? Math.max(0, Math.ceil(beamCrankBars)) : STEEL_BEAM_DEFAULTS.crankBars,
    beamCrankAllowancePerBar: Math.max(0, Number(source.beamCrankAllowancePerBar) || STEEL_BEAM_DEFAULTS.crankAllowancePerBar),
    steelWallHeight: Math.max(0, Number(source.steelWallHeight) || Number(source.chbWallHeight) || STEEL_WALL_DEFAULTS.height),
    steelWallVerticalMode: steelWallVerticalModeOption(source.steelWallVerticalMode).key,
    steelWallVerticalSpacing: Math.max(0, Number(source.steelWallVerticalSpacing) || STEEL_WALL_DEFAULTS.verticalSpacing),
    steelWallHorizontalSpacing: Math.max(0, Number(source.steelWallHorizontalSpacing) || STEEL_WALL_DEFAULTS.horizontalSpacing),
    steelWallDowelLength: Math.max(0, Number(source.steelWallDowelLength) || STEEL_WALL_DEFAULTS.dowelLength),
    planFileName: String(source.planFileName || source.fileName || "").trim(),
    planStoragePath: String(source.planStoragePath || "").trim(),
    planStorageFileName: String(source.planStorageFileName || source.planFileName || source.fileName || "").trim(),
    planStorageSize: Math.max(0, Number(source.planStorageSize) || 0),
    planUploadedAt: String(source.planUploadedAt || "").trim(),
    planUploadedByName: String(source.planUploadedByName || "").trim(),
    planUploadedByEmail: String(source.planUploadedByEmail || "").trim(),
    takeoffPage: Math.max(1, Number(source.takeoffPage) || 1),
    takeoffPageCount: Math.max(0, Number(source.takeoffPageCount) || 0),
    takeoffPageWidth: Math.max(0, Number(source.takeoffPageWidth) || 0),
    takeoffPageHeight: Math.max(0, Number(source.takeoffPageHeight) || 0),
    takeoffZoom: estimateV2ZoomValue(source),
    metersPerPixel: Math.max(0, Number(source.metersPerPixel) || 0),
    calibrationLength: Math.max(0, Number(source.calibrationLength) || 0),
    calibrationPoints: Array.isArray(source.calibrationPoints) ? source.calibrationPoints.map(normalizePoint).filter(Boolean).slice(0, 2) : [],
    takeoffTool: activeTakeoffTool.key,
    takeoffItemName: String(source.takeoffItemName || activeTakeoffTool.defaultName).trim(),
    takeoffCostPerUnit: Math.max(0, Number(source.takeoffCostPerUnit) || 0),
    orthoModeEnabled: Boolean(source.orthoModeEnabled),
    objectSnapEnabled: source.objectSnapEnabled !== false,
    snapGridEnabled: Boolean(source.snapGridEnabled),
    snapGridSize: Math.max(8, Math.min(200, Number(source.snapGridSize) || 32)),
    showTakeoffLabels: source.showTakeoffLabels !== false,
    visibleTakeoffLayers: normalizeEstimateV2Layers(source.visibleTakeoffLayers),
    takeoffRows: Array.isArray(source.takeoffRows) ? source.takeoffRows.map(normalizeEstimateV2TakeoffRow).filter((row) => row.description) : [],
    fileName: String(source.fileName || "").trim(),
    extractedAt: String(source.extractedAt || "").trim(),
    extractionMode: String(source.extractionMode || "").trim(),
    pageCount: Math.max(0, Number(source.pageCount) || 0),
    processedPages: Math.max(0, Number(source.processedPages) || 0),
    regionCount: Math.max(0, Number(source.regionCount) || 0),
    characterCount: Math.max(0, Number(source.characterCount) || 0),
    lineCount: Math.max(0, Number(source.lineCount) || 0),
    textPreview: String(source.textPreview || "").slice(0, 8000),
    ocrRegions: Array.isArray(source.ocrRegions) ? source.ocrRegions.map(normalizeOcrRegion).filter((region) => region.text).slice(0, 24) : [],
    materials: Array.isArray(source.materials) ? source.materials.map(normalizeEstimateV2Material).filter((item) => item.description) : []
  };
}

function normalizeOcrRegion(region) {
  return {
    page: Math.max(1, Number(region && region.page) || 1),
    region: String(region && region.region || "Region").trim(),
    text: String(region && region.text || "").trim().slice(0, 3000),
    confidence: Math.max(0, Math.min(100, Number(region && region.confidence) || 0)),
    lineCount: Math.max(0, Number(region && region.lineCount) || 0)
  };
}

function normalizeEstimateV2Material(material) {
  return {
    id: material.id || cryptoId(),
    description: String(material.description || "").trim(),
    category: String(material.category || "General").trim(),
    mentions: Math.max(0, Number(material.mentions) || 0),
    unit: String(material.unit || "").trim(),
    quantity: Number.isFinite(Number(material.quantity)) ? Math.max(0, Number(material.quantity)) : 0,
    confidence: String(material.confidence || "").trim(),
    source: String(material.source || "").trim(),
    notes: String(material.notes || "").trim(),
    matchedTerms: Array.isArray(material.matchedTerms) ? material.matchedTerms.map((term) => String(term || "").trim()).filter(Boolean).slice(0, 8) : [],
    sampleLines: Array.isArray(material.sampleLines) ? material.sampleLines.map((line) => String(line || "").trim()).filter(Boolean).slice(0, 3) : []
  };
}

function normalizeEstimateV2TakeoffRow(row) {
  const tool = estimateV2TakeoffTool(row && row.tool);
  const chbWallHeight = Math.max(0, Number(row && row.chbWallHeight) || 0);
  const wallLength = Math.max(0, Number(row && row.wallLength) || 0);
  const concreteVolume = Math.max(0, Number(row && row.concreteVolume) || 0);
  const rowLongitudinalStockBars = Math.max(0, Number(row && row.longitudinalStockBars) || 0);
  const rowTieStockBars = Math.max(0, Number(row && row.tieStockBars) || 0);
  const rowLapStockBars = Math.max(0, Number(row && row.lapStockBars) || 0);
  const steelTotalStockBars = Math.max(0, Number(row && row.totalStockBars) || (
    rowLongitudinalStockBars + rowTieStockBars + rowLapStockBars
  ) || 0);
  const quantity = Math.max(0, Number(row && row.quantity) || (estimateV2IsSteelworkTool(tool) ? steelTotalStockBars : 0));
  const tileLength = Math.max(0, Number(row && row.tileLength) || TILE_TAKEOFF.defaultLength);
  const tileWidth = Math.max(0, Number(row && row.tileWidth) || TILE_TAKEOFF.defaultWidth);
  const tileWastePercent = Math.max(0, Number(row && row.tileWastePercent) || 0);
  const tileArea = Math.max(0, Number(row && row.tileArea) || (tool.key === "tile-area" ? quantity : 0));
  const tilePieces = Math.max(0, Number(row && row.tilePieces) || estimateV2TilePieces(tileArea, tileLength, tileWidth, tileWastePercent));
  const stockLengthOptions = Array.isArray(row && row.stockLengthOptions)
    ? row.stockLengthOptions.map((option) => ({
      length: Math.max(0, Number(option && option.length) || 0),
      longitudinalStockBars: Math.max(0, Number(option && option.longitudinalStockBars) || 0),
      tieStockBars: Math.max(0, Number(option && option.tieStockBars) || 0),
      lapStockBars: Math.max(0, Number(option && option.lapStockBars) || 0),
      totalStockBars: Math.max(0, Number(option && option.totalStockBars) || (
        (Number(option && option.longitudinalStockBars) || 0) + (Number(option && option.tieStockBars) || 0) + (Number(option && option.lapStockBars) || 0)
      ) || 0)
    })).filter((option) => option.length)
    : [];
  const rowSteelSlabType = steelSlabTypeOption(row && (row.steelSlabType || row.steelSlabLevel));
  const rowSlabLength = Math.max(0, Number(row && row.slabLength) || 0);
  const rowSlabWidth = Math.max(0, Number(row && row.slabWidth) || 0);
  const rowSlabShortFallback = rowSlabLength && rowSlabWidth ? Math.min(rowSlabLength, rowSlabWidth) : (rowSlabLength || rowSlabWidth || 0);
  const rowSteelSlabShortSpan = Math.max(0, Number(row && row.steelSlabShortSpan) || rowSlabShortFallback);
  const rowSteelSlabLongSpan = Math.max(0, Number(row && row.steelSlabLongSpan) || Math.max(rowSlabLength, rowSlabWidth));
  const rowSteelSlabSpanRatio = Math.max(0, Number(row && row.steelSlabSpanRatio) || (rowSteelSlabShortSpan ? rowSteelSlabLongSpan / rowSteelSlabShortSpan : 0));
  const rowDetectedSlabTypeKey = rowSteelSlabSpanRatio >= 2 ? "one-way" : "two-way";
  const rowSteelSlabDetectedType = steelSlabTypeOption(row && row.steelSlabDetectedType || rowDetectedSlabTypeKey);
  const rowSteelSlabResolvedType = steelSlabTypeOption(row && row.steelSlabResolvedType || (rowSteelSlabType.key === "auto" ? rowSteelSlabDetectedType.key : rowSteelSlabType.key));
  const rowSteelSlabThickness = Number(row && row.steelSlabThickness);
  const rowSteelSlabCover = Number(row && row.steelSlabCover);
  const rowSteelSlabEffectiveDepth = Number(row && row.steelSlabEffectiveDepth);
  const rowSteelSlabCrankAllowance = Number(row && row.steelSlabCrankAllowance);
  const rowSteelSlabWastePercent = Number(row && row.steelSlabWastePercent);
  const normalizedSteelSlabThickness = Number.isFinite(rowSteelSlabThickness) ? Math.max(0, rowSteelSlabThickness) : STEEL_SLAB_DEFAULTS.thickness;
  const normalizedSteelSlabCover = Number.isFinite(rowSteelSlabCover) ? Math.max(0, rowSteelSlabCover) : STEEL_SLAB_DEFAULTS.cover;
  const normalizedSteelSlabEffectiveDepth = Number.isFinite(rowSteelSlabEffectiveDepth)
    ? Math.max(0, rowSteelSlabEffectiveDepth)
    : Math.max(0, normalizedSteelSlabThickness - normalizedSteelSlabCover);
  const normalizedSteelSlabCrankAllowance = Number.isFinite(rowSteelSlabCrankAllowance)
    ? Math.max(0, rowSteelSlabCrankAllowance)
    : Math.max(0, Number(row && row.steelSlabAllowancePerBar) || (0.42 * normalizedSteelSlabEffectiveDepth));
  return {
    id: row && row.id || cryptoId(),
    projectId: String(row && row.projectId || "").trim(),
    description: String(row && row.description || tool.defaultName).trim(),
    tool: tool.key,
    quantity,
    unit: String(row && row.unit || tool.unit).trim(),
    costPerUnit: Math.max(0, Number(row && row.costPerUnit) || 0),
    points: Array.isArray(row && row.points) ? row.points.map(normalizePoint).filter(Boolean).slice(0, 80) : [],
    page: Math.max(1, Number(row && row.page) || 1),
    color: String(row && row.color || tool.color).trim(),
    wallLength,
    wallArea: Math.max(0, Number(row && row.wallArea) || (wallLength * chbWallHeight)),
    chbWallHeight,
    chbWastePercent: Math.max(0, Number(row && row.chbWastePercent) || 0),
    chbBlocksPerSquareMeter: Math.max(0, Number(row && row.chbBlocksPerSquareMeter) || CHB_TAKEOFF.blocksPerSquareMeter),
    chbSize: String(row && row.chbSize || "").trim(),
    concreteKind: String(row && row.concreteKind || "").trim(),
    typeMark: String(row && row.typeMark || "").trim(),
    takeoffCount: Math.max(0, Number(row && row.takeoffCount) || 0),
    concreteVolumeBase: Math.max(0, Number(row && row.concreteVolumeBase) || concreteVolume),
    concreteVolume,
    concreteMixRatio: concreteMixOption(row && row.concreteMixRatio).key,
    cementPrice: Math.max(0, Number(row && row.cementPrice) || 0),
    sandPrice: Math.max(0, Number(row && row.sandPrice) || 0),
    gravelPrice: Math.max(0, Number(row && row.gravelPrice) || 0),
    concreteWastePercent: Math.max(0, Number(row && row.concreteWastePercent) || 0),
    floorSlabThickness: FLOOR_SLAB_THICKNESS_OPTIONS.includes(Number(row && row.floorSlabThickness)) ? Number(row && row.floorSlabThickness) : FLOOR_SLAB_THICKNESS_OPTIONS[0],
    tileLength,
    tileWidth,
    tileWastePercent,
    tilePrice: Math.max(0, Number(row && row.tilePrice) || 0),
    tileArea,
    tilePieces,
    rebarDiameter: REBAR_DIAMETER_OPTIONS.includes(Number(row && row.rebarDiameter)) ? Number(row && row.rebarDiameter) : REBAR_DIAMETER_OPTIONS[0],
    rebarLength: REBAR_LENGTH_OPTIONS.includes(Number(row && row.rebarLength)) ? Number(row && row.rebarLength) : REBAR_LENGTH_OPTIONS[0],
    longitudinalBarsPerColumn: Math.max(1, Math.ceil(Number(row && row.longitudinalBarsPerColumn) || STEEL_COLUMN_DEFAULTS.longitudinalBarsPerColumn)),
    verticalBarCount: Math.max(0, Number(row && row.verticalBarCount) || 0),
    longitudinalLengthPerBar: Math.max(0, Number(row && row.longitudinalLengthPerBar) || 0),
    longitudinalTotalLength: Math.max(0, Number(row && row.longitudinalTotalLength) || 0),
    lapAllowancePerBar: Math.max(0, Number(row && row.lapAllowancePerBar) || STEEL_COLUMN_DEFAULTS.lapAllowancePerBar),
    lapAllowanceTotalLength: Math.max(0, Number(row && row.lapAllowanceTotalLength) || 0),
    longitudinalWastePercent: Math.max(0, Number(row && row.longitudinalWastePercent) || STEEL_COLUMN_DEFAULTS.longitudinalWastePercent),
    longitudinalStockBars: rowLongitudinalStockBars,
    tieSpacing: Math.max(0, Number(row && row.tieSpacing) || STEEL_COLUMN_DEFAULTS.tieSpacing),
    tieHookAllowance: Math.max(0, Number(row && row.tieHookAllowance) || STEEL_COLUMN_DEFAULTS.tieHookAllowance),
    tiesPerColumn: Math.max(0, Number(row && row.tiesPerColumn) || 0),
    tiePieceCount: Math.max(0, Number(row && row.tiePieceCount) || 0),
    tieLengthEach: Math.max(0, Number(row && row.tieLengthEach) || 0),
    tieTotalLength: Math.max(0, Number(row && row.tieTotalLength) || 0),
    tieWastePercent: Math.max(0, Number(row && row.tieWastePercent) || STEEL_COLUMN_DEFAULTS.tieWastePercent),
    tieStockBars: rowTieStockBars,
    lapStockBars: rowLapStockBars,
    totalRebarLength: Math.max(0, Number(row && row.totalRebarLength) || 0),
    totalRebarWeightKg: Math.max(0, Number(row && row.totalRebarWeightKg) || 0),
    totalStockBars: steelTotalStockBars,
    stockLengthOptions,
    footingRebarSpacing: Math.max(0, Number(row && row.footingRebarSpacing) || STEEL_FOOTING_DEFAULTS.rebarSpacing),
    footingAllowancePerBar: Math.max(0, Number(row && row.footingAllowancePerBar) || STEEL_FOOTING_DEFAULTS.allowancePerBar),
    footingXBarsPerFooting: Math.max(0, Number(row && row.footingXBarsPerFooting) || 0),
    footingYBarsPerFooting: Math.max(0, Number(row && row.footingYBarsPerFooting) || 0),
    footingXBarsTotal: Math.max(0, Number(row && row.footingXBarsTotal) || 0),
    footingYBarsTotal: Math.max(0, Number(row && row.footingYBarsTotal) || 0),
    footingXBarLength: Math.max(0, Number(row && row.footingXBarLength) || 0),
    footingYBarLength: Math.max(0, Number(row && row.footingYBarLength) || 0),
    footingXTotalLength: Math.max(0, Number(row && row.footingXTotalLength) || 0),
    footingYTotalLength: Math.max(0, Number(row && row.footingYTotalLength) || 0),
    footingTotalBars: Math.max(0, Number(row && row.footingTotalBars) || 0),
    slabArea: Math.max(0, Number(row && row.slabArea) || 0),
    slabLength: rowSlabLength,
    slabWidth: rowSlabWidth,
    steelSlabType: rowSteelSlabType.key,
    steelSlabTypeLabel: rowSteelSlabType.label,
    steelSlabLevel: rowSteelSlabType.key,
    steelSlabLevelLabel: rowSteelSlabType.label,
    steelSlabDetectedType: rowSteelSlabDetectedType.key,
    steelSlabDetectedTypeLabel: rowSteelSlabDetectedType.label,
    steelSlabResolvedType: rowSteelSlabResolvedType.key,
    steelSlabResolvedTypeLabel: rowSteelSlabResolvedType.label,
    steelSlabFactor: Math.max(1, Number(row && row.steelSlabFactor) || 1),
    steelSlabRebarSpacing: Math.max(0, Number(row && row.steelSlabRebarSpacing) || STEEL_SLAB_DEFAULTS.rebarSpacing),
    steelSlabThickness: normalizedSteelSlabThickness,
    steelSlabCover: normalizedSteelSlabCover,
    steelSlabEffectiveDepth: normalizedSteelSlabEffectiveDepth,
    steelSlabCrankAllowance: normalizedSteelSlabCrankAllowance,
    steelSlabAllowancePerBar: normalizedSteelSlabCrankAllowance,
    steelSlabWastePercent: Number.isFinite(rowSteelSlabWastePercent) ? Math.max(0, rowSteelSlabWastePercent) : STEEL_SLAB_DEFAULTS.wastePercent,
    steelSlabSpanRatio: rowSteelSlabSpanRatio,
    steelSlabShortSpan: rowSteelSlabShortSpan,
    steelSlabLongSpan: rowSteelSlabLongSpan,
    slabShortBarsLabel: String(row && row.slabShortBarsLabel || (rowSteelSlabResolvedType.key === "one-way" ? "Main bars along short span" : "Short-span bars")).trim(),
    slabLongBarsLabel: String(row && row.slabLongBarsLabel || (rowSteelSlabResolvedType.key === "one-way" ? "Distribution bars along long span" : "Long-span bars")).trim(),
    slabShortBarsCount: Math.max(0, Number(row && row.slabShortBarsCount) || Number(row && row.slabXBarsPerLayer) || 0),
    slabLongBarsCount: Math.max(0, Number(row && row.slabLongBarsCount) || Number(row && row.slabYBarsPerLayer) || 0),
    slabShortBarLength: Math.max(0, Number(row && row.slabShortBarLength) || Number(row && row.slabXBarLength) || 0),
    slabLongBarLength: Math.max(0, Number(row && row.slabLongBarLength) || Number(row && row.slabYBarLength) || 0),
    slabShortTotalLength: Math.max(0, Number(row && row.slabShortTotalLength) || Number(row && row.slabXTotalLength) || 0),
    slabLongTotalLength: Math.max(0, Number(row && row.slabLongTotalLength) || Number(row && row.slabYTotalLength) || 0),
    slabTotalLengthBeforeWaste: Math.max(0, Number(row && row.slabTotalLengthBeforeWaste) || ((Number(row && row.slabShortTotalLength) || Number(row && row.slabXTotalLength) || 0) + (Number(row && row.slabLongTotalLength) || Number(row && row.slabYTotalLength) || 0))),
    slabXBarsPerLayer: Math.max(0, Number(row && row.slabXBarsPerLayer) || 0),
    slabYBarsPerLayer: Math.max(0, Number(row && row.slabYBarsPerLayer) || 0),
    slabXBarsTotal: Math.max(0, Number(row && row.slabXBarsTotal) || 0),
    slabYBarsTotal: Math.max(0, Number(row && row.slabYBarsTotal) || 0),
    slabXBarLength: Math.max(0, Number(row && row.slabXBarLength) || 0),
    slabYBarLength: Math.max(0, Number(row && row.slabYBarLength) || 0),
    slabXTotalLength: Math.max(0, Number(row && row.slabXTotalLength) || 0),
    slabYTotalLength: Math.max(0, Number(row && row.slabYTotalLength) || 0),
    slabTotalBars: Math.max(0, Number(row && row.slabTotalBars) || 0),
    beamLength: Math.max(0, Number(row && row.beamLength) || 0),
    beamWidth: Math.max(0, Number(row && row.beamWidth) || STEEL_BEAM_DEFAULTS.width),
    beamDepth: Math.max(0, Number(row && row.beamDepth) || STEEL_BEAM_DEFAULTS.depth),
    beamMainBars: Math.max(1, Math.ceil(Number(row && row.beamMainBars) || STEEL_BEAM_DEFAULTS.mainBars)),
    beamMainTotalLength: Math.max(0, Number(row && row.beamMainTotalLength) || 0),
    beamStirrupSpacing: Math.max(0, Number(row && row.beamStirrupSpacing) || STEEL_BEAM_DEFAULTS.stirrupSpacing),
    beamStirrupCount: Math.max(0, Number(row && row.beamStirrupCount) || 0),
    beamStirrupLengthEach: Math.max(0, Number(row && row.beamStirrupLengthEach) || 0),
    beamStirrupTotalLength: Math.max(0, Number(row && row.beamStirrupTotalLength) || 0),
    beamCrankBars: Math.max(0, Math.ceil(Number(row && row.beamCrankBars) || 0)),
    beamCrankAllowancePerBar: Math.max(0, Number(row && row.beamCrankAllowancePerBar) || 0),
    beamCrankLengthEach: Math.max(0, Number(row && row.beamCrankLengthEach) || 0),
    beamCrankTotalLength: Math.max(0, Number(row && row.beamCrankTotalLength) || 0),
    steelWallHeight: Math.max(0, Number(row && row.steelWallHeight) || 0),
    steelWallVerticalMode: steelWallVerticalModeOption(row && row.steelWallVerticalMode).key,
    steelWallVerticalModeLabel: steelWallVerticalModeOption(row && row.steelWallVerticalMode).label,
    steelWallVerticalSpacing: Math.max(0, Number(row && row.steelWallVerticalSpacing) || STEEL_WALL_DEFAULTS.verticalSpacing),
    steelWallHorizontalSpacing: Math.max(0, Number(row && row.steelWallHorizontalSpacing) || STEEL_WALL_DEFAULTS.horizontalSpacing),
    steelWallDowelLength: Math.max(0, Number(row && row.steelWallDowelLength) || STEEL_WALL_DEFAULTS.dowelLength),
    steelWallAllowancePerBar: Math.max(0, Number(row && row.steelWallAllowancePerBar) || STEEL_WALL_DEFAULTS.allowancePerBar),
    steelWallVerticalBarCount: Math.max(0, Number(row && row.steelWallVerticalBarCount) || 0),
    steelWallHorizontalBarCount: Math.max(0, Number(row && row.steelWallHorizontalBarCount) || 0),
    steelWallVerticalBarLength: Math.max(0, Number(row && row.steelWallVerticalBarLength) || 0),
    steelWallHorizontalBarLength: Math.max(0, Number(row && row.steelWallHorizontalBarLength) || 0),
    steelWallVerticalTotalLength: Math.max(0, Number(row && row.steelWallVerticalTotalLength) || 0),
    steelWallHorizontalTotalLength: Math.max(0, Number(row && row.steelWallHorizontalTotalLength) || 0),
    steelWallTotalBars: Math.max(0, Number(row && row.steelWallTotalBars) || 0),
    columnWidth: Math.max(0, Number(row && row.columnWidth) || 0),
    columnDepth: Math.max(0, Number(row && row.columnDepth) || 0),
    columnHeight: Math.max(0, Number(row && row.columnHeight) || 0),
    footingLength: Math.max(0, Number(row && row.footingLength) || 0),
    footingWidth: Math.max(0, Number(row && row.footingWidth) || 0),
    footingThickness: Math.max(0, Number(row && row.footingThickness) || 0),
    footingVolume: Math.max(0, Number(row && row.footingVolume) || 0),
    pedestalWidth: Math.max(0, Number(row && row.pedestalWidth) || 0),
    pedestalDepth: Math.max(0, Number(row && row.pedestalDepth) || 0),
    pedestalHeight: Math.max(0, Number(row && row.pedestalHeight) || 0),
    pedestalVolume: Math.max(0, Number(row && row.pedestalVolume) || 0)
  };
}

function normalizePoint(point) {
  if (!point || typeof point !== "object") return null;
  const x = Number(point.x);
  const y = Number(point.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x: Math.max(0, x), y: Math.max(0, y) };
}

function blankEstimateV2Material() {
  return normalizeEstimateV2Material({
    description: "",
    category: "General",
    quantity: 0,
    unit: "",
    confidence: "manual",
    source: "Manual row",
    notes: ""
  });
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
  setSyncedJson(STORAGE.estimateTemplates, templates);
}

function getMaterialPrices() {
  const saved = readJson(STORAGE.materialPrices, []);
  if (!Array.isArray(saved)) return [];
  return saved.map(normalizePriceRow).filter(hasPriceRowData)
    .sort((a, b) => a.description.localeCompare(b.description) || a.store.localeCompare(b.store) || a.costPerUnit - b.costPerUnit);
}

function saveMaterialPrices(prices) {
  setSyncedJson(STORAGE.materialPrices, prices.map(normalizePriceRow).filter(hasPriceRowData));
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

async function runLocalVisionOcr(file) {
  await loadPdfJs();
  await loadTesseract();
  const pdfBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
  const pageCount = pdf.numPages || 1;
  const processedPages = Math.min(pageCount, LOCAL_VISION_CONFIG.maxPages);
  const ocrRegions = [];
  let activeRegionLabel = "";
  let lastProgressToast = 0;
  const worker = await createTesseractWorker((message) => {
    if (message.status === "recognizing text" && Number.isFinite(message.progress)) {
      const now = Date.now();
      if (now - lastProgressToast > 1200) {
        lastProgressToast = now;
        toast(`Local OCR ${activeRegionLabel} ${Math.round(message.progress * 100)}%`);
      }
    }
  });
  try {
    if (worker && typeof worker.setParameters === "function") {
      await worker.setParameters({
        tessedit_pageseg_mode: "11",
        preserve_interword_spaces: "1"
      });
    }
    for (let pageNumber = 1; pageNumber <= processedPages; pageNumber += 1) {
      toast(`Rendering page ${pageNumber} of ${processedPages} at high resolution...`);
      const pageCanvas = await renderPdfPageForOcr(pdf, pageNumber);
      for (const regionDefinition of LOCAL_VISION_REGIONS) {
        activeRegionLabel = `P${pageNumber} ${regionDefinition.label}`;
        toast(`OCR ${activeRegionLabel}...`);
        const croppedCanvas = cropCanvasRegion(pageCanvas, regionDefinition);
        const preparedCanvas = preprocessCanvasForOcr(croppedCanvas);
        const result = await worker.recognize(preparedCanvas);
        const text = cleanOcrText(result && result.data ? result.data.text : "");
        const confidence = result && result.data ? Number(result.data.confidence) || 0 : 0;
        if (text) {
          ocrRegions.push(normalizeOcrRegion({
            page: pageNumber,
            region: regionDefinition.label,
            text,
            confidence,
            lineCount: text.split(/\n+/).filter(Boolean).length
          }));
        }
        croppedCanvas.width = 0;
        croppedCanvas.height = 0;
        preparedCanvas.width = 0;
        preparedCanvas.height = 0;
      }
      pageCanvas.width = 0;
      pageCanvas.height = 0;
    }
    const text = buildGroupedOcrText(ocrRegions);
    const confidenceValues = ocrRegions.map((region) => Number(region.confidence) || 0).filter((value) => value > 0);
    return {
      text,
      confidence: confidenceValues.length ? confidenceValues.reduce((total, value) => total + value, 0) / confidenceValues.length : 0,
      pageCount,
      processedPages,
      regionCount: ocrRegions.length,
      regions: ocrRegions
    };
  } finally {
    if (worker && typeof worker.terminate === "function") await worker.terminate();
  }
}

async function renderPdfPageForOcr(pdf, pageNumber) {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const dpiScale = LOCAL_VISION_CONFIG.targetDpi / 72;
  const maxScale = LOCAL_VISION_CONFIG.maxCanvasSide / Math.max(baseViewport.width, baseViewport.height);
  const renderScale = Math.max(0.9, Math.min(dpiScale, maxScale));
  const viewport = page.getViewport({ scale: renderScale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to prepare local OCR canvas.");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

function cropCanvasRegion(sourceCanvas, regionDefinition) {
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;
  const sourceX = Math.max(0, Math.floor(sourceWidth * regionDefinition.x));
  const sourceY = Math.max(0, Math.floor(sourceHeight * regionDefinition.y));
  const cropWidth = Math.max(1, Math.min(sourceWidth - sourceX, Math.floor(sourceWidth * regionDefinition.width)));
  const cropHeight = Math.max(1, Math.min(sourceHeight - sourceY, Math.floor(sourceHeight * regionDefinition.height)));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to crop OCR region.");
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, cropWidth, cropHeight);
  context.drawImage(sourceCanvas, sourceX, sourceY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return canvas;
}

function preprocessCanvasForOcr(sourceCanvas) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to preprocess OCR image.");
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  context.drawImage(sourceCanvas, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    const luminance = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
    const contrasted = Math.max(0, Math.min(255, (luminance - 128) * 1.55 + 128));
    let value = contrasted;
    if (contrasted > 214) value = 255;
    if (contrasted < 158) value = 0;
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
    data[index + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
  return canvas;
}

function buildGroupedOcrText(regions) {
  return (Array.isArray(regions) ? regions : [])
    .filter((region) => region.text)
    .map((region) => `Page ${formatInteger(region.page || 1)} - ${region.region || "Region"}\n${region.text}`)
    .join("\n\n");
}

async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  await loadScript(LOCAL_VISION_LIBS.pdfScript);
  if (!window.pdfjsLib) throw new Error("PDF renderer did not load.");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = LOCAL_VISION_LIBS.pdfWorker;
  return window.pdfjsLib;
}

async function loadTesseract() {
  if (window.Tesseract) return window.Tesseract;
  await loadScript(LOCAL_VISION_LIBS.tesseractScript);
  if (!window.Tesseract) throw new Error("Local OCR engine did not load.");
  return window.Tesseract;
}

function loadScript(src) {
  const existing = [...document.scripts].find((script) => script.src === src);
  if (existing && existing.dataset.loaded === "true") return Promise.resolve();
  if (existing && existing.dataset.loading === "true") {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.loading = "true";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function createTesseractWorker(logger) {
  const Tesseract = window.Tesseract;
  try {
    return await Tesseract.createWorker("eng", 1, { logger });
  } catch (_error) {
    const worker = await Tesseract.createWorker({ logger });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    return worker;
  }
}

function cleanOcrText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .split(/\r?\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function detectEstimateV2MaterialsFromText(text, planType, source) {
  return detectEstimateV2MaterialsFromRegions([{
    page: 1,
    region: source || "Readable Text",
    text: String(text || ""),
    confidence: 0,
    lineCount: String(text || "").split(/\n+/).filter(Boolean).length
  }], planType, source);
}

function detectEstimateV2MaterialsFromRegions(regions, planType, source) {
  const sourceRegions = (Array.isArray(regions) ? regions : []).map(normalizeOcrRegion).filter((region) => region.text);
  const searchable = sourceRegions.map((region) => region.text).join("\n").toLowerCase();
  const includeAll = planType === "Other";
  return ESTIMATE_V2_MATERIAL_TERMS
    .filter((material) => includeAll || material.planTypes.includes(planType) || material.category === "General")
    .map((material) => {
      const matchedTerms = material.terms.filter((term) => countTextMatches(searchable, term) > 0);
      const mentions = matchedTerms.reduce((total, term) => total + countTextMatches(searchable, term), 0);
      const evidence = evidenceForTerms(sourceRegions, matchedTerms);
      const sampleLines = evidence.map((item) => item.line);
      const quantityHint = inferEstimateV2Quantity(sampleLines);
      const evidenceConfidence = averageEvidenceConfidence(evidence);
      return normalizeEstimateV2Material({
        description: material.description,
        category: material.category,
        quantity: quantityHint.quantity,
        unit: quantityHint.unit,
        mentions,
        confidence: estimateV2ConfidenceLabel(mentions, evidenceConfidence, quantityHint.quantity),
        source,
        notes: formatEstimateV2EvidenceNotes(evidence, quantityHint, matchedTerms),
        matchedTerms,
        sampleLines
      });
    })
    .filter((material) => material.mentions > 0)
    .sort((first, second) => second.mentions - first.mentions || first.description.localeCompare(second.description));
}

function evidenceForTerms(regions, terms, limit = 5) {
  if (!terms.length) return [];
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const seen = new Set();
  const evidence = [];
  regions.forEach((region) => {
    String(region.text || "").split(/\n+/).map((line) => line.trim()).filter(Boolean).forEach((line) => {
      const lowerLine = line.toLowerCase();
      if (!lowerTerms.some((term) => lowerLine.includes(term))) return;
      const key = `${region.page}|${region.region}|${lowerLine}`;
      if (seen.has(key)) return;
      seen.add(key);
      evidence.push({
        page: region.page || 1,
        region: region.region || "Region",
        line,
        confidence: Number(region.confidence) || 0
      });
    });
  });
  return evidence.slice(0, limit);
}

function averageEvidenceConfidence(evidence) {
  const values = (Array.isArray(evidence) ? evidence : [])
    .map((item) => Number(item.confidence) || 0)
    .filter((value) => value > 0);
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function estimateV2ConfidenceLabel(mentions, ocrConfidence, quantity) {
  if (quantity > 0) return "high - quantity hint";
  if (mentions >= 4 && ocrConfidence >= 55) return "high";
  if (mentions >= 2 || ocrConfidence >= 50) return "medium";
  return "low";
}

function formatEstimateV2EvidenceNotes(evidence, quantityHint, matchedTerms) {
  const lines = (Array.isArray(evidence) ? evidence : [])
    .slice(0, 4)
    .map((item) => `Page ${formatInteger(item.page || 1)} | ${item.region || "Region"}: ${item.line}`);
  if (quantityHint.note) lines.push(quantityHint.note);
  if (!lines.length && matchedTerms.length) {
    lines.push(`Detected by OCR keyword${matchedTerms.length === 1 ? "" : "s"}: ${matchedTerms.join(", ")}`);
  }
  return lines.join("\n");
}

function countTextMatches(text, term) {
  const escapedTerm = escapeRegExp(term).replace(/\s+/g, "\\s+");
  const pattern = new RegExp(`(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`, "gi");
  return (text.match(pattern) || []).length;
}

function inferEstimateV2Quantity(lines) {
  const matches = [];
  const quantityPattern = /(^|[^0-9])([0-9]{1,6}(?:,[0-9]{3})*(?:\.[0-9]+)?)(?:\s*)(cu\.?\s*m|cum|m3|m\^3|sq\.?\s*m|sqm|m2|m\^2|pcs?|sets?|lots?|bags?|kg|tons?|l\.?\s*m\.?|lm|lin\.?\s*m)\b/gi;
  lines.forEach((line) => {
    let match = quantityPattern.exec(line);
    while (match) {
      const quantity = Number(String(match[2]).replace(/,/g, ""));
      const unit = normalizeEstimateV2Unit(match[3]);
      if (Number.isFinite(quantity) && quantity > 0 && quantity < 100000 && unit) {
        matches.push({ quantity, unit, line });
      }
      match = quantityPattern.exec(line);
    }
  });
  if (!matches.length) return { quantity: 0, unit: "", note: "" };
  const unit = matches[0].unit;
  const sameUnitMatches = matches.filter((match) => match.unit === unit);
  const quantity = sameUnitMatches.reduce((total, match) => total + match.quantity, 0);
  const sample = sameUnitMatches[0] ? sameUnitMatches[0].line : "";
  return {
    quantity,
    unit,
    note: sample ? `${sample}\nQuantity hint from OCR: ${formatSwaNumber(quantity)} ${unit}` : ""
  };
}

function normalizeEstimateV2Unit(unit) {
  const value = String(unit || "").toLowerCase().replace(/\s+/g, "").replace(/\./g, "");
  if (["cum", "m3", "m^3"].includes(value)) return "cu.m";
  if (["sqm", "m2", "m^2"].includes(value)) return "sq.m";
  if (["pc", "pcs"].includes(value)) return "pcs";
  if (["set", "sets"].includes(value)) return "sets";
  if (["lot", "lots"].includes(value)) return "lot";
  if (["bag", "bags"].includes(value)) return "bags";
  if (["kg"].includes(value)) return "kg";
  if (["ton", "tons"].includes(value)) return "tons";
  if (["lm", "linm", "m", "meter", "meters", "linemeter", "linearmeter", "linearmeters"].includes(value)) return "lm";
  return "";
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

function formatEstimateV2TotalCost(value) {
  const amount = Number(value) || 0;
  const absoluteAmount = Math.abs(amount);
  if (absoluteAmount < 1000) return formatCurrency(amount);
  const units = [
    { value: 1000000000, suffix: "B" },
    { value: 1000000, suffix: "M" },
    { value: 1000, suffix: "k" }
  ];
  const unit = units.find((item) => absoluteAmount >= item.value) || units[units.length - 1];
  const scaledAmount = amount / unit.value;
  const decimals = Math.abs(scaledAmount) >= 10 ? 1 : 2;
  const compactNumber = new Intl.NumberFormat("en-PH", {
    maximumFractionDigits: decimals
  }).format(scaledAmount);
  return `₱${compactNumber}${unit.suffix}`;
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
