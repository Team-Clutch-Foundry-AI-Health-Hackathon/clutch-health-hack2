import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  address: string;
  phone_number: string;
  occupation?: string;
  marital_status?: string;
  user_id: string;
}

interface PatientBiodataProps {
  sampleData?: {
    name: string;
    age: number;
    gender: string;
    occupation?: string;
    marital_status?: string;
    residence: string;
  };
}

const PatientBiodata = ({ sampleData }: PatientBiodataProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    birthdate: "",
    address: "",
    phone_number: "",
    occupation: "",
    marital_status: ""
  });
  const { toast } = useToast();

  // Initialize with sample data if provided
  useEffect(() => {
    if (sampleData) {
      const samplePatient: Patient = {
        id: "sample-001",
        name: sampleData.name,
        age: sampleData.age,
        gender: sampleData.gender as 'male' | 'female' | 'other',
        birthdate: new Date().toISOString().split('T')[0],
        address: sampleData.residence,
        phone_number: "N/A",
        occupation: sampleData.occupation,
        marital_status: sampleData.marital_status,
        user_id: "user-1"
      };
      setPatients([samplePatient]);
    }
  }, [sampleData]);

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient.id);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      birthdate: patient.birthdate,
      address: patient.address,
      phone_number: patient.phone_number,
      occupation: patient.occupation || "",
      marital_status: patient.marital_status || ""
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      setPatients(patients.map(patient => 
        patient.id === editingPatient 
          ? {
              ...patient,
              name: formData.name,
              age: parseInt(formData.age),
              gender: formData.gender as 'male' | 'female' | 'other',
              birthdate: formData.birthdate,
              address: formData.address,
              phone_number: formData.phone_number,
              occupation: formData.occupation || undefined,
              marital_status: formData.marital_status || undefined
            }
          : patient
      ));
      setEditingPatient(null);
      toast({
        title: "Patient Updated",
        description: "Patient information has been successfully updated.",
      });
    } else {
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female' | 'other',
        birthdate: formData.birthdate,
        address: formData.address,
        phone_number: formData.phone_number,
        occupation: formData.occupation || undefined,
        marital_status: formData.marital_status || undefined,
        user_id: "user-1"
      };
      setPatients([newPatient, ...patients]);
      toast({
        title: "Patient Added",
        description: "Patient biodata has been successfully recorded.",
      });
    }
    setFormData({
      name: "",
      age: "",
      gender: "",
      birthdate: "",
      address: "",
      phone_number: "",
      occupation: "",
      marital_status: ""
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      age: "",
      gender: "",
      birthdate: "",
      address: "",
      phone_number: "",
      occupation: "",
      marital_status: ""
    });
    setShowForm(false);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone_number.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Biodata</h2>
          <p className="text-gray-600">Manage patient demographic information</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search patients by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Patient Form */}
      {(showForm || editingPatient) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPatient ? "Edit Patient" : "Add New Patient"}</CardTitle>
            <CardDescription>Enter patient demographic information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address/Residence</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    placeholder="e.g., Retired teacher"
                  />
                </div>
                <div>
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select value={formData.marital_status} onValueChange={(value) => setFormData({...formData, marital_status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  {editingPatient ? "Save Changes" : "Save Patient"}
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

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{patient.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(patient)}
                  className="flex items-center gap-1"
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Age:</span> {patient.age} years
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Gender:</span> {patient.gender}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {patient.phone_number}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">DOB:</span> {patient.birthdate}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {patient.address}
              </div>
              {patient.occupation && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Occupation:</span> {patient.occupation}
                </div>
              )}
              {patient.marital_status && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Marital Status:</span> {patient.marital_status}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && patients.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No patients found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {patients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No patients registered yet. Add your first patient to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientBiodata;
