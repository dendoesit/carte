// src/utils/helpers.ts

// Helper to format date string for display (e.g., in PDF)
export const formatDate = (date: string | undefined | null): string => {
    if (!date) return '';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) { return date; }
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) { return 'Data Invalida'; }
      return parsedDate.toISOString().split('T')[0];
    } catch (e) { return 'Eroare Data'; }
};

// Helper to format date string for input type="date"
export const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    try {
      if (dateString.includes('T')) { return dateString.split('T')[0]; }
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) { return dateString; }
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) { return ''; }
};

// Helper to format array for display
export const formatArray = (arr: string[] | undefined): string => {
    if (!arr || arr.length === 0) return '-'; // Return '-' instead of 'Not specified'
    return arr.join(', ');
};

// Add other general utility functions here if needed 