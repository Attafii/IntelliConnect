'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Users, Zap } from 'lucide-react';

// Sample data - replace with actual data source
const cmTrendData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const resourceShortageData = [
  { name: 'Developers', shortage: 60, capacity: 100 },
  { name: 'Designers', shortage: 30, capacity: 100 },
  { name: 'QAs', shortage: 80, capacity: 100 },
];

const confidenceLevel = 75; // Percentage

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...springTransition, delay: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { ...springTransition, delay: i * 0.1 + 0.3 }, // Staggered delay after card
  }),
};

const PredictionsPanel = () => {
  return (
    <motion.div
      className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/40"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
        <Zap className="mr-2 h-6 w-6 text-primary" /> Predictions & Forecasts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CM Trend Line Prediction */}
        <motion.div 
          className="bg-background/50 p-4 rounded-lg shadow-md border border-border/20"
          variants={itemVariants}
          custom={0}
        >
          <h3 className="text-lg font-medium mb-3 text-foreground/90 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-accent-blue" /> CM Trend Prediction
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={cmTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Forecast Resource Shortages */}
        <motion.div 
          className="bg-background/50 p-4 rounded-lg shadow-md border border-border/20"
          variants={itemVariants}
          custom={1}
        >
          <h3 className="text-lg font-medium mb-3 text-foreground/90 flex items-center">
            <Users className="mr-2 h-5 w-5 text-accent-orange" /> Resource Shortage Forecast
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={resourceShortageData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Bar dataKey="shortage" fill="hsl(var(--primary))" radius={[0, 5, 5, 0]}>
                  {resourceShortageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.shortage > 70 ? 'hsl(var(--destructive))' : entry.shortage > 40 ? 'hsl(var(--warning))' : 'hsl(var(--primary))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Confidence Meter */}
        <motion.div 
          className="bg-background/50 p-4 rounded-lg shadow-md border border-border/20"
          variants={itemVariants}
          custom={2}
        >
          <h3 className="text-lg font-medium mb-3 text-foreground/90">Forecast Confidence</h3>
          <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-primary flex items-center justify-center text-sm font-medium text-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${confidenceLevel}%` }}
              transition={{ ...springTransition, duration: 1.5, delay: 0.6 }}
            >
              {confidenceLevel}%
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Based on current data and model accuracy.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PredictionsPanel;