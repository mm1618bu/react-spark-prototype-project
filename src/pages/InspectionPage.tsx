
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface VibrationDataPoint {
  timestamp: string;
  value: number;
}

interface Anomaly {
  start: string;
  end: string;
}

interface GraphData {
  title: string;
  x_label: string;
  y_label: string;
  x_tick_labels: string[];
  vibration_data: VibrationDataPoint[];
  anomalies: Anomaly[];
}

const InspectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machineId');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch(`/api/inspection?machineId=${machineId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGraphData(data);
        } else {
          throw new Error('Failed to fetch graph data');
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch inspection data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (machineId) {
      fetchGraphData();
    }
  }, [machineId]);

  const formatChartData = (vibrationData: VibrationDataPoint[]) => {
    return vibrationData.map(point => ({
      timestamp: new Date(point.timestamp).toLocaleDateString(),
      value: point.value,
      fullTimestamp: point.timestamp
    }));
  };

  const renderAnomalyLines = (anomalies: Anomaly[]) => {
    return anomalies.map((anomaly, index) => (
      <ReferenceLine
        key={index}
        x={new Date(anomaly.start).toLocaleDateString()}
        stroke="#ff4444"
        strokeDasharray="5 5"
        label={{ value: "Anomaly", position: "top" }}
      />
    ));
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
              onClick={() => navigate('/machine-health')}
            >
              <ArrowLeft size={18} />
            </Button>
            <Logo />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Anomaly Inspection</h1>
              <p className="text-gray-600">Machine ID: {machineId}</p>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                Loading inspection data...
              </div>
            ) : graphData ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">{graphData.title}</h2>
                
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatChartData(graphData.vibration_data)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        label={{ value: graphData.x_label, position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        label={{ value: graphData.y_label, angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        labelFormatter={(value) => `Time: ${value}`}
                        formatter={(value: any) => [value, 'Vibration']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Vibration Data"
                      />
                      {renderAnomalyLines(graphData.anomalies)}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Detected Anomalies</h3>
                  <div className="grid gap-2">
                    {graphData.anomalies.map((anomaly, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Anomaly {index + 1}:</strong> {new Date(anomaly.start).toLocaleString()} - {new Date(anomaly.end).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                No inspection data available
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default InspectionPage;
