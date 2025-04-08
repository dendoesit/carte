import { useState, useCallback, DragEvent, Dispatch, SetStateAction } from 'react';
import { Project, ChecklistItem, UploadedFile } from '@/types/Project'; // Adjust path if needed
import { useProjects } from '@/context/ProjectContext'; // To get updateProject

// Define Tab keys that use the checklist structure
type ChecklistTabKey = 'general' | 'technical' | 'financial' | 'resources';

// Define the shape of the props the hook expects
interface UseProjectTabsProps {
    selectedProject: Project | null;
    setSelectedProject: Dispatch<SetStateAction<Project | null>>;
}

// Define the shape of the object returned by the hook
export interface UseProjectTabsReturn {
    isSaving: boolean;
    draggedItemIndex: number | null;
    dragOverItemIndex: number | null;
    handleChecklistItemChange: (tab: ChecklistTabKey, index: number, checked: boolean) => void;
    handleChecklistLabelChange: (tab: ChecklistTabKey, index: number, newLabel: string) => void;
    handleAddCustomChecklistItem: (tab: ChecklistTabKey) => void;
    handleDeleteChecklistItem: (tab: ChecklistTabKey, index: number) => void;
    handleFileUploadLogic: (file: File | null, tab: ChecklistTabKey, itemIndex: number) => Promise<boolean>;
    handleRemoveFile: (tab: ChecklistTabKey, itemIndex: number) => void;
    handleDragStartReorder: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleDragEnterReorder: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleDragLeaveReorder: (e: DragEvent<HTMLDivElement>) => void;
    handleDragOverReorder: (e: DragEvent<HTMLDivElement>) => void;
    handleDropReorder: (e: DragEvent<HTMLDivElement>, tab: ChecklistTabKey) => void;
    handleDragEndReorder: () => void;
    handleSaveTab: (tab: ChecklistTabKey) => Promise<void>;
}

export function useProjectTabs({ selectedProject, setSelectedProject }: UseProjectTabsProps): UseProjectTabsReturn {
    const { updateProject } = useProjects(); // Get the update function from context
    const [isSaving, setIsSaving] = useState(false);

    // --- Drag and Drop State ---
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
    // Note: dragItemNode ref needs to be managed within the component using the hook

    // --- Checklist Handlers ---
    const handleChecklistItemChange = useCallback((tab: ChecklistTabKey, index: number, checked: boolean) => {
        if (!selectedProject) return;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return;
        const updatedChecklist = [...currentTab.checklistItems];
        if (updatedChecklist[index]) {
            updatedChecklist[index] = { ...updatedChecklist[index], checked };
            setSelectedProject(prev => prev ? { ...prev, tabs: { ...prev.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } } : null);
        }
    }, [selectedProject, setSelectedProject]);

    const handleChecklistLabelChange = useCallback((tab: ChecklistTabKey, index: number, newLabel: string) => {
        if (!selectedProject) return;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return;
        const updatedChecklist = [...currentTab.checklistItems];
        if (updatedChecklist[index]) {
            updatedChecklist[index] = { ...updatedChecklist[index], label: newLabel };
            setSelectedProject(prev => prev ? { ...prev, tabs: { ...prev.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } } : null);
        }
    }, [selectedProject, setSelectedProject]);

    const handleAddCustomChecklistItem = useCallback((tab: ChecklistTabKey) => {
        if (!selectedProject) return;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab) return;
        const newItem: ChecklistItem = { id: `custom-${Date.now()}`, label: "Document Nou", checked: true, file: null };
        const currentChecklist = currentTab.checklistItems || [];
        const updatedChecklist = [...currentChecklist, newItem];
        setSelectedProject(prev => prev ? { ...prev, tabs: { ...prev.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } } : null);
    }, [selectedProject, setSelectedProject]);

    const handleDeleteChecklistItem = useCallback((tab: ChecklistTabKey, index: number) => {
        if (!selectedProject) return;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return;
        const currentItems = currentTab.checklistItems;
        const itemToRemove = currentItems[index];
        if (!itemToRemove || !window.confirm(`Ștergeți "${itemToRemove.label}"?`)) return;
        if (itemToRemove.file?.url.startsWith('blob:')) { URL.revokeObjectURL(itemToRemove.file.url); }
        const updatedChecklist = currentItems.filter((_, i) => i !== index);
        setSelectedProject(prev => prev ? { ...prev, tabs: { ...prev.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } } : null);
    }, [selectedProject, setSelectedProject]);

    // --- File Handling ---
    const handleFileUploadLogic = useCallback(async (file: File | null, tab: ChecklistTabKey, itemIndex: number): Promise<boolean> => {
        if (!file || !selectedProject || itemIndex === undefined || itemIndex < 0) return false;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return false;
        if (file.type !== 'application/pdf' || file.size > 10 * 1024 * 1024) { alert('Invalid file'); return false; }
        const checklist = currentTab.checklistItems;
        const currentItem = checklist[itemIndex];
        if (!currentItem) return false;
        if (currentItem.file?.url.startsWith('blob:')) { URL.revokeObjectURL(currentItem.file.url); }

        setIsSaving(true);
        try {
            const fileUrl = URL.createObjectURL(file);
            const newFileEntry: UploadedFile = { name: file.name, url: fileUrl, type: file.type };
            const updatedChecklist = [...checklist];
            updatedChecklist[itemIndex] = { ...currentItem, file: newFileEntry };
            const updatedProjectData = { tabs: { ...selectedProject.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } };
            await updateProject(selectedProject.id, updatedProjectData); // Save to backend immediately
            setSelectedProject(prev => prev ? { ...prev, ...updatedProjectData } : null); // Update local state
            return true;
        } catch (error) { console.error('Upload error:', error); alert('Upload failed'); return false; }
        finally { setIsSaving(false); }
    }, [selectedProject, setSelectedProject, updateProject]);

    // Simplified remove for checklist tabs
    const handleRemoveFile = useCallback(async (tab: ChecklistTabKey, itemIndex: number) => {
        if (!selectedProject) return;
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return;
        const checklist = currentTab.checklistItems;
        const currentItem = checklist[itemIndex];
        if (!currentItem || !currentItem.file) return;
        if (currentItem.file.url.startsWith('blob:')) { URL.revokeObjectURL(currentItem.file.url); }

        setIsSaving(true);
        const updatedChecklist = [...checklist];
        updatedChecklist[itemIndex] = { ...currentItem, file: null };
        const updatedProjectData = { tabs: { ...selectedProject.tabs, [tab]: { ...currentTab, checklistItems: updatedChecklist } } };

        try {
            await updateProject(selectedProject.id, updatedProjectData);
            setSelectedProject(prev => prev ? { ...prev, ...updatedProjectData } : null);
        } catch (error: any) {
            console.error('Remove file error:', error);
            alert('Remove failed');
        } finally {
            setIsSaving(false);
        }
    }, [selectedProject, setSelectedProject, updateProject]);


    // --- Reorder Handlers ---
    const handleDragStartReorder = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragEnterReorder = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedItemIndex !== index) { setDragOverItemIndex(index); }
    }, [draggedItemIndex]);

    const handleDragLeaveReorder = useCallback((e: DragEvent<HTMLDivElement>) => {
        const relatedTarget = e.relatedTarget as Node;
        if (!e.currentTarget.contains(relatedTarget)) {
            // setDragOverItemIndex(null); // Optional: reset visual cue
        }
    }, []);

     const handleDragOverReorder = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); }, []);

    const handleDropReorder = useCallback((e: DragEvent<HTMLDivElement>, tab: ChecklistTabKey) => {
        e.preventDefault();
        if (draggedItemIndex === null || dragOverItemIndex === null || draggedItemIndex === dragOverItemIndex || !selectedProject) {
            setDraggedItemIndex(null); setDragOverItemIndex(null); return; // Invalid drop
        }
        const currentTab = selectedProject.tabs[tab];
        if (!currentTab?.checklistItems) return;

        const currentItems = [...currentTab.checklistItems];
        const [draggedItem] = currentItems.splice(draggedItemIndex, 1);
        currentItems.splice(dragOverItemIndex, 0, draggedItem);

        setSelectedProject(prev => prev ? { ...prev, tabs: { ...prev.tabs, [tab]: { ...currentTab, checklistItems: currentItems } } } : null);
        setDraggedItemIndex(null); setDragOverItemIndex(null);

        // Maybe trigger save here or set a 'dirty' flag
    }, [draggedItemIndex, dragOverItemIndex, selectedProject, setSelectedProject]);

    const handleDragEndReorder = useCallback(() => {
        setDraggedItemIndex(null); setDragOverItemIndex(null);
    }, []);

    // --- Save Handler ---
    const handleSaveTab = useCallback(async (tab: ChecklistTabKey) => {
        if (!selectedProject) return;
        setIsSaving(true);
        try {
            const allTabsData = { tabs: selectedProject.tabs };
            await updateProject(selectedProject.id, allTabsData);
            console.log(`Saved changes for tab: ${tab}`);
            alert('Modificări salvate!');
        } catch (error) {
            console.error(`Error saving tab ${tab}:`, error);
            alert('Eroare la salvare!');
        } finally {
            setIsSaving(false);
        }
    }, [selectedProject, updateProject]);


    return {
        isSaving,
        draggedItemIndex,
        dragOverItemIndex,
        handleChecklistItemChange,
        handleChecklistLabelChange,
        handleAddCustomChecklistItem,
        handleDeleteChecklistItem,
        handleFileUploadLogic,
        handleRemoveFile,
        handleDragStartReorder,
        handleDragEnterReorder,
        handleDragLeaveReorder,
        handleDragOverReorder,
        handleDropReorder,
        handleDragEndReorder,
        handleSaveTab,
    };
} 