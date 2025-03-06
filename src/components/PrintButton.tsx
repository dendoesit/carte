import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onPrint?: () => void;
}

export function PrintButton({ onPrint = () => {} }: PrintButtonProps) {
  return (
    <Button
      onClick={onPrint}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Printer className="h-4 w-4" />
      <span>Printează</span>
    </Button>
  );
} 