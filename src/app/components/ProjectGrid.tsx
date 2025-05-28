'use client';

import ProjectCard from './ProjectCard';
import ShimmerCard from './ShimmerCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from './RoleSwitcher'; // Import UserRole type

export interface Project { // Exporting Project interface for use in overviewPage
  id: string;
  name: string;
  status: 'green' | 'yellow' | 'red';
  statusText: string;
  schedule: string;
  budget: string;
  risk: string;
  bu?: string; // Added optional BU property
}

interface ProjectGridProps {
  projects: Project[];
  currentRole: UserRole;
  isLoading?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Stagger effect
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -20, 
    transition: { 
      duration: 0.3, 
      ease: 'easeIn' 
    }
  },
};

// Define layout based on role
const getGridLayout = (role: UserRole) => {
  switch (role) {
    case 'projectManager':
      return 'grid-cols-1 md:grid-cols-2 gap-4'; // More detailed view for PM
    case 'deliveryHead':
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'; // Standard view
    case 'executive':
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'; // Compact view for Exec
    case 'all':
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }
};

export default function ProjectGrid({ projects, currentRole, isLoading = false }: ProjectGridProps) {
  const gridLayout = getGridLayout(currentRole);

  if (isLoading) {
    return (
      <div className={`grid ${gridLayout}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerCard key={`shimmer-${index}`} />
        ))}
      </div>
    );
  }

  if (!projects.length && !isLoading) {
    return (
      <motion.div 
        className="text-center py-10 text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        No projects match the current filters.
      </motion.div>
    );
  }

  return (
    <div className={`grid ${gridLayout}`}>
      <AnimatePresence mode="sync"> {/* Use 'sync' or 'popLayout' for smoother transitions with layout changes */} 
        {projects.map((project, index) => (
          <motion.div
            key={project.id} // Ensure key is on the motion component for AnimatePresence
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout // Animate layout changes
          >
            <ProjectCard
              // Pass all project props
              {...project}
              // Potentially pass role to ProjectCard if its appearance needs to change
              // currentRole={currentRole} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}