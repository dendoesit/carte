import React, { useRef, DragEvent, ChangeEvent } from 'react';
import { Project, ChecklistItem, UploadedFile } from '@/types/Project';
import { Button } from "@/components/ui/button"; // Adjust path
import { GripVertical, FileText, X as XIcon, Upload, PlusCircle, Save, Trash2 } from 'lucide-react'; // Adjust path
import type { UseProjectTabsReturn } from '@/hooks/useProjectTabs'; // Use 'type' import if only used as type

interface ProiectareTabProps {
    project: Project;
    tabHandlers: UseProjectTabsReturn; // Get all handlers from the hook
}

export const ProiectareTab: React.FC<ProiectareTabProps> = ({ project, tabHandlers }) => {
    const tabKey = 'general'; // Specify the key for this tab
    // --- VERIFY ACCESS: Safely access checklistItems ---
    const checklist = project?.tabs?.[tabKey]?.checklistItems || [];
    console.log(`Rendering ProiectareTab for project ${project?.id}, items count: ${checklist.length}`); // Add console log for debugging

    // Destructure handlers for easier use
    const {
        isSaving,
        draggedItemIndex,
        dragOverItemIndex,
        handleChecklistItemChange,
        handleChecklistLabelChange,
        handleAddCustomChecklistItem,
        handleDeleteChecklistItem,
        handleFileUploadLogic, // Need logic, not simplified handler here
        handleRemoveFile,
        handleDragStartReorder,
        handleDragEnterReorder,
        handleDragLeaveReorder,
        handleDragOverReorder,
        handleDropReorder,
        handleDragEndReorder,
        handleSaveTab
    } = tabHandlers;

    // Ref for drag node needs to be here
    const dragItemNode = useRef<HTMLDivElement | null>(null);

    // File upload trigger (using the logic from hook)
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, itemIndex: number) => {
        const file = event.target.files?.[0] || null;
        await handleFileUploadLogic(file, tabKey, itemIndex);
        if(event.target) event.target.value = ''; // Clear input
    };

    // --- Modified Drag Handlers to use local ref ---
     const localHandleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        dragItemNode.current = e.target as HTMLDivElement; // Set local ref
        handleDragStartReorder(e, index); // Call hook handler
    };

     const localHandleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
         if (!dragItemNode.current || dragItemNode.current === e.target) return;
        handleDragEnterReorder(e, index); // Call hook handler
    };

     const localHandleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDropReorder(e, tabKey); // Call hook handler
        dragItemNode.current = null; // Reset local ref on drop
    };

     const localHandleDragEnd = () => {
        handleDragEndReorder(); // Call hook handler
        dragItemNode.current = null; // Reset local ref on drag end
    };


    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
            {/* --- VERIFY MAP: Ensure checklist is not empty and map runs --- */}
            {checklist.length === 0 && (
                <p className='text-center text-gray-500 italic py-4'>Niciun element de afișat pentru Proiectare.</p> // Message if empty
            )}
            {checklist.map((item, index) => {
                const isBeingDragged = draggedItemIndex === index;
                const isDragTarget = dragOverItemIndex !== null && dragOverItemIndex === index && !isBeingDragged;

                // --- Add console log here ---
                if (item.file) {
                    console.log(`Item ${index} file URL for link:`, item.file.url);
                }
                // --- End console log ---

                return (
                    <div 
                        key={item.id} 
                        draggable
                        onDragStart={(e) => localHandleDragStart(e, index)}
                        onDragEnter={(e) => localHandleDragEnter(e, index)}
                        onDragLeave={handleDragLeaveReorder}
                        onDragOver={handleDragOverReorder}
                        onDrop={localHandleDrop}
                        onDragEnd={localHandleDragEnd}
                        className={`flex items-center justify-between gap-4 p-3 rounded-lg border transition-all duration-150 ease-in-out cursor-move ${
                            isBeingDragged
                              ? 'opacity-50 bg-blue-100 border-blue-300'
                              : isDragTarget
                              ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                    >
                        {/* Drag Handle */} <div className="text-gray-400 hover:text-gray-600 px-1 flex-shrink-0"> <GripVertical size={18} /> </div>
                        {/* Checkbox & Label */}
                        <div className="flex items-center flex-grow gap-3 ml-1">
                            <input
                                type="checkbox"
                                id={`checkbox-${tabKey}-${item.id}`}
                                checked={item.checked}
                                onChange={(e) => handleChecklistItemChange(tabKey, index, e.target.checked)}
                                className="h-5 w-5 flex-shrink-0 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleChecklistLabelChange(tabKey, index, e.target.value)}
                                className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 focus:outline-none p-0 flex-grow"
                                placeholder="Nume document"
                            />
                        </div>
                        {/* File & Delete */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                           {item.file ? (
                                <>
                                  <div className="flex items-center gap-1 text-sm text-gray-600 overflow-hidden max-w-[150px]" title={item.file.name}>
                                      <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                      <span className="truncate">{item.file.name}</span>
                                  </div>
                                  <a
                                      href={item.file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary-600 hover:text-primary-800 font-medium px-2 py-1 rounded hover:bg-primary-50"
                                      title="Vizualizează PDF"
                                  >
                                      Vizualizează
                                  </a>
                                  <button onClick={() => handleRemoveFile(tabKey, index)} className="text-xs text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"><XIcon size={14}/></button>
                                </>
                           ) : (
                                <>
                                    <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, index)} className="hidden" id={`file-${tabKey}-${index}`} disabled={isSaving} />
                                    <label htmlFor={`file-${tabKey}-${index}`} className={`flex items-center gap-1 text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-2 py-1 rounded cursor-pointer transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}> <Upload className="w-3 h-3" /> {isSaving ? '...' : 'Încarcă PDF'} </label>
                                </>
                           )}
                            <button onClick={() => handleDeleteChecklistItem(tabKey, index)} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50" title="Șterge Element"> <Trash2 size={16} /> </button>
                        </div>
                    </div>
                );
            })}
            {/* Add Button */} <div className="flex justify-center pt-4 mt-4 border-t"> <Button onClick={() => handleAddCustomChecklistItem(tabKey)} variant="outline" className="flex items-center gap-2 text-primary-600 border-primary-300 hover:bg-primary-50"> <PlusCircle size={18} /> Adaugă Document Nou </Button></div>
            {/* Save Button */} <div className="flex justify-end pt-4 mt-2"> <Button onClick={() => handleSaveTab(tabKey)} disabled={isSaving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"> <Save className="w-4 h-4" /> {isSaving ? 'Se salvează...' : 'Salvează Modificările'} </Button></div>
        </div>
      </div>
    );
}; 