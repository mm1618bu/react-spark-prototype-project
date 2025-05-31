
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useSearchParams } from 'react-router-dom';
import { InspectionHeader } from '@/components/inspection/InspectionHeader';
import { VibrationChart } from '@/components/inspection/VibrationChart';
import { AnomaliesList } from '@/components/inspection/AnomaliesList';
import { ChatPromptBar } from '@/components/inspection/ChatPromptBar';
import { SampleQuestions } from '@/components/inspection/SampleQuestions';
import { useInspectionData } from '@/hooks/useInspectionData';

const InspectionPage = () => {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machineId');
  const { graphData, isLoading } = useInspectionData(machineId);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMessageSent = (message: string) => {
    console.log('Message sent:', message);
    // Here you could integrate with your chat/query service
  };

  const handleTyping = (isTyping: boolean) => {
    setIsMinimized(isTyping);
  };

  const handleQuestionClick = (question: string) => {
    handleMessageSent(question);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <InspectionHeader />
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Anomaly Inspection</h1>
              <p className="text-gray-600">Machine ID: {machineId}</p>
            </div>

            <SampleQuestions 
              onQuestionClick={handleQuestionClick} 
              isMinimized={isMinimized}
            />
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                Loading inspection data...
              </div>
            ) : graphData ? (
              <div 
                className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
                  isMinimized ? 'p-2' : 'p-6'
                }`}
              >
                <h2 className={`font-semibold mb-6 transition-all duration-300 ${
                  isMinimized ? 'text-sm mb-2' : 'text-xl'
                }`}>
                  {graphData.title}
                </h2>
                
                {!isMinimized && (
                  <>
                    <VibrationChart graphData={graphData} />
                    <AnomaliesList anomalies={graphData.anomalies} />
                  </>
                )}
                
                {isMinimized && (
                  <div className="text-sm text-gray-500">
                    Chart minimized - ask your question below
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                No inspection data available
              </div>
            )}
          </div>
        </main>
        
        <ChatPromptBar onMessageSent={handleMessageSent} onTyping={handleTyping} />
        
        <Footer />
      </div>
    </div>
  );
};

export default InspectionPage;
