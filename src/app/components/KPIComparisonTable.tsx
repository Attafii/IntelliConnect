'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export interface KPI {
  id: string;
  name: string;
  target: string;
  actual: string;
  variance: string;
  status: 'positive' | 'negative' | 'neutral';
  numericValue?: number; // For sorting purposes
}

interface KPIComparisonTableProps {
  kpis: KPI[];
  title?: string;
}

type SortField = 'name' | 'target' | 'actual' | 'variance' | 'status';
type SortDirection = 'asc' | 'desc';

const KPIComparisonTable: React.FC<KPIComparisonTableProps> = ({ 
  kpis, 
  title = "KPI Comparison" 
}) => {
  const [sortedKPIs, setSortedKPIs] = useState<KPI[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    if (kpis.length > 0) {
      sortData(sortField, sortDirection);
    }
  }, [kpis, sortField, sortDirection]);

  const sortData = (field: SortField, direction: SortDirection) => {
    const sorted = [...kpis].sort((a, b) => {
      let comparison = 0;
      
      // Handle different field types for sorting
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'target':
        case 'actual':
        case 'variance':
          // If numericValue is available, use it for more accurate sorting
          if (a.numericValue !== undefined && b.numericValue !== undefined) {
            comparison = a.numericValue - b.numericValue;
          } else {
            // Fallback to string comparison
            comparison = a[field].localeCompare(b[field]);
          }
          break;
        case 'status':
          // Custom sort order: positive > neutral > negative
          const statusOrder = { positive: 3, neutral: 2, negative: 1 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    setSortedKPIs(sorted);
  };

  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'positive':
        return 'bg-cap-accent-green/20 text-cap-accent-green border-cap-accent-green';
      case 'negative':
        return 'bg-destructive/20 text-destructive border-destructive';
      case 'neutral':
      default:
        return 'bg-cap-secondary-blue/20 text-cap-secondary-blue border-cap-secondary-blue';
    }
  };

  const tableHeaderVariants = {
    hover: { backgroundColor: 'rgba(0, 112, 173, 0.1)' }, // Cap blue with low opacity
    tap: { scale: 0.98 }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05, // Stagger effect
        duration: 0.3,
        ease: 'easeOut'
      }
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      {title && (
        <h2 className="text-xl font-semibold p-4 border-b border-border text-foreground">
          {title}
        </h2>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {[
                { field: 'name', label: 'KPI Name' },
                { field: 'target', label: 'Target' },
                { field: 'actual', label: 'Actual' },
                { field: 'variance', label: 'Variance' },
                { field: 'status', label: 'Status' }
              ].map(({ field, label }) => (
                <motion.th 
                  key={field}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer select-none"
                  onClick={() => handleSort(field as SortField)}
                  variants={tableHeaderVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortField === field && (
                      <span className="text-primary">
                        {sortDirection === 'asc' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                        }
                      </span>
                    )}
                  </div>
                </motion.th>
              ))}
            </tr>
          </thead>
          
          <AnimatePresence initial={false} mode="popLayout">
            <tbody>
              {sortedKPIs.map((kpi, index) => (
                <motion.tr 
                  key={kpi.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border-t border-border hover:bg-muted/50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{kpi.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{kpi.target}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{kpi.actual}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{kpi.variance}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                      {kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  );
};

export default KPIComparisonTable;