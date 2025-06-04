
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchGraphData = async () => {
    setIsLoading(true);
    setError(null);
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
      setError('Failed to load graph data. Please check your backend connection.');
      toast({
        title: "Error",
        description: "Could not connect to backend. Please try again.",
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
  const chartData = graphData?.vibration_data?.map((point, index) => {
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
      label: graphData?.y_label || "Vibration",
      color: "#2563eb",
    },
  };

  // Calculate proper domain for Y-axis
  const yValues = chartData.map(d => d.value);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yPadding = (yMax - yMin) * 0.1; // 10% padding

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
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchGraphData}>Try Again</Button>
            </div>
          ) : graphData ? (
            <Card>
              <CardHeader>
                <CardTitle>{graphData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="index"
                          type="number"
                          scale="linear"
                          domain={[0, chartData.length - 1]}
                          ticks={[0, Math.floor(chartData.length / 4), Math.floor(chartData.length / 2), Math.floor(3 * chartData.length / 4), chartData.length - 1]}
                          tickFormatter={(value) => {
                            const point = chartData[Math.floor(value)];
                            return point ? point.formattedTime : '';
                          }}
                          label={{ 
                            value: graphData.x_label, 
                            position: 'insideBottom', 
                            offset: -10 
                          }}
                        />
                        <YAxis 
                          domain={[yMin - yPadding, yMax + yPadding]}
                          label={{ 
                            value: graphData.y_label, 
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
                          strokeWidth={1.5}
                          dot={false}
                          connectNulls={false}
                        />
                        {/* Add reference lines for anomalies */}
                        {graphData.anomalies?.map((anomaly, index) => {
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
              <p className="text-gray-500">No data available. Please try refreshing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;
