/**
 * Seed sample .docx content into existing documents.
 * Run after the main seed: node prisma/seed-docs.js
 */
const { PrismaClient } = require("@prisma/client");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageNumber,
} = require("docx");

const prisma = new PrismaClient();

const NAVY = "1F4E79";
const BLUE = "2E75B6";
const B = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const BR = { top: B, bottom: B, left: B, right: B };
const CM = { top: 60, bottom: 60, left: 100, right: 100 };

function hdr(txt, w) {
  return new TableCell({
    borders: BR, width: { size: w, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: CM,
    children: [new Paragraph({ children: [new TextRun({ text: txt, bold: true, color: "FFFFFF", font: "Arial", size: 18 })] })],
  });
}

function cel(txt, w, opts = {}) {
  return new TableCell({
    borders: BR, width: { size: w, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: CM,
    children: [new Paragraph({ children: [new TextRun({ text: txt || "", font: "Arial", size: 18, bold: !!opts.bold, color: opts.color || "000000" })] })],
  });
}

function makeDoc(title, ref, sections) {
  return new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 20 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 30, bold: true, font: "Arial", color: NAVY },
          paragraph: { spacing: { before: 300, after: 180 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Arial", color: BLUE },
          paragraph: { spacing: { before: 200, after: 120 } } },
      ],
    },
    numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: `J676 | ${ref}`, font: "Arial", size: 14, bold: true, color: NAVY })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun({ text: "Barhale / Pang & Chiu | J676 Manor Road NOS", font: "Arial", size: 12, color: "999999" })] })] }) },
      children: [
        new Table({
          width: { size: 9386, type: WidthType.DXA }, columnWidths: [2400, 6986],
          rows: [
            new TableRow({ children: [hdr("Document", 2400), cel(title, 6986, { bold: true })] }),
            new TableRow({ children: [hdr("Reference", 2400), cel(ref, 6986)] }),
            new TableRow({ children: [hdr("Project", 2400), cel("J676 \u2013 Manor Road NOS Bridge (NOS07 & NOS08)", 6986)] }),
            new TableRow({ children: [hdr("Contract", 2400), cel("FA1495 Design & Build Target Cost", 6986)] }),
            new TableRow({ children: [hdr("Date", 2400), cel("March 2026", 6986)] }),
            new TableRow({ children: [hdr("Status", 2400), cel("DRAFT \u2013 AI Generated Starting Point", 6986, { color: "CC0000", bold: true })] }),
          ],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        ...sections,
      ],
    }],
  });
}

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] }); }
function p(t) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, font: "Arial", size: 20 })] }); }
function bullet(t) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: t, font: "Arial", size: 20 })] }); }

// Document content generators per code
const DOC_CONTENT = {
  "PL-001": () => [
    h1("1. Programme Overview"),
    p("This document sets out the construction programme narrative for J676 Manor Road NOS Bridge remediation works covering NOS07 Rail Spans and NOS08 Road Span."),
    p("The programme is structured around five key phases: Mobilisation, Sewer Isolation, Road Works, Rail Works, and Handover. Critical path activities are driven by LUL/DLR possession availability and Thames Water isolation windows."),
    h2("1.1 Key Milestones"),
    bullet("Mobilisation complete: Month 2"),
    bullet("First sewer barrel isolation: Month 3"),
    bullet("Road span works commence: Month 4"),
    bullet("Rail span works commence: Month 6"),
    bullet("Sectional completion NOS08: Month 10"),
    bullet("Final handover: Month 14"),
    h1("2. Critical Path Analysis"),
    p("The critical path runs through LUL/DLR possession scheduling for NOS07 rail span works. Any delay to possession availability directly impacts programme completion."),
    h2("2.1 Key Dependencies"),
    bullet("UKPN HV cable diversions must complete before main rail span works"),
    bullet("Asbestos sludge main removal precedes barrel isolation"),
    bullet("LB Newham road closure approvals (12-week lead time) for NOS08"),
    bullet("Thames Water operational constraints on barrel isolation sequencing"),
    h1("3. Resource Strategy"),
    p("Peak workforce of 45 operatives during rail span works phase. Specialist subcontractors required for post-tensioned concrete assessment, asbestos removal, and HV cable works."),
  ],
  "PL-003": () => [
    h1("Weekly Progress Report"),
    h2("Period: Week 12"),
    p("Overall programme status: ON TRACK with risks to critical path."),
    h2("Key Achievements This Week"),
    bullet("Completed Site Investigation Phase 2 — results being analysed"),
    bullet("RAMS approved for enabling works package"),
    bullet("LUL possession schedule confirmed for Q3"),
    bullet("Asbestos R&D survey mobilised"),
    h2("Issues and Risks"),
    bullet("UKPN HV cable diversion programme slipped 2 weeks — mitigation in progress"),
    bullet("BG&E condition findings indicate additional scope — EWN-001 issued"),
    bullet("Road closure applications submitted to LB Newham — awaiting confirmation"),
    h2("Lookahead: Next Week"),
    bullet("Complete asbestos R&D survey"),
    bullet("Issue Work Package Plans for enabling works"),
    bullet("Hold progress meeting with Thames Water Operations"),
    bullet("Finalise subcontractor evaluations"),
  ],
  "HS-001": () => [
    h1("Risk Assessment and Method Statement"),
    h2("1. Scope of Works"),
    p("This RAMS covers enabling works for NOS07 Rail Spans including site establishment, temporary works installation, and preparatory activities within the LUL/DLR corridor."),
    h2("2. Hazard Identification"),
    bullet("Working adjacent to live railway — LUL Jubilee and DLR lines"),
    bullet("Working at height — scaffold and MEWP operations"),
    bullet("Asbestos-containing materials — sludge main removal"),
    bullet("HV electrical cables — UKPN exclusion zones"),
    bullet("Confined space entry — sewer barrel internals"),
    bullet("Manual handling — structural steel and formwork"),
    h2("3. Control Measures"),
    p("All works within LUL boundary require approved Safe System of Work and current possession. Minimum 2.5m clearance from live rail maintained at all times. Asbestos works by licensed contractor only."),
    h2("4. Emergency Procedures"),
    p("Emergency assembly point at Manor Road site entrance. Nearest A&E: Newham University Hospital (2.1 miles). Emergency contact: Site Manager on 07XXX XXXXXX."),
  ],
  "HS-005": () => [
    h1("Construction Phase Plan"),
    h2("1. Project Description"),
    p("CDM 2015 compliant Construction Phase Plan for J676 Manor Road NOS Bridge remediation. Principal Contractor: Barhale Ltd."),
    h2("2. Management Structure"),
    bullet("Project Director: [Name]"),
    bullet("Project Manager: [Name]"),
    bullet("H&S Manager: [Name]"),
    bullet("CDM Coordinator: [Name]"),
    h2("3. Site Rules"),
    p("All personnel must hold valid CSCS card. Site induction mandatory before access. PPE requirements: hard hat, hi-vis, safety boots, eye protection. No lone working permitted."),
    h2("4. Key Risks"),
    bullet("Live sewer — H2S monitoring required at all times near barrels"),
    bullet("Asbestos — R&D survey before any intrusive works"),
    bullet("Rail proximity — no works within 3m of running rail without possession"),
    bullet("Post-tensioned concrete — no drilling or coring without structural engineer approval"),
  ],
  "EN-001": () => [
    h1("Construction Method Statement"),
    h2("1. Introduction"),
    p("Method statement for structural remediation of NOS07 rail spans including concrete repair, waterproofing, and bearing replacement works."),
    h2("2. Sequence of Works"),
    bullet("Phase 1: Scaffold erection and access platform installation (Week 1-2)"),
    bullet("Phase 2: Concrete breakout and preparation (Week 3-4)"),
    bullet("Phase 3: Reinforcement repair and replacement (Week 5-6)"),
    bullet("Phase 4: Concrete repair and curing (Week 7-8)"),
    bullet("Phase 5: Waterproofing application (Week 9)"),
    bullet("Phase 6: Bearing replacement (Week 10-11)"),
    bullet("Phase 7: Scaffold strip and site clearance (Week 12)"),
    h2("3. Plant and Equipment"),
    p("MEWP (cherry picker) for soffit access. Hydrodemolition unit for concrete breakout. Concrete pump for repair mortar placement."),
    h2("4. Quality Requirements"),
    p("All concrete repairs to BS EN 1504. Hold points at reinforcement inspection and pre-pour stages. Cube testing at 7 and 28 days."),
  ],
  "EN-003": () => [
    h1("Inspection & Test Plan"),
    h2("1. Purpose"),
    p("This ITP defines the inspection and testing requirements for NOS07 structural remediation works. It identifies hold points, witness points, and records required."),
    h2("2. Hold Points"),
    bullet("H1: Reinforcement inspection before concrete pour"),
    bullet("H2: Concrete cube results at 28 days"),
    bullet("H3: Waterproofing adhesion test"),
    bullet("H4: Bearing alignment check before grouting"),
    h2("3. Witness Points"),
    bullet("W1: Concrete breakout extent verification"),
    bullet("W2: Surface preparation inspection"),
    bullet("W3: Coating DFT readings"),
    h2("4. Records"),
    p("All inspection records to be compiled in QA Dossier (HO-004). Photographic records required at each hold point."),
  ],
  "CM-001": () => [
    h1("Early Warning Notice Register"),
    h2("1. Purpose"),
    p("Register of Early Warning Notices issued under NEC4 Clause 15. EWNs are issued to notify the Project Manager of any matter that could increase the total of the Prices, delay Completion, or impair the performance of the works."),
    h2("2. Active Early Warnings"),
    bullet("EWN-001: BG&E condition survey — findings significantly worse than design assumption"),
    bullet("EWN-002: Asbestos sludge main — scope of licensed removal exceeds allowance"),
    bullet("EWN-003: Post-tensioned beam restrictions — alternative fixing methodology required"),
    bullet("EWN-004: LUL possession availability — reduced access windows vs programme assumption"),
    bullet("EWN-005: HV cable diversion — UKPN programme delay impacting critical path"),
    h2("3. Risk Reduction Meetings"),
    p("Risk reduction meetings held fortnightly to review open EWNs and agree mitigation actions. Attended by PM, Commercial Manager, and Client representative."),
  ],
  "QA-001": () => [
    h1("Quality Management Plan"),
    h2("1. Quality Policy"),
    p("Barhale is committed to delivering works that meet all specified requirements first time, every time. This QMP sets out the quality management procedures for J676 Manor Road NOS Bridge."),
    h2("2. Organisation"),
    p("QA Manager reports directly to Project Director. Independent from construction management to ensure impartiality of quality assurance activities."),
    h2("3. Document Control"),
    bullet("All documents issued via project document management system"),
    bullet("Revision control with approval workflow"),
    bullet("Superseded documents clearly marked and archived"),
    h2("4. Inspection and Testing"),
    p("Inspection and Test Plans (ITPs) prepared for each work package. Hold points require formal sign-off before proceeding. Non-conformances recorded on NCR forms (QA-005)."),
  ],
  "HO-001": () => [
    h1("Health & Safety File"),
    h2("1. Introduction"),
    p("This Health & Safety File is prepared in accordance with CDM 2015 Regulation 12. It contains information relevant to the health and safety of any future construction work on or near the NOS Bridge structures."),
    h2("2. Key Residual Risks"),
    bullet("Asbestos-containing materials may remain in sludge main — specialist survey required before future intrusive works"),
    bullet("Post-tensioned concrete beams — no coring or drilling permitted without structural assessment"),
    bullet("Live sewer barrels — confined space entry procedures required for any future maintenance"),
    bullet("HV cables routed through structure — contact UKPN before any ground or structural works"),
    h2("3. As-Built Information"),
    p("As-built drawings, material certificates, and test records are contained in the QA Dossier (HO-004). BIM model updated to reflect as-constructed condition."),
  ],
  "HO-005": () => [
    h1("Stage Gate Checklist"),
    h2("Stage Gate 1 — Make Ready Complete"),
    p("This checklist confirms all prerequisites are satisfied before commencing main construction works on NOS07."),
    bullet("Site investigations and surveys complete"),
    bullet("Design basis agreed with Thames Water"),
    bullet("RAMS approved for enabling works"),
    bullet("LUL/DLR possession schedule confirmed"),
    bullet("UKPN HV cable diversion programme agreed"),
    bullet("Asbestos R&D survey results received and reviewed"),
    bullet("Construction Phase Plan approved"),
    bullet("Environmental permits and consents in place"),
    bullet("Subcontract packages tendered and evaluated"),
    bullet("Programme baseline agreed with client"),
    bullet("Cost plan approved"),
    bullet("Risk register reviewed and accepted"),
    h2("Approval"),
    p("Signed off by Project Director and Client Representative before proceeding to Stage Gate 2."),
  ],
};

async function main() {
  console.log("Seeding .docx content into documents...\n");

  const project = await prisma.project.findFirst({ where: { code: "NOS07" } });
  if (!project) { console.error("NOS07 project not found"); return; }

  const codes = Object.keys(DOC_CONTENT);
  let count = 0;

  for (const code of codes) {
    const doc = await prisma.document.findFirst({
      where: { projectId: project.id, code },
    });
    if (!doc) { console.log(`  SKIP: ${code} not found`); continue; }

    const sections = DOC_CONTENT[code]();
    const docx = makeDoc(doc.title, code, sections);
    const buffer = await Packer.toBuffer(docx);

    await prisma.document.update({
      where: { id: doc.id },
      data: { content: buffer },
    });

    count++;
    console.log(`  ${code}: ${doc.title} (${buffer.length} bytes)`);
  }

  console.log(`\nSeeded ${count} documents with .docx content.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
