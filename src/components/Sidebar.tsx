import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Inbox, CalendarDays, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { groups, selectedGroupId, setSelectedGroup, darkMode, setView } = useStore();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-64 border-r h-full overflow-y-auto transition-colors scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="mb-6 space-y-2">
          <button
            onClick={() => setView('list')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <Inbox size={16} />
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Inbox</span>
          </button>
          <button
            onClick={() => setView('today')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <CalendarIcon size={16} />
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Today</span>
          </button>
          <button
            onClick={() => setView('upcoming')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <CalendarDays size={16} />
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Upcoming</span>
          </button>
          <button
            onClick={() => setView('stats')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={16} />
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Stats</span>
          </button>
        </div>
        <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Groups
        </h2>
        
        <div className="space-y-2">
          {groups.map((group) => (
            <motion.button
              key={group.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGroup(group.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                selectedGroupId === group.id
                  ? darkMode
                    ? 'bg-blue-900/20 border border-blue-800'
                    : 'bg-blue-50 border border-blue-200'
                  : darkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-50'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: group.color }}
              >
                {group.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {group.name}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {group.tasks.length} tasks
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
