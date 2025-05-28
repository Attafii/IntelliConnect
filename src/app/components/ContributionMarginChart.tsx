'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AnimatedChartCard from './AnimatedChartCard';

interface DataPoint {
  month: string;
  margin: number;
}

const data: DataPoint[] = [
  { month: 'Jan', margin: 4000 },
  { month: 'Feb', margin: 3000 },
  { month: 'Mar', margin: 2000 },
  { month: 'Apr', margin: 2780 },
  { month: 'May', margin: 1890 },
  { month: 'Jun', margin: 2390 },
  { month: 'Jul', margin: 3490 },
  { month: 'Aug', margin: 3200 },
  { month: 'Sep', margin: 3800 },
  { month: 'Oct', margin: 4100 },
  { month: 'Nov', margin: 4500 },
  { month: 'Dec', margin: 4300 },
];

const ContributionMarginChart: React.FC = () => {
  return (
    <AnimatedChartCard title="Contribution Margin Over Time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="month" className="text-xs fill-gray-600 dark:fill-gray-400" />
          <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              borderRadius: '0.5rem',
              borderColor: 'rgba(0,0,0,0.1)',
              color: '#333',
            }}
            itemStyle={{ color: '#333' }}
            cursor={{ stroke: 'rgba(200,200,200,0.5)', strokeWidth: 1 }}
          />
          <Legend wrapperStyle={{ fontSize: '0.875rem', color: '#4A5568' }} />
          <Line
            type="monotone"
            dataKey="margin"
            name="Contribution Margin"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8, className: 'stroke-purple-600 fill-white' }}
            dot={{ r: 4, className: 'fill-purple-600' }}
            isAnimationActive={true} // Default Recharts animation
          />
        </LineChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};

export default ContributionMarginChart;