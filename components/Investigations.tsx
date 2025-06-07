import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Investigation {
  id: string;
  type: 'laboratory' | 'imaging' | 'histology';
  name: string;
  results: string;
  reference_values?: string;
  interpretation?: string;
  user_id: string;
  created_at: string;
}

interface InvestigationsProps {
  sampleData?: Array<{
    type: string;
    name: string;
    results: string;
    reference_values?: string;
    interpretation?: string;
  }>;
}

const Investigations = ({ sampleData }: InvestigationsProps) => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    results: "",
    reference_values: "",
    interpretation: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const sampleInvestigations: Investigation[] = sampleData.map((inv, index) => ({
        id: `sample-${index + 1}`,
        type: inv.type as 'laboratory' | 'imaging' | 'histology',
        name: inv.name,
        results: inv.results,
        reference_values: inv.reference_values,
        interpretation: inv.interpretation,
        user_id: "user-1",
        created_at: new Date().toISOString()
      }));
      setInvestigations(sampleInvestigations);
    }
  }, [sampleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvestigation: Investigation = {
      id: Date.now().toString(),
      type: formData.type as 'laboratory' | 'imaging' | 'histology',
      name: formData.name,
      results: formData.results,
      reference_values: formData.reference_values,
      interpretation: formData.interpretation,
      user_id: "user-1",
      created_at: new Date().toISOString()
    };
    
    setInvestigations([newInvestigation, ...investigations]);
    setFormData({
      type: "",
      name: "",
      results: "",
      reference_values: "",
      interpretation: ""
    });
    setShowForm(false);
    toast({
      title: "Investigation Recorded",
      description: "Investigation results have been successfully recorded.",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'laboratory': return 'text-blue-600';
      case 'imaging': return 'text-purple-600';
      case 'histology': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investigations</h2>
          <p className="text-gray-600">Record laboratory tests, imaging, and histology results</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Investigation
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Investigation Results</CardTitle>
            <CardDescription>Document laboratory, imaging, or histology findings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Investigation Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laboratory">Laboratory Tests</SelectItem>
                    <SelectItem value="imaging">Imaging Studies</SelectItem>
                    <SelectItem value="histology">Histology/Biopsy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Investigation Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., PSA, MRI Pelvis, Prostate Biopsy"
                  required
                />
              </div>
              <div>
                <Label htmlFor="results">Results</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => setFormData({...formData, results: e.target.value})}
                  placeholder="Detailed results and findings..."
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="reference_values">Reference Values/Normal Range</Label>
                <Input
                  id="reference_values"
                  value={formData.reference_values}
                  onChange={(e) => setFormData({...formData, reference_values: e.target.value})}
                  placeholder="e.g., Normal < 4 ng/mL"
                />
              </div>
              <div>
                <Label htmlFor="interpretation">Clinical Interpretation</Label>
                <Textarea
                  id="interpretation"
                  value={formData.interpretation}
                  onChange={(e) => setFormData({...formData, interpretation: e.target.value})}
                  placeholder="Clinical significance and interpretation..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Investigation</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {investigations.map((investigation) => (
          <Card key={investigation.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className={getTypeColor(investigation.type)} />
                <CardTitle className="text-lg">{investigation.name}</CardTitle>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  investigation.type === 'laboratory' ? 'bg-blue-100 text-blue-800' :
                  investigation.type === 'imaging' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {investigation.type.charAt(0).toUpperCase() + investigation.type.slice(1)}
                </span>
              </div>
              <CardDescription>
                Recorded on {new Date(investigation.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold text-gray-700">Results:</Label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{investigation.results}</p>
              </div>
              {investigation.reference_values && (
                <div>
                  <Label className="font-semibold text-gray-700">Reference Values:</Label>
                  <p className="mt-1 text-gray-900">{investigation.reference_values}</p>
                </div>
              )}
              {investigation.interpretation && (
                <div>
                  <Label className="font-semibold text-gray-700">Clinical Interpretation:</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{investigation.interpretation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {investigations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No investigations recorded yet. Add your first investigation to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Investigations;
