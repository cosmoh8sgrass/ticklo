import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useStore } from '../store/useStore';

const StatsView: React.FC = () => {
  const { getProductivityStats, groups, darkMode } = useStore();
  const stats = getProductivityStats();

  const completionRate = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, subtitle, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg shadow-sm border p-6 transition-colors ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const ProgressBar: React.FC<{
    label: string;
    value: number;
    max: number;
    color: string;
  }> = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
          <span className={`font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}/{max}</span>
        </div>
        <div className={`w-full rounded-full h-2 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 p-6 transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Productivity Statistics</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your progress and performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasks Completed"
            value={stats.tasksCompleted}
            subtitle={`${completionRate.toFixed(1)}% completion rate`}
            icon={<Target size={24} className="text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle="All time"
            icon={<BarChart3 size={24} className="text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Avg. Time"
            value={`${Math.round(stats.averageCompletionTime / 60)}h`}
            subtitle="Per task"
            icon={<Clock size={24} className="text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Most Productive"
            value={stats.mostProductiveDay}
            subtitle="Day of the week"
            icon={<TrendingUp size={24} className="text-white" />}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks by Priority */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-lg shadow-sm border p-6 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-6 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <PieChart size={20} className="mr-2" />
              Tasks by Priority
            </h3>
            <div className="space-y-4">
              <ProgressBar
                label="High Priority"
                value={stats.tasksByPriority.high}
                max={stats.totalTasks}
                color="bg-red-500"
              />
              <ProgressBar
                label="Medium Priority"
                value={stats.tasksByPriority.medium}
                max={stats.totalTasks}
                color="bg-yellow-500"
              />
              <ProgressBar
                label="Low Priority"
                value={stats.tasksByPriority.low}
                max={stats.totalTasks}
                color="bg-green-500"
              />
            </div>
          </motion.div>

          {/* Tasks by Group */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-lg shadow-sm border p-6 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-6 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 size={20} className="mr-2" />
              Tasks by Group
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.tasksByGroup).map(([groupName, count], index) => {
                const group = groups.find(g => g.name === groupName);
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                const color = colors[index % colors.length];
                
                return (
                  <ProgressBar
                    key={groupName}
                    label={groupName}
                    value={count}
                    max={stats.totalTasks}
                    color={color}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-sm border p-6 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-6 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Calendar size={20} className="mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {groups.flatMap(g => g.tasks)
                .filter(task => task.completed)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .slice(0, 5)
                .map((task) => (
                  <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Completed {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Productivity Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-sm border p-6 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Productivity Tips</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-800' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-blue-300' : 'text-blue-900'
                }`}>Break Down Large Tasks</h4>
                <p className={`text-xs ${
                  darkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Split complex tasks into smaller, manageable subtasks to maintain momentum.
                </p>
              </div>
              <div className={`p-4 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-green-900/20 border-green-800' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-green-300' : 'text-green-900'
                }`}>Set Realistic Deadlines</h4>
                <p className={`text-xs ${
                  darkMode ? 'text-green-400' : 'text-green-700'
                }`}>
                  Use do dates to plan when you'll work on tasks, not just when they're due.
                </p>
              </div>
              <div className={`p-4 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-purple-900/20 border-purple-800' 
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <h4 className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-purple-300' : 'text-purple-900'
                }`}>Track Your Time</h4>
                <p className={`text-xs ${
                  darkMode ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  Monitor how long tasks actually take to improve future estimates.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
