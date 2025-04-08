declare module 'pdf-lib' {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    embedFont(font: StandardFonts): Promise<PDFFont>;
    addPage(size: [number, number]): PDFPage;
    save(): Promise<Uint8Array>;
    load: any;
  }

  export class PDFPage {
    getSize(): { width: number; height: number };
    getHeight(): number;
    getWidth(): number;
    drawText(text: string, options: {
      x: number;
      y: number;
      size: number;
      font: PDFFont;
      color: { r: number; g: number; b: number };
    }): void;
  }

  export class PDFFont {
    widthOfTextAtSize(text: string, size: number): number;
  }

  export enum StandardFonts {
    TimesRoman = 'Times-Roman',
    TimesRomanBold = 'Times-Bold',
    TimesRomanItalic = 'Times-Italic',
    TimesRomanBoldItalic = 'Times-BoldItalic',
    Helvetica = 'Helvetica',
    HelveticaBold = 'Helvetica-Bold',
    HelveticaOblique = 'Helvetica-Oblique',
    HelveticaBoldOblique = 'Helvetica-BoldOblique',
    Courier = 'Courier',
    CourierBold = 'Courier-Bold',
    CourierOblique = 'Courier-Oblique',
    CourierBoldOblique = 'Courier-BoldOblique',
    Symbol = 'Symbol',
    ZapfDingbats = 'ZapfDingbats'
  }

  export function rgb(r: number, g: number, b: number): { r: number; g: number; b: number };
} 