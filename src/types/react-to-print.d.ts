declare module 'react-to-print' {
  import { RefObject } from 'react';

  export interface PrintOptions {
    documentTitle?: string;
    onBeforeGetContent?: () => HTMLElement | null;
    removeAfterPrint?: boolean;
  }

  export type UseReactToPrintHookContent = () => HTMLElement | null;
  
  export function useReactToPrint(options: PrintOptions): () => void;
} 