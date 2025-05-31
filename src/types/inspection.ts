
export interface VibrationDataPoint {
  timestamp: string;
  value: number;
}

export interface Anomaly {
  start: string;
  end: string;
}

export interface GraphData {
  title: string;
  x_label: string;
  y_label: string;
  x_tick_labels: string[];
  vibration_data: VibrationDataPoint[];
  anomalies: Anomaly[];
}
