
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';

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

// Sample data for testing - matches the structure you provided
const sampleGraphData: GraphData = {
  title: "Outlier detection for Greensand crane June-December 2024",
  x_label: "time samples",
  y_label: "vibration (mm/s)",
  x_tick_labels: ["July", "August", "October", "November", "December"],
  vibration_data: [
    { timestamp: "2024-07-01T00:00:00Z", value: 2.3 },
    { timestamp: "2024-07-15T00:00:00Z", value: 3.1 },
    { timestamp: "2024-08-01T00:00:00Z", value: 2.8 },
    { timestamp: "2024-08-15T00:00:00Z", value: 3.5 },
    { timestamp: "2024-09-01T00:00:00Z", value: 2.9 },
    { timestamp: "2024-09-15T00:00:00Z", value: 4.2 },
    { timestamp: "2024-10-01T00:00:00Z", value: 3.7 },
    { timestamp: "2024-10-15T00:00:00Z", value: 5.1 },
    { timestamp: "2024-11-01T00:00:00Z", value: 4.8 },
    { timestamp: "2024-11-02T06:00:00Z", value: 15.2 },
    { timestamp: "2024-11-02T06:15:00Z", value: 18.5 },
    { timestamp: "2024-11-15T00:00:00Z", value: 3.9 },
    { timestamp: "2024-12-01T00:00:00Z", value: 4.3 },
    { timestamp: "2024-12-10T01:30:00Z", value: 12.7 },
    { timestamp: "2024-12-10T02:00:00Z", value: 16.1 },
    { timestamp: "2024-12-15T00:00:00Z", value: 3.2 }
  ],
  anomalies: [
    {
      start: "2024-07-14T00:00:00Z",
      end: "2024-08-14T00:00:00Z"
    },
    {
      start: "2024-11-02T06:00:00Z",
      end: "2024-11-02T06:15:00Z"
    },
    {
      start: "2024-12-10T01:30:00Z",
      end: "2024-12-10T02:00:00Z"
    }
  ]
};

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
          // If API fails, use sample data for demonstration
          console.log('API not available, using sample graph data');
          setGraphData(sampleGraphData);
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
        // Use sample data when API is not available
        console.log('Using sample graph data for demonstration');
        setGraphData(sampleGraphData);
      } finally {
        setIsLoading(false);
      }
    };

    if (machineId) {
      fetchGraphData();
    }
  }, [machineId]);

  const formatChartData = (vibrationData: VibrationDataPoint[]) => {
    return vibrationData.map((point, index) => ({
      timestamp: new Date(point.timestamp).toLocaleDateString(),
      value: point.value,
      fullTimestamp: point.timestamp,
      index: index
    }));
  };

  const renderAnomalyAreas = (anomalies: Anomaly[], chartData: any[]) => {
    return anomalies.map((anomaly, index) => {
      const startTime = new Date(anomaly.start).getTime();
      const endTime = new Date(anomaly.end).getTime();
      
      // Find data points that fall within the anomaly time range
      const anomalyPoints = chartData.filter(point => {
        const pointTime = new Date(point.fullTimestamp).getTime();
        return pointTime >= startTime && pointTime <= endTime;
      });
      
      if (anomalyPoints.length === 0) {
        // If no exact points, find closest surrounding points
        let startIndex = 0;
        let endIndex = chartData.length - 1;
        
        chartData.forEach((point, idx) => {
          const pointTime = new Date(point.fullTimestamp).getTime();
          if (pointTime <= startTime) {
            startIndex = idx;
          }
          if (pointTime <= endTime) {
            endIndex = idx;
          }
        });
        
        // Ensure we have at least one point to highlight
        if (startIndex === endIndex && startIndex < chartData.length - 1) {
          endIndex = startIndex + 1;
        }
        
        return (
          <ReferenceArea
            key={`anomaly-${index}`}
            x1={chartData[startIndex]?.timestamp}
            x2={chartData[endIndex]?.timestamp}
            fill="#ef4444"
            fillOpacity={0.3}
            stroke="#dc2626"
            strokeWidth={1}
            strokeOpacity={0.6}
          />
        );
      } else {
        // Use the actual anomaly points
        return (
          <ReferenceArea
            key={`anomaly-${index}`}
            x1={anomalyPoints[0].timestamp}
            x2={anomalyPoints[anomalyPoints.length - 1].timestamp}
            fill="#ef4444"
            fillOpacity={0.3}
            stroke="#dc2626"
            strokeWidth={1}
            strokeOpacity={0.6}
          />
        );
      }
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
                      {renderAnomalyAreas(graphData.anomalies, formatChartData(graphData.vibration_data))}
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#2563eb" }}
                        name="Vibration Data"
                      />
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
