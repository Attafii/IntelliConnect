'use client';

import RouteTransition from '../components/RouteTransition';
import MilestoneTimeline from '../components/MilestoneTimeline';
import { Milestone } from '../components/MilestoneCard'; // Ensure Milestone type is imported

// Sample data adapted for the new MilestoneTimeline component
const sampleMilestones: Milestone[] = [
  {
    id: '1',
    name: 'Project Alpha - Phase 1',
    date: '2023-08-15',
    status: 'completed',
    description: 'Initial design and prototype development finished ahead of schedule.',
  },
  {
    id: '2',
    name: 'Beta Testing Launch',
    date: '2023-10-01',
    status: 'in-progress',
    description: 'Recruiting beta testers and preparing testing environments.',
  },
  {
    id: '3',
    name: 'Feature X Integration',
    date: '2023-11-20',
    status: 'pending', // Changed from 'Upcoming' to 'pending' to match MilestoneStatus
    description: 'Development of Feature X is on track for November integration.',
  },
  {
    id: '4',
    name: 'Marketing Campaign Kick-off',
    date: '2024-01-10',
    status: 'pending',
    description: 'Planning for the main marketing campaign to start in the new year.',
  },
  {
    id: '5',
    name: 'Seed Funding Secured',
    date: '2023-05-01',
    status: 'completed',
    description: 'Successfully secured seed funding for project initiation.',
  },
  {
    id: '6',
    name: 'EU Regulatory Approval',
    date: '2024-03-01',
    status: 'delayed',
    description: 'Submission delayed due to new documentation requirements.',
  },
  {
    id: '7',
    name: 'User Interface Overhaul',
    date: '2024-05-15',
    status: 'in-progress',
    description: 'Redesigning the user interface for improved user experience based on beta feedback.',
  },
  {
    id: '8',
    name: 'Full Product Launch',
    date: '2024-07-01',
    status: 'pending',
    description: 'Final preparations for the official product launch in Q3.',
  },
];

const MilestonesPage = () => {
  return (
    <RouteTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* The MilestoneTimeline component handles its own padding and title */}
        <MilestoneTimeline milestones={sampleMilestones} title="Our Journey: Key Milestones" />
        
        {/* You can add more content to the page here if needed */}
        <div className="p-4 md:p-8">
          <h2 className="text-xl font-semibold mt-8 mb-4">Additional Information</h2>
          <p className="text-muted-foreground">
            This section can contain more details about the project's progress or other relevant information.
            The timeline above provides a visual overview of our key achievements and upcoming goals.
          </p>
        </div>
      </div>
    </RouteTransition>
  );
};

export default MilestonesPage;