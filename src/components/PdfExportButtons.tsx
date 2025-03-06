import { type RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { exportElementToPDF, combinePagesToPDF } from '@/utils/pdfUtils';
import { Download } from 'lucide-react';

export interface PdfExportButtonsProps {
  contentRef: RefObject<HTMLElement>;
  pageName: string;
  allPagesRefs?: RefObject<HTMLElement>[];
}

export default function PdfExportButtons({ 
  contentRef, 
  pageName,
  allPagesRefs 
}: PdfExportButtonsProps) {
  const handleSaveCurrentPage = async () => {
    if (!contentRef.current) return;

    try {
      await exportElementToPDF(
        contentRef.current,
        `${pageName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      );
    } catch (error) {
      console.error('Failed to export page:', error);
      // You might want to show an error message to the user
    }
  };

  const handleExportAllPages = async () => {
    if (!allPagesRefs || !allPagesRefs.length) return;

    const validPages = allPagesRefs
      .map(ref => ref.current)
      .filter((element): element is HTMLElement => element !== null);

    if (!validPages.length) return;

    try {
      await combinePagesToPDF(validPages, 'complete-documentation.pdf');
    } catch (error) {
      console.error('Failed to export all pages:', error);
      // You might want to show an error message to the user
    }
  };

  return (
    <div className="flex space-x-4">
      <Button
        onClick={handleSaveCurrentPage}
        className="flex items-center space-x-2"
        variant="outline"
      >
        <Download className="h-4 w-4" />
        <span>Salvează ca PDF</span>
      </Button>
      
      {allPagesRefs && (
        <Button
          onClick={handleExportAllPages}
          className="flex items-center space-x-2"
          variant="default"
        >
          <Download className="h-4 w-4" />
          <span>Exportă Tot ca PDF</span>
        </Button>
      )}
    </div>
  );
} 