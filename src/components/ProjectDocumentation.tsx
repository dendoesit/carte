import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/types/Project";
import PdfExportButton from "./PdfExportButton";

interface ProjectDocumentationProps {
  project: Project;
}

export default function ProjectDocumentation({ project }: ProjectDocumentationProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Documentație Proiect</h2>
        <PdfExportButton project={project} />
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Informații Generale</TabsTrigger>
          <TabsTrigger value="technical">Specificații Tehnice</TabsTrigger>
          <TabsTrigger value="financial">Financiar</TabsTrigger>
          <TabsTrigger value="resources">Resurse</TabsTrigger>
        </TabsList>

        {/* General Information */}
        <TabsContent value="general">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informații Generale</h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Nume Proiect: </span>
                <span>{project.name}</span>
              </div>
              <div>
                <span className="font-semibold">Descriere: </span>
                <span>{project.description}</span>
              </div>
              <div>
                <span className="font-semibold">Nume Construcție: </span>
                <span>{project.constructionName}</span>
              </div>
              <div>
                <span className="font-semibold">Adresă: </span>
                <span>{project.address}</span>
              </div>
              <div>
                <span className="font-semibold">Beneficiar: </span>
                <span>{project.beneficiary}</span>
              </div>
              <div>
                <span className="font-semibold">Proiectant: </span>
                <span>{project.designer}</span>
              </div>
              <div>
                <span className="font-semibold">Constructor: </span>
                <span>{project.builder}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Technical Specifications */}
        <TabsContent value="technical">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Specificații Tehnice</h2>
            <div className="space-y-4">
              {project.tabs?.technical && (
                <>
                  <div>
                    <span className="font-semibold">Tehnologii: </span>
                    <span>{project.tabs.technical.technologies?.join(", ") || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Complexitate: </span>
                    <span>{project.tabs.technical.complexity || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Descriere Produs: </span>
                    <span>{project.tabs.technical.productDescription || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Caracteristici Tehnice: </span>
                    <span>{project.tabs.technical.technicalCharacteristics || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Condiții de Producție: </span>
                    <span>{project.tabs.technical.productionConditions || "-"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Financial Information */}
        <TabsContent value="financial">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informații Financiare</h2>
            <div className="space-y-4">
              {project.tabs?.financial && (
                <>
                  <div>
                    <span className="font-semibold">Buget: </span>
                    <span>{project.tabs.financial.budget || 0} {project.tabs.financial.currency || "RON"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Cost Estimat: </span>
                    <span>{project.tabs.financial.estimatedCost || 0} {project.tabs.financial.currency || "RON"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Marjă de Profit: </span>
                    <span>{project.tabs.financial.profitMargin || 0}%</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resurse</h2>
            <div className="space-y-4">
              {project.tabs?.resources && (
                <>
                  <div>
                    <span className="font-semibold">Membri Echipă: </span>
                    <span>{project.tabs.resources.teamMembers?.join(", ") || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Abilități Necesare: </span>
                    <span>{project.tabs.resources.requiredSkills?.join(", ") || "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Echipamente Necesare: </span>
                    <span>{project.tabs.resources.equipmentNeeded?.join(", ") || "-"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 