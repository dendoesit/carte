import type { Project } from '@/types/Project';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function usePrint(project: Project): () => Promise<void> {
  const generateAndDownloadPDF = async (): Promise<void> => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed fonts
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add title page
      const titlePage = pdfDoc.addPage([595.276, 841.890]); // A4 size
      const { width, height } = titlePage.getSize();
      
      // Function to remove diacritics
      function removeDiacritics(str: string | undefined | null): string {
        if (!str) return '';
        return str.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
      }
      
      // Title page content
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
      
      // Project name
      const projectName = removeDiacritics(project.name || 'Proiect');
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
        { label: 'Beneficiar:', value: removeDiacritics(project.beneficiary || '-') },
        { label: 'Proiectant:', value: removeDiacritics(project.designer || '-') },
        { label: 'Constructor:', value: removeDiacritics(project.builder || '-') },
        { label: 'Adresa:', value: removeDiacritics(project.address || '-') },
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
      
      // Add date at the bottom
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
        const textStr = removeDiacritics(text);
        
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
      
      // Helper function to add a section
      const addSection = (
        title: string, 
        content: Array<{ label: string; value: string }>
      ): void => {
        let page = pdfDoc.addPage([595.276, 841.890]);
        let currentY = page.getHeight() - 50;
        const margin = 50;
        const contentWidth = page.getWidth() - (margin * 2);
        
        // Section title
        page.drawText(title, {
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
            page = pdfDoc.addPage([595.276, 841.890]);
            currentY = page.getHeight() - 50;
          }
          
          if (item.value !== undefined && item.value !== null && item.value !== '') {
            // Label
            page.drawText(item.label, {
              x: margin,
              y: currentY,
              size: 12,
              font: timesBoldFont,
              color: rgb(0, 0, 0),
            });
            
            // Value with text wrapping
            currentY = addWrappedText(
              page, 
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
      };
      
      // Add General Information section
      addSection('1. Informatii Generale', [
        { label: 'Nume Proiect:', value: project.name || '-' },
        { label: 'Descriere:', value: project.description || '-' },
        { label: 'Nume Constructie:', value: project.constructionName || '-' },
        { label: 'Adresa:', value: project.address || '-' },
        { label: 'Beneficiar:', value: project.beneficiary || '-' },
        { label: 'Proiectant:', value: project.designer || '-' },
        { label: 'Constructor:', value: project.builder || '-' },
      ]);
      
      // Add Technical section
      const technical = project.tabs?.technical;
      if (technical) {
        addSection('2. Specificatii Tehnice', [
          { label: 'Tehnologii:', value: (technical.technologies && technical.technologies.length > 0) ? technical.technologies.join(', ') : '-' },
          { label: 'Complexitate:', value: technical.complexity || '-' },
          { label: 'Descriere Produs:', value: technical.productDescription || '-' },
          { label: 'Caracteristici Tehnice:', value: technical.technicalCharacteristics || '-' },
          { label: 'Conditii de Productie:', value: technical.productionConditions || '-' },
        ]);
      }
      
      // Add Financial section
      const financial = project.tabs?.financial;
      if (financial) {
        addSection('3. Informatii Financiare', [
          { label: 'Buget:', value: `${financial.budget || 0} ${financial.currency || 'RON'}` },
          { label: 'Cost Estimat:', value: `${financial.estimatedCost || 0} ${financial.currency || 'RON'}` },
          { label: 'Marja de Profit:', value: `${financial.profitMargin || 0}%` },
        ]);
      }
      
      // Add Resources section
      const resources = project.tabs?.resources;
      if (resources) {
        addSection('4. Resurse', [
          { label: 'Membri Echipa:', value: (resources.teamMembers && resources.teamMembers.length > 0) ? resources.teamMembers.join(', ') : '-' },
          { label: 'Abilitati Necesare:', value: (resources.requiredSkills && resources.requiredSkills.length > 0) ? resources.requiredSkills.join(', ') : '-' },
          { label: 'Echipamente Necesare:', value: (resources.equipmentNeeded && resources.equipmentNeeded.length > 0) ? resources.equipmentNeeded.join(', ') : '-' },
        ]);
      }
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(project.name || 'proiect').toLowerCase().replace(/\s+/g, '-')}-cartea-tehnica.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Eroare la generarea PDF-ului. Vă rugăm să încercați din nou.');
    }
  };

  return generateAndDownloadPDF;
} 