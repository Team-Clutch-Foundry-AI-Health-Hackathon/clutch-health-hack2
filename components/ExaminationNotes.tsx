import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExaminationNote {
  id: string;
  vital_signs?: string;
  general_examination?: string;
  systemic_examination: string;
  special_examinations?: string;
  user_id: string;
  created_at: string;
}

interface ExaminationNotesProps {
  sampleData?: {
    vital_signs?: string;
    general_examination?: string;
    systemic_examination: string;
    special_examinations?: string;
  };
}

const ExaminationNotes = ({ sampleData }: ExaminationNotesProps) => {
  const [examinations, setExaminations] = useState<ExaminationNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vital_signs: "",
    general_examination: "",
    systemic_examination: "",
    special_examinations: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const sampleExamination: ExaminationNote = {
        id: "sample-001",
        vital_signs: sampleData.vital_signs,
        general_examination: sampleData.general_examination,
        systemic_examination: sampleData.systemic_examination,
        special_examinations: sampleData.special_examinations,
        user_id: "user-1",
        created_at: new Date().toISOString()
      };
      setExaminations([sampleExamination]);
    }
  }, [sampleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExamination: ExaminationNote = {
      id: Date.now().toString(),
      vital_signs: formData.vital_signs,
      general_examination: formData.general_examination,
      systemic_examination: formData.systemic_examination,
      special_examinations: formData.special_examinations,
      user_id: "user-1",
      created_at: new Date().toISOString()
    };
    
    setExaminations([newExamination, ...examinations]);
    setFormData({
      vital_signs: "",
      general_examination: "",
      systemic_examination: "",
      special_examinations: ""
    });
    setShowForm(false);
    toast({
      title: "Examination Recorded",
      description: "Physical examination has been successfully recorded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Physical Examination</h2>
          <p className="text-gray-600">Record comprehensive physical examination findings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Examination
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Physical Examination</CardTitle>
            <CardDescription>Document comprehensive physical examination findings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="vital_signs">Vital Signs</Label>
                <Textarea
                  id="vital_signs"
                  value={formData.vital_signs}
                  onChange={(e) => setFormData({...formData, vital_signs: e.target.value})}
                  placeholder="BP, HR, Temperature, RR, O2 saturation..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="general_examination">General Examination</Label>
                <Textarea
                  id="general_examination"
                  value={formData.general_examination}
                  onChange={(e) => setFormData({...formData, general_examination: e.target.value})}
                  placeholder="General appearance, build, nutrition, pallor, jaundice, cyanosis..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="systemic_examination">Systemic Examination</Label>
                <Textarea
                  id="systemic_examination"
                  value={formData.systemic_examination}
                  onChange={(e) => setFormData({...formData, systemic_examination: e.target.value})}
                  placeholder="CVS, RS, Abdomen, CNS examination findings..."
                  required
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="special_examinations">Special Examinations</Label>
                <Textarea
                  id="special_examinations"
                  value={formData.special_examinations}
                  onChange={(e) => setFormData({...formData, special_examinations: e.target.value})}
                  placeholder="DRE, PV examination, neurological tests, etc..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Examination</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {examinations.map((examination) => (
          <Card key={examination.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Stethoscope size={20} className="text-green-600" />
                <CardTitle className="text-lg">Physical Examination</CardTitle>
              </div>
              <CardDescription>
                Recorded on {new Date(examination.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {examination.vital_signs && (
                <div>
                  <Label className="font-semibold text-gray-700">Vital Signs:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{examination.vital_signs}</p>
                </div>
              )}
              {examination.general_examination && (
                <div>
                  <Label className="font-semibold text-gray-700">General Examination:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{examination.general_examination}</p>
                </div>
              )}
              <div>
                <Label className="font-semibold text-gray-700">Systemic Examination:</Label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{examination.systemic_examination}</p>
              </div>
              {examination.special_examinations && (
                <div>
                  <Label className="font-semibold text-gray-700">Special Examinations:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{examination.special_examinations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {examinations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No examination notes recorded yet. Add your first examination record to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExaminationNotes;
