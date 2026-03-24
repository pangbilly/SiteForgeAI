// Shared helpers for all document generators
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  PageBreak,
  PageNumber,
} from 'docx';

// Border and margin constants
const B = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' };
export const BR = { top: B, bottom: B, left: B, right: B };
export const CM = { top: 60, bottom: 60, left: 100, right: 100 };
export const NAVY = '1F4E79';
export const BLUE = '2E75B6';

// Table header cell
export function hdr(txt: string, w: number, fill: string = NAVY): TableCell {
  return new TableCell({
    borders: BR,
    width: { size: w, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: CM,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: txt,
            bold: true,
            color: 'FFFFFF',
            font: 'Arial',
            size: 18,
          }),
        ],
      }),
    ],
  });
}

interface CellOptions {
  fill?: string;
  bold?: boolean;
  color?: string;
  italics?: boolean;
  span?: number;
}

// Table cell
export function cel(
  txt: string | string[],
  w: number,
  opts: CellOptions = {}
): TableCell {
  const shading = opts.fill
    ? { fill: opts.fill, type: ShadingType.CLEAR }
    : undefined;
  const paras: Paragraph[] = [];

  if (Array.isArray(txt)) {
    txt.forEach((t) =>
      paras.push(
        new Paragraph({
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: t,
              font: 'Arial',
              size: 18,
              bold: !!opts.bold,
              color: opts.color || '000000',
            }),
          ],
        })
      )
    );
  } else {
    paras.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: txt || '',
            font: 'Arial',
            size: 18,
            bold: !!opts.bold,
            color: opts.color || '000000',
            italics: !!opts.italics,
          }),
        ],
      })
    );
  }

  return new TableCell({
    borders: BR,
    width: { size: w, type: WidthType.DXA },
    shading,
    margins: CM,
    columnSpan: opts.span || 1,
    children: paras,
  });
}

// Heading 1
export function h1(txt: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun(txt)],
  });
}

// Heading 2
export function h2(txt: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun(txt)],
  });
}

// Heading 3
export function h3(txt: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun(txt)],
  });
}

interface ParagraphOptions {
  after?: number;
  bold?: boolean;
  italics?: boolean;
  color?: string;
}

// Paragraph
export function p(txt: string, opts: ParagraphOptions = {}): Paragraph {
  return new Paragraph({
    spacing: { after: opts.after || 120 },
    children: [
      new TextRun({
        text: txt,
        font: 'Arial',
        size: 20,
        bold: !!opts.bold,
        italics: !!opts.italics,
        color: opts.color || '000000',
      }),
    ],
  });
}

// Page break
export function pb(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
  });
}

// Spacing paragraph
export function sp(): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [],
  });
}

// Bullet point
export function bullet(txt: string): Paragraph {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: txt,
        font: 'Arial',
        size: 20,
      }),
    ],
  });
}

// Numbered point
export function num(txt: string): Paragraph {
  return new Paragraph({
    numbering: { reference: 'nums', level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: txt,
        font: 'Arial',
        size: 20,
      }),
    ],
  });
}

// Create a Document with header/footer and document control table
export function makeDoc(
  title: string,
  subtitle: string,
  ref: string,
  children: (Paragraph | Table)[]
): Document {
  return new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 20 } } },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 30, bold: true, font: 'Arial', color: NAVY },
          paragraph: {
            spacing: { before: 300, after: 180 },
            outlineLevel: 0,
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 24, bold: true, font: 'Arial', color: BLUE },
          paragraph: {
            spacing: { before: 200, after: 120 },
            outlineLevel: 1,
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 22, bold: true, font: 'Arial', color: '404040' },
          paragraph: {
            spacing: { before: 160, after: 100 },
            outlineLevel: 2,
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
              },
            },
          ],
        },
        {
          reference: 'nums',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                border: {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    color: NAVY,
                    space: 1,
                  },
                },
                children: [
                  new TextRun({
                    text: `BR-01 | ${ref}`,
                    font: 'Arial',
                    size: 14,
                    bold: true,
                    color: NAVY,
                  }),
                  new TextRun({
                    text: '\tDRAFT \u2013 AI Generated',
                    font: 'Arial',
                    size: 12,
                    italics: true,
                    color: '999999',
                  }),
                ],
                tabStops: [{ type: 'right', position: 9386 }],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Pang & Chiu | Bridge Remediation Programme',
                    font: 'Arial',
                    size: 12,
                    color: '999999',
                  }),
                  new TextRun({
                    text: '\tPage ',
                    font: 'Arial',
                    size: 12,
                    color: '999999',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Arial',
                    size: 12,
                    color: '999999',
                  }),
                ],
                tabStops: [{ type: 'right', position: 9386 }],
              }),
            ],
          }),
        },
        children: [
          // Document control table
          new Table({
            width: { size: 9386, type: WidthType.DXA },
            columnWidths: [2400, 6986],
            rows: [
              new TableRow({
                children: [hdr('Document', 2400), cel(title, 6986, { bold: true })],
              }),
              new TableRow({
                children: [hdr('Reference', 2400), cel(ref, 6986)],
              }),
              new TableRow({
                children: [
                  hdr('Project', 2400),
                  cel(
                    'BR-01 \u2013 Bridge Remediation Programme (BR-01 & BR-02)',
                    6986
                  ),
                ],
              }),
              new TableRow({
                children: [
                  hdr('Contract', 2400),
                  cel('Design & Build Target Cost Contract', 6986),
                ],
              }),
              new TableRow({
                children: [
                  hdr('Prepared By', 2400),
                  cel('[PM Name] \u2013 Meridian Civil Engineering', 6986),
                ],
              }),
              new TableRow({
                children: [
                  hdr('Date', 2400),
                  cel('March 2026', 6986),
                ],
              }),
              new TableRow({
                children: [
                  hdr('Status', 2400),
                  cel('DRAFT \u2013 AI Generated Starting Point', 6986, {
                    color: 'CC0000',
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          sp(),
          sp(),
          ...children,
        ],
      },
    ],
  });
}

// Save document to buffer (for file writing)
export async function save(doc: Document, path: string): Promise<number> {
  const fs = await import('fs');
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path, buf);
  return buf.length;
}

// Generate document and return as Buffer (without filesystem writes)
export async function generateDocument(
  title: string,
  subtitle: string,
  ref: string,
  children: (Paragraph | Table)[]
): Promise<Buffer> {
  const doc = makeDoc(title, subtitle, ref, children);
  const buf = await Packer.toBuffer(doc);
  return buf;
}

// Export docx types for use by generators
export {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  PageBreak,
  PageNumber,
};
