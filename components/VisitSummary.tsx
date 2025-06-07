import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText, Copy, Send, Activity, AlertTriangle, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { HealthAnalysis } from "@/lib/openai";
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

interface VisitSummaryProps {
  visitSummaryData: VisitSummaryData;
  onClose: () => void;
}

interface Reference {
  title: string;
  journal: string;
  year: string;
  url: string;
}

interface PastCase {
  date: string;
  diagnosis: string[];
  treatment: string[];
  outcome: string[];
}

export function VisitSummary({ visitSummaryData, onClose }: VisitSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<HealthAnalysis | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showAnalysisResultOnPage, setShowAnalysisResultOnPage] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/health/load-cases', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      setUploadedFile(file);
      toast({
        title: "Success",
        description: "Past medical cases have been loaded and will be used for analysis.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to load past medical cases. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!uploadedFile) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a PDF file first before analyzing.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'clinical_analysis',
          visit_summary: {
            ...visitSummaryData,
          }
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const analysisResult: HealthAnalysis = await response.json();
      setAiAnalysisResult(analysisResult);
      setShowAnalysisModal(true);
      setShowAnalysisResultOnPage(true);
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

  const renderAnalysisContent = (analysis: HealthAnalysis | null) => {
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Primary Diagnosis</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.diagnosis.guidelines.map((guideline: string, index: number) => (
              <li key={index} className="text-muted-foreground">{guideline}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Recommended Next Steps</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.diagnosis.nextSteps.map((step: string, index: number) => (
              <li key={index} className="text-muted-foreground">{step}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Prognosis Analysis</h4>
          <div className="space-y-3">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <h5 className="font-medium mb-1">Based on Current Research</h5>
              <p className="text-muted-foreground">{analysis.prognosis.researchBased}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <h5 className="font-medium mb-1">Based on Similar Past Cases</h5>
              <p className="text-muted-foreground">{analysis.prognosis.visitBased}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Final Recommendation</h4>
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-muted-foreground">{analysis.finalRecommendation}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Medical References</h4>
          <div className="space-y-3">
            {analysis.references.map((ref: Reference, index: number) => (
              <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{ref.title}</p>
                    <p className="text-sm text-muted-foreground">{ref.journal}, {ref.year}</p>
                  </div>
                  {ref.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        Open Study
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Current Visit Summary</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="ml-auto">
            <FileText className="mr-2 h-4 w-4" /> Load Sample Case
          </Button>
          <Button variant="outline" className="ml-auto">
            <Download className="mr-2 h-4 w-4" /> Export RAG Payload
          </Button>
          <Button className="ml-auto">
            <Send className="mr-2 h-4 w-4" /> Send to RAG
          </Button>
          <Dialog open={showAnalysisModal} onOpenChange={(open) => {
            setShowAnalysisModal(open);
            if (!open && aiAnalysisResult) {
              setShowAnalysisResultOnPage(true);
            }
          }}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  if (uploadedFile) {
                    handleAnalyzeWithAI();
                  } else {
                    setShowAnalysisModal(true);
                    setAiAnalysisResult(null);
                  }
                }}
              >
                <Activity className="mr-2 h-4 w-4" /> Get Second Opinion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>AI Health Analysis</DialogTitle>
                <DialogDescription>
                  Upload past medical cases and get an AI-powered analysis of the current visit.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {!uploadedFile && (
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Step 1: Upload Past Medical Cases</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a PDF file containing past medical cases. These cases will be used as reference for analysis.
                    </p>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="case-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="case-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer ${
                          isUploading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Past Cases'}
                      </label>
                      {uploadedFile && (
                        <span className="text-sm text-muted-foreground">
                          ✓ {(uploadedFile as File).name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Step 2: Analyze with AI</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    After uploading past cases, click below to analyze the current visit with AI.
                  </p>
                  <Button
                    onClick={handleAnalyzeWithAI}
                    disabled={!uploadedFile || isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    {isAnalyzing ? "Analyzing..." : "Get Second Opinion"}
                  </Button>
                </div>

                {aiAnalysisResult && (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">AI Analysis Results</h2>
                    {renderAnalysisContent(aiAnalysisResult)}
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowAnalysisModal(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg mb-4">Visit Summary - {visitSummaryData.biodata.name}</CardDescription>
        <p className="text-muted-foreground text-sm mb-6">Visit Date: {visitSummaryData.visit_date}</p>

        {showAnalysisResultOnPage && aiAnalysisResult && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">AI Analysis Results</h2>
            {renderAnalysisContent(aiAnalysisResult)}
          </div>
        )}

        <div className="space-y-6">
          {/* Patient Demographics */}
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Patient Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2">
              <div>
                <p className="font-medium">Name: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.name}</span></p>
              </div>
              <div>
                <p className="font-medium">Age: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.age} years</span></p>
              </div>
              <div>
                <p className="font-medium">Gender: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.gender}</span></p>
              </div>
              <div>
                <p className="font-medium">Occupation: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.occupation}</span></p>
              </div>
              <div>
                <p className="font-medium">Marital Status: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.marital_status}</span></p>
              </div>
              <div>
                <p className="font-medium">Residence: <span className="font-normal text-muted-foreground">{visitSummaryData.biodata.residence}</span></p>
              </div>
            </div>
          </div>

          {/* Clinical History */}
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Clinical History</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Chief Complaint:</p>
                <p className="text-muted-foreground text-sm">{visitSummaryData.chief_complaint}</p>
              </div>
              <div>
                <p className="font-medium">History of Present Illness:</p>
                <p className="text-muted-foreground text-sm">{visitSummaryData.history_present_illness}</p>
              </div>
              {visitSummaryData.past_medical_history && (
                <div>
                  <p className="font-medium">Past Medical History:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.past_medical_history}</p>
                </div>
              )}
              {visitSummaryData.family_history && (
                <div>
                  <p className="font-medium">Family History:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.family_history}</p>
                </div>
              )}
              {visitSummaryData.social_history && (
                <div>
                  <p className="font-medium">Social History:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.social_history}</p>
                </div>
              )}
              {visitSummaryData.review_of_systems && (
                <div>
                  <p className="font-medium">Review of Systems:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.review_of_systems}</p>
                </div>
              )}
            </div>
          </div>

          {/* Physical Examination */}
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Physical Examination</h3>
            <div className="space-y-4">
              {visitSummaryData.physical_examination.vital_signs && (
                <div>
                  <p className="font-medium">Vital Signs:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.physical_examination.vital_signs}</p>
                </div>
              )}
              {visitSummaryData.physical_examination.general_examination && (
                <div>
                  <p className="font-medium">General Examination:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.physical_examination.general_examination}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Systemic Examination:</p>
                <p className="text-muted-foreground text-sm">{visitSummaryData.physical_examination.systemic_examination}</p>
              </div>
              {visitSummaryData.physical_examination.special_examinations && (
                <div>
                  <p className="font-medium">Special Examinations:</p>
                  <p className="text-muted-foreground text-sm">{visitSummaryData.physical_examination.special_examinations}</p>
                </div>
              )}
            </div>
          </div>

          {/* Investigations */}
          {visitSummaryData.investigations && visitSummaryData.investigations.length > 0 && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Investigations</h3>
              <div className="space-y-4">
                {visitSummaryData.investigations.map((inv, index) => (
                  <div key={index}>
                    <p className="font-medium">{inv.name} ({inv.type}):</p>
                    <p className="text-muted-foreground text-sm">Results: {inv.results}</p>
                    {inv.reference_values && <p className="text-muted-foreground text-sm">Reference: {inv.reference_values}</p>}
                    {inv.interpretation && <p className="text-muted-foreground text-sm">Interpretation: {inv.interpretation}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          {visitSummaryData.clinical_notes && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Clinical Notes</h3>
              <p className="text-muted-foreground text-sm">{visitSummaryData.clinical_notes}</p>
            </div>
          )}

          {/* Assessment and Plan */}
          {visitSummaryData.assessment_plan && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Assessment and Plan</h3>
              <p className="text-muted-foreground text-sm">{visitSummaryData.assessment_plan}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
