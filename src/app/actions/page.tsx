'use client';

import RouteTransition from '../components/RouteTransition';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const actionItems = [
  {
    id: 'A001',
    title: 'Finalize Q4 Marketing Budget',
    assignedTo: 'Sarah Miller',
    dueDate: '2023-09-15',
    priority: 'High',
    status: 'In Progress',
    project: 'Marketing Campaign Q4',
  },
  {
    id: 'A002',
    title: 'Develop New User Onboarding Flow',
    assignedTo: 'John Davis',
    dueDate: '2023-10-01',
    priority: 'High',
    status: 'Pending',
    project: 'Product Enhancement Initiative',
  },
  {
    id: 'A003',
    title: 'Conduct Security Audit for API Endpoints',
    assignedTo: 'Tech Team',
    dueDate: '2023-09-20',
    priority: 'Medium',
    status: 'Completed',
    project: 'System Security Upgrade',
  },
  {
    id: 'A004',
    title: 'Update Customer Support Documentation',
    assignedTo: 'Emily White',
    dueDate: '2023-09-30',
    priority: 'Low',
    status: 'Pending',
    project: 'Knowledge Base Refresh',
  },
  {
    id: 'A005',
    title: 'Review and Approve Design Mockups for Mobile App',
    assignedTo: 'Michael Brown',
    dueDate: '2023-09-12',
    priority: 'Medium',
    status: 'In Progress',
    project: 'Mobile App Development v2.0',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-400';
    case 'Medium': return 'text-orange-400';
    case 'Low': return 'text-sky-400';
    default: return 'text-gray-400';
  }
};

const ActionsPage = () => {
  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
            Action Items
          </h1>
          <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> New Action
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Assigned To</th>
                <th scope="col" className="px-6 py-3">Due Date</th>
                <th scope="col" className="px-6 py-3">Priority</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Project</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item) => (
                <tr key={item.id} className="border-b border-white/10 hover:bg-white/10 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4">{item.assignedTo}</td>
                  <td className="px-6 py-4">{item.dueDate}</td>
                  <td className={`px-6 py-4 font-medium ${getPriorityColor(item.priority)}`}>{item.priority}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.project}</td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button title="Edit" className="text-blue-400 hover:text-blue-300"><PencilSquareIcon className="h-5 w-5" /></button>
                    <button title={item.status === 'Completed' ? 'Reopen' : 'Mark Complete'} className={`${item.status === 'Completed' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                      {item.status === 'Completed' ? <ArrowPathIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                    </button>
                    <button title="Delete" className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RouteTransition>
  );
};

export default ActionsPage;