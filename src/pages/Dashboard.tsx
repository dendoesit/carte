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
import * as pdfjsLib from 'pdfjs-dist'

import PdfExportButton from "@/components/PdfExportButton";



const Dashboard: React.FC = () => {
  const { projects, createProject, updateProject } = useProjects()
  const { user, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [constructionName, setConstructionName] = useState('');
  const [address, setAddress] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [designer, setDesigner] = useState('');
  const [builder, setBuilder] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For production, use a CDN to load the worker
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
  }, [])

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setProjectName(project.name)
      setProjectDescription(project.description)
      setConstructionName(project.constructionName || '');
      setAddress(project.address || '');
      setBeneficiary(project.beneficiary || '');
      setDesigner(project.designer || '');
      setBuilder(project.builder || '');
      setStartDate(new Date(project.tabs.general.startDate || '').toISOString().split('T')[0]);
      setEndDate(new Date(project.tabs.general.endDate || '').toISOString().split('T')[0]);
    } else {
      setEditingProject(null)
      setProjectName('')
      setProjectDescription('')
      setConstructionName('');
      setAddress('');
      setBeneficiary('');
      setDesigner('');
      setBuilder('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setProjectName('')
    setProjectDescription('')
    setConstructionName('');
    setAddress('');
    setBeneficiary('');
    setDesigner('');
    setBuilder('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
  }

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      alert('Vă rugăm să introduceți numele proiectului');
      return;
    }

    const projectData: Omit<Project, 'id' | 'createdAt'> = {
      name: projectName,
      description: projectDescription,
      constructionName,
      address,
      beneficiary,
      designer,
      builder,
      updatedAt: new Date(),
      tabs: {
        general: {
          projectType: '',
          clientName: '',
          startDate: startDate,
          endDate: endDate,
          uploadedFiles: [],
        },
        technical: {
          technologies: [],
          complexity: "Low" as const,
          productDescription: '',
          technicalCharacteristics: '',
          productionConditions: '',
          uploadedFiles: [],
          specifications: '',
          technicalRequirements: ''
        },
        financial: {
          budget: 0,
          estimatedCost: 0,
          currency: 'RON',
          profitMargin: 0,
          uploadedFiles: [],
        },
        resources: {
          teamMembers: [],
          requiredSkills: [],
          equipmentNeeded: [],
          uploadedFiles: [],
        }
      }
    };

    if (editingProject) {
      projectData.tabs = {
        general: { ...editingProject.tabs.general, uploadedFiles: editingProject.tabs.general.uploadedFiles || [] },
        technical: { ...editingProject.tabs.technical, uploadedFiles: editingProject.tabs.technical.uploadedFiles || [] },
        financial: { ...editingProject.tabs.financial, uploadedFiles: editingProject.tabs.financial.uploadedFiles || [] },
        resources: { ...editingProject.tabs.resources, uploadedFiles: editingProject.tabs.resources.uploadedFiles || [] }
      };
      projectData.tabs.general.startDate = startDate;
      projectData.tabs.general.endDate = endDate;
    } else {
      projectData.tabs.general.startDate = startDate;
      projectData.tabs.general.endDate = endDate;
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, tab: keyof Project['tabs']) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject) return;

    const currentFiles = selectedProject.tabs[tab].uploadedFiles || [];
    if (currentFiles.some(f => f.name === file.name)) {
       alert(`Un fișier cu numele "${file.name}" există deja în această secțiune.`);
       event.target.value = '';
       return;
    }

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      event.target.value = '';
      return;
    }

    setIsSaving(true);

    try {
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
            uploadedFiles: updatedFiles
          }
        }
      };

      await updateProject(selectedProject.id, updatedProjectData);

      setSelectedProject({
        ...selectedProject,
        ...updatedProjectData
      });

      event.target.value = '';

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      event.target.value = '';
    } finally {
      setIsSaving(false);
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

  const renderFileUpload = (tab: keyof Project['tabs']) => {
    const files = selectedProject?.tabs[tab]?.uploadedFiles || [];

    return (
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">Documente Aditionale PDF</h3>
          <div className="relative">
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
              className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-4 h-4" />
              {isSaving ? 'Se încarcă...' : 'Adaugă PDF'}
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3 mt-4">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between text-sm">
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
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numele Proiectului
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți numele proiectului"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descriere
        </label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți descrierea proiectului"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numele Construcției
        </label>
        <input
          type="text"
          value={constructionName}
          onChange={(e) => setConstructionName(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți numele construcției"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresa
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți adresa"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beneficiar
        </label>
        <input
          type="text"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți numele beneficiarului"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proiectant
        </label>
        <input
          type="text"
          value={designer}
          onChange={(e) => setDesigner(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți numele proiectantului"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Constructor
        </label>
        <input
          type="text"
          value={builder}
          onChange={(e) => setBuilder(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="Introduceți numele constructorului"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Început
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Sfârșit
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preț de Vânzare Recomandat</label>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingProject ? 'Editare Proiect' : 'Creare Proiect Nou'}
            </h2>
            {renderProjectCreationForm()}
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Anulare
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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