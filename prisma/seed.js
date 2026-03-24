const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const USERS = [
  { email: "admin@pangandchiu.com", name: "Admin User", password: "siteforge2026", role: "ADMIN" },
  { email: "pm@pangandchiu.com", name: "Project Manager", password: "siteforge2026", role: "PM" },
  { email: "viewer@pangandchiu.com", name: "Site Viewer", password: "siteforge2026", role: "VIEWER" },
];

const PROJECTS = [
  { name: "BR-01 — Rail Spans Remediation", code: "BR-01", client: "Network Utilities Ltd", contractor: "Meridian Civil Engineering", status: "active" },
  { name: "BR-02 — Road Span Remediation", code: "BR-02", client: "Network Utilities Ltd", contractor: "Meridian Civil Engineering", status: "active" },
];

const CONSTRAINTS = [
  { projectCode: "BR-01", category: "access", title: "Rail track access — possessions required for rail span works", severity: "high", status: "open", owner: "Access Coordinator" },
  { projectCode: "BR-01", category: "access", title: "Network operator interface — coordinated possessions with rail timetable", severity: "high", status: "open", owner: "PM" },
  { projectCode: "BR-01", category: "services", title: "5x 2.74m service barrels — 3 must remain in service at all times (min flow)", severity: "high", status: "open", owner: "Utilities Operations" },
  { projectCode: "BR-01", category: "services", title: "HV cable exclusion zones — diversions required before main works", severity: "high", status: "open", owner: "Power Coordinator" },
  { projectCode: "BR-01", category: "environment", title: "Hazardous material in service main — licensed removal required, survey results pending", severity: "high", status: "open", owner: "H&S Manager" },
  { projectCode: "BR-01", category: "structural", title: "Post-tensioned concrete beams — no coring/drilling permitted, specialist assessment needed", severity: "medium", status: "open", owner: "Structural Engineer" },
  { projectCode: "BR-01", category: "structural", title: "Condition survey findings worse than assumed — additional remediation scope likely", severity: "high", status: "open", owner: "Design Lead" },
  { projectCode: "BR-01", category: "access", title: "Additional span and arch structures included in BR-01 scope", severity: "medium", status: "open", owner: "PM" },
  { projectCode: "BR-02", category: "access", title: "Local authority road closures — weekend/night closures, 12-week lead time", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "BR-02", category: "access", title: "Road span — traffic management during all overhead works", severity: "high", status: "open", owner: "Traffic Manager" },
  { projectCode: "BR-02", category: "services", title: "Barrel isolation sequencing — cannot isolate more than 2 barrels simultaneously", severity: "high", status: "open", owner: "Utilities Operations" },
  { projectCode: "BR-02", category: "environment", title: "Noise & vibration restrictions — residential properties adjacent to road", severity: "medium", status: "open", owner: "Environmental Manager" },
  { projectCode: "BR-02", category: "structural", title: "Road span soffit condition — spalling and exposed rebar identified in survey", severity: "medium", status: "open", owner: "Structural Engineer" },
];

const CHANGES = [
  { projectCode: "BR-01", type: "EWN", reference: "EWN-001", title: "Condition survey — findings significantly worse than design assumption", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-002", title: "Hazardous material — scope of licensed removal exceeds allowance", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-003", title: "Post-tensioned beam restrictions — alternative fixing methodology required", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-004", title: "Rail possession availability — reduced access windows vs programme assumption", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-005", title: "HV cable diversion — power company programme delay impacting critical path", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-006", title: "Additional structural repairs to secondary span not in original scope", status: "notified" },
  { projectCode: "BR-01", type: "EWN", reference: "EWN-007", title: "Arch structure remediation — scope increase from detailed survey", status: "notified" },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-008", title: "Road closure lead time — 12 weeks vs 8 weeks assumed in programme", status: "notified" },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-009", title: "Barrel isolation sequence change — utilities ops requirement for additional monitoring", status: "notified" },
  { projectCode: "BR-02", type: "EWN", reference: "EWN-010", title: "Road span soffit repairs — extent exceeds original survey estimate", status: "notified" },
  { projectCode: "BR-01", type: "CE", reference: "CE-001", title: "Risk materialised: barrel condition worse than assumed", status: "quoted", value: 85000 },
  { projectCode: "BR-01", type: "CE", reference: "CE-002", title: "Additional hazardous material removal works — licensed contractor mobilisation", status: "quoted", value: 42000 },
  { projectCode: "BR-02", type: "CE", reference: "CE-003", title: "Extended traffic management — additional weekend closures required", status: "notified", value: 28000 },
  { projectCode: "BR-01", type: "CE", reference: "CE-004", title: "Design change — alternative fixing detail for post-tensioned beams", status: "notified" },
];

const CHECKLISTS = [
  {
    projectCode: "BR-01", title: "Stage Gate 1 — Make Ready Complete", type: "stage_gate",
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
    projectCode: "BR-01", title: "Stage Gate 2 — Design Complete", type: "stage_gate",
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
    projectCode: "BR-02", title: "Stage Gate 1 — Make Ready Complete", type: "stage_gate",
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
    projectCode: "BR-01", title: "Weekly Pre-Start Meeting Checklist", type: "pre_start",
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

const DOCUMENTS = [
  { code: "PL-001", title: "Construction Programme Narrative", category: "planning" },
  { code: "PL-002", title: "4-Week Lookahead", category: "planning" },
  { code: "PL-003", title: "Weekly Progress Report", category: "planning" },
  { code: "PL-004", title: "Monthly Progress Report", category: "planning" },
  { code: "PL-005", title: "Outage/Possession Management Plan", category: "planning" },
  { code: "PL-006", title: "Work Package Plan", category: "planning" },
  { code: "HS-001", title: "RAMS Template", category: "health_safety" },
  { code: "HS-002", title: "Safe System of Work (SSOW)", category: "health_safety" },
  { code: "HS-003", title: "Toolbox Talk Record", category: "health_safety" },
  { code: "HS-004", title: "Permit to Work", category: "health_safety" },
  { code: "HS-005", title: "Construction Phase Plan", category: "health_safety" },
  { code: "HS-006", title: "Emergency Response Plan", category: "health_safety" },
  { code: "HS-007", title: "COSHH Assessment", category: "health_safety" },
  { code: "HS-008", title: "Asbestos Management Plan", category: "health_safety" },
  { code: "EN-001", title: "Construction Method Statement", category: "engineering" },
  { code: "EN-002", title: "Temporary Works Design Procedure", category: "engineering" },
  { code: "EN-003", title: "Inspection & Test Plan (ITP)", category: "engineering" },
  { code: "EN-004", title: "Permanent Works Design Report", category: "engineering" },
  { code: "EN-005", title: "Temporary Works Design Report / AIP", category: "engineering" },
  { code: "EN-006", title: "Survey & Investigation Interpretive Report", category: "engineering" },
  { code: "EN-007", title: "CEMP (Environmental Management)", category: "engineering" },
  { code: "EN-008", title: "3D/BIM Model Specification", category: "engineering" },
  { code: "CM-001", title: "Early Warning Notice (EWN) with CE Tracker", category: "commercial" },
  { code: "CM-002", title: "Compensation Event (CE) Notice", category: "commercial" },
  { code: "CM-003", title: "CE Quotation", category: "commercial" },
  { code: "CM-004", title: "Cost Value Reconciliation (CVR)", category: "commercial" },
  { code: "CM-005", title: "Payment Application / Interim Certificate", category: "commercial" },
  { code: "CM-006", title: "Subcontract Order Schedule", category: "commercial" },
  { code: "QA-001", title: "Quality Management Plan", category: "quality" },
  { code: "QA-002", title: "Inspection & Test Record Template", category: "quality" },
  { code: "QA-003", title: "Welding Procedure Specification (WPS)", category: "quality" },
  { code: "QA-004", title: "Material Test Certificate Register", category: "quality" },
  { code: "QA-005", title: "Non-Conformance Report (NCR)", category: "quality" },
  { code: "QA-006", title: "Concrete Pour Record", category: "quality" },
  { code: "QA-007", title: "Painting/Coating Inspection Record", category: "quality" },
  { code: "HO-001", title: "Health & Safety File Template", category: "handover" },
  { code: "HO-002", title: "As-Built Drawing Register", category: "handover" },
  { code: "HO-003", title: "O&M Manual", category: "handover" },
  { code: "HO-004", title: "QA Dossier Index", category: "handover" },
  { code: "HO-005", title: "Stage Gate Checklist", category: "handover" },
  { code: "HO-006", title: "Defects Register", category: "handover" },
  { code: "HO-007", title: "Hanger/Bearing Inspection Report", category: "handover" },
  { code: "HO-008", title: "Spalling/Concrete Condition Report", category: "handover" },
];

const DEMO_STATUSES = ["APPROVED", "APPROVED", "IN_REVIEW", "DRAFT", "ISSUED", "APPROVED", "IN_REVIEW", "DRAFT", "DRAFT", "APPROVED"];

async function main() {
  console.log("Seeding SiteForge AI database...\n");

  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.changeItem.deleteMany();
  await prisma.constraint.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.document.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: { email: u.email, name: u.name, password: hash, role: u.role },
    });
    users.push(user);
    console.log(`  User: ${user.email} (${user.role})`);
  }

  const projectMap = {};
  for (const p of PROJECTS) {
    const project = await prisma.project.create({ data: p });
    projectMap[project.code] = project;
    console.log(`  Project: ${project.code} — ${project.name}`);
  }

  for (const user of users) {
    for (const project of Object.values(projectMap)) {
      await prisma.projectMember.create({
        data: { userId: user.id, projectId: project.id, role: user.role },
      });
    }
  }
  console.log("  Project memberships assigned");

  for (const c of CONSTRAINTS) {
    const project = projectMap[c.projectCode];
    if (!project) continue;
    await prisma.constraint.create({
      data: { projectId: project.id, category: c.category, title: c.title, severity: c.severity, status: c.status, owner: c.owner },
    });
  }
  console.log(`  Constraints: ${CONSTRAINTS.length} created`);

  for (const ch of CHANGES) {
    const project = projectMap[ch.projectCode];
    if (!project) continue;
    await prisma.changeItem.create({
      data: { projectId: project.id, type: ch.type, reference: ch.reference, title: ch.title, value: ch.value || null, status: ch.status },
    });
  }
  console.log(`  Change items: ${CHANGES.length} created`);

  const proj1 = projectMap["BR-01"];
  let docCount = 0;
  for (let i = 0; i < DOCUMENTS.length; i++) {
    const d = DOCUMENTS[i];
    await prisma.document.create({
      data: { projectId: proj1.id, category: d.category, code: d.code, title: d.title, status: i < DEMO_STATUSES.length ? DEMO_STATUSES[i] : "DRAFT", version: 1 },
    });
    docCount++;
  }
  console.log(`  Documents: ${docCount} created for BR-01`);

  for (const cl of CHECKLISTS) {
    const project = projectMap[cl.projectCode];
    if (!project) continue;
    const checklist = await prisma.checklist.create({
      data: { projectId: project.id, title: cl.title, type: cl.type },
    });
    for (let i = 0; i < cl.items.length; i++) {
      await prisma.checklistItem.create({
        data: { checklistId: checklist.id, text: cl.items[i], sortOrder: i, checked: i < 3 },
      });
    }
  }
  console.log(`  Checklists: ${CHECKLISTS.length} created`);

  console.log("\nSeed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
