
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface MachineData {
  id: string;
  machineA: string;
  severityLevel: string;
  lastAnomaly: string;
  sensorType: string;
}

const MachineHealthPage = () => {
  const navigate = useNavigate();
  const [machineData, setMachineData] = useState<MachineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await fetch('/api/machine-health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMachineData(data);
        } else {
          throw new Error('Failed to fetch machine data');
        }
      } catch (error) {
        console.error('Error fetching machine data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch machine health data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineData();
  }, []);

  const handleInspectAnomaly = (machineId: string) => {
    console.log('Inspecting anomaly for machine:', machineId);
    toast({
      title: "Inspect Anomaly",
      description: `Inspecting anomaly for machine ${machineId}`,
    });
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} />
            </Button>
            <Logo />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">Machine Health Dashboard</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search machines..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading machine health data...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machine A</TableHead>
                      <TableHead>Severity Level</TableHead>
                      <TableHead>Last Anomaly</TableHead>
                      <TableHead>Sensor Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machineData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No machine data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      machineData.map((machine) => (
                        <TableRow
                          key={machine.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedMachine(machine.id)}
                        >
                          <TableCell className="font-medium">{machine.machineA}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              machine.severityLevel === 'High' ? 'bg-red-100 text-red-800' :
                              machine.severityLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {machine.severityLevel}
                            </span>
                          </TableCell>
                          <TableCell>{machine.lastAnomaly}</TableCell>
                          <TableCell>{machine.sensorType}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectAnomaly(machine.id);
                              }}
                            >
                              Inspect Anomaly
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MachineHealthPage;
