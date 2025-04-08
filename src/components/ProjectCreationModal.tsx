import React, { useState, useEffect } from 'react';
import { Project } from '@/types/Project'; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import { formatDateForInput } from '@/utils/helpers'; // Adjust path

interface ProjectCreationModalProps {
    show: boolean;
    onClose: () => void;
    projectToEdit: Project | null;
    // onSubmit needs the full structure, including default tabs for new projects
    onSubmit: (projectData: Omit<Project, 'id' | 'createdAt'>) => Promise<void>; 
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ show, onClose, projectToEdit, onSubmit }) => {
    // --- State for ALL modal fields ---
    const [description, setDescription] = useState('');
    const [designer, setDesigner] = useState('');
    const [builder, setBuilder] = useState('');
    const [constructionName, setConstructionName] = useState('');
    const [localization, setLocalization] = useState('');
    const [investorName, setInvestorName] = useState('');
    const [investorAddress, setInvestorAddress] = useState('');
    const [investorCounty, setInvestorCounty] = useState('');
    const [authNumber, setAuthNumber] = useState('');
    const [authDate, setAuthDate] = useState('');
    const [authDeadline, setAuthDeadline] = useState('');
    const [iscNoticeNr, setISCNoticeNr] = useState('');
    const [iscNoticeDate, setISCNoticeDate] = useState('');
    const [receptionDate, setReceptionDate] = useState('');
    const [siteAddress, setSiteAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

    // --- Populate state on edit ---
    useEffect(() => {
        if (projectToEdit) {
            setConstructionName(projectToEdit.constructionName || '');
            setLocalization(projectToEdit.address || '');
            setInvestorName(projectToEdit.beneficiary || '');
            setInvestorAddress(projectToEdit.investorAddress || '');
            setInvestorCounty(projectToEdit.investorCounty || '');
            setAuthNumber(projectToEdit.authNumber || '');
            setAuthDate(formatDateForInput(projectToEdit.authDate));
            setAuthDeadline(formatDateForInput(projectToEdit.authDeadline));
            setISCNoticeNr(projectToEdit.iscNoticeNumber || '');
            setISCNoticeDate(formatDateForInput(projectToEdit.iscNoticeDate));
            setReceptionDate(formatDateForInput(projectToEdit.receptionDate));
            setSiteAddress(projectToEdit.siteAddress || '');
            setDescription(projectToEdit.description || '');
            setDesigner(projectToEdit.designer || '');
            setBuilder(projectToEdit.builder || '');
        } else {
            // Reset all fields
            setConstructionName(''); setLocalization(''); setInvestorName('');
            setInvestorAddress(''); setInvestorCounty(''); setAuthNumber('');
            setAuthDate(''); setAuthDeadline(''); setISCNoticeNr('');
            setISCNoticeDate(''); setReceptionDate(''); setSiteAddress('');
            setDescription(''); setDesigner(''); setBuilder('');
        }
    }, [projectToEdit]);

    // --- Handle Submit ---
    const handleSubmitInternal = async () => {
        if (!constructionName.trim()) {
            alert('Vă rugăm să introduceți Denumirea conform autorizației');
            return;
        }
        setIsSubmitting(true);

        // Base data from form state
        const projectBaseData = {
            name: constructionName, // Use construction name as primary name
            description: description || `Detalii pentru ${constructionName}`,
            updatedAt: new Date(),
            constructionName, localization, investorName, investorAddress,
            investorCounty, authNumber, authDate: authDate || undefined,
            authDeadline: authDeadline || undefined, iscNoticeNumber: iscNoticeNr,
            iscNoticeDate: iscNoticeDate || undefined, receptionDate: receptionDate || undefined,
            siteAddress, designer, builder,
        };

        // Add default tabs only if creating NEW project
        // If editing, the main updateProject logic in Dashboard should handle merging
        let projectDataWithTabs: Omit<Project, 'id' | 'createdAt'>;

        if (projectToEdit) {
            projectDataWithTabs = {
                ...projectBaseData,
                tabs: projectToEdit.tabs // Pass existing tabs when editing
            };
        } else {
             // Define default tabs structure here or receive it via props?
             // For now, let Dashboard handle default tabs on create.
             // Pass only base data, Dashboard will add default tabs.
            projectDataWithTabs = {
                ...projectBaseData,
                // Let Dashboard's handleModalSubmit add default tabs
                 tabs: {
                     general: { checklistItems: [] },
                     technical: { checklistItems: [] },
                     financial: { checklistItems: [] },
                     resources: { checklistItems: [] }
                 }
            };
        }


        try {
            await onSubmit(projectDataWithTabs);
            onClose(); // Close modal on successful submit
        } catch (err) {
             console.error("Modal submit error:", err);
             alert("Eroare la salvare!"); // Show error
             // Keep modal open on error
        } finally {
             setIsSubmitting(false);
        }
    };

    if (!show) return null;

    // --- Render the EXACT form structure and classes ---
    const renderFormContent = () => (
       <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
           {/* Obiectiv Section */}
           <fieldset className="border border-gray-300 p-4 rounded-md">
               <legend className="text-lg font-semibold px-2 text-gray-700">Obiectiv</legend>
               <div className="space-y-3 mt-2">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1"> Denumire conf autorizației de construire </label>
                       <input type="text" value={constructionName} onChange={(e) => setConstructionName(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți denumirea obiectivului" />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1"> Localizare </label>
                       <input type="text" value={localization} onChange={(e) => setLocalization(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți localizarea" />
                   </div>
               </div>
           </fieldset>

           {/* Investitorul Section */}
           <fieldset className="border border-gray-300 p-4 rounded-md">
               <legend className="text-lg font-semibold px-2 text-gray-700">Investitorul</legend>
               <div className="space-y-3 mt-2">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1"> Denumire </label>
                       <input type="text" value={investorName} onChange={(e) => setInvestorName(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți denumirea investitorului" />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1"> Adresa </label>
                       <input type="text" value={investorAddress} onChange={(e) => setInvestorAddress(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți adresa investitorului" />
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1"> Județ </label>
                       <input type="text" value={investorCounty} onChange={(e) => setInvestorCounty(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți județul" />
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
                           <input type="text" value={authNumber} onChange={(e) => setAuthNumber(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Număr autorizație" />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                           <input type="date" value={authDate} onChange={(e) => setAuthDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Termen de execuție</label>
                       <input type="date" value={authDeadline} onChange={(e) => setAuthDeadline(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Nr. anunț ISC</label>
                           <input type="text" value={iscNoticeNr} onChange={(e) => setISCNoticeNr(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Număr anunț ISC" />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Data anunț ISC</label>
                           <input type="date" value={iscNoticeDate} onChange={(e) => setISCNoticeDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Data recepției la terminarea lucrărilor</label>
                       <input type="date" value={receptionDate} onChange={(e) => setReceptionDate(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
                   </div>
               </div>
           </fieldset>

           {/* Adresa Santier Section */}
           <fieldset className="border border-gray-300 p-4 rounded-md">
               <legend className="text-lg font-semibold px-2 text-gray-700">Adresa Șantier</legend>
               <div className="space-y-3 mt-2">
                   <div>
                       <input type="text" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                           placeholder="Introduceți adresa șantierului" />
                   </div>
               </div>
           </fieldset>

            {/* Other Info Section */}
           <fieldset className="border border-gray-300 p-4 rounded-md">
               <legend className="text-lg font-semibold px-2 text-gray-700">Alte Informatii</legend>
               <div className="space-y-3 mt-2">
                  <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Descriere Generală Proiect</label>
                       <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                           className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors min-h-[80px]"
                           placeholder="Descriere succintă a proiectului..." />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Proiectant</label>
                           <input type="text" value={designer} onChange={(e) => setDesigner(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Nume proiectant" />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Constructor</label>
                           <input type="text" value={builder} onChange={(e) => setBuilder(e.target.value)} className="w-full px-3 py-2 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="Nume constructor" />
                       </div>
                   </div>
               </div>
           </fieldset>
       </form>
    );


    return (
        // --- Outer modal container with background ---
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* --- Inner modal card --- */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[90vh]"> {/* Added max-h */}
            {/* --- Header --- */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex-shrink-0">
              {projectToEdit ? 'Editare Detalii Proiect' : 'Creare Proiect Nou'}
            </h2>
            {/* --- Scrollable Content Area --- */}
            <div className="flex-grow overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {renderFormContent()}
            </div>
            {/* --- Footer --- */}
            <div className="flex justify-end space-x-3 flex-shrink-0 border-t pt-4">
              <Button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                Anulare
              </Button>
              <Button onClick={handleSubmitInternal} disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Se salvează...' : (projectToEdit ? 'Salvează Modificările' : 'Creează Proiect')}
              </Button>
            </div>
          </div>
        </div>
    );
}; 