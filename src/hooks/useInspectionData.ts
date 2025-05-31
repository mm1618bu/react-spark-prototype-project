
import { useState, useEffect } from 'react';
import { GraphData } from '@/types/inspection';
import { sampleGraphData } from '@/data/sampleInspectionData';

export const useInspectionData = (machineId: string | null) => {
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

  return { graphData, isLoading };
};
