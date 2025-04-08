export type Complexity = "Low" | "Medium" | "High";
export type Currency = "RON" | "EUR" | "USD";

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export interface GeneralTab {
  startDate: string;
  endDate: string;
  projectType: string;
  clientName: string;
  uploadedFiles?: UploadedFile[];
}

export interface TechnicalTab {
  technologies: string[];
  complexity: Complexity;
  specifications: string;
  productDescription: string;
  technicalCharacteristics: string;
  productionConditions: string;
  technicalRequirements: string;
  uploadedFiles?: UploadedFile[];
}

export interface FinancialTab {
  budget: number;
  estimatedCost: number;
  currency: Currency;
  profitMargin: number;
  uploadedFiles?: UploadedFile[];
}

export interface ResourcesTab {
  teamMembers: string[];
  requiredSkills: string[];
  equipmentNeeded: string[];
  uploadedFiles?: UploadedFile[];
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