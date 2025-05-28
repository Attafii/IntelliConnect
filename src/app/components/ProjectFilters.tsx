'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';

export interface FilterValues {
  status: string;
  risk: string;
  bu: string;
}

interface ProjectFiltersProps {
  filters: FilterValues;
  onFilterChange: (filterName: keyof FilterValues, value: string) => void;
  uniqueStatuses: string[];
  uniqueRisks: string[];
  uniqueBUs: string[]; // Assuming BUs will be added to project data later
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: 'easeIn' } },
};

export default function ProjectFilters({
  filters,
  onFilterChange,
  uniqueStatuses,
  uniqueRisks,
  uniqueBUs,
}: ProjectFiltersProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-4 mb-6 p-4 bg-card/50 rounded-lg border border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      {/* Status Filter */}
      <div className="flex flex-col">
        <label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground mb-1">
          Status
        </label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger className="w-[180px] bg-background hover:bg-muted transition-colors">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <AnimatePresence>
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </motion.div>
          </AnimatePresence>
        </Select>
      </div>

      {/* Risk Filter */}
      <div className="flex flex-col">
        <label htmlFor="risk-filter" className="text-sm font-medium text-muted-foreground mb-1">
          Risk Level
        </label>
        <Select value={filters.risk} onValueChange={(value) => onFilterChange('risk', value)}>
          <SelectTrigger className="w-[180px] bg-background hover:bg-muted transition-colors">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <AnimatePresence>
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                {uniqueRisks.map((risk) => (
                  <SelectItem key={risk} value={risk}>
                    {risk}
                  </SelectItem>
                ))}
              </SelectContent>
            </motion.div>
          </AnimatePresence>
        </Select>
      </div>

      {/* BU Filter (Placeholder for now) */}
      <div className="flex flex-col">
        <label htmlFor="bu-filter" className="text-sm font-medium text-muted-foreground mb-1">
          Business Unit
        </label>
        <Select value={filters.bu} onValueChange={(value) => onFilterChange('bu', value)} disabled={uniqueBUs.length === 0}>
          <SelectTrigger className="w-[180px] bg-background hover:bg-muted transition-colors">
            <SelectValue placeholder="Filter by BU" />
          </SelectTrigger>
          <AnimatePresence>
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SelectContent>
                <SelectItem value="all">All BUs</SelectItem>
                {uniqueBUs.map((bu) => (
                  <SelectItem key={bu} value={bu}>
                    {bu}
                  </SelectItem>
                ))}
              </SelectContent>
            </motion.div>
          </AnimatePresence>
        </Select>
      </div>
    </motion.div>
  );
}