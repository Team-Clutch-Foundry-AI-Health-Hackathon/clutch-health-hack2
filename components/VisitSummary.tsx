import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText, Copy, Send, Activity, AlertTriangle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ClinicalAnalysis } from "@/lib/openai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VisitSummaryData {
  patient_id: string;
  visit_date: string;
  biodata: {
    name: string;
    age: number;
    gender: string;
    occupation?: string;
    marital_status?: string;
    residence: string;
  };
  chief_complaint: string;
  history_present_illness: string;
  past_medical_history?: string;
  family_history?: string;
  social_history?: string;
  review_of_systems?: string;
  physical_examination: {
    vital_signs?: string;
    general_examination?: string;
    systemic_examination: string;
    special_examinations?: string;
  };
  investigations: Array<{
    type: string;
    name: string;
    results: string;
    reference_values?: string;
    interpretation?: string;
  }>;
  clinical_notes?: string;
  assessment_plan?: string;
  user_id: string;
}

const VisitSummary = () => {
  const [currentVisit, setCurrentVisit] = useState<VisitSummaryData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    clinical_notes: "",
    assessment_plan: ""
  });
  const { toast } = useToast();

  // Sample visit data based on the case provided
  const sampleVisit: VisitSummaryData = {
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
    user_id: "user-1"
  };

  const generateRAGPayload = (visit: VisitSummaryData) => {
    return {
      visit_id: `visit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      patient_data: visit,
      clinical_summary: {
        primary_diagnosis: "Prostate Cancer T3N0M1 (Gleason 8)",
        key_findings: [
          "Significantly elevated PSA (55 ng/mL)",
          "Hard, irregular prostate on DRE",
          "High-grade adenocarcinoma (Gleason 8)",
          "Extracapsular extension on MRI",
          "Bone metastases on bone scan"
        ],
        red_flags: [
          "Weight loss",
          "Bone metastases",
          "High Gleason score",
          "Elevated creatinine"
        ]
      },
      metadata: {
        case_complexity: "high",
        urgency_level: "urgent",
        specialty_required: ["oncology", "urology"],
        created_by: visit.user_id
      }
    };
  };

  const handleLoadSampleCase = () => {
    setCurrentVisit(sampleVisit);
    toast({
      title: "Sample Case Loaded",
      description: "Mr. Mutuma Mwani's case has been loaded successfully.",
    });
  };

  const handleExportRAG = () => {
    if (!currentVisit) return;
    
    const payload = generateRAGPayload(currentVisit);
    const jsonString = JSON.stringify(payload, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(jsonString);
    
    // Also trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-${currentVisit.patient_id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "RAG Payload Generated",
      description: "Visit data has been formatted for RAG system and copied to clipboard.",
    });
  };

  const handleAnalyzeWithAI = async () => {
    if (!currentVisit) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visit_summary: currentVisit,
          type: 'clinical_analysis'
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const analysisResult = await response.json();
      setAnalysis(analysisResult);
      setShowAnalysis(true);
      
      toast({
        title: "Analysis Complete",
        description: "The visit summary has been analyzed by AI.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Unable to analyze the visit summary. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendToRAG = async () => {
    if (!currentVisit) return;
    
    setIsSending(true);
    try {
      const payload = generateRAGPayload(currentVisit);
      const response = await fetch('http://jw408ssgw800osg0o0cok4kw.4.222.184.96.sslip.io', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error:', errorData || response.statusText);
        throw new Error(errorData?.message || response.statusText || 'Failed to send data to RAG model');
      }

      toast({
        title: "Success",
        description: "Visit summary sent to RAG model successfully",
      });
    } catch (error) {
      console.error('Error sending to RAG:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send visit summary to RAG model",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const renderAnalysisContent = () => {
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Primary Diagnosis</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.diagnosis.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Differential Diagnosis</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.differentialDiagnosis.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Recommended Tests</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.recommendedTests.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Treatment Plan</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.treatmentPlan.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Follow-up Recommendations</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.followUpRecommendations.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${
          analysis.urgency === 'urgent'
            ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : analysis.urgency === 'soon'
            ? 'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            : 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-5 w-5 mr-2 ${
              analysis.urgency === 'urgent'
                ? 'text-red-600 dark:text-red-400'
                : analysis.urgency === 'soon'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
            <h4 className="font-medium">Urgency Level: {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}</h4>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Visit Summary</h2>
          <p className="text-gray-600">Compile and export visit data for RAG systems</p>
        </div>
        <div className="flex gap-2">
          {!currentVisit && (
            <Button onClick={handleLoadSampleCase} variant="outline" className="flex items-center gap-2">
              <FileText size={16} />
              Load Sample Case
            </Button>
          )}
          {currentVisit && (
            <>
              <Button onClick={handleExportRAG} className="flex items-center gap-2">
                <Download size={16} />
                Export RAG Payload
              </Button>
              <Button 
                onClick={handleAnalyzeWithAI} 
                className="flex items-center gap-2"
                disabled={isAnalyzing}
              >
                <Activity size={16} />
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>
              {analysis && (
                <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye size={16} />
                      View AI Analysis
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>AI Analysis Results</DialogTitle>
                      <DialogDescription>
                        Analysis of the visit summary by AI
                      </DialogDescription>
                    </DialogHeader>
                    {renderAnalysisContent()}
                  </DialogContent>
                </Dialog>
              )}
              <Button 
                onClick={handleSendToRAG} 
                className="flex items-center gap-2"
                disabled={isSending}
              >
                <Send size={16} />
                {isSending ? "Sending..." : "Send to RAG"}
              </Button>
            </>
          )}
        </div>
      </div>

      {currentVisit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Visit Summary - {currentVisit.biodata.name}</CardTitle>
            <CardDescription>
              Visit Date: {new Date(currentVisit.visit_date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Demographics */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">Patient Demographics</Label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div><strong>Name:</strong> {currentVisit.biodata.name}</div>
                <div><strong>Age:</strong> {currentVisit.biodata.age} years</div>
                <div><strong>Gender:</strong> {currentVisit.biodata.gender}</div>
                <div><strong>Occupation:</strong> {currentVisit.biodata.occupation}</div>
                <div><strong>Marital Status:</strong> {currentVisit.biodata.marital_status}</div>
                <div><strong>Residence:</strong> {currentVisit.biodata.residence}</div>
              </div>
            </div>

            {/* Clinical History */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">Clinical History</Label>
              <div className="mt-2 space-y-3">
                <div>
                  <strong>Chief Complaint:</strong>
                  <p className="text-gray-700">{currentVisit.chief_complaint}</p>
                </div>
                <div>
                  <strong>History of Present Illness:</strong>
                  <p className="text-gray-700 whitespace-pre-wrap">{currentVisit.history_present_illness}</p>
                </div>
              </div>
            </div>

            {/* Physical Examination */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">Physical Examination</Label>
              <div className="mt-2 space-y-2">
                <div><strong>Vital Signs:</strong> {currentVisit.physical_examination.vital_signs}</div>
                <div><strong>General:</strong> {currentVisit.physical_examination.general_examination}</div>
                <div><strong>Systemic:</strong> {currentVisit.physical_examination.systemic_examination}</div>
                <div><strong>Special:</strong> {currentVisit.physical_examination.special_examinations}</div>
              </div>
            </div>

            {/* Investigations */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">Investigations</Label>
              <div className="mt-2 space-y-2">
                {currentVisit.investigations.map((inv, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{inv.name} ({inv.type})</div>
                    <div><strong>Result:</strong> {inv.results}</div>
                    {inv.reference_values && <div><strong>Reference:</strong> {inv.reference_values}</div>}
                    {inv.interpretation && <div><strong>Interpretation:</strong> {inv.interpretation}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* RAG Export Preview */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Label className="text-lg font-semibold text-blue-800">RAG System Payload Preview</Label>
              <p className="text-sm text-blue-600 mt-1">
                This visit data will be formatted with metadata for optimal RAG system processing
              </p>
              <div className="mt-3">
                <Button onClick={handleExportRAG} className="w-full">
                  <Download size={16} className="mr-2" />
                  Generate & Export RAG Payload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentVisit && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Current Visit</h3>
            <p className="text-gray-600 mb-4">
              Load the sample case or create a new visit summary to export data for RAG systems.
            </p>
            <Button onClick={handleLoadSampleCase}>
              Load Sample Case (Mr. Mutuma Mwani)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitSummary;
