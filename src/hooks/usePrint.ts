import { useReactToPrint, type PrintOptions } from 'react-to-print';
import type { RefObject } from 'react';

export function usePrint(contentRef: RefObject<HTMLElement>) {
  const handlePrint = useReactToPrint({
    documentTitle: 'Document',
    onBeforeGetContent: () => contentRef.current,
    removeAfterPrint: true
  } as PrintOptions);

  return () => handlePrint();
} 