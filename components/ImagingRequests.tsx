import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Scan, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagingRequest {
  id: string;
  image_name: string;
  image_code: string;
  user_id: string;
  created_at: string;
}

interface ImagingRequestsProps {
  sampleData?: Array<{
    type: string;
    name: string;
    results: string;
    reference_values?: string;
    interpretation?: string;
  }>;
}

const ImagingRequests = ({ sampleData }: ImagingRequestsProps) => {
  const [imagingRequests, setImagingRequests] = useState<ImagingRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    image_name: "",
    image_code: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const sampleImagingRequests: ImagingRequest[] = sampleData.map((img, index) => ({
        id: `sample-${index + 1}`,
        image_name: img.name,
        image_code: `IMG${index + 1}`,
        user_id: "user-1",
        created_at: new Date().toISOString()
      }));
      setImagingRequests(sampleImagingRequests);
    }
  }, [sampleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newImagingRequest: ImagingRequest = {
      id: Date.now().toString(),
      image_name: formData.image_name,
      image_code: formData.image_code,
      user_id: "user-1",
      created_at: new Date().toISOString()
    };
    
    setImagingRequests([newImagingRequest, ...imagingRequests]);
    setFormData({ image_name: "", image_code: "" });
    setShowForm(false);
    toast({
      title: "Imaging Request Created",
      description: "Medical imaging request has been successfully created.",
    });
  };

  const filteredRequests = imagingRequests.filter(request =>
    request.image_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.image_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Imaging Requests</h2>
          <p className="text-gray-600">Manage radiology and imaging study orders</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Imaging Request
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search imaging requests by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Imaging Request</CardTitle>
            <CardDescription>Request medical imaging studies and radiology investigations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_name">Imaging Study Name</Label>
                  <Input
                    id="image_name"
                    value={formData.image_name}
                    onChange={(e) => setFormData({...formData, image_name: e.target.value})}
                    placeholder="e.g., Chest X-Ray"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_code">Study Code</Label>
                  <Input
                    id="image_code"
                    value={formData.image_code}
                    onChange={(e) => setFormData({...formData, image_code: e.target.value})}
                    placeholder="e.g., CXR001"
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
                <Scan size={20} className="text-purple-600" />
                <CardTitle className="text-lg">{request.image_name}</CardTitle>
              </div>
              <CardDescription>
                Code: {request.image_code}
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

      {filteredRequests.length === 0 && imagingRequests.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No imaging requests found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {imagingRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Scan size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No imaging requests created yet. Add your first imaging request to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImagingRequests;
