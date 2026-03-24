/**
 * SiteForge AI — Demo Project Seed Data
 * Generic infrastructure bridge remediation project
 */

export const SEED_PROJECTS = [
  {
    name: "BR-01 — Rail Spans Remediation",
    code: "BR-01",
    client: "Network Utilities Ltd",
    contractor: "Meridian Civil Engineering",
    status: "active",
  },
  {
    name: "BR-02 — Road Span Remediation",
    code: "BR-02",
    client: "Network Utilities Ltd",
    contractor: "Meridian Civil Engineering",
    status: "active",
  },
];

export const SEED_CONSTRAINTS = [
  // BR-01 Constraints
  { projectCode: "BR-01", category: "access", title: "Rail track access — possessions required for rail span works", severity: "high", status: "open", owner: "Access Coordinator" },
  { projectCode: "BR-01", category: "access", title: "Network operator interface — coordinated possessions with rail timetable", severity: "high", status: "open", owner: "PM" },
  { projectCode: "BR-01", category: "services", title: "5x 2.74m service barrels — 3 must remain in service at all times (min flow)", severity: "high", status: "open", owner: "Utilities Operations" },
  { projectCode: "BR-01", category: "services", title: "HV cable exclusion zones — diversions required before main works", severity: "high", status: "open", owner: "Power Coordinator" },
  { projectCode: "BR-01", category: "environment", title: "Hazardous material in service main — licensed removal required, survey results pending", severity: "high", status: "open", owner: "H&S Manager" },
  { projectCode: "BR-01", category: "structural", title: "Post-tensioned concrete beams — no coring/drilling permitted, specialist assessment needed", severity: "medium", status: "open", owner: "Structural Engineer" },
  { projectCode: "BR-01", category: "structural", title: "Condition survey findings worse than assumed — additional remediation scope likely", severity: "high", status: "open", owner: "Design Lead" },
  { projectCode: "BR-01", category: "access", title: "Additional span and arch structures included in BR-01 scope", severity: "medium", status: "open", owner: "PM" },

  // BR-02 Constraints
  { projectCode: "BR-02", category: "access", title: "Local authority road closures — weekend/night closures, 12-week lead time", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "BR-02", category: "access", title: "Road span — traffic management during all overhead works", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "BR-02", category: "services", title: "Barrel isolation sequencing — cannot isolate more than 2 barrels simultaneously", severity: "high", status: "open", owner: "Utilities Operations" },
  { projectCode: "BR-02", category: "environment", title: "Noise & vibration restrictions — residential properties adjacent to road", severity: "medium", status: "open", owner: "Environmental Manager" },
  { projectCode: "BR-02", category: "structural", title: "Road span soffit condition — spalling and exposed rebar identified in survey", severity: "medium", status: "open", owner: "Structural Engineer" },
];

export const SEED_CHANGES = [
  { projectCode: "BR-01", type: "EWN", reference: "EWN-001", title: "Condition survey — findings significantly worse than design assumption", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-002", title: "Hazardous material — scope of licensed removal exceeds allowance", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-003", title: "Post-tensioned beam restrictions — alternative fixing methodology required", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-004", title: "Rail possession availability — reduced access windows vs programme assumption", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-005", title: "HV cable diversion — power company programme delay impacting critical path", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-006", title: "Additional structural repairs to secondary span not in original scope", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-007", title: "Arch structure remediation — scope increase from detailed survey", status: "notified", value: undefined },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-008", title: "Road closure lead time — 12 weeks vs 8 weeks assumed in programme", status: "notified", value: undefined },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-009", title: "Barrel isolation sequence change — utilities ops requirement for additional monitoring", status: "notified", value: undefined },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-010", title: "Road span soffit repairs — extent exceeds original survey estimate", status: "notified", value: undefined },
  { projectCode: "BR-01", type: "CE", reference: "CE-001", title: "Risk materialised: barrel condition worse than assumed", status: "quoted", value: 85000 },
  { projectCode: "BR-01", type: "CE", reference: "CE-002", title: "Additional hazardous material removal works — licensed contractor mobilisation", status: "quoted", value: 42000 },
  { projectCode: "BR-02", type: "CE", reference: "CE-003", title: "Extended traffic management — additional weekend closures required", status: "notified", value: 28000 },
  { projectCode: "BR-01", type: "CE", reference: "CE-004", title: "Design change — alternative fixing detail for post-tensioned beams", status: "notified", value: undefined },
];

export const SEED_CHECKLISTS = [
  {
    projectCode: "BR-01",
    title: "Stage Gate 1 — Make Ready Complete",
    type: "stage_gate",
    items: [
      "Site investigations and surveys complete",
      "Design basis agreed with client",
      "RAMS approved for enabling works",
      "Rail possession schedule confirmed",
      "HV cable diversion programme agreed",
      "Hazardous material survey results received and reviewed",
      "Construction Phase Plan approved",
      "Environmental permits and consents in place",
      "Subcontract packages tendered and evaluated",
      "Programme baseline agreed with client",
      "Cost plan approved",
      "Risk register reviewed and accepted",
    ],
  },
  {
    projectCode: "BR-01",
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
    projectCode: "BR-02",
    title: "Stage Gate 1 — Make Ready Complete",
    type: "stage_gate",
    items: [
      "Traffic management plan approved by local authority",
      "Road closure applications submitted (12-week notice)",
      "Barrel isolation sequence agreed with utilities operations",
      "Soffit condition survey complete",
      "RAMS approved for road span works",
      "Environmental Management Plan approved",
      "Subcontract packages tendered",
      "Programme baseline agreed",
    ],
  },
  {
    projectCode: "BR-01",
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
    name: "Admin User",
    password: "siteforge2026",
    role: "ADMIN" as const,
  },
  {
    email: "viewer@pangandchiu.com",
    name: "Site Viewer",
    password: "siteforge2026",
    role: "VIEWER" as const,
  },
];
