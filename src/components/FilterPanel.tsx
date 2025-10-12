import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export const FilterPanel: React.FC<{ onClose: () => void } & { className?: string }> = ({ onClose, className }) => {
  const { darkMode, filter, setFilter, clearFilter, groups } = useStore();
  const [search, setSearch] = useState(filter.search);
  const [selectedGroup, setSelectedGroup] = useState(filter.groupId || '');
  const [priorities, setPriorities] = useState<string[]>(filter.priority as string[]);
  const [statuses, setStatuses] = useState<string[]>(filter.status as string[]);

  const toggleIn = (arr: string[], value: string) => arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const apply = () => {
    setFilter({ search, groupId: selectedGroup || undefined, priority: priorities as any, status: statuses as any });
    onClose();
  };

  const reset = () => {
    clearFilter();
    onClose();
  };

  return (
    <div className={`absolute right-0 mt-2 z-40 w-80 rounded-lg border shadow ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${className || ''}`}>
      <div className="p-4 space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} placeholder="Find tasks..." />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Group</label>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
            <option value="">All</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
          <div className="flex items-center space-x-2">
            {['low','medium','high'].map(p => (
              <button key={p} onClick={() => setPriorities(prev => toggleIn(prev, p))} className={`px-2 py-1 rounded text-xs border ${priorities.includes(p) ? 'bg-blue-600 text-white border-blue-600' : darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
          <div className="flex items-center space-x-2">
            {['pending','completed','overdue'].map(s => (
              <button key={s} onClick={() => setStatuses(prev => toggleIn(prev, s))} className={`px-2 py-1 rounded text-xs border ${statuses.includes(s) ? 'bg-blue-600 text-white border-blue-600' : darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={reset} className={`${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} px-3 py-2 rounded`}>Reset</button>
          <button onClick={apply} className="px-3 py-2 rounded bg-blue-600 text-white">Apply</button>
        </div>
      </div>
    </div>
  );
};
