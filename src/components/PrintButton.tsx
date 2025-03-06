import { type RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { usePrint } from '@/hooks/usePrint';

interface PrintButtonProps {
  contentRef: RefObject<HTMLElement>;
}

export function PrintButton({ contentRef }: PrintButtonProps) {
  const onPrint = usePrint(contentRef);

  return (
    <Button
      onClick={onPrint}
      className="flex items-center gap-2"
    >
      Print
    </Button>
  );
} 