
import { GraphData } from '@/types/inspection';

export const sampleGraphData: GraphData = {
  title: "Outlier detection for Greensand crane June-December 2024",
  x_label: "time samples",
  y_label: "vibration (mm/s)",
  x_tick_labels: ["July", "August", "October", "November", "December"],
  vibration_data: [
    { timestamp: "2024-07-01T00:00:00Z", value: 2.3 },
    { timestamp: "2024-07-15T00:00:00Z", value: 3.1 },
    { timestamp: "2024-08-01T00:00:00Z", value: 2.8 },
    { timestamp: "2024-08-15T00:00:00Z", value: 3.5 },
    { timestamp: "2024-09-01T00:00:00Z", value: 2.9 },
    { timestamp: "2024-09-15T00:00:00Z", value: 4.2 },
    { timestamp: "2024-10-01T00:00:00Z", value: 3.7 },
    { timestamp: "2024-10-15T00:00:00Z", value: 5.1 },
    { timestamp: "2024-11-01T00:00:00Z", value: 4.8 },
    { timestamp: "2024-11-02T06:00:00Z", value: 15.2 },
    { timestamp: "2024-11-02T06:15:00Z", value: 18.5 },
    { timestamp: "2024-11-15T00:00:00Z", value: 3.9 },
    { timestamp: "2024-12-01T00:00:00Z", value: 4.3 },
    { timestamp: "2024-12-10T01:30:00Z", value: 12.7 },
    { timestamp: "2024-12-10T02:00:00Z", value: 16.1 },
    { timestamp: "2024-12-15T00:00:00Z", value: 3.2 }
  ],
  anomalies: [
    {
      start: "2024-07-14T00:00:00Z",
      end: "2024-08-14T00:00:00Z"
    },
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
