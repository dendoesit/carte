import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  file: string;
  scale?: number;
}

export default function PdfViewer({ file, scale = 1.0 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError(true);
    setLoading(false);
  }

  return (
    <div className="pdf-viewer">
      {loading && <div className="loading">Loading PDF...</div>}
      {error && <div className="error">Error loading PDF. Please try again.</div>}
      
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="loading">Loading PDF...</div>}
      >
        <Page 
          pageNumber={pageNumber} 
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>
      
      {numPages && (
        <div className="pdf-controls">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(prevPage => Math.max(prevPage - 1, 1))}
          >
            Previous
          </button>
          
          <span>
            Page {pageNumber} of {numPages}
          </span>
          
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(prevPage => Math.min(prevPage + 1, numPages))}
          >
            Next
          </button>
          
          <select
            value={pageNumber}
            onChange={(e) => setPageNumber(parseInt(e.target.value))}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <option key={index + 1} value={index + 1}>
                Page {index + 1}
              </option>
            ))}
          </select>
          
          <select
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          >
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2">200%</option>
          </select>
        </div>
      )}
    </div>
  );
} 