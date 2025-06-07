import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, FileText, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface History {
  id: string;
  presenting_complaint: string;
  history_of_presenting_illness: string;
  past_medical_history?: string;
  family_history?: string;
  social_history?: string;
  review_of_systems?: string;
  user_id: string;
  created_at: string;
}

interface PatientHistoryProps {
  sampleData?: {
    presenting_complaint: string;
    history_of_presenting_illness: string;
    past_medical_history?: string;
    family_history?: string;
    social_history?: string;
    review_of_systems?: string;
  };
}

const PatientHistory = ({ sampleData }: PatientHistoryProps) => {
  const [histories, setHistories] = useState<History[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHistory, setEditingHistory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    presenting_complaint: "",
    history_of_presenting_illness: "",
    past_medical_history: "",
    family_history: "",
    social_history: "",
    review_of_systems: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const sampleHistory: History = {
        id: "sample-001",
        presenting_complaint: sampleData.presenting_complaint,
        history_of_presenting_illness: sampleData.history_of_presenting_illness,
        past_medical_history: sampleData.past_medical_history,
        family_history: sampleData.family_history,
        social_history: sampleData.social_history,
        review_of_systems: sampleData.review_of_systems,
        user_id: "user-1",
        created_at: new Date().toISOString()
      };
      setHistories([sampleHistory]);
    }
  }, [sampleData]);

  const handleEdit = (history: History) => {
    setEditingHistory(history.id);
    setFormData({
      presenting_complaint: history.presenting_complaint,
      history_of_presenting_illness: history.history_of_presenting_illness,
      past_medical_history: history.past_medical_history || "",
      family_history: history.family_history || "",
      social_history: history.social_history || "",
      review_of_systems: history.review_of_systems || ""
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHistory) {
      setHistories(histories.map(history => 
        history.id === editingHistory 
          ? {
              ...history,
              presenting_complaint: formData.presenting_complaint,
              history_of_presenting_illness: formData.history_of_presenting_illness,
              past_medical_history: formData.past_medical_history || undefined,
              family_history: formData.family_history || undefined,
              social_history: formData.social_history || undefined,
              review_of_systems: formData.review_of_systems || undefined
            }
          : history
      ));
      setEditingHistory(null);
      toast({
        title: "History Updated",
        description: "Patient history has been successfully updated.",
      });
    } else {
      const newHistory: History = {
        id: Date.now().toString(),
        presenting_complaint: formData.presenting_complaint,
        history_of_presenting_illness: formData.history_of_presenting_illness,
        past_medical_history: formData.past_medical_history || undefined,
        family_history: formData.family_history || undefined,
        social_history: formData.social_history || undefined,
        review_of_systems: formData.review_of_systems || undefined,
        user_id: "user-1",
        created_at: new Date().toISOString()
      };
      setHistories([newHistory, ...histories]);
      toast({
        title: "History Recorded",
        description: "Patient history has been successfully recorded.",
      });
    }
    setFormData({
      presenting_complaint: "",
      history_of_presenting_illness: "",
      past_medical_history: "",
      family_history: "",
      social_history: "",
      review_of_systems: ""
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingHistory(null);
    setFormData({
      presenting_complaint: "",
      history_of_presenting_illness: "",
      past_medical_history: "",
      family_history: "",
      social_history: "",
      review_of_systems: ""
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient History</h2>
          <p className="text-gray-600">Record comprehensive patient history</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add History
        </Button>
      </div>

      {(showForm || editingHistory) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingHistory ? "Edit Patient History" : "Record Patient History"}</CardTitle>
            <CardDescription>Enter comprehensive patient history information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="presenting_complaint">Chief Complaint</Label>
                <Textarea
                  id="presenting_complaint"
                  value={formData.presenting_complaint}
                  onChange={(e) => setFormData({...formData, presenting_complaint: e.target.value})}
                  placeholder="Main complaint or reason for visit..."
                  required
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="history_of_presenting_illness">History of Present Illness</Label>
                <Textarea
                  id="history_of_presenting_illness"
                  value={formData.history_of_presenting_illness}
                  onChange={(e) => setFormData({...formData, history_of_presenting_illness: e.target.value})}
                  placeholder="Detailed history including onset, progression, associated symptoms..."
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="past_medical_history">Past Medical History</Label>
                <Textarea
                  id="past_medical_history"
                  value={formData.past_medical_history}
                  onChange={(e) => setFormData({...formData, past_medical_history: e.target.value})}
                  placeholder="Previous medical conditions, surgeries, hospitalizations..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="family_history">Family History</Label>
                <Textarea
                  id="family_history"
                  value={formData.family_history}
                  onChange={(e) => setFormData({...formData, family_history: e.target.value})}
                  placeholder="Relevant family medical history..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="social_history">Social History</Label>
                <Textarea
                  id="social_history"
                  value={formData.social_history}
                  onChange={(e) => setFormData({...formData, social_history: e.target.value})}
                  placeholder="Smoking, alcohol, lifestyle factors..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="review_of_systems">Review of Systems</Label>
                <Textarea
                  id="review_of_systems"
                  value={formData.review_of_systems}
                  onChange={(e) => setFormData({...formData, review_of_systems: e.target.value})}
                  placeholder="Systematic review of body systems..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  {editingHistory ? "Save Changes" : "Save History"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {histories.map((history) => (
          <Card key={history.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  <CardTitle className="text-lg">Patient History Record</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(history)}
                  className="flex items-center gap-1"
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
              <CardDescription>
                Recorded on {new Date(history.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold text-gray-700">Chief Complaint:</Label>
                <p className="mt-1 text-gray-900">{history.presenting_complaint}</p>
              </div>
              <div>
                <Label className="font-semibold text-gray-700">History of Present Illness:</Label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.history_of_presenting_illness}</p>
              </div>
              {history.past_medical_history && (
                <div>
                  <Label className="font-semibold text-gray-700">Past Medical History:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.past_medical_history}</p>
                </div>
              )}
              {history.family_history && (
                <div>
                  <Label className="font-semibold text-gray-700">Family History:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.family_history}</p>
                </div>
              )}
              {history.social_history && (
                <div>
                  <Label className="font-semibold text-gray-700">Social History:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.social_history}</p>
                </div>
              )}
              {history.review_of_systems && (
                <div>
                  <Label className="font-semibold text-gray-700">Review of Systems:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.review_of_systems}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {histories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No patient histories recorded yet. Add your first history record to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientHistory;
