import { useRef } from 'react';
import { useProjects } from '@/context/ProjectContext';
import type { Project } from '@/types/Project';
import PdfExportButton from '@/components/PdfExportButton';

export default function ProjectView() {
  const { projects, selectedProject } = useProjects();
  const componentRef = useRef<HTMLDivElement>(null);

  if (!selectedProject) {
    return <div>No project selected</div>;
  }

  return (
    <div>
      <div ref={componentRef}>
        <h1>{selectedProject.name}</h1>
        <div className="project-details">
          <p>Client: {selectedProject.tabs.general.clientName}</p>
          <p>Start Date: {selectedProject.tabs.general.startDate}</p>
          <p>End Date: {selectedProject.tabs.general.endDate}</p>
          {/* Add more project details as needed */}
        </div>
      </div>
      
      <PdfExportButton project={selectedProject} />
    </div>
  );
} 