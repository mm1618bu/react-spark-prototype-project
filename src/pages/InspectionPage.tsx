
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useSearchParams } from 'react-router-dom';
import { InspectionHeader } from '@/components/inspection/InspectionHeader';
import { VibrationChart } from '@/components/inspection/VibrationChart';
import { AnomaliesList } from '@/components/inspection/AnomaliesList';
import { useInspectionData } from '@/hooks/useInspectionData';

const InspectionPage = () => {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machineId');
  const { graphData, isLoading } = useInspectionData(machineId);

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
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                Loading inspection data...
              </div>
            ) : graphData ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">{graphData.title}</h2>
                
                <VibrationChart graphData={graphData} />
                
                <AnomaliesList anomalies={graphData.anomalies} />
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
