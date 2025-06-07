
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pill, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MedicationOrder {
  id: string;
  medication_name: string;
  medication_code: string;
  user_id: string;
  created_at: string;
}

const MedicationOrders = () => {
  const [medicationOrders, setMedicationOrders] = useState<MedicationOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    medication_name: "",
    medication_code: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedicationOrder: MedicationOrder = {
      id: Date.now().toString(),
      medication_name: formData.medication_name,
      medication_code: formData.medication_code,
      user_id: "user-1",
      created_at: new Date().toISOString()
    };
    
    setMedicationOrders([newMedicationOrder, ...medicationOrders]);
    setFormData({ medication_name: "", medication_code: "" });
    setShowForm(false);
    toast({
      title: "Medication Order Created",
      description: "Medication order has been successfully created.",
    });
  };

  const filteredOrders = medicationOrders.filter(order =>
    order.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.medication_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Orders</h2>
          <p className="text-gray-600">Manage prescription orders and medication requests</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Medication Order
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search medications by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Medication Order</CardTitle>
            <CardDescription>Order medications and prescriptions for patients</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medication_name">Medication Name</Label>
                  <Input
                    id="medication_name"
                    value={formData.medication_name}
                    onChange={(e) => setFormData({...formData, medication_name: e.target.value})}
                    placeholder="e.g., Amoxicillin 500mg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="medication_code">Medication Code</Label>
                  <Input
                    id="medication_code"
                    value={formData.medication_code}
                    onChange={(e) => setFormData({...formData, medication_code: e.target.value})}
                    placeholder="e.g., AMX500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Order</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Pill size={20} className="text-green-600" />
                <CardTitle className="text-lg">{order.medication_name}</CardTitle>
              </div>
              <CardDescription>
                Code: {order.medication_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ordered:</span> {new Date(order.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && medicationOrders.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No medication orders found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {medicationOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Pill size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No medication orders created yet. Add your first medication order to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationOrders;
