import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sun, Moon, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Data (Unchanged) ---
const mockTasks = [
  { id: 1, title: 'Fix login bug', status: 'To Do', deadline: '2025-04-25', priority: 'High' },
  { id: 2, title: 'Write documentation', status: 'In Progress', deadline: '2025-04-26', priority: 'Medium' },
  { id: 3, title: 'UI review with manager', status: 'Completed', deadline: '2025-04-20', priority: 'Low' },
  { id: 4, title: 'Deploy feature X', status: 'To Do', deadline: '2025-04-28', priority: 'High' },
];

// --- Define Statuses Centrally ---
const TASK_STATUSES = ['To Do', 'In Progress', 'Completed'];

// --- New TaskCard Component ---
// This component focuses solely on rendering a single task card.
function TaskCard({ task, onUpdateStatus, availableStatuses }) {
  return (
    <Card className="rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline: {task.deadline}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Priority: {task.priority}</p>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* Dynamically generate buttons for *other* available statuses */}
          {availableStatuses
            .filter(statusOption => statusOption !== task.status) // Don't show button for current status
            .map(statusOption => (
              <Button
                key={statusOption}
                size="sm"
                variant="outline" // Use outline for a less prominent look
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
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  // Default to the first status in our defined list
  const [selectedTab, setSelectedTab] = useState(TASK_STATUSES[0]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Task update logic remains the same
  const updateTaskStatus = (id, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
    // Optional: Automatically switch tab when the last item of a status is moved
    // (Consider UX implications - might be jarring)
    // const remainingTasksInTab = tasks.filter(t => t.status === selectedTab && t.id !== id).length;
    // if (remainingTasksInTab === 0) {
    //   // Find the next logical tab or default to the first one
    //   const nextTabIndex = TASK_STATUSES.indexOf(newStatus);
    //   setSelectedTab(TASK_STATUSES[nextTabIndex] || TASK_STATUSES[0]);
    // }
  };

  // Dark mode effect remains the same
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    // Added transition for background color change
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Team Member Dashboard</h1>
          <div className="flex items-center gap-2">
            <Sun className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-yellow-500'}`} />
            <Switch
              id="dark-mode-switch"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* Task Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Use the TASK_STATUSES constant to generate TabsList */}
          <TabsList className="mb-4 grid grid-cols-3 w-full sm:w-auto sm:inline-flex">
            {TASK_STATUSES.map(status => (
              <TabsTrigger key={status} value={status} className="data-[state=active]:shadow-sm">
                {status}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Use the TASK_STATUSES constant to generate TabsContent */}
          {TASK_STATUSES.map(status => (
            <TabsContent key={status} value={status}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks
                  .filter(task => task.status === status)
                  .map(task => (
                    // Use framer-motion for animation when tasks appear
                    <motion.div
                      key={task.id}
                      layout // Animate layout changes smoothly (e.g., when moving between tabs)
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} // Add exit animation if using AnimatePresence (optional)
                      transition={{ duration: 0.3 }}
                    >
                      {/* Render the extracted TaskCard component */}
                      <TaskCard
                        task={task}
                        onUpdateStatus={updateTaskStatus}
                        availableStatuses={TASK_STATUSES}
                      />
                    </motion.div>
                  ))}
                {/* Optional: Display a message if no tasks in this status */}
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