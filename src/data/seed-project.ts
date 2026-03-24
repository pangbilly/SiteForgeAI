/**
 * SiteForge AI — J676 NOS07/NOS08 Seed Data
 * Real project data from Thames Water / Barhale Manor Road NOS Bridge
 */

export const SEED_PROJECTS = [
  {
    name: "J676 NOS07 — Rail Spans (Jubilee/DLR)",
    code: "NOS07",
    client: "Thames Water",
    contractor: "Barhale Ltd",
    status: "active",
  },
  {
    name: "J676 NOS08 — Road Span (Manor Road A1011)",
    code: "NOS08",
    client: "Thames Water",
    contractor: "Barhale Ltd",
    status: "active",
  },
];

export const SEED_CONSTRAINTS = [
  // NOS07 Constraints
  { projectCode: "NOS07", category: "access", title: "LUL/DLR Track Access — Jubilee & DLR possessions required for rail span works", severity: "high", status: "open", owner: "Richard Smith" },
  { projectCode: "NOS07", category: "access", title: "Network Rail interface — coordinated possessions with NR timetable", severity: "high", status: "open", owner: "PM" },
  { projectCode: "NOS07", category: "services", title: "5x 2.74m sewer barrels — 3 must remain in service at all times (21m³/s min flow)", severity: "high", status: "open", owner: "TW Operations" },
  { projectCode: "NOS07", category: "services", title: "HV cable exclusion zones — UKPN diversions required before main works", severity: "high", status: "open", owner: "UKPN Coordinator" },
  { projectCode: "NOS07", category: "environment", title: "Asbestos sludge main — licensed removal required, R&D survey results pending", severity: "high", status: "open", owner: "H&S Manager" },
  { projectCode: "NOS07", category: "structural", title: "Post-tensioned concrete beams — no coring/drilling permitted, specialist assessment needed", severity: "medium", status: "open", owner: "Structural Engineer" },
  { projectCode: "NOS07", category: "structural", title: "BG&E condition findings worse than assumed — additional remediation scope likely", severity: "high", status: "open", owner: "Design Lead" },
  { projectCode: "NOS07", category: "access", title: "Dummy span and 2x arch structures included in NOS07 scope", severity: "medium", status: "open", owner: "PM" },

  // NOS08 Constraints
  { projectCode: "NOS08", category: "access", title: "LB Newham road closures — Manor Road A1011 weekend/night closures, 12-week lead time", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "NOS08", category: "access", title: "Road span over Manor Road — traffic management during all overhead works", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "NOS08", category: "services", title: "Barrel isolation sequencing — cannot isolate more than 2 barrels simultaneously", severity: "high", status: "open", owner: "TW Operations" },
  { projectCode: "NOS08", category: "environment", title: "Noise & vibration restrictions — residential properties adjacent to Manor Road", severity: "medium", status: "open", owner: "Environmental Manager" },
  { projectCode: "NOS08", category: "structural", title: "Road span soffit condition — spalling and exposed rebar identified in survey", severity: "medium", status: "open", owner: "Structural Engineer" },
];

export const SEED_CHANGES = [
  // Variation triggers identified from project brief
  { projectCode: "NOS07", type: "EWN", reference: "EWN-001", title: "BG&E condition survey — findings significantly worse than design assumption", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-002", title: "Asbestos sludge main — scope of licensed removal exceeds allowance", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-003", title: "Post-tensioned beam restrictions — alternative fixing methodology required", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-004", title: "LUL possession availability — reduced access windows vs programme assumption", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-005", title: "HV cable diversion — UKPN programme delay impacting critical path", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-006", title: "Additional structural repairs to dummy span not in original scope", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "EWN", reference: "EWN-007", title: "Arch structure remediation — scope increase from detailed survey", status: "notified", value: undefined },
  { projectCode: "NOS08", type: "EWN", reference: "EWN-008", title: "Road closure lead time — 12 weeks vs 8 weeks assumed in programme", status: "notified", value: undefined },
  { projectCode: "NOS08", type: "EWN", reference: "EWN-009", title: "Barrel isolation sequence change — TW ops requirement for additional monitoring", status: "notified", value: undefined },
  { projectCode: "NOS08", type: "EWN", reference: "EWN-010", title: "Road span soffit repairs — extent exceeds original survey estimate", status: "notified", value: undefined },
  { projectCode: "NOS07", type: "CE", reference: "CE-001", title: "Scope item S29411e — risk materialised: barrel condition worse than assumed", status: "quoted", value: 85000 },
  { projectCode: "NOS07", type: "CE", reference: "CE-002", title: "Additional asbestos removal works — licensed contractor mobilisation", status: "quoted", value: 42000 },
  { projectCode: "NOS08", type: "CE", reference: "CE-003", title: "Extended traffic management — additional weekend closures required", status: "notified", value: 28000 },
  { projectCode: "NOS07", type: "CE", reference: "CE-004", title: "Design change — alternative fixing detail for post-tensioned beams", status: "notified", value: undefined },
];

export const SEED_CHECKLISTS = [
  {
    projectCode: "NOS07",
    title: "Stage Gate 1 — Make Ready Complete",
    type: "stage_gate",
    items: [
      "Site investigations and surveys complete",
      "Design basis agreed with TW",
      "RAMS approved for enabling works",
      "LUL/DLR possession schedule confirmed",
      "UKPN HV cable diversion programme agreed",
      "Asbestos R&D survey results received and reviewed",
      "Construction Phase Plan approved",
      "Environmental permits and consents in place",
      "Subcontract packages tendered and evaluated",
      "Programme baseline agreed with client",
      "Cost plan approved",
      "Risk register reviewed and accepted",
    ],
  },
  {
    projectCode: "NOS07",
    title: "Stage Gate 2 — Design Complete",
    type: "stage_gate",
    items: [
      "Permanent works design approved (Cat III check)",
      "Temporary works design approved by TWC",
      "BIM model coordination complete — clash-free",
      "Method statements approved for all critical activities",
      "ITPs issued for all work packages",
      "Material procurement orders placed for long-lead items",
      "Detailed programme issued and accepted",
      "All design risk assessments complete",
    ],
  },
  {
    projectCode: "NOS08",
    title: "Stage Gate 1 — Make Ready Complete",
    type: "stage_gate",
    items: [
      "Traffic management plan approved by LB Newham",
      "Road closure applications submitted (12-week notice)",
      "Barrel isolation sequence agreed with TW Operations",
      "Soffit condition survey complete",
      "RAMS approved for road span works",
      "Environmental Management Plan approved",
      "Subcontract packages tendered",
      "Programme baseline agreed",
    ],
  },
  {
    projectCode: "NOS07",
    title: "Weekly Pre-Start Meeting Checklist",
    type: "pre_start",
    items: [
      "Review previous week's progress against lookahead",
      "Confirm possession/access windows for coming week",
      "Review open permits and RAMS",
      "Confirm material deliveries scheduled",
      "Review plant and equipment availability",
      "Check weather forecast for impact",
      "Review H&S incidents/near misses from previous week",
      "Confirm subcontractor attendance and readiness",
      "Update constraints register",
      "Issue updated 4-week lookahead",
    ],
  },
];

export const SEED_USERS = [
  {
    email: "admin@pangandchiu.com",
    name: "Billy Kin Pang",
    password: "siteforge2026", // Will be hashed during seeding
    role: "ADMIN" as const,
  },
  {
    email: "viewer@barhale.co.uk",
    name: "Barhale Viewer",
    password: "barhale2026",
    role: "VIEWER" as const,
  },
];
