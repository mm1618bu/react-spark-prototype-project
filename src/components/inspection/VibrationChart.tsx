
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { GraphData, VibrationDataPoint, Anomaly } from '@/types/inspection';

interface VibrationChartProps {
  graphData: GraphData;
}

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

export const VibrationChart = ({ graphData }: VibrationChartProps) => {
  const chartData = formatChartData(graphData.vibration_data);

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            label={{ 
              value: graphData.x_label, 
              position: 'insideBottom', 
              offset: -5,
              textAnchor: 'middle'
            }}
            tick={{ fontSize: 12 }}
            height={60}
          />
          <YAxis 
            label={{ 
              value: graphData.y_label, 
              angle: -90, 
              position: 'insideLeft',
              textAnchor: 'middle'
            }}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip 
            labelFormatter={(value) => `Time: ${value}`}
            formatter={(value: any) => [value, 'Vibration']}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="line"
          />
          {renderAnomalyAreas(graphData.anomalies, chartData)}
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
  );
};
