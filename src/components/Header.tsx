import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Grid3X3, List, Plus, Search, Moon, Sun, BarChart3, Filter, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const Header: React.FC = () => {
  const { view, setView, addGroup, darkMode, toggleDarkMode, filter, setFilter, clearFilter } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filter.search);

  const handleAddGroup = () => {
    const name = prompt('Enter group name:');
    if (name) {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
      const icons = ['💼', '🏠', '🎯', '📚', '🏃', '🎨'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      addGroup(name, randomColor, randomIcon);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ search: query });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilter({ search: '' });
    setShowSearch(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-6 py-4 border-b transition-colors ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ticklo
          </h1>
          <span className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Organize life and work
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  autoFocus
                />
              </div>
              <button
                onClick={handleClearSearch}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Search size={18} />
            </button>
          )}

          {/* View Toggle */}
          <div className={`flex items-center rounded-lg p-1 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list'
                  ? darkMode 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-white text-blue-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setView('board')}
              className={`p-2 rounded-md transition-colors ${
                view === 'board'
                  ? darkMode 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-white text-blue-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Board View"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md transition-colors ${
                view === 'calendar'
                  ? darkMode 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-white text-blue-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Calendar View"
            >
              <Calendar size={18} />
            </button>
            <button
              onClick={() => setView('stats')}
              className={`p-2 rounded-md transition-colors ${
                view === 'stats'
                  ? darkMode 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-white text-blue-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Statistics"
            >
              <BarChart3 size={18} />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add Group Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddGroup}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Add Group</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
