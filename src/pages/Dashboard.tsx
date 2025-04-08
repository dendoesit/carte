import React, { useState, useEffect, useCallback } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  PlusIcon, FolderIcon, LogOutIcon, UserIcon,
  EyeIcon, PencilIcon, ArrowLeft, FileText,
} from 'lucide-react';
import { Project, ChecklistItem } from '@/types/Project';
import * as pdfjsLib from 'pdfjs-dist';

import { useProjectTabs } from '@/hooks/useProjectTabs';
import { ProiectareTab } from '@/components/tabs/ProiectareTab';
import { ExecutieTab } from '@/components/tabs/ExecutieTab';
import { ReceptieTab } from '@/components/tabs/ReceptieTab';
import { UrmarireTab } from '@/components/tabs/UrmarireTab';
import { ProjectCreationModal } from '@/components/ProjectCreationModal';
import PdfExportButton from "@/components/PdfExportButton";

const defaultGeneralChecklistItems: Omit<ChecklistItem, 'checked' | 'file'>[] = [
  { id: 'tema-proiectare', label: 'Documentatie referitoare la tema de proiectare' },
  { id: 'studiu-prefezabilitate', label: 'Studiu de prefezabilitate (HG 907/2016)' },
  { id: 'studiu-fezabilitate', label: 'Studiu de fezabilitate (HG 907/2016)' },
  { id: 'dali', label: 'Documentatie de avizare a lucrarilor de interventii (D.A.L.I) (HG 907/2016)' },
  { id: 'devize', label: 'Deviz general si deviz pe obiect' },
  { id: 'urbanism-avize', label: 'Certificat de urbanism, ridicari topografice si avize de specialitate' },
  { id: 'pac', label: 'Proiectul pentru autorizarea executarii lucrarilor de construire-P.A.C.' },
  { id: 'autorizatie-construire', label: 'Autorizatia de construire' },
  { id: 'poe', label: 'Proiect de organizare a executiei lucrarilor-P.O.E.' },
  { id: 'pad', label: 'Proiect pentru autorizarea executarii lucrarilor de desfiintare - P.A.D.' },
  { id: 'pte', label: 'Proiect tehnic de executie' },
  { id: 'alte-documente-gen', label: 'Alte documente (Proiectare)' },
];

const defaultTechnicalChecklistItems: Omit<ChecklistItem, 'checked' | 'file'>[] = [
  { id: 'exec-doc-calitate', label: 'Documente de calitate' },
  { id: 'exec-borderou-avize', label: 'Borderou cu avize de insotire a materialelor' },
  { id: 'exec-manuale-utilizare', label: 'Manuale de utilizare ale utilajelor si echipamentelor de la producator' },
  { id: 'exec-situatii-lucrari', label: 'Situatii de lucrari si caiete de atasament' },
  { id: 'exec-dispozitii-santier', label: 'Dispozitii de santier si note de constatare' },
  { id: 'exec-pv-stadiu', label: 'Procese verbale de constatare privind stadiul realizarii constructiei' },
  { id: 'exec-acte-control', label: 'Acte de control incheiate de organe de control si faze determinante cu participarea reprezentatilor I.S.C.' },
  { id: 'exec-jurnal-santier', label: 'Jurnalul de santier' },
  { id: 'exec-registru-comunicari', label: 'Registru unic de comunicari' },
  { id: 'exec-jurnal-evenimente', label: 'Jurnalul principalelor evenimente (inundatii, cutremure, temperaturi excesive, etc.)' },
  { id: 'exec-expertize-suplim', label: 'Documentatii privind expertize tehnice, verificari in teren sau cercetari suplimentare' },
  { id: 'exec-pv-montare-instalatii', label: 'Procese verbale privind montarea instalatiilor de masurare (daca este cazul)' },
  { id: 'exec-alte-documente', label: 'Alte documente (Executie)' },
];

const defaultFinancialChecklistItems: Omit<ChecklistItem, 'checked' | 'file'>[] = [
    { id: 'rec-doc-finalizare', label: 'Documente privind finalizarea lucrarilor' },
    { id: 'rec-referate-specialisti', label: 'Referate specialisti la finalizarea lucrarilor' },
    { id: 'rec-doc-valoare-cote', label: 'Documente privind valoarea finala a lucrarilor si plata cotelor aferente (0,1% si 0,5%)' },
    { id: 'rec-doc-comisie-receptie', label: 'Documente privind constituirea comisiei de receptie la terminarea lucrarilor' },
    { id: 'rec-doc-receptie-hg273', label: 'Documente privind receptia conform H.G. 273/1994 modificata cu H.G. 343/2017' },
    { id: 'rec-doc-receptie-hg845', label: 'Documente privind receptia conform H.G. 845/2018(infrastructura rutiera si feroviara de interes national)' },
    { id: 'rec-proiect-as-build', label: 'Proiect tehnic As-Build' },
    { id: 'rec-certificat-energetic', label: 'Certificat Energetic' },
    { id: 'rec-alte-documente', label: 'Alte documente (Receptie)' },
];

const defaultResourcesChecklistItems: Omit<ChecklistItem, 'checked' | 'file'>[] = [
    { id: 'urm-prevederi-proiectant', label: 'Prevederile scrise ale proiectantului privind urmarirea comportarii constructiei' },
    { id: 'urm-instructiuni', label: 'Instructiunile de exploatare si intretinere' },
    { id: 'urm-prescriptii', label: 'Lista prescriptiilor de baza care trebuie respectate pe timpul exploatarii constructiei' },
    { id: 'urm-proiect-urmarire-speciala', label: 'Proiectul de urmarire speciala a constructiei (dupa caz)' },
    { id: 'urm-pv-predare-instalatii', label: 'Procesul-verbal de predare-primire a instalatiilor de masurare (dupa caz)' },
    { id: 'urm-jurnal-evenimente', label: 'Jurnalul de evenimente' },
    { id: 'urm-doc-interpretare', label: 'Documentatia de interpretare a urmaririi comportarii constructiei in timpul executiei si al exploatarii' },
    { id: 'urm-proiecte-modificari', label: 'Proiecte de modificari ale constructiei dupa receptia finala' },
    { id: 'urm-acte-constatare', label: 'Actele de constatare a unor deficiente aparute dupa receptia executarii lucrarilor si masurile de interventie luate' },
    { id: 'urm-referat-concluzii', label: 'Referatul cu concluziile anuale si finale asupra rezultatelor urmariri speciale (dupa caz)' },
    { id: 'urm-pv-predare-proprietar', label: 'Procesele-verbale de predare-primire a constructiei in cazul schimbarii proprietarului' },
    { id: 'urm-jurnalul-evenimentelor', label: 'Jurnalul evenimentelor' },
    { id: 'urm-alte-documente', label: 'Alte documente (Urmarire)' },
];

const Dashboard: React.FC = () => {
    const { projects, createProject, updateProject } = useProjects();
    const { user, logout } = useAuth();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const tabHandlers = useProjectTabs({ selectedProject, setSelectedProject });

    useEffect(() => {
        const workerSrcPath = `/pdf.worker.mjs`;
        try { pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcPath; console.log("PDF Worker set"); }
        catch (error) { console.error("PDF Worker setup failed:", error); }
    }, []);

    const handleOpenModal = useCallback((project?: Project) => {
        setEditingProject(project || null);
        setShowModal(true);
    }, []);
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setEditingProject(null);
    }, []);

    const handleModalSubmit = useCallback(async (projectFormData: Omit<Project, 'id' | 'createdAt'>) => {
        try {
            let finalProjectData: Omit<Project, 'id' | 'createdAt'>;

            if (editingProject) {
                // EDITING
                const currentTabs = editingProject.tabs || {};
                // Initialize EACH tab's checklist if missing
                const generalChecklist = (currentTabs.general?.checklistItems && currentTabs.general.checklistItems.length > 0)
                    ? currentTabs.general.checklistItems
                    : defaultGeneralChecklistItems.map(item => ({ ...item, checked: true, file: null }));

                const technicalChecklist = (currentTabs.technical?.checklistItems && currentTabs.technical.checklistItems.length > 0)
                    ? currentTabs.technical.checklistItems
                    : defaultTechnicalChecklistItems.map(item => ({ ...item, checked: true, file: null }));

                const financialChecklist = (currentTabs.financial?.checklistItems && currentTabs.financial.checklistItems.length > 0)
                    ? currentTabs.financial.checklistItems
                    : defaultFinancialChecklistItems.map(item => ({ ...item, checked: true, file: null }));

                const resourcesChecklist = (currentTabs.resources?.checklistItems && currentTabs.resources.checklistItems.length > 0)
                    ? currentTabs.resources.checklistItems
                    : defaultResourcesChecklistItems.map(item => ({ ...item, checked: true, file: null }));

                finalProjectData = {
                    ...projectFormData, // Base fields from modal form
                    tabs: { // Reconstruct tabs ensuring checklists are present
                        general: { checklistItems: generalChecklist },
                        technical: { checklistItems: technicalChecklist },
                        financial: { checklistItems: financialChecklist },
                        resources: { checklistItems: resourcesChecklist },
                    }
                };
                await updateProject(editingProject.id, finalProjectData);
                 if(selectedProject?.id === editingProject.id) {
                    setSelectedProject(prev => prev ? ({ ...prev, ...finalProjectData }) : null);
                 }
            } else {
                // CREATING
                 finalProjectData = {
                    ...projectFormData, // Base fields from modal
                    tabs: { // Initialize all tabs with defaults
                        general: { checklistItems: defaultGeneralChecklistItems.map(item => ({ ...item, checked: true, file: null })) },
                        technical: { checklistItems: defaultTechnicalChecklistItems.map(item => ({ ...item, checked: true, file: null })) },
                        financial: { checklistItems: defaultFinancialChecklistItems.map(item => ({ ...item, checked: true, file: null })) },
                        resources: { checklistItems: defaultResourcesChecklistItems.map(item => ({ ...item, checked: true, file: null })) }
                    }
                };
                await createProject(finalProjectData);
            }
        } catch (error) {
            console.error('Error saving project from modal:', error);
            alert('A apărut o eroare la salvarea proiectului.');
            throw error;
        }
    }, [editingProject, selectedProject, createProject, updateProject, setSelectedProject]);

    const handleCopyProject = useCallback(async (project: Project) => {
        try {
             const copiedProject: Omit<Project, 'id' | 'createdAt'> = {
                name: `${project.name} COPY`,
                description: project.description,
                updatedAt: new Date(),
                tabs: JSON.parse(JSON.stringify(project.tabs))
             };
            await createProject(copiedProject);
            alert('Proiect copiat!');
        } catch (error) { alert('Eroare la copiere.'); }
    }, [createProject]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                       <div className="bg-primary-50 p-2 rounded-full">
                           <UserIcon className="text-primary-600" size={20} />
                       </div>
                       <div>
                         <h2 className="text-sm font-semibold text-gray-800">{user?.username}</h2>
                         <p className="text-xs text-gray-500">{user?.email}</p>
                       </div>
                    </div>
                </div>
                <div className="p-3 space-y-2 flex-shrink-0 border-b border-gray-200">
                    <Button onClick={() => handleOpenModal()} size="sm" className="w-full justify-start text-sm">
                        <PlusIcon size={16} className="mr-2" /> Proiect nou
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="w-full justify-start text-sm text-gray-700">
                        <Link to="/formulare">
                            <FileText size={16} className="mr-2" /> Formulare
                        </Link>
                    </Button>
                </div>
                <nav className="mt-2 flex-grow overflow-y-auto px-2">
                    <div className="space-y-1 py-2">
                        {projects.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProject(p)}
                                className={`flex items-center px-3 py-2 text-sm cursor-pointer rounded-md transition-colors group ${
                                    selectedProject?.id === p.id
                                        ? 'bg-primary-100 text-primary-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                                title={p.name}
                            >
                                <FolderIcon className={`mr-2.5 h-4 w-4 flex-shrink-0 ${
                                    selectedProject?.id === p.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                <span className="truncate flex-grow">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </nav>
                 <div className="mt-auto p-3 border-t border-gray-200 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOutIcon size={16} className="mr-2" />
                        <span>Logout</span>
                    </Button>
                 </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50">
                <div className="p-6 md:p-8">
                    {selectedProject ? (
                        <div>
                             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div className='flex items-center'>
                                   <Button onClick={() => setSelectedProject(null)} variant="ghost" size="icon" className="mr-3 text-gray-500 hover:text-gray-800"><ArrowLeft size={20}/></Button>
                                   <h1 className="text-2xl font-bold text-gray-900 truncate">{selectedProject.name}</h1>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button asChild variant="outline" size="sm">
                                        <Link to="/formulare">
                                            <FileText className="mr-1.5 h-4 w-4"/> Formulare
                                        </Link>
                                    </Button>
                                    <Button onClick={() => handleOpenModal(selectedProject)} variant="outline" size="sm"><PencilIcon className="mr-1.5 h-4 w-4"/> Edit Info</Button>
                                    <PdfExportButton project={selectedProject} />
                                </div>
                             </div>

                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 border-b">
                                    <TabsTrigger value="general">Proiectare</TabsTrigger>
                                    <TabsTrigger value="technical">Executie</TabsTrigger>
                                    <TabsTrigger value="financial">Receptie</TabsTrigger>
                                    <TabsTrigger value="resources">Urmarirea in timp</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="mt-6">
                                    <ProiectareTab project={selectedProject} tabHandlers={tabHandlers} />
                                </TabsContent>
                                <TabsContent value="technical" className="mt-6">
                                     <ExecutieTab project={selectedProject} tabHandlers={tabHandlers} />
                                </TabsContent>
                                <TabsContent value="financial" className="mt-6">
                                     <ReceptieTab project={selectedProject} tabHandlers={tabHandlers} />
                                </TabsContent>
                                <TabsContent value="resources" className="mt-6">
                                     <UrmarireTab project={selectedProject} tabHandlers={tabHandlers} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Proiectele mele</h1>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(p => (
                                    <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                                        <div className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-gray-800 leading-tight"> {p.name} </h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {p.description || 'Fără descriere'}
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedProject(p)} className="text-primary-600 hover:text-primary-700">
                                                <EyeIcon className="mr-1.5 h-4 w-4"/> Vizualizează
                                            </Button>
                                            <div className="flex space-x-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(p)} className="text-gray-600 hover:text-gray-900">
                                                    <PencilIcon className="h-4 w-4"/>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleCopyProject(p)} className="text-gray-600 hover:text-gray-900">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ProjectCreationModal
                show={showModal}
                onClose={handleCloseModal}
                projectToEdit={editingProject}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}

export default Dashboard;