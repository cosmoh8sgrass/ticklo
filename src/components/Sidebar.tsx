import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const Sidebar: React.FC = () => {
  const { groups, selectedGroupId, setSelectedGroup, darkMode } = useStore();

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
