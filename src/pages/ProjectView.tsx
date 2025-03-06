import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { usePrint } from '@/hooks/usePrint';
import type { Project } from '@/types/Project';

interface ProjectViewProps {
  project: Project;
}

export default function ProjectView({ project }: ProjectViewProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(componentRef);

  return (
    <div ref={componentRef}>
      <h1>{project.name}</h1>
      <div className="project-details">
        <p>Client: {project.tabs.general.clientName}</p>
        <p>Start Date: {project.tabs.general.startDate}</p>
        <p>End Date: {project.tabs.general.endDate}</p>
        {/* Add more project details as needed */}
      </div>
      <Button onClick={handlePrint} className="flex items-center gap-2">
        Print
      </Button>
    </div>
  );
} 