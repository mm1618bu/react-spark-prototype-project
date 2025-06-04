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

  // Sample data for demonstration
  const sampleData: GraphData = {
    title: "Outlier detection for Greensand crane June-December 2024",
    x_label: "Time",
    y_label: "Vibration (mm/s)",
    x_tick_labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    vibration_data: [
      { timestamp: "2024-07-01T00:00:00Z", value: 2.3 },
      { timestamp: "2024-07-05T00:00:00Z", value: 2.1 },
      { timestamp: "2024-07-10T00:00:00Z", value: 2.4 },
      { timestamp: "2024-07-15T00:00:00Z", value: 2.2 },
      { timestamp: "2024-07-20T00:00:00Z", value: 2.5 },
      { timestamp: "2024-07-25T00:00:00Z", value: 2.3 },
      { timestamp: "2024-08-01T00:00:00Z", value: 2.6 },
      { timestamp: "2024-08-05T00:00:00Z", value: 2.4 },
      { timestamp: "2024-08-10T00:00:00Z", value: 2.7 },
      { timestamp: "2024-08-15T00:00:00Z", value: 2.8 },
      { timestamp: "2024-08-20T00:00:00Z", value: 2.5 },
      { timestamp: "2024-08-25T00:00:00Z", value: 2.6 },
      { timestamp: "2024-09-01T00:00:00Z", value: 2.4 },
      { timestamp: "2024-09-05T00:00:00Z", value: 2.3 },
      { timestamp: "2024-09-10T00:00:00Z", value: 2.7 },
      { timestamp: "2024-09-15T00:00:00Z", value: 2.6 },
      { timestamp: "2024-09-20T00:00:00Z", value: 2.8 },
      { timestamp: "2024-09-25T00:00:00Z", value: 2.4 },
      { timestamp: "2024-10-01T00:00:00Z", value: 2.2 },
      { timestamp: "2024-10-05T00:00:00Z", value: 2.5 },
      { timestamp: "2024-10-10T00:00:00Z", value: 2.3 },
      { timestamp: "2024-10-15T00:00:00Z", value: 2.9 },
      { timestamp: "2024-10-20T00:00:00Z", value: 2.6 },
      { timestamp: "2024-10-25T00:00:00Z", value: 2.4 },
      { timestamp: "2024-11-01T00:00:00Z", value: 3.1 },
      { timestamp: "2024-11-02T06:00:00Z", value: 4.5 },
      { timestamp: "2024-11-02T06:15:00Z", value: 4.8 },
      { timestamp: "2024-11-05T00:00:00Z", value: 2.8 },
      { timestamp: "2024-11-10T00:00:00Z", value: 2.6 },
      { timestamp: "2024-11-15T00:00:00Z", value: 2.7 },
      { timestamp: "2024-11-20T00:00:00Z", value: 2.5 },
      { timestamp: "2024-11-25T00:00:00Z", value: 2.9 },
      { timestamp: "2024-12-01T00:00:00Z", value: 2.4 },
      { timestamp: "2024-12-05T00:00:00Z", value: 2.6 },
      { timestamp: "2024-12-10T01:30:00Z", value: 4.2 },
      { timestamp: "2024-12-10T02:00:00Z", value: 4.6 },
      { timestamp: "2024-12-15T00:00:00Z", value: 2.3 },
      { timestamp: "2024-12-20T00:00:00Z", value: 2.5 },
      { timestamp: "2024-12-25T00:00:00Z", value: 2.4 }
    ],
    anomalies: [
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
      // Use sample data when API fails
      setGraphData(sampleData);
      toast({
        title: "Using Sample Data",
        description: "Could not connect to backend, showing sample data",
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
  const displayData = graphData || sampleData;
  const chartData = displayData?.vibration_data?.map((point, index) => {
    const date = new Date(point.timestamp);
    return {
      index,
      timestamp: point.timestamp,
      value: point.value,
      date: date.getTime(),
      formattedTime: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
    };
  }).sort((a, b) => a.date - b.date) || [];

  const chartConfig = {
    value: {
      label: displayData?.y_label || "Vibration",
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{displayData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="index"
                          type="number"
                          scale="linear"
                          domain={['dataMin', 'dataMax']}
                          tickFormatter={(value) => {
                            const point = chartData[Math.floor(value)];
                            return point ? point.formattedTime : '';
                          }}
                          label={{ 
                            value: displayData.x_label, 
                            position: 'insideBottom', 
                            offset: -10 
                          }}
                        />
                        <YAxis 
                          domain={['dataMin - 0.5', 'dataMax + 0.5']}
                          label={{ 
                            value: displayData.y_label, 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) => {
                            const point = chartData[Math.floor(value as number)];
                            return point ? `Time: ${point.formattedTime}` : '';
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="var(--color-value)" 
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          connectNulls={false}
                        />
                        {/* Add reference lines for anomalies */}
                        {displayData.anomalies?.map((anomaly, index) => {
                          const startTime = new Date(anomaly.start).getTime();
                          const endTime = new Date(anomaly.end).getTime();
                          const startIndex = chartData.findIndex(point => 
                            new Date(point.timestamp).getTime() >= startTime
                          );
                          const endIndex = chartData.findIndex(point => 
                            new Date(point.timestamp).getTime() >= endTime
                          );
                          
                          if (startIndex === -1) return null;
                          
                          return (
                            <React.Fragment key={index}>
                              <ReferenceLine 
                                x={startIndex} 
                                stroke="#ef4444" 
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{ 
                                  value: `Anomaly ${index + 1}`, 
                                  position: "top",
                                  style: { fill: '#ef4444' }
                                }}
                              />
                              {endIndex !== -1 && endIndex !== startIndex && (
                                <ReferenceLine 
                                  x={endIndex} 
                                  stroke="#ef4444" 
                                  strokeDasharray="5 5"
                                  strokeWidth={2}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                {/* Anomaly Summary */}
                {displayData.anomalies && displayData.anomalies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Detected Anomalies</h3>
                    <div className="grid gap-2">
                      {displayData.anomalies.map((anomaly, index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
