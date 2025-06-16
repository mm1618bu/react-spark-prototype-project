
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface WorkOrderFormProps {
  onClose: () => void;
  onSubmit: (workOrderData: any) => void;
}

export const WorkOrderForm = ({ onClose, onSubmit }: WorkOrderFormProps) => {
  const [formData, setFormData] = useState({
    pageNo: '1',
    priority: '1',
    companyName: '',
    workOrderNo: '',
    weekNo: '',
    weekOf: '',
    equipmentId: '',
    category: '',
    equipmentDescription: '',
    building: '',
    floor: '',
    room: '',
    description: '',
    emergencyContact: '',
    specialInstructions: '',
    shopVendor: '',
    departmentName: '',
    employee: '',
    taskNo: '',
    workDescription: '',
    frequency: '',
    partNumbers: [{ partNo: '', description: '', quantity: '', qtyInStock: '', location: '' }],
    workPerformedBy: '',
    date: '',
    standardHours: '',
    overtimeHours: '',
    materialsUsed: [{ description: '', quantity: '', partNo: '' }]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPartNumber = () => {
    setFormData(prev => ({
      ...prev,
      partNumbers: [...prev.partNumbers, { partNo: '', description: '', quantity: '', qtyInStock: '', location: '' }]
    }));
  };

  const updatePartNumber = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      partNumbers: prev.partNumbers.map((part, i) => 
        i === index ? { ...part, [field]: value } : part
      )
    }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: [...prev.materialsUsed, { description: '', quantity: '', partNo: '' }]
    }));
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: prev.materialsUsed.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const generateWorkOrder = async () => {
    setIsGenerating(true);
    console.log('Generating work order...');
    
    try {
      const response = await fetch('http://localhost:5001/generate-work-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: 'generate_work_order',
          current_data: formData
        }),
      });

      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const workOrderData = await response.json();
      console.log('Received work order data:', workOrderData);
      
      // Update form data with response from backend
      setFormData(prev => ({
        ...prev,
        ...workOrderData,
        // Handle arrays properly
        partNumbers: workOrderData.partNumbers || prev.partNumbers,
        materialsUsed: workOrderData.materialsUsed || prev.materialsUsed
      }));
      
      console.log('Form populated with generated data');
    } catch (error) {
      console.error('Error generating work order:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generate Work Order</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pageNo">Page No.</Label>
                <Input
                  id="pageNo"
                  value={formData.pageNo}
                  onChange={(e) => handleInputChange('pageNo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                />
              </div>
            </div>

            {/* Work Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="workOrderNo">P.M. Work Order No.</Label>
                <Input
                  id="workOrderNo"
                  value={formData.workOrderNo}
                  onChange={(e) => handleInputChange('workOrderNo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weekNo">Week No.</Label>
                <Input
                  id="weekNo"
                  value={formData.weekNo}
                  onChange={(e) => handleInputChange('weekNo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weekOf">Week Of</Label>
                <Input
                  id="weekOf"
                  type="date"
                  value={formData.weekOf}
                  onChange={(e) => handleInputChange('weekOf', e.target.value)}
                />
              </div>
            </div>

            {/* Equipment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Equipment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentId">Equipment I.D.</Label>
                  <Input
                    id="equipmentId"
                    value={formData.equipmentId}
                    onChange={(e) => handleInputChange('equipmentId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="equipmentDescription">Equipment Description</Label>
                <Input
                  id="equipmentDescription"
                  value={formData.equipmentDescription}
                  onChange={(e) => handleInputChange('equipmentDescription', e.target.value)}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Input
                    id="building"
                    value={formData.building}
                    onChange={(e) => handleInputChange('building', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Special Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Shop/Vendor Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shopVendor">Shop/Vendor</Label>
                <Input
                  id="shopVendor"
                  value={formData.shopVendor}
                  onChange={(e) => handleInputChange('shopVendor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="departmentName">Department Name</Label>
                <Input
                  id="departmentName"
                  value={formData.departmentName}
                  onChange={(e) => handleInputChange('departmentName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="employee">Employee</Label>
                <Input
                  id="employee"
                  value={formData.employee}
                  onChange={(e) => handleInputChange('employee', e.target.value)}
                />
              </div>
            </div>

            {/* Task Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Task Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taskNo">Task #</Label>
                  <Input
                    id="taskNo"
                    value={formData.taskNo}
                    onChange={(e) => handleInputChange('taskNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workDescription">Description of Work</Label>
                <Textarea
                  id="workDescription"
                  rows={4}
                  value={formData.workDescription}
                  onChange={(e) => handleInputChange('workDescription', e.target.value)}
                />
              </div>
            </div>

            {/* Parts and Components */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Parts and Components Required</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPartNumber}>
                  Add Part
                </Button>
              </div>
              {formData.partNumbers.map((part, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded">
                  <div>
                    <Label>Part #</Label>
                    <Input
                      value={part.partNo}
                      onChange={(e) => updatePartNumber(index, 'partNo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={part.description}
                      onChange={(e) => updatePartNumber(index, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      value={part.quantity}
                      onChange={(e) => updatePartNumber(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Qty in Stock</Label>
                    <Input
                      value={part.qtyInStock}
                      onChange={(e) => updatePartNumber(index, 'qtyInStock', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={part.location}
                      onChange={(e) => updatePartNumber(index, 'location', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Work Performance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Work Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="workPerformedBy">Work Performed By</Label>
                  <Input
                    id="workPerformedBy"
                    value={formData.workPerformedBy}
                    onChange={(e) => handleInputChange('workPerformedBy', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="standardHours">Standard Hours</Label>
                  <Input
                    id="standardHours"
                    value={formData.standardHours}
                    onChange={(e) => handleInputChange('standardHours', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeHours">Overtime Hours</Label>
                  <Input
                    id="overtimeHours"
                    value={formData.overtimeHours}
                    onChange={(e) => handleInputChange('overtimeHours', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Materials Used */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Materials and Parts Used</h3>
                <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                  Add Material
                </Button>
              </div>
              {formData.materialsUsed.map((material, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={material.description}
                      onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Part #</Label>
                    <Input
                      value={material.partNo}
                      onChange={(e) => updateMaterial(index, 'partNo', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={generateWorkOrder}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Work Order'}
              </Button>
              <Button type="submit">
                Submit Work Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
