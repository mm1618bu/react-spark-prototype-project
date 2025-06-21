import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChatPromptBar } from '@/components/ChatPromptBar';
import { WorkOrderForm } from '@/components/WorkOrderForm';
import { sendQuery, fetchInspectionData, InspectionFilters, GraphData } from '@/services/apiService';
import ReactMarkdown from 'react-markdown';

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
  const [isChatMode, setIsChatMode] = useState(false);
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  const [filters, setFilters] = useState<InspectionFilters>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sample prompts for the inspection page
  const samplePrompts = [
    "What could be causing these vibration anomalies?",
    "Analyze the pattern of anomalies in this data",
    "Do you want to generate a Work Order?",
    "How severe are these detected anomalies?"
  ];

  const fetchGraphData = async (currentFilters?: InspectionFilters) => {
    console.log('Fetching graph data with filters:', currentFilters || filters);
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchInspectionData(currentFilters || filters);
      setGraphData(data);
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
    // Read URL parameters and set initial filters
    const machineIdParam = searchParams.get('machineId');
    const machineNameParam = searchParams.get('machineName');
    const sensorTypeParam = searchParams.get('sensorType');
    
    console.log('InspectionPage - URL parameters:', { machineIdParam, machineNameParam, sensorTypeParam });
    
    const initialFilters: InspectionFilters = {
      ...(machineIdParam && { machineId: machineIdParam }),
      ...(machineNameParam && { machineName: machineNameParam }),
      ...(sensorTypeParam && { sensorType: sensorTypeParam })
    };
    
    console.log('InspectionPage - Setting initial filters:', initialFilters);
    setFilters(initialFilters);
    fetchGraphData(initialFilters);
  }, [searchParams]);

  const handleBackClick = () => {
    console.log('Back button clicked, navigating to /machine-health');
    navigate('/machine-health');
  };

  const handleMultiColorButtonClick = () => {
    const machineIdFromParams = searchParams.get('machineId');
    console.log('InspectionPage - Multi Color Button clicked, opening WorkOrderForm with machineId:', machineIdFromParams);
    setShowWorkOrderForm(true);
  };

  const handleMessageSent = async (message: string) => {
    console.log('Message sent from inspection page:', message);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsQueryLoading(true);
    
    // Enter chat mode and minimize graph on first message
    if (!isChatMode) {
      setIsChatMode(true);
      setIsGraphExpanded(false);
    }
    
    try {
      // Pass machine_id when available for anomaly inspection queries
      const response = await sendQuery(message, 'anomaly', filters.machineId);
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
      
      // Removed all toast notifications for successful queries
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

  const handleSamplePromptClick = (prompt: string) => {
    if (prompt === "Do you want to generate a Work Order?") {
      const machineIdFromParams = searchParams.get('machineId');
      console.log('InspectionPage - Opening WorkOrderForm with machineId:', machineIdFromParams);
      setShowWorkOrderForm(true);
    } else {
      handleMessageSent(prompt);
    }
  };

  const handleWorkOrderSubmit = (workOrderData: any) => {
    console.log('Work order data:', workOrderData);
    setShowWorkOrderForm(false);
    
    // Add the work order generation as a chat message
    setMessages(prev => [...prev, 
      { role: 'user', content: 'Generate a work order with the provided information' },
      { 
        role: 'system', 
        content: `# Work Order Generated Successfully\n\n**Work Order #${workOrderData.workOrderNo || 'TBD'}** has been created for **${workOrderData.equipmentDescription || 'Equipment'}**.\n\nThe work order includes:\n- Equipment ID: ${workOrderData.equipmentId}\n- Location: Building ${workOrderData.building}, Floor ${workOrderData.floor}, Room ${workOrderData.room}\n- Assigned to: ${workOrderData.employee}\n- Priority: ${workOrderData.priority}\n\nAll specified parts and materials have been logged for procurement and scheduling.`,
        format: 'markdown'
      }
    ]);
    
    if (!isChatMode) {
      setIsChatMode(true);
      setIsGraphExpanded(false);
    }
    
    toast({
      title: "Work Order Generated",
      description: "Work order has been successfully created.",
    });
  };

  const handleTyping = (isTyping: boolean) => {
    setIsMinimized(isTyping);
  };

  const toggleGraphExpanded = () => {
    setIsGraphExpanded(!isGraphExpanded);
  };

  // Transform data for recharts based on data type
  const chartData = React.useMemo(() => {
    if (!graphData) return [];

    if (graphData.data_type === 'multi' && graphData.multi_value_data) {
      return graphData.multi_value_data.map((point) => {
        const date = new Date(point.timestamp);
        return {
          timestamp: point.timestamp,
          value1: point.value1,
          value2: point.value2,
          value3: point.value3,
          timeValue: date.getTime(),
          hourLabel: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
        };
      }).sort((a, b) => a.timeValue - b.timeValue);
    } else if (graphData.vibration_data) {
      return graphData.vibration_data.map((point) => {
        const date = new Date(point.timestamp);
        return {
          timestamp: point.timestamp,
          value: point.value,
          timeValue: date.getTime(),
          hourLabel: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
        };
      }).sort((a, b) => a.timeValue - b.timeValue);
    }
    return [];
  }, [graphData]);

  // Calculate proper domain for axes
  const isMultiValue = graphData?.data_type === 'multi';
  
  const yValues = React.useMemo(() => {
    if (isMultiValue) {
      return chartData.flatMap(d => [d.value1, d.value2, d.value3].filter(v => v !== undefined));
    } else {
      return chartData.map(d => d.value).filter(v => v !== undefined);
    }
  }, [chartData, isMultiValue]);

  const yMin = yValues.length > 0 ? Math.min(...yValues) : 0;
  const yMax = yValues.length > 0 ? Math.max(...yValues) : 100;
  const yPadding = (yMax - yMin) * 0.1; // 10% padding

  const timeValues = chartData.map(d => d.timeValue);
  const timeMin = timeValues.length > 0 ? Math.min(...timeValues) : 0;
  const timeMax = timeValues.length > 0 ? Math.max(...timeValues) : Date.now();

  // Custom Y-axis formatter to round values
  const formatYAxisTick = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Machine Health
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Anomaly Inspection
                  {searchParams.get('machineName') && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      - {searchParams.get('machineName')}
                    </span>
                  )}
                </h1>
                <Button 
                  onClick={handleMultiColorButtonClick}
                  className="bg-gradient-to-r from-sage-500 via-purple-500 to-pink-500 hover:from-sage-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Work Order
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading graph data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => fetchGraphData()}>Try Again</Button>
                </div>
              ) : graphData ? (
                <div className="space-y-4">
                  <Card className="transition-all duration-500 ease-in-out transform-gpu">
                    <CardHeader 
                      className={`transition-all duration-500 ease-in-out flex flex-row items-center justify-between ${
                        !isGraphExpanded ? 'pb-2 pt-4' : 'pb-4 pt-6'
                      }`}
                    >
                      <CardTitle 
                        className={`transition-all duration-500 ease-in-out ${
                          !isGraphExpanded ? 'text-lg' : 'text-xl'
                        }`}
                      >
                        {graphData.title}
                      </CardTitle>
                      {isChatMode && (
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
                          height: !isGraphExpanded ? '120px' : '300px',
                          opacity: !isGraphExpanded ? 0.7 : 1
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={chartData} 
                            margin={{ 
                              top: !isGraphExpanded ? 5 : 15, 
                              right: !isGraphExpanded ? 10 : 20, 
                              left: !isGraphExpanded ? 25 : 45, 
                              bottom: !isGraphExpanded ? 5 : 30 
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timeValue"
                              type="number"
                              scale="time"
                              domain={[timeMin, timeMax]}
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                });
                              }}
                              tick={{ fontSize: !isGraphExpanded ? 9 : 11 }}
                            />
                            <YAxis 
                              domain={[yMin - yPadding, yMax + yPadding]}
                              tickFormatter={formatYAxisTick}
                              label={{ 
                                value: graphData.y_label, 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fontSize: !isGraphExpanded ? 9 : 11 }
                              }}
                              tick={{ fontSize: !isGraphExpanded ? 9 : 11 }}
                            />
                            
                            {/* Render lines based on data type */}
                            {isMultiValue ? (
                              <>
                                <Line 
                                  type="monotone" 
                                  dataKey="value1" 
                                  stroke="#2563eb" 
                                  strokeWidth={!isGraphExpanded ? 1 : 2}
                                  dot={false}
                                  connectNulls={false}
                                  name="Value 1"
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value2" 
                                  stroke="#dc2626" 
                                  strokeWidth={!isGraphExpanded ? 1 : 2}
                                  dot={false}
                                  connectNulls={false}
                                  name="Value 2"
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value3" 
                                  stroke="#16a34a" 
                                  strokeWidth={!isGraphExpanded ? 1 : 2}
                                  dot={false}
                                  connectNulls={false}
                                  name="Value 3"
                                />
                              </>
                            ) : (
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#2563eb" 
                                strokeWidth={!isGraphExpanded ? 1 : 2}
                                dot={false}
                                connectNulls={false}
                              />
                            )}
                            
                            {graphData.anomalies?.map((anomaly, index) => {
                              const startTime = new Date(anomaly.start).getTime();
                              const endTime = new Date(anomaly.end).getTime();
                              
                              return (
                                <ReferenceArea
                                  key={index}
                                  x1={startTime}
                                  x2={endTime}
                                  fill="#ef4444"
                                  fillOpacity={0.3}
                                  stroke="#ef4444"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  label={isGraphExpanded ? { 
                                    value: `Anomaly ${index + 1}`, 
                                    position: "top",
                                    style: { fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }
                                  } : undefined}
                                />
                              );
                            })}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div 
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          !isGraphExpanded ? 'max-h-0 opacity-0 mt-0' : 'max-h-48 opacity-100 mt-4'
                        }`}
                      >
                        {/* Legend for multi-value charts */}
                        {isMultiValue && isGraphExpanded && (
                          <div className="mb-4 flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-0.5 bg-blue-600"></div>
                              <span>Value 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-0.5 bg-red-600"></div>
                              <span>Value 2</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-0.5 bg-green-600"></div>
                              <span>Value 3</span>
                            </div>
                          </div>
                        )}

                        {graphData.anomalies && graphData.anomalies.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold mb-2">Detected Anomalies</h3>
                            <div className="grid gap-1">
                              {graphData.anomalies.map((anomaly, index) => (
                                <div key={index} className="bg-red-50 border border-red-200 rounded p-2">
                                  <p className="text-xs">
                                    <span className="font-medium">Anomaly {index + 1}:</span>{' '}
                                    {new Date(anomaly.start).toLocaleString()} - {new Date(anomaly.end).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isGraphExpanded && isChatMode && (
                        <div 
                          className="text-xs text-gray-500 mt-1 transition-all duration-500 ease-in-out"
                        >
                          Chart minimized - click "Expand" to view full details
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Show sample prompts and chat prompt bar initially */}
                  {!isChatMode && (
                    <>
                      {/* Sample prompts */}
                      <div className="mt-6 mb-4">
                        <p className="text-sm text-gray-600 mb-3">Try asking:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {samplePrompts.map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="text-left h-auto p-3 bg-white hover:bg-sage-50 border-sage-200 text-gray-700 justify-start"
                              onClick={() => handleSamplePromptClick(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Chat prompt bar */}
                      <div className="mb-4">
                        <ChatPromptBar 
                          onMessageSent={handleMessageSent} 
                          onTyping={handleTyping} 
                          source="anomaly"
                        />
                      </div>
                    </>
                  )}
                  
                  {messages.length > 0 && (
                    <div className="space-y-3 max-w-4xl mx-auto pb-4">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-sage-100 ml-8' 
                              : 'bg-white border shadow-sm mr-8'
                          }`}
                        >
                          {message.role === 'system' && message.format === 'markdown' ? (
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      ))}
                      {isQueryLoading && (
                        <div className="bg-white border shadow-sm p-3 rounded-lg mr-8">
                          <p className="text-gray-500 text-sm">Thinking...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show chat prompt bar below messages once chat mode is active */}
                  {isChatMode && (
                    <div className="mt-4 mb-4">
                      <ChatPromptBar 
                        onMessageSent={handleMessageSent} 
                        onTyping={handleTyping} 
                        source="anomaly"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No data available. Please try refreshing.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Work Order Form Modal */}
      {showWorkOrderForm && (
        <WorkOrderForm
          onClose={() => setShowWorkOrderForm(false)}
          onSubmit={handleWorkOrderSubmit}
          machineId={searchParams.get('machineId') || undefined}
        />
      )}
    </div>
  );
};

export default InspectionPage;
