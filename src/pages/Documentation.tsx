import { useRef } from 'react';
import PdfExportButtons from '@/components/PdfExportButtons';
import SEO from '@/components/SEO';

export default function Documentation() {
  const pageRef = useRef<HTMLDivElement>(null);
  const allPagesRefs = useRef<HTMLDivElement[]>([]);  // You'll need to populate this with all page refs

  return (
    <>
      <SEO 
        title="Documentație Tehnică | DocuTech"
        description="Creează și gestionează documentația tehnică cu ușurință folosind platforma DocuTech. Instrumente moderne pentru documentare tehnică eficientă."
      />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* PDF Export Buttons */}
          <div className="mb-6">
            <PdfExportButtons
              contentRef={pageRef}
              pageName="Documentation"
              allPagesRefs={allPagesRefs.current.map(ref => ({ current: ref }))}
            />
          </div>

          {/* Page Content */}
          <div ref={pageRef} className="bg-white p-6 rounded-lg shadow">
            {/* Your page content here */}
          </div>
        </div>
      </div>
    </>
  );
} 