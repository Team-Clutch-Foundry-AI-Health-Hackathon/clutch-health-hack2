'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Microscope, Scan, Pill, Plus, Stethoscope, ClipboardList, FileBarChart } from "lucide-react";
import PatientBiodata from "@/components/PatientBiodata";
import PatientHistory from "@/components/PatientHistory";
import ExaminationNotes from "@/components/ExaminationNotes";
import Investigations from "@/components/Investigations";
import LabRequests from "@/components/LabRequests";
import ImagingRequests from "@/components/ImagingRequests";
import MedicationOrders from "@/components/MedicationOrders";
import { VisitSummary } from "@/components/VisitSummary";

// Sample visit data from VisitSummary.tsx
const sampleVisitData = {
  patient_id: "patient-001",
  visit_date: new Date().toISOString(),
  biodata: {
    name: "Mr. Mutuma Mwani",
    age: 72,
    gender: "male",
    occupation: "Retired teacher",
    marital_status: "Married",
    residence: "Mwiki"
  },
  chief_complaint: "Difficulty in urination for 6 months",
  history_present_illness: "Onset: Gradual\nProgression: Worsening urinary stream, increased frequency, especially nocturia (3–4 times per night).\nAssociated symptoms: Hesitancy, intermittency, straining, sensation of incomplete voiding. No hematuria or dysuria initially.\nPain: Mild perineal discomfort.\nWeight loss (~5 kg in 3 months) and fatigue noted recently.",
  past_medical_history: "Hypertension for 10 years, well controlled.\nNo previous urological interventions.",
  family_history: "Father died of 'prostate problems' in his 80s.",
  social_history: "Non-smoker, moderate alcohol intake.\nSedentary lifestyle.",
  review_of_systems: "No lower limb weakness or numbness.\nNo constipation or back pain.",
  physical_examination: {
    vital_signs: "BP 135/85 mmHg, HR 78 bpm, afebrile",
    general_examination: "Appears elderly, mildly cachectic",
    systemic_examination: "Abdominal Exam: No masses or organomegaly. Bladder not palpable.\nNeurological Exam: Normal lower limb motor and sensory functions. Intact anal sphincter tone.",
    special_examinations: "Digital Rectal Examination (DRE): Prostate: Hard, irregular surface with nodularity, especially on the right lobe. Median sulcus obliterated. No tenderness."
  },
  investigations: [
    {
      type: "laboratory",
      name: "PSA (Prostate Specific Antigen)",
      results: "55 ng/mL",
      reference_values: "normal < 4 ng/mL",
      interpretation: "Significantly elevated, concerning for prostate malignancy"
    },
    {
      type: "laboratory",
      name: "Full Blood Count",
      results: "Mild normocytic normochromic anemia (Hb 11 g/dL)",
      interpretation: "Mild anemia, possibly related to chronic disease"
    },
    {
      type: "laboratory",
      name: "Renal Function Tests",
      results: "Urea 12 mmol/L, Creatinine 140 µmol/L",
      interpretation: "Suggesting post-renal obstruction"
    },
    {
      type: "imaging",
      name: "TRUS (Transrectal Ultrasound)",
      results: "Hypoechoic lesion in peripheral zone of prostate",
      interpretation: "Suspicious for malignancy"
    },
    {
      type: "imaging",
      name: "MRI Pelvis",
      results: "Extracapsular extension, likely seminal vesicle invasion",
      interpretation: "Advanced local disease"
    },
    {
      type: "imaging",
      name: "Bone Scan",
      results: "Multiple sclerotic lesions in the lumbar spine and pelvis",
      interpretation: "Metastatic disease"
    },
    {
      type: "histology",
      name: "Prostate Biopsy",
      results: "Adenocarcinoma, Gleason score 8 (4+4)",
      interpretation: "High-grade prostate cancer"
    }
  ],
  user_id: "clutch-user-123"
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health Management Information System
          </h1>
          <p className="text-gray-600">
            Streamlined health record management for healthcare professionals
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Patients</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="examination" className="flex items-center gap-2">
              <Stethoscope size={16} />
              <span className="hidden sm:inline">Exam</span>
            </TabsTrigger>
            <TabsTrigger value="investigations" className="flex items-center gap-2">
              <ClipboardList size={16} />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center gap-2">
              <Microscope size={16} />
              <span className="hidden sm:inline">Lab</span>
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center gap-2">
              <Scan size={16} />
              <span className="hidden sm:inline">Imaging</span>
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill size={16} />
              <span className="hidden sm:inline">Meds</span>
            </TabsTrigger>
            <TabsTrigger value="visit-summary" className="flex items-center gap-2">
              <FileBarChart size={16} />
              <span className="hidden sm:inline">Visit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <PatientBiodata sampleData={sampleVisitData.biodata} />
          </TabsContent>

          <TabsContent value="history">
            <PatientHistory 
              sampleData={{
                presenting_complaint: sampleVisitData.chief_complaint,
                history_of_presenting_illness: sampleVisitData.history_present_illness,
                past_medical_history: sampleVisitData.past_medical_history,
                family_history: sampleVisitData.family_history,
                social_history: sampleVisitData.social_history,
                review_of_systems: sampleVisitData.review_of_systems
              }} 
            />
          </TabsContent>

          <TabsContent value="examination">
            <ExaminationNotes sampleData={sampleVisitData.physical_examination} />
          </TabsContent>

          <TabsContent value="investigations">
            <Investigations sampleData={sampleVisitData.investigations} />
          </TabsContent>

          <TabsContent value="lab">
            <LabRequests sampleData={sampleVisitData.investigations.filter(inv => inv.type === 'laboratory')} />
          </TabsContent>

          <TabsContent value="imaging">
            <ImagingRequests sampleData={sampleVisitData.investigations.filter(inv => inv.type === 'imaging')} />
          </TabsContent>

          <TabsContent value="medication">
            <MedicationOrders />
          </TabsContent>

          <TabsContent value="visit-summary">
            <VisitSummary visitSummaryData={sampleVisitData} onClose={function (): void {
              // This function can be implemented if there's a need to close the summary from within the component
              // For now, it's a placeholder as the modal handles its own close state.
            } } />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
