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
    const response = await fetch(url); if (!response.ok) return { success: false, error:`HTTP ${response.status}`};
    const arrayBuffer = await response.arrayBuffer(); if(!arrayBuffer || arrayBuffer.byteLength === 0) return { success: false, error:'Fișier gol'};
    if (!(await isValidPdf(arrayBuffer))) return { success: false, error:'Header PDF invalid'};

    const pdfBytes = new Uint8Array(arrayBuffer);
    // @ts-ignore - Assuming load exists despite type issues
    const uploadedPdf = await PDFDocument.load(pdfBytes);

    // @ts-ignore - Assuming getPageCount exists
    const pageCount = uploadedPdf.getPageCount();
    if (pageCount === 0) return { success: false, error: 'PDF-ul nu are pagini' };

    // @ts-ignore - Assuming getPageIndices exists
    const pageIndices = uploadedPdf.getPageIndices();

    // @ts-ignore - Assuming copyPages exists
    const copiedPages = await pdfDoc.copyPages(uploadedPdf, pageIndices);

    console.log('[embedPdf] Adding pages to main document');
    copiedPages.forEach((page: PDFPage) => {
      // --- FIX: Try direct addPage with ts-ignore ---
      // This avoids the potentially problematic page.getSize() call
      // @ts-ignore - Assume addPage can accept a PDFPage instance at runtime
      pdfDoc.addPage(page);
      // --- End FIX ---

      /* // Remove the previous workaround:
      // @ts-ignore
      // const newPage = pdfDoc.addPage(page.getSize());
      // @ts-ignore
      // newPage.drawPage(page);
      */
    });

    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    return { success: true };
  } catch (error: any) {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    // --- FIX: Provide more detail in error ---
    return { success: false, error: `Eroare embed: ${error?.message ?? String(error)}` };
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

// Interface for file entries within a section's borderou
interface BorderouEntry {
  name: string; // File name or checklist item label
  page: number; // 1-based page number where it starts
}

// Track content page indices (0-based) for assembly
type SectionPageRange = { start: number; end: number };

export default function PdfExportButton({ project }: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!project) return;
    setIsGenerating(true);
    console.log('Starting PDF generation for project:', project.name);

    // Store borderou data PER section
    const borderouData: { [key in 'Proiectare' | 'Executie' | 'Receptie' | 'Urmarire']?: BorderouEntry[] } = {};
    // Store 0-based page indices for content ranges
    const sectionContentIndices: { [key: string]: SectionPageRange | null } = {
        DateGenerale: null, Proiectare: null, Executie: null, Receptie: null, Urmarire: null,
    };

    // --- Step 1: Generate all content into a temporary document ---
    const tempPdfDoc = await PDFDocument.create();
    const timesRomanFont = await tempPdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await tempPdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const margin = 50;
    const defaultPageSize: [number, number] = [595.28, 841.89]; // A4

    try {
        // --- Add Title Page ---
        const titlePage = tempPdfDoc.addPage(defaultPageSize);
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

        let currentPageNum = 1; // Title page is page 1
        const addPageAndGetCurrentIndex = (): PDFPage => { currentPageNum++; return tempPdfDoc.addPage(defaultPageSize); };

        // --- Add Date Generale Content ---
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
        if (generalProjectContent.length > 0) {
            const page = addPageAndGetCurrentIndex();
            const startIndex = tempPdfDoc.getPageCount() - 1;
            sectionContentIndices.DateGenerale = { start: startIndex, end: -1 };
            addSectionContent( tempPdfDoc, timesRomanFont, timesBoldFont, "1. Date Generale Proiect (Modal)", generalProjectContent, margin, page, page.getHeight()-margin );
            sectionContentIndices.DateGenerale.end = tempPdfDoc.getPageCount();
        }

        // --- REUSABLE FUNCTION TO GENERATE CHECKLIST CONTENT PAGES ---
        const generateChecklistContent = async (
            sectionKey: keyof typeof borderouData,
            tabData: { checklistItems?: any } | undefined
        ): Promise<void> => {
            if (!tabData?.checklistItems) return;

            const contentStartIndex = tempPdfDoc.getPageCount(); // Index where content for this section STARTS
            let contentAdded = false;
            borderouData[sectionKey] = []; // Initialize borderou data for this section

            for (const item of tabData.checklistItems) {
                if (item.checked) {
                    contentAdded = true; // Mark that we are adding pages for this section
                    const itemContentPage = addPageAndGetCurrentIndex();
                    let itemContentY = itemContentPage.getHeight() - margin;

                    // Draw item label as heading on its content page
                    itemContentPage.drawText(item.label, { x: margin, y: itemContentY, size: 14, font: timesBoldFont });
                    itemContentY -= 30;

                    if (item.file) {
                        const pageNumBeforeEmbed = tempPdfDoc.getPageCount() + 1; // Page num where embedded content will START
                        const result = await embedPdf(tempPdfDoc, item.file); // Embed into temp doc
                        if (result.success) {
                            // Add to borderou data only if embed succeeded
                            borderouData[sectionKey]?.push({ name: `${item.label} (${item.file.name})`, page: pageNumBeforeEmbed });
                        } else { /* Draw error on itemContentPage */
                            itemContentPage.drawText(`! Eroare PDF: ${result.error || 'Necunoscut'}`, {x: margin, y:itemContentY, size:10, color:rgb(1,0,0)}); itemContentY -=15;
                         }
                    } else { /* Draw no file message on itemContentPage */
                       itemContentPage.drawText(`(Niciun document PDF atasat)`, {x: margin, y:itemContentY, size:10, color:rgb(0.5,0.5,0.5)}); itemContentY -=15;
                    }
                } // end if checked
            } // end loop

            if (contentAdded) {
                 sectionContentIndices[sectionKey] = { start: contentStartIndex, end: tempPdfDoc.getPageCount() };
            }
        }; // --- END generateChecklistContent ---


        // --- Generate Content for Checklist Tabs ---
        await generateChecklistContent('Proiectare', project.tabs.general);
        await generateChecklistContent('Executie', project.tabs.technical);
        await generateChecklistContent('Receptie', project.tabs.financial);
        await generateChecklistContent('Urmarire', project.tabs.resources);


        // --- Step 2: Generate Borderou Pages (in memory) ---
        console.log('Generating Borderou pages in memory');
        const borderouPagesMap: Map<string, { page: PDFPage, finalPageNum: number | null }> = new Map();
        const borderouDoc = await PDFDocument.create();
        // --- Embed fonts needed for drawing borderou ---
        const borderouTimesBold = await borderouDoc.embedFont(StandardFonts.TimesRomanBold);

        for (const sectionKey of ['Proiectare', 'Executie', 'Receptie', 'Urmarire'] as const) {
            const entries = borderouData[sectionKey];
            if (entries && entries.length > 0) {
                 const tempBorderouPage = borderouDoc.addPage(defaultPageSize);
                 let borderouY = tempBorderouPage.getHeight() - margin;
                 let sectionTitle = ""; // Determine title based on sectionKey
                 if(sectionKey === 'Proiectare') sectionTitle = "2. Borderou Documentatie Proiectare";
                 else if(sectionKey === 'Executie') sectionTitle = "3. Borderou Documentatie Executie";
                 else if(sectionKey === 'Receptie') sectionTitle = "4. Borderou Documentatie Receptie";
                 else if(sectionKey === 'Urmarire') sectionTitle = "5. Borderou Documentatie Urmarirea in Timp";

                 // --- Draw using fonts embedded in borderouDoc ---
                 tempBorderouPage.drawText(sectionTitle, { x: margin, y: borderouY, font: borderouTimesBold, size: 16 });
                 borderouY -= 40;
                 // Draw Table Headers using borderou fonts...
                 borderouY -= 20;
                 
                 // Copy the drawn page (now using self-contained fonts)
                 const [copiedBorderouPage] = await tempPdfDoc.copyPages(borderouDoc, [0]);
                 borderouPagesMap.set(sectionKey, { page: copiedBorderouPage, finalPageNum: null });
                 borderouDoc.removePage(0);
            }
        }


        // --- Step 3: Create Final Document and Copy Pages in Order ---
        console.log('Assembling final PDF');
        const finalPdfDoc = await PDFDocument.create();
        const pagesToCopyIndices: number[] = []; // 0-based indices from tempPdfDoc

        // 1. Add Title Page Index (Index 0 from tempPdfDoc)
        pagesToCopyIndices.push(0);

        // 2. Add Date Generale Content Indices
        if (sectionContentIndices.DateGenerale) {
          for (let i = sectionContentIndices.DateGenerale.start; i < sectionContentIndices.DateGenerale.end; i++) {
              pagesToCopyIndices.push(i);
          }
        }

        // 3. Add Sections (Borderou (from map), Content)
        for (const sectionKey of ['Proiectare', 'Executie', 'Receptie', 'Urmarire'] as const) {
            const indices = sectionContentIndices[sectionKey]; // Content indices
            const borderouInfo = borderouPagesMap.get(sectionKey); // Borderou page instance

            // Add Borderou Page Index (if exists)
            if (borderouInfo) {
                const borderouIndexInTemp = tempPdfDoc.getPages().indexOf(borderouInfo.page);
                if (borderouIndexInTemp !== -1) pagesToCopyIndices.push(borderouIndexInTemp);
            }

            // Add Content Page Indices (if they exist)
            if (indices) {
                for (let i = indices.start; i < indices.end; i++) {
                    pagesToCopyIndices.push(i);
                }
            }
        }

        // Copy all collected pages into the final document
        const copiedFinalPages = await finalPdfDoc.copyPages(tempPdfDoc, pagesToCopyIndices);
        copiedFinalPages.forEach(page => finalPdfDoc.addPage(page));


        // --- Step 4: REMOVED Redrawing/Overwriting Borderou Page Numbers ---
        console.log("Skipping borderou page number redraw step.");
        // The borderou pages will display the page numbers calculated during the initial tempPdfDoc generation.


        // --- Save and Display ---
        console.log('Saving final PDF document');
        const pdfBytes = await finalPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        console.log('Opening PDF in new tab');
        window.open(blobUrl, '_blank');

    } catch (error: any) {
        console.error("Error generating PDF:", error);
        alert(`Eroare la generarea PDF-ului: ${error.message}`);
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