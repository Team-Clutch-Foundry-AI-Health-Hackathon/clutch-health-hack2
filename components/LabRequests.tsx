import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Microscope, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabRequest {
  id: string;
  lab_name: string;
  lab_code: string;
  user_id: string;
  created_at: string;
}

interface LabRequestsProps {
  sampleData?: Array<{
    type: string;
    name: string;
    results: string;
    reference_values?: string;
    interpretation?: string;
  }>;
}

const LabRequests = ({ sampleData }: LabRequestsProps) => {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    lab_name: "",
    lab_code: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const sampleLabRequests: LabRequest[] = sampleData.map((lab, index) => ({
        id: `sample-${index + 1}`,
        lab_name: lab.name,
        lab_code: `LAB${index + 1}`,
        user_id: "user-1",
        created_at: new Date().toISOString()
      }));
      setLabRequests(sampleLabRequests);
    }
  }, [sampleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLabRequest: LabRequest = {
      id: Date.now().toString(),
      lab_name: formData.lab_name,
      lab_code: formData.lab_code,
      user_id: "user-1",
      created_at: new Date().toISOString()
    };
    
    setLabRequests([newLabRequest, ...labRequests]);
    setFormData({ lab_name: "", lab_code: "" });
    setShowForm(false);
    toast({
      title: "Lab Request Created",
      description: "Laboratory request has been successfully created.",
    });
  };

  const filteredRequests = labRequests.filter(request =>
    request.lab_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.lab_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laboratory Requests</h2>
          <p className="text-gray-600">Manage laboratory test orders and requests</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Lab Request
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search lab requests by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Lab Request</CardTitle>
            <CardDescription>Request laboratory tests and investigations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lab_name">Laboratory Test Name</Label>
                  <Input
                    id="lab_name"
                    value={formData.lab_name}
                    onChange={(e) => setFormData({...formData, lab_name: e.target.value})}
                    placeholder="e.g., Complete Blood Count"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lab_code">Test Code</Label>
                  <Input
                    id="lab_code"
                    value={formData.lab_code}
                    onChange={(e) => setFormData({...formData, lab_code: e.target.value})}
                    placeholder="e.g., CBC001"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Microscope size={20} className="text-blue-600" />
                <CardTitle className="text-lg">{request.lab_name}</CardTitle>
              </div>
              <CardDescription>
                Code: {request.lab_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Requested:</span> {new Date(request.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && labRequests.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No lab requests found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {labRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Microscope size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No laboratory requests created yet. Add your first lab request to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabRequests;
