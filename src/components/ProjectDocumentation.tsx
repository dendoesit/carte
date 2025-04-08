import React from 'react';
import { Project } from '@/types/Project';

interface ProjectDocumentationProps {
  project: Project | null;
}

const ProjectDocumentation: React.FC<ProjectDocumentationProps> = ({ project }) => {
  if (!project) return <div>No project selected</div>;

  return (
    <div className="p-6 space-y-8">
      {/* General Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Date Generale Proiect (Modal)</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div><strong className="text-gray-600">Denumire conf AC:</strong> {project.constructionName || "-"}</div>
          <div><strong className="text-gray-600">Localizare (Obiectiv):</strong> {project.address || "-"}</div>
          {/* ... other general fields ... */}
        </div>
      </section>

       {/* Proiectare */}
       <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Documentatie Proiectare</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
              {project.tabs.general?.checklistItems?.filter(item => item.checked).map(item => (
                  <li key={item.id}>{item.label} {item.file ? `(${item.file.name})` : '(Fără fișier)'}</li>
              ))}
              {(project.tabs.general?.checklistItems?.filter(item => item.checked).length === 0) && <li>Niciun element bifat.</li>}
          </ul>
       </section>

       {/* Executie */}
       <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Documentatie Executie</h2>
           <ul className="list-disc pl-5 space-y-1 text-sm">
               {project.tabs.technical?.checklistItems?.filter(item => item.checked).map(item => (
                   <li key={item.id}>{item.label} {item.file ? `(${item.file.name})` : '(Fără fișier)'}</li>
               ))}
               {(project.tabs.technical?.checklistItems?.filter(item => item.checked).length === 0) && <li>Niciun element bifat.</li>}
           </ul>
       </section>

       {/* Receptie */}
       <section>
           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informatii Receptie</h2>
           <ul className="list-disc pl-5 space-y-1 text-sm">
               {project.tabs.financial?.checklistItems?.filter(item => item.checked).map(item => (
                   <li key={item.id}>{item.label} {item.file ? `(${item.file.name})` : '(Fără fișier)'}</li>
               ))}
               {(project.tabs.financial?.checklistItems?.filter(item => item.checked).length === 0) && <li>Niciun element bifat.</li>}
           </ul>
       </section>

       {/* Urmarire */}
       <section>
           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Urmarirea in Timp</h2>
           <ul className="list-disc pl-5 space-y-1 text-sm">
               {project.tabs.resources?.checklistItems?.filter(item => item.checked).map(item => (
                   <li key={item.id}>{item.label} {item.file ? `(${item.file.name})` : '(Fără fișier)'}</li>
               ))}
               {(project.tabs.resources?.checklistItems?.filter(item => item.checked).length === 0) && <li>Niciun element bifat.</li>}
           </ul>
       </section>
    </div>
  );
};

export default ProjectDocumentation; 