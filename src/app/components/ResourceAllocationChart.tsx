'use client';

import { motion } from 'framer-motion';

interface ResourceAllocation {
  category: string;
  allocated: number;
  available: number;
  color: string;
}

interface ResourceAllocationChartProps {
  data: ResourceAllocation[];
}

const ResourceAllocationChart = ({ data }: ResourceAllocationChartProps) => {
  const maxValue = Math.max(...data.map(item => item.allocated + item.available));

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-foreground">Resource Allocation Overview</h3>
      <div className="space-y-6">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{item.category}</span>
              <span className="text-sm text-muted-foreground">
                {item.allocated}/{item.allocated + item.available}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.allocated / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResourceAllocationChart;
