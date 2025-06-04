
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchGraphData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/inspection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGraphData(data);
      
      toast({
        title: "Success",
        description: "Graph data loaded successfully",
      });
    } catch (error) {
      console.error('Error fetching graph data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch graph data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const handleBackClick = () => {
    navigate('/machine-health');
  };

  // Transform data for recharts
  const chartData = graphData?.vibration_data?.map((point, index) => ({
    index,
    timestamp: point.timestamp,
    value: point.value,
    formattedTime: new Date(point.timestamp).toLocaleDateString(),
  })) || [];

  const chartConfig = {
    value: {
      label: graphData?.y_label || "Vibration",
      color: "#2563eb",
    },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Machine Health
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Anomaly Inspection</h1>
            <Button onClick={fetchGraphData} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading graph data...</p>
            </div>
          ) : graphData ? (
            <Card>
              <CardHeader>
                <CardTitle>{graphData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="index"
                        tickFormatter={(value) => {
                          const tickIndex = Math.floor((value / chartData.length) * (graphData.x_tick_labels?.length || 1));
                          return graphData.x_tick_labels?.[tickIndex] || '';
                        }}
                        label={{ value: graphData.x_label, position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: graphData.y_label, angle: -90, position: 'insideLeft' }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        labelFormatter={(value) => {
                          const point = chartData[value as number];
                          return point ? `Time: ${point.formattedTime}` : '';
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--color-value)" 
                        strokeWidth={2}
                        dot={false}
                      />
                      {/* Add reference lines for anomalies */}
                      {graphData.anomalies?.map((anomaly, index) => {
                        const startIndex = chartData.findIndex(point => 
                          new Date(point.timestamp) >= new Date(anomaly.start)
                        );
                        const endIndex = chartData.findIndex(point => 
                          new Date(point.timestamp) >= new Date(anomaly.end)
                        );
                        
                        return (
                          <React.Fragment key={index}>
                            <ReferenceLine 
                              x={startIndex} 
                              stroke="#ef4444" 
                              strokeDasharray="5 5"
                              label={{ value: "Anomaly Start", position: "top" }}
                            />
                            <ReferenceLine 
                              x={endIndex} 
                              stroke="#ef4444" 
                              strokeDasharray="5 5"
                              label={{ value: "Anomaly End", position: "top" }}
                            />
                          </React.Fragment>
                        );
                      })}
                    </LineChart>
                  </ChartContainer>
                </div>
                
                {/* Anomaly Summary */}
                {graphData.anomalies && graphData.anomalies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Detected Anomalies</h3>
                    <div className="grid gap-2">
                      {graphData.anomalies.map((anomaly, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-sm">
                            <span className="font-medium">Anomaly {index + 1}:</span>{' '}
                            {new Date(anomaly.start).toLocaleString()} - {new Date(anomaly.end).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No graph data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
