'use client';

import { motion } from 'framer-motion';

interface HeatmapCellProps {
  value: number;
  label: string;
  max: number;
}

const HeatmapCell = ({ value, label, max }: HeatmapCellProps) => {
  const intensity = value / max;
  const backgroundColor = `rgba(59, 130, 246, ${intensity})`; // Using blue with varying opacity

  return (
    <motion.div
      className="p-3 rounded-lg"
      style={{ backgroundColor }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="text-lg font-bold text-foreground">{value.toLocaleString()}</div>
    </motion.div>
  );
};

interface PerformanceHeatmapProps {
  data: {
    label: string;
    value: number;
  }[];
}

const PerformanceHeatmap = ({ data }: PerformanceHeatmapProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card rounded-xl shadow-md">
      {data.map((item, index) => (
        <HeatmapCell
          key={index}
          value={item.value}
          label={item.label}
          max={maxValue}
        />
      ))}
    </div>
  );
};

export default PerformanceHeatmap;
