
import React from 'react';
import { Anomaly } from '@/types/inspection';

interface AnomaliesListProps {
  anomalies: Anomaly[];
}

export const AnomaliesList = ({ anomalies }: AnomaliesListProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Detected Anomalies</h3>
      <div className="grid gap-2">
        {anomalies.map((anomaly, index) => (
          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Anomaly {index + 1}:</strong> {new Date(anomaly.start).toLocaleString()} - {new Date(anomaly.end).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
