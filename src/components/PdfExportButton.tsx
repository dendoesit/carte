import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Project } from "@/types/Project";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useState } from "react";

interface PdfExportButtonProps {
  project: Project;
}

export default function PdfExportButton({ project }: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed fonts with Unicode support
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Function to remove ALL diacritics and special characters
      function removeAllDiacritics(str: string | undefined | null): string {
        if (!str) return '';
        
        // Create a simple mapping for Romanian characters
        const map: Record<string, string> = {
          'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
          'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
        };
        
        // Replace each character with its ASCII equivalent
        return str.split('').map(char => map[char] || char)
          .join('')
          .normalize('NFD')  // Decompose accented characters
          .replace(/[\u0300-\u036f]/g, '')  // Remove all accent marks
          .replace(/[^\x00-\x7F]/g, '');  // Remove any remaining non-ASCII characters
      }
      
      // Add title page
      const titlePage = pdfDoc.addPage([595.276, 841.890]); // A4 size
      const { width, height } = titlePage.getSize();
      
      // Title page content - using ASCII characters for the title
      titlePage.drawText('CARTEA TEHNICA', {
        x: width / 2 - timesBoldFont.widthOfTextAtSize('CARTEA TEHNICA', 36) / 2,
        y: height - 250,
        size: 36,
        font: timesBoldFont,
        color: rgb(0, 0, 0),
      });
      
      titlePage.drawText('a constructiei', {
        x: width / 2 - timesRomanFont.widthOfTextAtSize('a constructiei', 24) / 2,
        y: height - 300,
        size: 24,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Project name - remove diacritics
      const projectName = removeAllDiacritics(project.name || 'Proiect');
      titlePage.drawText(projectName, {
        x: width / 2 - timesBoldFont.widthOfTextAtSize(projectName, 28) / 2,
        y: height - 400,
        size: 28,
        font: timesBoldFont,
        color: rgb(0, 0, 0),
      });
      
      // Project details
      const detailsY = height - 500;
      const detailsX = 100;
      const details = [
        { label: 'Beneficiar:', value: removeAllDiacritics(project.beneficiary || '-') },
        { label: 'Proiectant:', value: removeAllDiacritics(project.designer || '-') },
        { label: 'Constructor:', value: removeAllDiacritics(project.builder || '-') },
        { label: 'Adresa:', value: removeAllDiacritics(project.address || '-') },
      ];
      
      details.forEach(({ label, value }, index) => {
        titlePage.drawText(label, {
          x: detailsX,
          y: detailsY - (index * 30),
          size: 12,
          font: timesBoldFont,
          color: rgb(0, 0, 0),
        });
        
        titlePage.drawText(value, {
          x: detailsX + 100,
          y: detailsY - (index * 30),
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      });
      
      // Add date at the bottom - use English month names
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
      
      titlePage.drawText(currentDate, {
        x: width / 2 - timesRomanFont.widthOfTextAtSize(currentDate, 12) / 2,
        y: 100,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Helper function to add wrapped text
      const addWrappedText = (
        page: any, 
        text: string, 
        x: number, 
        y: number, 
        maxWidth: number, 
        fontSize: number, 
        font: any
      ): number => {
        if (!text) return y;
        const textStr = removeAllDiacritics(text);
        
        const words = textStr.split(' ');
        let line = '';
        let currentY = y;
        
        words.forEach(word => {
          const testLine = line + word + ' ';
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && line.length > 0) {
            page.drawText(line, { 
              x, 
              y: currentY, 
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            line = word + ' ';
            currentY -= fontSize * 1.5;
          } else {
            line = testLine;
          }
        });
        
        if (line.length > 0) {
          page.drawText(line.trim(), { 
            x, 
            y: currentY, 
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
        
        return currentY - fontSize * 1.5;
      };
      
      // Function to check if a file is a valid PDF
      const isValidPdf = async (arrayBuffer: ArrayBuffer): Promise<boolean> => {
        try {
          // Check for PDF header
          const bytes = new Uint8Array(arrayBuffer);
          const header = new TextDecoder().decode(bytes.slice(0, 8));
          
          // PDF files start with %PDF-1.x
          if (!header.startsWith('%PDF-')) {
            console.error('Invalid PDF header:', header);
            return false;
          }
          
          // Try to parse it as a PDF
          try {
            // @ts-ignore - TypeScript doesn't recognize the load method
            await PDFDocument.load(bytes);
            return true;
          } catch (e) {
            console.error('Failed to parse PDF:', e);
            return false;
          }
        } catch (error) {
          console.error('PDF validation failed:', error);
          return false;
        }
      };
      
      // Function to get a URL from a file object or URL string
      const getFileUrl = async (fileOrUrl: any): Promise<string | null> => {
        if (!fileOrUrl) return null;
        
        // If it's a string, assume it's already a URL
        if (typeof fileOrUrl === 'string') {
          return fileOrUrl;
        }
        
        // If it has a 'url' property, use that
        if (fileOrUrl.url && typeof fileOrUrl.url === 'string') {
          return fileOrUrl.url;
        }
        
        // If it has a 'path' property, use that
        if (fileOrUrl.path && typeof fileOrUrl.path === 'string') {
          return fileOrUrl.path;
        }
        
        // If it's a File object, create a URL for it
        if (fileOrUrl instanceof File || 
            (fileOrUrl.type && fileOrUrl.size && fileOrUrl.name)) {
          return URL.createObjectURL(fileOrUrl);
        }
        
        // If it has a toString method, try that
        if (typeof fileOrUrl.toString === 'function') {
          const str = fileOrUrl.toString();
          if (str !== '[object Object]') {
            return str;
          }
        }
        
        console.error('Unable to get URL from:', fileOrUrl);
        return null;
      };
      
      // Function to fetch and embed a PDF
      const embedPdf = async (fileOrUrl: any): Promise<{ success: boolean; error?: string }> => {
        if (!fileOrUrl) return { success: false, error: 'No file or URL provided' };
        
        try {
          // Get a usable URL
          const url = await getFileUrl(fileOrUrl);
          if (!url) {
            return { success: false, error: 'Could not get URL from file object' };
          }
          
          console.log('Fetching PDF from URL:', url);
          const response = await fetch(url);
          
          if (!response.ok) {
            return { 
              success: false, 
              error: `HTTP error: ${response.status} ${response.statusText}` 
            };
          }
          
          const contentType = response.headers.get('content-type');
          console.log('Content-Type:', contentType);
          
          const arrayBuffer = await response.arrayBuffer();
          console.log('File fetched, size:', arrayBuffer.byteLength);
          
          if (arrayBuffer.byteLength === 0) {
            return { success: false, error: 'File is empty' };
          }
          
          // Validate that it's actually a PDF
          const valid = await isValidPdf(arrayBuffer);
          if (!valid) {
            return { success: false, error: 'File is not a valid PDF' };
          }
          
          const pdfBytes = new Uint8Array(arrayBuffer);
          
          // Load the PDF document
          console.log('Loading PDF document');
          // @ts-ignore - TypeScript doesn't recognize the load method
          const uploadedPdf = await PDFDocument.load(pdfBytes);
          const pageCount = uploadedPdf.getPageCount();
          console.log('PDF loaded, pages:', pageCount);
          
          if (pageCount === 0) {
            return { success: false, error: 'PDF has no pages' };
          }
          
          // Copy all pages from the uploaded PDF
          const pageIndices = uploadedPdf.getPageIndices();
          console.log('Copying pages:', pageIndices);
          // @ts-ignore - TypeScript doesn't recognize the copyPages method
          const copiedPages = await pdfDoc.copyPages(uploadedPdf, pageIndices);
          
          // Add all pages to our document
          console.log('Adding pages to document');
          copiedPages.forEach((page: any) => {
            pdfDoc.addPage(page);
          });
          
          // Clean up if we created an object URL
          if (url.startsWith('blob:') && typeof fileOrUrl !== 'string') {
            URL.revokeObjectURL(url);
          }
          
          console.log('PDF embedded successfully');
          return { success: true };
        } catch (error) {
          console.error('Error embedding PDF:', error);
          return { 
            success: false, 
            error: `Error: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      };
      
      // Function to add a section with its PDF
      const addSectionWithPdf = async (
        title: string,
        content: Array<{ label: string; value: string }>,
        pdfFile?: any
      ): Promise<void> => {
        // Add section content
        const sectionPage = pdfDoc.addPage([595.276, 841.890]);
        let currentY = sectionPage.getHeight() - 50;
        const margin = 50;
        const contentWidth = sectionPage.getWidth() - (margin * 2);
        
        // Section title
        sectionPage.drawText(title, {
          x: margin,
          y: currentY,
          size: 16,
          font: timesBoldFont,
          color: rgb(0, 0, 0),
        });
        currentY -= 30;
        
        // Content items
        for (const item of content) {
          // Check if we need a new page
          if (currentY < 100) {
            const newPage = pdfDoc.addPage([595.276, 841.890]);
            currentY = newPage.getHeight() - 50;
          }
          
          if (item.value !== undefined && item.value !== null && item.value !== '') {
            // Label
            sectionPage.drawText(item.label, {
              x: margin,
              y: currentY,
              size: 12,
              font: timesBoldFont,
              color: rgb(0, 0, 0),
            });
            
            // Value with text wrapping
            currentY = addWrappedText(
              sectionPage, 
              item.value, 
              margin + 150, 
              currentY, 
              contentWidth - 150, 
              12, 
              timesRomanFont
            );
            
            // Space between items
            currentY -= 10;
          }
        }
        
        // Add note about attached PDF if there is one
        if (pdfFile) {
          currentY -= 20;
          
          // Try to embed the PDF
          const result = await embedPdf(pdfFile);
          
          if (result.success) {
            sectionPage.drawText('Document PDF atasat (urmeaza imediat):', {
              x: margin,
              y: currentY,
              size: 12,
              font: timesBoldFont,
              color: rgb(0, 0, 0),
            });
          } else {
            sectionPage.drawText('Eroare la incarcarea documentului PDF:', {
              x: margin,
              y: currentY,
              size: 12,
              font: timesBoldFont,
              color: rgb(1, 0, 0), // Red color
            });
            
            currentY -= 20;
            sectionPage.drawText(removeAllDiacritics(result.error || 'Motiv necunoscut'), {
              x: margin,
              y: currentY,
              size: 12,
              font: timesRomanFont,
              color: rgb(1, 0, 0), // Red color
            });
            
            // Add file info for debugging
            currentY -= 20;
            const fileInfo = typeof pdfFile === 'string' 
              ? pdfFile 
              : `File object: ${pdfFile.name || 'unnamed'}`;
            
            sectionPage.drawText(`File: ${removeAllDiacritics(fileInfo)}`, {
              x: margin,
              y: currentY,
              size: 10,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
          }
        }
      };
      
      // Add General Information section with its PDF
      console.log('Adding General Information section');
      await addSectionWithPdf('1. Informatii Generale', [
        { label: 'Nume Proiect:', value: project.name || '-' },
        { label: 'Descriere:', value: project.description || '-' },
        { label: 'Nume Constructie:', value: project.constructionName || '-' },
        { label: 'Adresa:', value: project.address || '-' },
        { label: 'Beneficiar:', value: project.beneficiary || '-' },
        { label: 'Proiectant:', value: project.designer || '-' },
        { label: 'Constructor:', value: project.builder || '-' },
      ], project.tabs?.general?.uploadedFile);
      
      // Add Technical section with its PDF
      console.log('Adding Technical section');
      const technical = project.tabs?.technical;
      if (technical) {
        await addSectionWithPdf('2. Specificatii Tehnice', [
          { label: 'Tehnologii:', value: (technical.technologies && technical.technologies.length > 0) ? technical.technologies.join(', ') : '-' },
          { label: 'Complexitate:', value: technical.complexity || '-' },
          { label: 'Descriere Produs:', value: technical.productDescription || '-' },
          { label: 'Caracteristici Tehnice:', value: technical.technicalCharacteristics || '-' },
          { label: 'Conditii de Productie:', value: technical.productionConditions || '-' },
        ], technical.uploadedFile);
      }
      
      // Add Financial section with its PDF
      console.log('Adding Financial section');
      const financial = project.tabs?.financial;
      if (financial) {
        await addSectionWithPdf('3. Informatii Financiare', [
          { label: 'Buget:', value: `${financial.budget || 0} ${financial.currency || 'RON'}` },
          { label: 'Cost Estimat:', value: `${financial.estimatedCost || 0} ${financial.currency || 'RON'}` },
          { label: 'Marja de Profit:', value: `${financial.profitMargin || 0}%` },
        ], financial.uploadedFile);
      }
      
      // Add Resources section with its PDF
      console.log('Adding Resources section');
      const resources = project.tabs?.resources;
      if (resources) {
        await addSectionWithPdf('4. Resurse', [
          { label: 'Membri Echipa:', value: (resources.teamMembers && resources.teamMembers.length > 0) ? resources.teamMembers.join(', ') : '-' },
          { label: 'Abilitati Necesare:', value: (resources.requiredSkills && resources.requiredSkills.length > 0) ? resources.requiredSkills.join(', ') : '-' },
          { label: 'Echipamente Necesare:', value: (resources.equipmentNeeded && resources.equipmentNeeded.length > 0) ? resources.equipmentNeeded.join(', ') : '-' },
        ], resources.uploadedFile);
      }
      
      // Save the PDF
      console.log('Saving PDF');
      const pdfBytes = await pdfDoc.save();
      
      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Open the PDF in a new tab for viewing only
      window.open(url, '_blank');
      
      // Clean up the URL object after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000); // Longer delay to ensure the PDF loads in the new tab
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Eroare la generarea PDF-ului. Va rugam sa incercati din nou.');
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      onClick={generatePDF}
      className="flex items-center gap-2"
      variant="default"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          <span>Generare...</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span>Descarcare PDF</span>
        </>
      )}
    </Button>
  );
} 