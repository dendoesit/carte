import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Project } from "@/types/Project";
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';

interface PdfExportButtonProps {
  project: Project;
}

// --- Helper Functions ---

function removeAllDiacritics(str: string): string {
        if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const formatDate = (date: string | undefined | null): string => {
    if (!date) return '';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) { return date; }
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
          console.warn("[PdfExportButton] formatDate: Invalid date value:", date);
          return 'Data Invalida';
      }
      return parsedDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("[PdfExportButton] formatDate error:", date, e);
        return 'Eroare Data';
    }
};

const addWrappedText = (
  page: PDFPage,
        text: string, 
        x: number, 
        y: number, 
        maxWidth: number, 
        fontSize: number, 
  font: PDFFont
): number => { // Return the updated Y coordinate
        if (!text) return y;
        const textStr = removeAllDiacritics(text);
        
        const words = textStr.split(' ');
        let line = '';
        let currentY = y;
        
        words.forEach(word => {
          const testLine = line + word + ' ';
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && line.length > 0) {
      page.drawText(line.trim(), {
        x, y: currentY, size: fontSize, font: font, color: rgb(0, 0, 0),
            });
            line = word + ' ';
      currentY -= fontSize * 1.5; // Adjust line height factor if needed
          } else {
            line = testLine;
          }
        });
        
        if (line.length > 0) {
          page.drawText(line.trim(), { 
      x, y: currentY, size: fontSize, font: font, color: rgb(0, 0, 0),
    });
    // Return Y below the last line drawn
    return currentY - fontSize * 1.5;
  }
  // If no text was drawn (e.g., empty input), return original Y
  return y;
};


      const isValidPdf = async (arrayBuffer: ArrayBuffer): Promise<boolean> => {
        try {
          const bytes = new Uint8Array(arrayBuffer);
      const header = new TextDecoder().decode(bytes.slice(0, 5)); // Check first 5 bytes for %PDF-
          if (!header.startsWith('%PDF-')) {
        console.error('[isValidPdf] Invalid PDF header:', header);
            return false;
          }
      // Optional: Basic sanity check on file size?
      if (bytes.length < 20) { // Arbitrary small size check
          console.error('[isValidPdf] PDF file too small.');
            return false;
          }
      // Avoid full parsing here for speed, rely on embedPdf's load
      return true;
        } catch (error) {
      console.error('[isValidPdf] PDF validation failed:', error);
          return false;
        }
      };
      
      const getFileUrl = async (fileOrUrl: any): Promise<string | null> => {
    console.log('[getFileUrl] Input:', fileOrUrl);
        if (!fileOrUrl) return null;
    if (typeof fileOrUrl === 'string') return fileOrUrl;
    if (fileOrUrl.url && typeof fileOrUrl.url === 'string') return fileOrUrl.url;
    if (fileOrUrl.path && typeof fileOrUrl.path === 'string') return fileOrUrl.path;
    if (fileOrUrl instanceof File || (fileOrUrl.type && fileOrUrl.size && fileOrUrl.name)) {
        const blobUrl = URL.createObjectURL(fileOrUrl);
        console.log('[getFileUrl] Created Blob URL:', blobUrl);
        return blobUrl;
    }
    console.error('[getFileUrl] Unable to get URL from:', fileOrUrl);
        return null;
      };
      
// --- Modified embedPdf to accept pdfDoc ---
const embedPdf = async (pdfDoc: PDFDocument, fileOrUrl: any): Promise<{ success: boolean; error?: string }> => {
  let url: string | null = null;
  try {
    url = await getFileUrl(fileOrUrl); if (!url) return { success: false, error:'...'};
    const response = await fetch(url); if (!response.ok) return { success: false, error:'...'};
    const arrayBuffer = await response.arrayBuffer(); if(!arrayBuffer || arrayBuffer.byteLength === 0) return { success: false, error:'...'};
    if (!(await isValidPdf(arrayBuffer))) return { success: false, error:'...'};

    const pdfBytes = new Uint8Array(arrayBuffer);
    // @ts-ignore
    const uploadedPdf = await PDFDocument.load(pdfBytes);

    // @ts-ignore
    const pageCount = uploadedPdf.getPageCount();
    if (pageCount === 0) return { success: false, error: 'PDF-ul nu are pagini' };
    // @ts-ignore
    const pageIndices = uploadedPdf.getPageIndices();
    console.log('[embedPdf] Copying pages:', pageIndices);
    // @ts-ignore
    const copiedPages = await pdfDoc.copyPages(uploadedPdf, pageIndices);

    console.log('[embedPdf] Adding pages to main document');
    copiedPages.forEach((page: PDFPage) => {
      // @ts-ignore
      const newPage = pdfDoc.addPage(page.getSize());
      // @ts-ignore
      newPage.drawPage(page);

      // @ts-ignore
      // pdfDoc.addPage(page);
    });

    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    return { success: true };
  } catch (error: any) {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    return { success: false, error: `Eroare embed: ${error.message}` };
  }
};

// --- Modified addSectionContent to accept margin ---
const addSectionContent = (
  pdfDoc: PDFDocument,
  timesRomanFont: PDFFont,
  timesBoldFont: PDFFont,
        title: string,
        content: Array<{ label: string; value: string }>,
  margin: number,
  existingPage?: PDFPage,
  startCurrentY?: number
): { page: PDFPage, currentY: number } => {
   let page = existingPage || pdfDoc.addPage([595.28, 841.89]);
   let currentY = startCurrentY || page.getHeight() - margin;
   const contentWidth = page.getWidth() - (margin * 2);

   if (title) {
     page.drawText(title, { x: margin, y: currentY, size: 16, font: timesBoldFont, color: rgb(0, 0, 0) });
     currentY -= 30;
   }
        
        for (const item of content) {
     if (currentY < 60) {
       page = pdfDoc.addPage([595.28, 841.89]);
       currentY = page.getHeight() - margin;
     }
     if (item.value !== undefined && item.value !== null && item.value !== '' && item.value !== '-') {
       page.drawText(item.label, { x: margin, y: currentY, size: 12, font: timesBoldFont, color: rgb(0, 0, 0) });
       currentY = addWrappedText(page, item.value, margin + 150, currentY, contentWidth - 150, 12, timesRomanFont);
     }
   }
   return { page, currentY };
};

interface TocEntry {
  level: 1 | 2; // 1 for main sections, 2 for files/checklist items
  name: string;
  page: number; // 1-based page number
}

export default function PdfExportButton({ project }: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!project) return;
    setIsGenerating(true);
    console.log('Starting PDF generation for project:', project.name);

    const tocEntries: TocEntry[] = [];

    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const margin = 50;
      const defaultPageSize: [number, number] = [595.28, 841.89]; // A4 in points

      // --- 1. Title Page ---
      console.log('Adding Title Page');
      // @ts-ignore
      const titlePage = pdfDoc.addPage(defaultPageSize);
      const { width: pageWidth, height: pageHeight } = titlePage.getSize();
      const titleText = 'Cartea Tehnica a Constructiei';
      const titleFontSize = 24;
      const titleWidth = timesBoldFont.widthOfTextAtSize(titleText, titleFontSize);
      titlePage.drawText(titleText, {
        x: (pageWidth - titleWidth) / 2,
        y: pageHeight / 2, // Center vertically
              font: timesBoldFont,
        size: titleFontSize,
              color: rgb(0, 0, 0),
            });
      const projectNameText = removeAllDiacritics(project.name || 'Proiect Fara Nume');
      const projectNameFontSize = 16;
      const projectNameWidth = timesRomanFont.widthOfTextAtSize(projectNameText, projectNameFontSize);
      titlePage.drawText(projectNameText, {
        x: (pageWidth - projectNameWidth) / 2,
        y: pageHeight / 2 - 40, // Below main title
        font: timesRomanFont,
        size: projectNameFontSize,
        color: rgb(0.2, 0.2, 0.2),
      });

      // --- GENERATE ALL CONTENT PAGES ---
      let currentPageNum = 1; // Title page is page 1
      const addPageAndIncrement = (): PDFPage => { currentPageNum++; return pdfDoc.addPage(defaultPageSize); };

      // --- 2. Section: Date Generale ---
      console.log('Adding General Project Data section');
      const generalProjectContent = [
        { label: 'Denumire conf AC:', value: project.constructionName || '-' },
        { label: 'Localizare (Obiectiv):', value: project.address || '-' },
        { label: 'Investitor (Nume):', value: project.beneficiary || '-' },
        { label: 'Investitor (Adresa):', value: project.investorAddress || '-' },
        { label: 'Investitor (Judet):', value: project.investorCounty || '-' },
        { label: 'Autorizatie (Numar):', value: project.authNumber || '-' },
        { label: 'Autorizatie (Data):', value: formatDate(project.authDate) },
        { label: 'Autorizatie (Termen):', value: formatDate(project.authDeadline) },
        { label: 'Notificare ISC (Numar):', value: project.iscNoticeNumber || '-' },
        { label: 'Notificare ISC (Data):', value: formatDate(project.iscNoticeDate) },
        { label: 'Data Receptie Lucrari:', value: formatDate(project.receptionDate) },
        { label: 'Adresa Santier:', value: project.siteAddress || '-' },
        { label: 'Proiectant:', value: project.designer || '-' },
        { label: 'Constructor:', value: project.builder || '-' },
        { label: 'Descriere Generala:', value: project.description || '-' }, // Top-level description if exists
      ].filter(item => item.value && item.value !== '-'); // Filter out empty/default
      if (generalProjectContent.length > 0) { // Only add if content exists
          const generalContentPage = addPageAndIncrement();
          tocEntries.push({ level: 1, name: '1. Date Generale Proiect (Modal)', page: currentPageNum });
          let generalContentY = generalContentPage.getHeight() - margin;
          addSectionContent( pdfDoc, timesRomanFont, timesBoldFont, "", generalProjectContent, margin, generalContentPage, generalContentY );
          // @ts-ignore
          currentPageNum = pdfDoc.getPageCount(); // Update page count
      }

      // --- REUSABLE FUNCTION FOR CHECKLIST SECTIONS ---
      const addChecklistSection = async (
          sectionIndex: number,
          sectionKey: 'general' | 'technical' | 'financial' | 'resources',
          sectionFullName: string
      ): Promise<boolean> => {
          console.log(`Adding ${sectionFullName} section`);
          const tabData = project.tabs[sectionKey];
          let sectionAdded = false;

          if (tabData?.checklistItems && tabData.checklistItems.some(item => item.checked)) {
              const sectionTitle = `${sectionIndex}. ${sectionFullName}`;
              const titlePage = addPageAndIncrement();
              sectionAdded = true;
              tocEntries.push({ level: 1, name: sectionTitle, page: currentPageNum });
              titlePage.drawText(sectionTitle, { x: margin, y: titlePage.getHeight() - margin, size: 18, font: timesBoldFont, color: rgb(0,0,0) });

              for (const item of tabData.checklistItems) {
                  if (item.checked) {
                      let itemContentPage = addPageAndIncrement();
                      tocEntries.push({ level: 2, name: item.label, page: currentPageNum });
                      let itemContentY = itemContentPage.getHeight() - margin;
                      itemContentPage.drawText(item.label, { x: margin, y: itemContentY, size: 14, font: timesBoldFont, color: rgb(0, 0, 0) });
                      itemContentY -= 30;

                      if (item.file) {
                          // @ts-ignore
                          const pageNumBeforeEmbed = pdfDoc.getPageCount() + 1;
                          const result = await embedPdf(pdfDoc, item.file);
                          // @ts-ignore
                          currentPageNum = pdfDoc.getPageCount();
                          if (result.success) {
                              tocEntries.push({ level: 2, name: `   - ${item.file.name}`, page: pageNumBeforeEmbed });
                          } else {
                              console.error(`Failed embed for ${item.label}: ${result.error}`);
                              // Add error message BELOW sub-heading on the item's content page
                              if (itemContentY < 60) { itemContentPage = addPageAndIncrement(); itemContentY = itemContentPage.getHeight() - margin; }
                              itemContentPage.drawText(`! Eroare PDF: ${removeAllDiacritics(result.error || 'Necunoscut')}`, { x: margin, y: itemContentY, size: 10, font: timesRomanFont, color: rgb(1, 0, 0) });
                              itemContentY -= 15;
                          }
                      } else {
                          // No file attached - add note below sub-heading
                          if (itemContentY < 60) { itemContentPage = addPageAndIncrement(); itemContentY = itemContentPage.getHeight() - margin; }
                          itemContentPage.drawText(`(Niciun document PDF atasat)`, { x: margin, y: itemContentY, size: 10, font: timesRomanFont, color: rgb(0.5, 0.5, 0.5) });
                          itemContentY -= 15;
                      }
                  } // end if checked
              } // end loop
          } // end if checklist items exist & checked
          return sectionAdded;
      };

      // --- Call addChecklistSection for all tabs ---
      let currentSectionIndex = 1; // Start after "Date Generale"

      const proiectareAdded = await addChecklistSection(currentSectionIndex + 1, 'general', 'Documentatie Proiectare');
      if (proiectareAdded) currentSectionIndex++;

      const executieAdded = await addChecklistSection(currentSectionIndex + 1, 'technical', 'Documentatie Executie');
      if (executieAdded) currentSectionIndex++;

      const receptieAdded = await addChecklistSection(currentSectionIndex + 1, 'financial', 'Documentatie Receptie');
      if (receptieAdded) currentSectionIndex++;

      const urmarireAdded = await addChecklistSection(currentSectionIndex + 1, 'resources', 'Documentatie Urmarirea in Timp');
      if (urmarireAdded) currentSectionIndex++;

      // --- Generate and Insert Borderou General Page ---
      console.log('Generating Borderou General page');
      if (tocEntries.length > 0) {
          // @ts-ignore
          const borderouPage = pdfDoc.insertPage(1, defaultPageSize);
          for (let i = 0; i < tocEntries.length; i++) { tocEntries[i].page++; }

          let borderouY = borderouPage.getHeight() - margin;
          const tableX = margin;
          const tableWidth = borderouPage.getWidth() - margin * 2;
          const nameColWidth = tableWidth * 0.85; // More space for name
          const pageColWidth = tableWidth * 0.15;
          const pageColX = tableX + nameColWidth;
          const fontSize = 10;
          const lineHeight = 15; // Base line height

          // Borderou Title
          borderouPage.drawText('Borderou General / Cuprins', { x: margin, y: borderouY, font: timesBoldFont, size: 14 });
          borderouY -= 30;

          // Table Headers
          borderouPage.drawText('Nume', { x: tableX, y: borderouY, font: timesBoldFont, size: fontSize });
          borderouPage.drawText('Pagina', { x: pageColX, y: borderouY, font: timesBoldFont, size: fontSize });
          borderouY -= 5;
          borderouPage.drawLine({ start: { x: tableX, y: borderouY }, end: { x: tableX + tableWidth, y: borderouY }, thickness: 0.5 });
          borderouY -= lineHeight;

          // Table Rows
          for (const entry of tocEntries) {
               // Check for page overflow BEFORE drawing
               if (borderouY < margin + lineHeight) {
                   console.warn("Borderou content overflow - requires pagination logic.");
                   break; // Stop drawing if overflow occurs
               }

               const isMainSection = entry.level === 1;
               const currentFont = isMainSection ? timesBoldFont : timesRomanFont;
               const indent = isMainSection ? 0 : 10; // Indent sub-items (level 2)

               // --- Draw Name (Left Aligned) ---
               // Basic Truncation (replace with wrapping if essential)
               let displayName = entry.name;
               let textWidth = currentFont.widthOfTextAtSize(displayName, fontSize);
               while (textWidth > nameColWidth - indent && displayName.length > 10) {
                  displayName = displayName.substring(0, displayName.length - 4) + "..."; // Simple truncation
                  textWidth = currentFont.widthOfTextAtSize(displayName, fontSize);
               }
               borderouPage.drawText(displayName, {
                   x: tableX + indent,
                   y: borderouY,
                   font: currentFont,
                   size: fontSize,
                   color: rgb(0,0,0),
                   maxWidth: nameColWidth - indent // Good practice, though we truncated
               });

               // --- Draw Page Number (Right Aligned) ---
               const pageNumStr = String(entry.page);
               const pageNumWidth = timesRomanFont.widthOfTextAtSize(pageNumStr, fontSize); // Use consistent font for width calc?
               borderouPage.drawText(pageNumStr, {
                   x: pageColX + pageColWidth - pageNumWidth, // Calculate right alignment start X
                   y: borderouY,
                   font: timesRomanFont, // Use standard font for numbers
                   size: fontSize,
                   color: rgb(0,0,0)
               });

               borderouY -= lineHeight; // Move Y for next line
          }
      }


      // --- Save and Display ---
      console.log('Saving PDF document');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      console.log('Opening PDF in new tab');
      window.open(blobUrl, '_blank');

    } catch (error) {
      console.error('Error generating PDF:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Eroare la generarea PDF-ului: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  }; // End generatePDF
  
  return (
    <Button onClick={generatePDF} disabled={isGenerating} variant="outline">
      {isGenerating ? 'Se generează...' : <><Download className="mr-2 h-4 w-4" />Descarcă PDF</>}
    </Button>
  );
} 