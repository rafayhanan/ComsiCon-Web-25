import React, { useState, useEffect } from 'react'; // Kept useState, useEffect for tasks/tabs
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Removed Switch import
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// Removed Sun, Moon imports. Kept MessageSquare.
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Data (Unchanged) ---
const mockTasks = [
  { id: 1, title: 'Fix login bug', status: 'To Do', deadline: '2025-04-25', priority: 'High' },
  { id: 2, title: 'Write documentation', status: 'In Progress', deadline: '2025-04-26', priority: 'Medium' },
  { id: 3, title: 'UI review with manager', status: 'Completed', deadline: '2025-04-20', priority: 'Low' },
  { id: 4, title: 'Deploy feature X', status: 'To Do', deadline: '2025-04-28', priority: 'High' },
];

// --- Define Statuses Centrally (Unchanged) ---
const TASK_STATUSES = ['To Do', 'In Progress', 'Completed'];

// --- TaskCard Component (Unchanged) ---
function TaskCard({ task, onUpdateStatus, availableStatuses }) {
  return (
    <Card className="rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline: {task.deadline}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Priority: {task.priority}</p>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {availableStatuses
            .filter(statusOption => statusOption !== task.status)
            .map(statusOption => (
              <Button
                key={statusOption}
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(task.id, statusOption)}
                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Move to {statusOption}
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Refactored Dashboard Component ---
export default function TeamMemberDashboardRefactored() {
  // --- Removed darkMode state ---
  // const [darkMode, setDarkMode] = useState(false);

  // Keep state for tasks and tabs
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTab, setSelectedTab] = useState(TASK_STATUSES[0]);

  // --- Removed toggleDarkMode function ---
  // const toggleDarkMode = () => setDarkMode(!darkMode);

  // Task update logic remains the same
  const updateTaskStatus = (id, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // --- Removed Dark mode useEffect ---
  // useEffect(() => {
  //  document.documentElement.classList.toggle('dark', darkMode);
  // }, [darkMode]);

  // Keep other useEffects if needed, otherwise remove useEffect import if unused

  return (
    // The component still benefits from dark mode styles applied globally
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header - Removed Dark Mode Toggle Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Team Member Dashboard</h1>
          {/* Dark Mode Toggle UI removed from here */}
        </div>

        {/* Task Tabs (Unchanged) */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto sm:inline-flex">
            {TASK_STATUSES.map(status => (
              <TabsTrigger key={status} value={status} className="data-[state=active]:shadow-sm">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>

          {TASK_STATUSES.map(status => (
            <TabsContent key={status} value={status}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskCard
                        task={task}
                        onUpdateStatus={updateTaskStatus}
                        availableStatuses={TASK_STATUSES}
                      />
                    </motion.div>
                  ))}
                {tasks.filter(task => task.status === status).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                        No tasks in '{status}'.
                    </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Project Chat Placeholder (Unchanged) */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Project Chat (coming soon)
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-400">
            Real-time chat and file sharing features will be integrated here.
          </div>
        </div>
      </div>
    </div>
  );
}