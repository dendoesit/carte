import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfExportButtons from "@/components/PdfExportButtons";

export default function DocumentationTabs() {
  // Create refs for each tab content
  const generalInfoRef = useRef<HTMLDivElement>(null);
  const technicalSpecsRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);

  // Array of all refs for the "Export All" functionality
  const allTabRefs = [generalInfoRef, technicalSpecsRef, requirementsRef];

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">Informații Generale</TabsTrigger>
        <TabsTrigger value="technical">Specificații Tehnice</TabsTrigger>
        <TabsTrigger value="requirements">Cerințe</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <PdfExportButtons 
          tabRef={generalInfoRef}
          tabName="Informații Generale"
          allTabRefs={allTabRefs}
        />
        <div ref={generalInfoRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your general info content */}
        </div>
      </TabsContent>

      <TabsContent value="technical">
        <PdfExportButtons 
          tabRef={technicalSpecsRef}
          tabName="Specificații Tehnice"
          allTabRefs={allTabRefs}
        />
        <div ref={technicalSpecsRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your technical specs content */}
        </div>
      </TabsContent>

      <TabsContent value="requirements">
        <PdfExportButtons 
          tabRef={requirementsRef}
          tabName="Cerințe"
          allTabRefs={allTabRefs}
        />
        <div ref={requirementsRef} className="p-4 bg-white rounded-lg shadow">
          {/* Your requirements content */}
        </div>
      </TabsContent>
    </Tabs>
  );
} 