export type Complexity = "Low" | "Medium" | "High";
export type Currency = "RON" | "EUR" | "USD";

export interface UploadedFile {
  name: string;
  url: string;
  type?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  file: UploadedFile | null;
}

export interface GeneralTab {
  checklistItems: ChecklistItem[];
}

export interface TechnicalTab {
  checklistItems: ChecklistItem[];
}

export interface FinancialTab {
  checklistItems: ChecklistItem[];
}

export interface ResourcesTab {
  checklistItems: ChecklistItem[];
}

export interface ProjectTabs {
  general: GeneralTab;
  technical: TechnicalTab;
  financial: FinancialTab;
  resources: ResourcesTab;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  constructionName?: string;
  address?: string;
  beneficiary?: string;
  investorAddress?: string;
  investorCounty?: string;
  authNumber?: string;
  authDate?: string;
  authDeadline?: string;
  iscNoticeNumber?: string;
  iscNoticeDate?: string;
  receptionDate?: string;
  siteAddress?: string;
  designer?: string;
  builder?: string;
  createdAt: Date;
  updatedAt: Date;
  tabs: {
    general: GeneralTab;
    technical: TechnicalTab;
    financial: FinancialTab;
    resources: ResourcesTab;
  };
}