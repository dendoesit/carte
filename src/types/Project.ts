export type Complexity = "Low" | "Medium" | "High";
export type Currency = "RON" | "EUR" | "USD";

interface UploadedFile {
  name: string;
  url: string;
}

export interface GeneralTab {
  startDate: string;
  endDate: string;
  projectType: string;
  clientName: string;
  uploadedFile?: UploadedFile;
}

export interface TechnicalTab {
  technologies: string[];
  complexity: Complexity;
  specifications: string;
  productDescription: string;
  technicalCharacteristics: string;
  productionConditions: string;
  technicalRequirements: string;
  uploadedFile?: UploadedFile;
}

export interface FinancialTab {
  budget: number;
  estimatedCost: number;
  currency: Currency;
  profitMargin: number;
  uploadedFile?: UploadedFile;
}

export interface ResourcesTab {
  teamMembers: string[];
  requiredSkills: string[];
  equipmentNeeded: string[];
  uploadedFile?: UploadedFile;
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
  constructionName: string;
  address: string;
  beneficiary: string;
  designer: string;
  builder: string;
  createdAt: Date;
  updatedAt: Date;
  tabs: {
    general: GeneralTab;
    technical: TechnicalTab;
    financial: FinancialTab;
    resources: ResourcesTab;
  };
}