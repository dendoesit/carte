import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfExportButtons from "@/components/PdfExportButtons";

export default function DocumentationTabs() {
  // Create refs for each tab content
  const generalInfoRef = useRef<HTMLDivElement>(null);
  const technicalSpecsRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">Informații Generale</TabsTrigger>
        <TabsTrigger value="technical">Specificații Tehnice</TabsTrigger>
        <TabsTrigger value="requirements">Cerințe</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <PdfExportButtons 
          contentRef={generalInfoRef}
          pageName="General Information"
        />
        <div ref={generalInfoRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your general info content */}
        </div>
      </TabsContent>

      <TabsContent value="technical">
        <PdfExportButtons 
          contentRef={technicalSpecsRef}
          pageName="Technical Specifications"
        />
        <div ref={technicalSpecsRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your technical specs content */}
        </div>
      </TabsContent>

      <TabsContent value="requirements">
        <PdfExportButtons 
          contentRef={requirementsRef}
          pageName="Requirements"
        />
        <div ref={requirementsRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your requirements content */}
        </div>
      </TabsContent>
    </Tabs>
  );
} 