'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import AnimatedChartCard from './AnimatedChartCard';

interface DataPoint {
  name: string;
  budget: number;
  actual: number;
  isOutlier?: boolean;
}

const data: DataPoint[] = [
  { name: 'Project A', budget: 4000, actual: 2400 },
  { name: 'Project B', budget: 3000, actual: 1398, isOutlier: true },
  { name: 'Project C', budget: 2000, actual: 9800, isOutlier: true },
  { name: 'Project D', budget: 2780, actual: 3908 },
  { name: 'Project E', budget: 1890, actual: 4800 },
  { name: 'Project F', budget: 2390, actual: 3800 },
  { name: 'Project G', budget: 3490, actual: 4300 },
];

const BudgetActualChart: React.FC = () => {
  return (
    <AnimatedChartCard title="Budget vs. Actual Spending">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="name" className="text-xs fill-gray-600 dark:fill-gray-400" />
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
            cursor={{ fill: 'rgba(200,200,200,0.3)' }}
          />
          <Legend wrapperStyle={{ fontSize: '0.875rem', color: '#4A5568' }} />
          <Bar dataKey="budget" fill="#8884d8" name="Budgeted Amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-budget-${index}`} fill={entry.isOutlier ? '#FF8042' : '#8884d8'} />
            ))}
          </Bar>
          <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-actual-${index}`} fill={entry.isOutlier ? '#FFBB28' : '#82ca9d'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnimatedChartCard>
  );
};

export default BudgetActualChart;