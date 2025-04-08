import React, { useState, useRef, useEffect } from 'react'
import { useProjects } from '@/context/ProjectContext'
import { useAuth } from '@/context/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  FolderIcon, 
  LogOutIcon, 
  UserIcon,
  EyeIcon,
  PencilIcon,
  Save,
  Upload,
  ArrowLeft,
  FileText,
  X as XIcon,
} from 'lucide-react'
import { Project, GeneralTab } from '@/types/Project'

import PdfExportButton from "@/components/PdfExportButton";
import * as pdfjsLib from 'pdfjs-dist';



const Dashboard: React.FC = () => {
  const { projects, createProject, updateProject } = useProjects()
  const { user, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectDescription, setProjectDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [designer, setDesigner] = useState('')
  const [builder, setBuilder] = useState('')

  // --- NEW State variables for the modal ---
  const [modalConstructionName, setModalConstructionName] = useState('')
  const [modalLocalization, setModalLocalization] = useState('')
  const [modalInvestorName, setModalInvestorName] = useState('')
  const [modalInvestorAddress, setModalInvestorAddress] = useState('')
  const [modalInvestorCounty, setModalInvestorCounty] = useState('')
  const [modalAuthNumber, setModalAuthNumber] = useState('')
  const [modalAuthDate, setModalAuthDate] = useState('')
  const [modalAuthDeadline, setModalAuthDeadline] = useState('')
  const [modalISCNoticeNr, setModalISCNoticeNr] = useState('')
  const [modalISCNoticeDate, setModalISCNoticeDate] = useState('')
  const [modalReceptionDate, setModalReceptionDate] = useState('')
  const [modalSiteAddress, setModalSiteAddress] = useState('')
  // --- End NEW State variables ---

  const componentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<Record<keyof Project['tabs'], boolean>>({
    general: false,
    technical: false,
    financial: false,
    resources: false
  });

  useEffect(() => {
    // Path will be relative to the root of the deployed site
    const workerSrcPath = `/pdf.worker.mjs`; // Just the filename

    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcPath;
      console.log("PDF.js workerSrc set to:", workerSrcPath);
    } catch (error) {
      console.error("Failed to set PDF.js workerSrc:", error);
      // Handle error
    }
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setProjectDescription(project.description)

      // Populate new modal states from project data
      setModalConstructionName(project.constructionName || '')
      setModalLocalization(project.address || '')
      setModalInvestorName(project.beneficiary || '')
      setModalInvestorAddress(project.investorAddress || '')
      setModalInvestorCounty(project.investorCounty || '')
      setModalAuthNumber(project.authNumber || '')
      setModalAuthDate(formatDateForInput(project.authDate))
      setModalAuthDeadline(formatDateForInput(project.authDeadline))
      setModalISCNoticeNr(project.iscNoticeNumber || '')
      setModalISCNoticeDate(formatDateForInput(project.iscNoticeDate))
      setModalReceptionDate(formatDateForInput(project.receptionDate))
      setModalSiteAddress(project.siteAddress || '')

      // Keep these if used elsewhere
      setDesigner(project.designer || '')
      setBuilder(project.builder || '')

    } else {
      setEditingProject(null)
      setProjectDescription('')

      // Reset new modal states
      setModalConstructionName('')
      setModalLocalization('')
      setModalInvestorName('')
      setModalInvestorAddress('')
      setModalInvestorCounty('')
      setModalAuthNumber('')
      setModalAuthDate('')
      setModalAuthDeadline('')
      setModalISCNoticeNr('')
      setModalISCNoticeDate('')
      setModalReceptionDate('')
      setModalSiteAddress('')

      // Reset others if needed
      setDesigner('')
      setBuilder('')
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setProjectDescription('')

    // Reset new modal states
    setModalConstructionName('')
    setModalLocalization('')
    setModalInvestorName('')
    setModalInvestorAddress('')
    setModalInvestorCounty('')
    setModalAuthNumber('')
    setModalAuthDate('')
    setModalAuthDeadline('')
    setModalISCNoticeNr('')
    setModalISCNoticeDate('')
    setModalReceptionDate('')
    setModalSiteAddress('')

    // Reset others if needed
    setDesigner('')
    setBuilder('')
  }

  const handleSubmit = async () => {
    if (!modalConstructionName.trim()) {
      alert('Vă rugăm să introduceți Denumirea conform autorizației');
      return;
    }

    const projectBaseData: Partial<Project> = {
      name: modalConstructionName,
      description: projectDescription || `Detalii pentru ${modalConstructionName}`,
      updatedAt: new Date(),
      constructionName: modalConstructionName,
      address: modalLocalization,
      beneficiary: modalInvestorName,
      investorAddress: modalInvestorAddress,
      investorCounty: modalInvestorCounty,
      authNumber: modalAuthNumber,
      authDate: modalAuthDate || undefined,
      authDeadline: modalAuthDeadline || undefined,
      iscNoticeNumber: modalISCNoticeNr,
      iscNoticeDate: modalISCNoticeDate || undefined,
      receptionDate: modalReceptionDate || undefined,
      siteAddress: modalSiteAddress,
      designer: designer,
      builder: builder,
    };

    let projectData: Omit<Project, 'id' | 'createdAt'>;

    if (editingProject) {
      projectData = {
        ...projectBaseData,
        tabs: editingProject.tabs,
      } as Omit<Project, 'id' | 'createdAt'>;
    } else {
      projectData = {
        ...projectBaseData,
        tabs: {
          general: { projectType: '', clientName: '', startDate: '', endDate: '', uploadedFiles: [] },
          technical: {
            technologies: [],
            complexity: "Low",
            productDescription: '',
            technicalCharacteristics: '',
            productionConditions: '',
            specifications: '',
            technicalRequirements: '',
            uploadedFiles: []
          },
          financial: { budget: 0, estimatedCost: 0, currency: 'RON', profitMargin: 0, uploadedFiles: [] },
          resources: { teamMembers: [], requiredSkills: [], equipmentNeeded: [], uploadedFiles: [] }
        }
      } as Omit<Project, 'id' | 'createdAt'>;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('A apărut o eroare la salvarea proiectului. Vă rugăm să încercați din nou.');
    }
  };

  const handleInputChange = (tab: keyof Project['tabs'], field: string, value: any) => {
    if (!selectedProject) return;

    const updatedProject = {
      ...selectedProject,
      tabs: {
        ...selectedProject.tabs,
        [tab]: {
          ...selectedProject.tabs[tab],
          [field]: value
        }
      }
    };

    setSelectedProject(updatedProject);
  };

  const handleSave = async (tab: keyof Project['tabs']) => {
    if (!selectedProject) return;
    
    setIsSaving(true);
    try {
      await updateProject(selectedProject.id, {
        tabs: {
          ...selectedProject.tabs,
          [tab]: selectedProject.tabs[tab]
        }
      });
      // Show success message or feedback
    } catch (error) {
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  // --- Refactor File Upload Logic ---
  // Create a separate function to handle the actual file processing logic
  const handleFileUploadLogic = async (file: File | null, tab: keyof Project['tabs']) => {
    if (!file || !selectedProject) return;

    // Optional: Check if file with the same name already exists
    const currentFiles = selectedProject.tabs[tab].uploadedFiles || [];
    if (currentFiles.some(f => f.name === file.name)) {
       alert(`Un fișier cu numele "${file.name}" există deja în această secțiune.`);
       return false; // Indicate failure
    }

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return false; // Indicate failure
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB');
      return false; // Indicate failure
    }

    setIsSaving(true); // Still use isSaving for the upload process

    try {
      // Note: Blob URLs are temporary. For persistence, you'd need actual file storage.
      const fileUrl = URL.createObjectURL(file);
      const newFileEntry = {
        name: file.name,
        url: fileUrl,
        type: file.type
      };

      const updatedFiles = [...currentFiles, newFileEntry];

      const updatedProjectData = {
        tabs: {
          ...selectedProject.tabs,
          [tab]: {
            ...selectedProject.tabs[tab],
            uploadedFiles: updatedFiles // Update with the new array
          }
        }
      };

      // Update the project in the backend/context
      await updateProject(selectedProject.id, updatedProjectData);

      // Update the local selected project state
      setSelectedProject({
        ...selectedProject,
        ...updatedProjectData // Merge the updated tabs back
      });
      return true; // Indicate success

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      return false; // Indicate failure
    } finally {
      setIsSaving(false);
    }
  };

  // --- Original handleFileUpload now uses the logic function ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, tab: keyof Project['tabs']) => {
    const file = event.target.files?.[0] || null;
    const success = await handleFileUploadLogic(file, tab);
    if (success || !event.target) {
       event.target.value = ''; // Clear input only on success or if target exists
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, tab: keyof Project['tabs']) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(prev => ({ ...prev, [tab]: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, tab: keyof Project['tabs']) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if leaving to a child element, only set false if leaving the container itself
    const relatedTarget = e.relatedTarget as Node;
    if (!e.currentTarget.contains(relatedTarget)) {
        setIsDragging(prev => ({ ...prev, [tab]: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, tab: keyof Project['tabs']) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(prev => ({ ...prev, [tab]: false })); // Reset drag state

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        // Handle only the first file dropped for simplicity
        const file = files[0];
        await handleFileUploadLogic(file, tab); // Use the refactored logic
    }
  };

  const handleRemoveFile = async (tab: keyof Project['tabs'], fileIndex: number) => {
     if (!selectedProject) return;

     const currentFiles = selectedProject.tabs[tab].uploadedFiles || [];
     const fileToRemove = currentFiles[fileIndex];
     if (!fileToRemove) return;

     if (fileToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
     }

     const updatedFiles = currentFiles.filter((_, index) => index !== fileIndex);

     try {
       const updatedProjectData = {
         tabs: {
           ...selectedProject.tabs,
           [tab]: {
             ...selectedProject.tabs[tab],
             uploadedFiles: updatedFiles
           }
         }
       };

       await updateProject(selectedProject.id, updatedProjectData);

       setSelectedProject({
         ...selectedProject,
         ...updatedProjectData
       });

     } catch (error) {
       console.error('Error removing file:', error);
       alert('Error removing file');
     }
  };

  // --- Update renderFileUpload to include Drop Zone logic ---
  const renderFileUpload = (tab: keyof Project['tabs']) => {
    const files = selectedProject?.tabs[tab]?.uploadedFiles || [];
    const isCurrentlyDragging = isDragging[tab] || false;

    return (
      // Add drop zone event handlers and conditional styling
      <div
        className={`mt-6 border-t pt-6 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out ${
          isCurrentlyDragging
            ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-200' // Style when dragging over
            : 'border-gray-300 hover:border-gray-400' // Default style
        }`}
        onDragEnter={(e) => handleDragEnter(e, tab)}
        onDragLeave={(e) => handleDragLeave(e, tab)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, tab)}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div className="text-center sm:text-left">
             <h3 className="font-medium text-gray-700">Documente Aditionale PDF</h3>
             <p className="text-sm text-gray-500">Trageți și plasați un fișier PDF aici sau folosiți butonul.</p>
          </div>
          {/* "Add PDF" button */}
          <div className="relative flex-shrink-0">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, tab)}
              className="hidden"
              id={`file-upload-${tab}`}
              disabled={isSaving}
            />
            <label
              htmlFor={`file-upload-${tab}`}
              className={`flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-4 h-4" />
              {isSaving ? 'Se încarcă...' : 'Selectează PDF'}
            </label>
          </div>
        </div>

        {/* Visual cue when dragging */}
        {isCurrentlyDragging && (
            <div className="text-center py-4 text-primary-600 font-medium">
                Plasați fișierul PDF aici...
            </div>
        )}

        {/* List of uploaded files */}
        {files.length > 0 && !isCurrentlyDragging && ( // Hide list while dragging for clarity
          <div className="space-y-3 mt-4">
            {files.map((file, index) => (
              <div key={`${tab}-${file.name}-${index}`} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between text-sm border border-gray-200">
                <div className="flex items-center gap-2 overflow-hidden">
                   <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                   <span className="text-gray-700 truncate" title={file.name}>
                     {file.name}
                   </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                    title="View PDF"
                  >
                    Vizualizează
                  </a>
                  <button
                    onClick={() => handleRemoveFile(tab, index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    title="Remove File"
                  >
                    <XIcon className="h-4 w-4" />
                    <span>Șterge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPdfContent = () => (
    <div ref={componentRef} className="pdf-content hidden">
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Cartea Tehnica</h1>
        <h2 className="text-2xl font-semibold mb-8">{selectedProject?.name}</h2>
        <p className="text-lg text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold mb-6">General Information</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Project Name</h3><p>{selectedProject?.name}</p></div>
          <div><h3 className="font-semibold">Description</h3><p>{selectedProject?.description || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Construction Name</h3><p>{selectedProject?.constructionName || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Address</h3><p>{selectedProject?.address || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Beneficiary</h3><p>{selectedProject?.beneficiary || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Designer</h3><p>{selectedProject?.designer || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Builder</h3><p>{selectedProject?.builder || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Start Date</h3><p>{formatDate(selectedProject?.tabs.general.startDate)}</p></div>
          <div><h3 className="font-semibold">End Date</h3><p>{formatDate(selectedProject?.tabs.general.endDate)}</p></div>
        </div>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Product Description</h3><p>{selectedProject?.tabs.technical.productDescription || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Technical Characteristics</h3><p>{selectedProject?.tabs.technical.technicalCharacteristics || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Production Conditions</h3><p>{selectedProject?.tabs.technical.productionConditions || 'N/A'}</p></div>
          <div><h3 className="font-semibold">Norme și Standarde</h3><p>{formatArray(selectedProject?.tabs.technical.technologies)}</p></div>
        </div>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold mb-6">Financial Information</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Cost de Producție</h3><p>{selectedProject?.tabs.financial.budget || 0} {selectedProject?.tabs.financial.currency}</p></div>
          <div><h3 className="font-semibold">Preț de Vânzare</h3><p>{selectedProject?.tabs.financial.estimatedCost || 0} {selectedProject?.tabs.financial.currency}</p></div>
          <div><h3 className="font-semibold">Marja de Profit</h3><p>{selectedProject?.tabs.financial.profitMargin || 0}%</p></div>
        </div>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold mb-6">Resources</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Personal Necesar</h3><p>{formatArray(selectedProject?.tabs.resources.teamMembers)}</p></div>
          <div><h3 className="font-semibold">Calificări Necesare</h3><p>{formatArray(selectedProject?.tabs.resources.requiredSkills)}</p></div>
          <div><h3 className="font-semibold">Echipamente Necesare</h3><p>{formatArray(selectedProject?.tabs.resources.equipmentNeeded)}</p></div>
        </div>
      </div>
    </div>
  );

  const renderProjectCreationForm = () => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Obiectiv Section */}
      <fieldset className="border border-gray-300 p-4 rounded-md">
        <legend className="text-lg font-semibold px-2 text-gray-700">Obiectiv</legend>
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Denumire conf autorizației de construire
            </label>
            <input
              type="text"
              value={modalConstructionName}
              onChange={(e) => setModalConstructionName(e.target.value)}
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduceți denumirea obiectivului"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localizare
            </label>
            <input
              type="text"
              value={modalLocalization}
              onChange={(e) => setModalLocalization(e.target.value)}
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduceți localizarea"
            />
          </div>
        </div>
      </fieldset>

      {/* Investitorul Section */}
      <fieldset className="border border-gray-300 p-4 rounded-md">
        <legend className="text-lg font-semibold px-2 text-gray-700">Investitorul</legend>
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Denumire
            </label>
            <input
              type="text"
              value={modalInvestorName}
              onChange={(e) => setModalInvestorName(e.target.value)}
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduceți denumirea investitorului"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresa
            </label>
            <input
              type="text"
              value={modalInvestorAddress}
              onChange={(e) => setModalInvestorAddress(e.target.value)}
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduceți adresa investitorului"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Județ
            </label>
            <input
              type="text"
              value={modalInvestorCounty}
              onChange={(e) => setModalInvestorCounty(e.target.value)}
              className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Introduceți județul"
            />
          </div>
        </div>
      </fieldset>

      {/* Autorizatia de construire Section */}
       <fieldset className="border border-gray-300 p-4 rounded-md">
         <legend className="text-lg font-semibold px-2 text-gray-700">Autorizația de construire</legend>
         <div className="space-y-3 mt-2">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Număr</label>
               <input type="text" value={modalAuthNumber} onChange={(e) => setModalAuthNumber(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Număr autorizație" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
               <input type="date" value={modalAuthDate} onChange={(e) => setModalAuthDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Termen de execuție</label>
             <input type="date" value={modalAuthDeadline} onChange={(e) => setModalAuthDeadline(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nr. anunț ISC</label>
               <input type="text" value={modalISCNoticeNr} onChange={(e) => setModalISCNoticeNr(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Număr anunț ISC" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Data anunț ISC</label>
               <input type="date" value={modalISCNoticeDate} onChange={(e) => setModalISCNoticeDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Data recepției la terminarea lucrărilor</label>
             <input type="date" value={modalReceptionDate} onChange={(e) => setModalReceptionDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
           </div>
         </div>
       </fieldset>

      {/* Adresa Santier Section */}
       <fieldset className="border border-gray-300 p-4 rounded-md">
         <legend className="text-lg font-semibold px-2 text-gray-700">Adresa Șantier</legend>
         <div className="space-y-3 mt-2">
           <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Adresa Șantier</label> */}
             <input
               type="text"
               value={modalSiteAddress}
               onChange={(e) => setModalSiteAddress(e.target.value)}
               className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
               placeholder="Introduceți adresa șantierului"
             />
           </div>
         </div>
       </fieldset>

      {/* Keep old fields if needed, or remove them */}
      {/* 
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numele Proiectului (List View) 
        </label>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full ..." placeholder="Nume pentru lista de proiecte" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descriere (List View)</label>
        <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="w-full ..." placeholder="Descriere pentru lista de proiecte" />
      </div> 
      */}
    </form>
  );

  const handleDateChange = (date: string, field: keyof Pick<GeneralTab, 'startDate' | 'endDate'>) => {
    if (!selectedProject) return;
    
    setSelectedProject({
      ...selectedProject,
      tabs: {
        ...selectedProject.tabs,
        general: {
          ...selectedProject.tabs.general,
          [field]: date
        }
      }
    });
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const formatArray = (arr: string[] | undefined) => {
    return arr?.join(', ') || 'Not specified';
  };

  const handleCopyProject = async (project: Project) => {
    try {
      const copiedProject: Omit<Project, 'id' | 'createdAt'> = {
        name: `${project.name} COPY`,
        description: project.description,
        constructionName: project.constructionName,
        address: project.address,
        beneficiary: project.beneficiary,
        designer: project.designer,
        builder: project.builder,
        updatedAt: new Date(),
        tabs: {
          general: { ...project.tabs.general },
          technical: { ...project.tabs.technical },
          financial: { ...project.tabs.financial },
          resources: { ...project.tabs.resources }
        }
      };
      
      await createProject(copiedProject);
      alert('Project copied successfully!');
    } catch (error) {
      console.error('Error copying project:', error);
      alert('Error copying project. Please try again.');
    }
  };

  // Helper to format date string for input type="date"
  const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    try {
      // Assumes dateString is already in 'YYYY-MM-DD' or compatible format
      // If it's a full ISO string, extract the date part
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      // Basic validation if needed
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
         return dateString;
      }
      // Attempt to parse if format is different (might need adjustment)
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date for input:", dateString, e);
      return '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-2 rounded-full">
              <UserIcon className="text-primary-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{user?.username}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button 
            onClick={() => handleOpenModal()}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition"
          >
            <PlusIcon size={20} />
            <span>Proiect nou</span>
          </button>

          <Link 
            to="/formulare"
            className="w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            <FileText size={20} />
            <span>Formulare</span>
          </Link>
        </div>

        <nav className="mt-4">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your Projects
          </h3>
          <div className="mt-2 space-y-1">
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`flex items-center px-4 py-2 text-sm cursor-pointer transition-colors ${
                  selectedProject?.id === project.id 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <FolderIcon className="mr-3 text-primary-500" size={20} />
                {project.name}
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-auto p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <LogOutIcon size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {selectedProject ? (
            <div>
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title="Back to projects"
                >
                  <ArrowLeft className="text-gray-600" size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{selectedProject.name}</h1>
                <div className="flex items-center gap-4">
                <Link 
                    to="/formulare"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    <FileText size={16} />
                    <span>Formulare</span>
                  </Link>
                  <PdfExportButton project={selectedProject} />
                </div>
              </div>

              {renderPdfContent()}

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Proiectare</TabsTrigger>
                  <TabsTrigger value="technical">Executie</TabsTrigger>
                  <TabsTrigger value="financial">Receptie</TabsTrigger>
                  <TabsTrigger value="resources">Urmarirea in timp</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Denumirea Produsului
                        </label>
                        <input
                          type="text"
                          value={selectedProject.tabs.general.projectType}
                          onChange={(e) => handleInputChange('general', 'projectType', e.target.value)}
                          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Introduceți denumirea produsului"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cod Produs
                        </label>
                        <input
                          type="text"
                          value={selectedProject.tabs.general.clientName}
                          onChange={(e) => handleInputChange('general', 'clientName', e.target.value)}
                          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="Introduceți codul produsului"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categorie Produs
                      </label>
                      <select
                        value={selectedProject.tabs.general.projectType}
                        onChange={(e) => handleInputChange('general', 'projectType', e.target.value)}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="">Selectați categoria</option>
                        <option value="electronice">Produse Electronice</option>
                        <option value="mecanice">Produse Mecanice</option>
                        <option value="software">Software</option>
                        <option value="altele">Altele</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data Emiterii
                        </label>
                        <input
                          type="date"
                          value={formatDate(selectedProject?.tabs.general.startDate)}
                          onChange={(e) => handleDateChange(e.target.value, 'startDate')}
                          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data Revizuirii
                        </label>
                        <input
                          type="date"
                          value={formatDate(selectedProject?.tabs.general.endDate)}
                          onChange={(e) => handleDateChange(e.target.value, 'endDate')}
                          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        />
                      </div>
                    </div>

                    

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => handleSave('general')}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                      </Button>
                    </div>
                    {renderFileUpload('general')}
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrierea Produsului</label>
                      <textarea
                        value={selectedProject.tabs.technical.productDescription}
                        onChange={(e) => handleInputChange('technical', 'productDescription', e.target.value)}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[150px]"
                        placeholder="Introduceți descrierea detaliată a produsului"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caracteristici Tehnice</label>
                      <textarea
                        value={selectedProject.tabs.technical.technicalCharacteristics}
                        onChange={(e) => handleInputChange('technical', 'technicalCharacteristics', e.target.value)}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[150px]"
                        placeholder="Specificați caracteristicile tehnice principale"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condiții de Producție</label>
                      <textarea
                        value={selectedProject.tabs.technical.productionConditions}
                        onChange={(e) => handleInputChange('technical', 'productionConditions', e.target.value)}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[150px]"
                        placeholder="Descrieți condițiile necesare pentru producție"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Norme și Standarde Aplicate</label>
                      <input
                        type="text"
                        value={formatArray(selectedProject?.tabs.technical.technologies)}
                        onChange={(e) => handleInputChange('technical', 'technologies', e.target.value.split(',').map(t => t.trim()))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți normele și standardele aplicabile"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => handleSave('technical')}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                      </Button>
                    </div>
                    {renderFileUpload('technical')}
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="mt-6">
                  <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost de Producție</label>
                      <input
                        type="number"
                        value={selectedProject.tabs.financial.budget}
                        onChange={(e) => handleInputChange('financial', 'budget', Number(e.target.value))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți costul de producție"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preț de Vânzare</label>
                      <input
                        type="number"
                        value={selectedProject.tabs.financial.estimatedCost}
                        onChange={(e) => handleInputChange('financial', 'estimatedCost', Number(e.target.value))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți prețul de vânzare recomandat"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                      <select
                        value={selectedProject.tabs.financial.currency}
                        onChange={(e) => handleInputChange('financial', 'currency', e.target.value)}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="RON">RON</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marja de Profit (%)</label>
                      <input
                        type="number"
                        value={selectedProject.tabs.financial.profitMargin}
                        onChange={(e) => handleInputChange('financial', 'profitMargin', Number(e.target.value))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți marja de profit"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => handleSave('financial')}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                      </Button>
                    </div>
                    {renderFileUpload('financial')}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personal Necesar</label>
                      <input
                        type="text"
                        value={formatArray(selectedProject?.tabs.resources.teamMembers)}
                        onChange={(e) => handleInputChange('resources', 'teamMembers', e.target.value.split(',').map(t => t.trim()))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți personalul necesar (separat prin virgulă)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calificări Necesare</label>
                      <input
                        type="text"
                        value={formatArray(selectedProject?.tabs.resources.requiredSkills)}
                        onChange={(e) => handleInputChange('resources', 'requiredSkills', e.target.value.split(',').map(t => t.trim()))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți calificările necesare (separate prin virgulă)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Echipamente Necesare</label>
                      <input
                        type="text"
                        value={formatArray(selectedProject?.tabs.resources.equipmentNeeded)}
                        onChange={(e) => handleInputChange('resources', 'equipmentNeeded', e.target.value.split(',').map(t => t.trim()))}
                        className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Introduceți echipamentele necesare (separate prin virgulă)"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => handleSave('resources')}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                      </Button>
                    </div>
                    {renderFileUpload('resources')}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Proiectele mele</h1>
                <Link 
                  to="/formulare"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <FileText size={16} />
                  <span>Formulare</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {project.name}
                        </h3>
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {project.description || 'No description provided'}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <FolderIcon size={16} />
                          <span className="text-xs">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <UserIcon size={16} />
                          <span className="text-xs">0 Members</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-4 flex justify-between">
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="text-gray-600 hover:text-primary-600 text-sm flex items-center space-x-1"
                      >
                        <EyeIcon size={16} />
                        <span>View Project</span>
                      </button>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleOpenModal(project)}
                          className="text-gray-600 hover:text-primary-600 text-sm flex items-center space-x-1"
                        >
                          <PencilIcon size={16} />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleCopyProject(project)}
                          className="text-gray-600 hover:text-primary-600 text-sm flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex-shrink-0">
              {editingProject ? 'Editare Detalii Proiect' : 'Creare Proiect Nou'}
            </h2>
            <div className="flex-grow overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {renderProjectCreationForm()}
            </div>
            <div className="flex justify-end space-x-3 flex-shrink-0 border-t pt-4">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Anulare
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                {editingProject ? 'Salvează Modificările' : 'Creează Proiect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard