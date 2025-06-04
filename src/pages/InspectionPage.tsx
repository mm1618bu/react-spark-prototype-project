import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChatPromptBar } from '@/components/ChatPromptBar';
import { sendQuery } from '@/services/apiService';
import ReactMarkdown from 'react-markdown';

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

interface Message {
  role: 'user' | 'system';
  content: string;
  format?: 'markdown' | 'text';
}

const InspectionPage = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGraphExpanded, setIsGraphExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

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

  const handleMessageSent = async (message: string) => {
    console.log('Message sent:', message);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsQueryLoading(true);
    
    // Minimize graph when chat starts
    if (messages.length === 0) {
      setIsGraphExpanded(false);
    }
    
    try {
      const response = await sendQuery(message);
      console.log('Query response:', response);
      
      // Add system response
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: response.response || "I'm sorry, I couldn't process that request.",
          format: response.format || 'markdown'
        }
      ]);
      
      toast({
        title: "Query Sent",
        description: "Your question has been processed successfully",
      });
    } catch (error) {
      console.error('Failed to send query:', error);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `I couldn't process your question about "${message}". This is a simulated response as the backend is unavailable.`,
          format: 'markdown'
        }
      ]);
      
      toast({
        title: "Query Failed",
        description: "Could not process your question. Using simulated response.",
        variant: "destructive",
      });
    } finally {
      setIsQueryLoading(false);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setIsMinimized(isTyping);
  };

  const toggleGraphExpanded = () => {
    setIsGraphExpanded(!isGraphExpanded);
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
            <div className="space-y-6">
              <Card className="transition-all duration-500 ease-in-out transform-gpu">
                <CardHeader 
                  className={`transition-all duration-500 ease-in-out flex flex-row items-center justify-between ${
                    !isGraphExpanded ? 'pb-2 pt-4' : 'pb-4 pt-6'
                  }`}
                >
                  <CardTitle 
                    className={`transition-all duration-500 ease-in-out ${
                      !isGraphExpanded ? 'text-lg' : 'text-2xl'
                    }`}
                  >
                    {graphData.title}
                  </CardTitle>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleGraphExpanded}
                      className="flex items-center gap-2"
                    >
                      {isGraphExpanded ? (
                        <>
                          Minimize <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Expand <ChevronDown size={16} />
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>
                <CardContent 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    !isGraphExpanded ? 'pt-0 pb-4' : 'pt-0 pb-6'
                  }`}
                >
                  <div 
                    className="w-full transition-all duration-500 ease-in-out" 
                    style={{ 
                      height: !isGraphExpanded ? '150px' : '400px',
                      opacity: !isGraphExpanded ? 0.7 : 1
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData} 
                        margin={{ 
                          top: !isGraphExpanded ? 10 : 20, 
                          right: !isGraphExpanded ? 15 : 30, 
                          left: !isGraphExpanded ? 30 : 60, 
                          bottom: !isGraphExpanded ? 10 : 60 
                        }}
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
                          tick={{ fontSize: !isGraphExpanded ? 10 : 12 }}
                        />
                        <YAxis 
                          domain={[yMin - yPadding, yMax + yPadding]}
                          label={{ 
                            value: graphData.y_label, 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: !isGraphExpanded ? 10 : 12 }
                          }}
                          tick={{ fontSize: !isGraphExpanded ? 10 : 12 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          strokeWidth={!isGraphExpanded ? 1 : 2}
                          dot={false}
                          connectNulls={false}
                        />
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
                                strokeWidth={!isGraphExpanded ? 1 : 2}
                                label={isGraphExpanded ? { 
                                  value: `Anomaly ${index + 1}`, 
                                  position: "top",
                                  style: { fill: '#ef4444' }
                                } : undefined}
                              />
                              {endIndex !== -1 && endIndex !== startIndex && (
                                <ReferenceLine 
                                  x={endIndex} 
                                  stroke="#ef4444" 
                                  strokeDasharray="5 5"
                                  strokeWidth={!isGraphExpanded ? 1 : 2}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div 
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      !isGraphExpanded ? 'max-h-0 opacity-0 mt-0' : 'max-h-96 opacity-100 mt-6'
                    }`}
                  >
                    {graphData.anomalies && graphData.anomalies.length > 0 && (
                      <div>
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
                  </div>

                  {!isGraphExpanded && messages.length > 0 && (
                    <div 
                      className="text-sm text-gray-500 mt-2 transition-all duration-500 ease-in-out"
                    >
                      Chart minimized - click "Expand" to view full details
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Chat messages section */}
              {messages.length > 0 && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-sage-100 ml-12' 
                          : 'bg-white border shadow-sm mr-12'
                      }`}
                    >
                      {message.role === 'system' && message.format === 'markdown' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  ))}
                  {isQueryLoading && (
                    <div className="bg-white border shadow-sm p-4 rounded-lg mr-12">
                      <p className="text-gray-500">Thinking...</p>
                    </div>
                  )}
                </div>
              )}
              
              <ChatPromptBar onMessageSent={handleMessageSent} onTyping={handleTyping} />
            </div>
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
