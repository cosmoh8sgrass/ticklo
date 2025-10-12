import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Plus, Trash2, Calendar, Tag, Pin, Play, Pause, Paperclip, Copy, Bell } from 'lucide-react';
import { useStore, Task } from '../store/useStore';
import { format } from 'date-fns';
import { snoozeTask } from '../notifications';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const { 
    toggleTask, 
    deleteTask, 
    addSubtask, 
    toggleSubtask, 
    deleteSubtask, 
    pinTask, 
    unpinTask, 
    duplicateTask,
    startTimer,
    stopTimer,
    activeTimer,
    darkMode
  } = useStore();
  const storeRef = useStore;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      addSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;
  const isTimerActive = activeTimer === task.id;

  const handleTimerToggle = () => {
    if (isTimerActive) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }
  };

  const handlePinToggle = () => {
    if (task.isPinned) {
      unpinTask(task.id);
    } else {
      pinTask(task.id);
    }
  };

  const handleSnooze = (minutes: number) => {
    snoozeTask(storeRef, task.id, minutes);
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg border p-4 mb-3 transition-colors ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}
        >
          {task.completed && <Check size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                task.completed
                  ? darkMode 
                    ? 'line-through text-gray-400' 
                    : 'line-through text-gray-500'
                  : darkMode 
                    ? 'text-white' 
                    : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-4 mt-2">
                {task.doDate && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Calendar size={12} />
                    <span>{format(task.doDate, 'MMM d')}</span>
                  </div>
                )}

                {task.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Tag size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <div className="flex space-x-1">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  
              {task.recurring && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      Recurring
                    </span>
                  )}
              {task.dependencies.length > 0 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {task.dependencies.length} deps
                </span>
              )}
                  
                  {task.attachments.length > 0 && (
                    <span className="flex items-center text-xs text-gray-500">
                      <Paperclip size={10} className="mr-1" />
                      {task.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePinToggle}
                className={`p-1 rounded ${
                  task.isPinned 
                    ? 'bg-blue-100 text-blue-500 hover:bg-blue-200' 
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                title={task.isPinned ? 'Unpin task' : 'Pin task'}
              >
                <Pin size={14} />
              </button>
              
              {task.timeSpent > 0 && (
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                  {formatTime(task.timeSpent)}
                </span>
              )}
              
              <button
                onClick={handleTimerToggle}
                className={`p-1 rounded ${
                  isTimerActive 
                    ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
                title={isTimerActive ? 'Stop timer' : 'Start timer'}
              >
                {isTimerActive ? <Pause size={14} /> : <Play size={14} />}
              </button>
              
              {task.reminder && (
                <span className="text-xs text-blue-500 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                  Reminds {format(task.reminder, 'MMM d, HH:mm')}
                </span>
              )}

              {task.subtasks.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
              
              <button
                onClick={handleDuplicate}
                className="p-1 hover:bg-gray-100 text-gray-500 rounded"
                title="Duplicate task"
              >
                <Copy size={14} />
              </button>

              <label className="p-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" title="Attach file">
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    useStore.getState().addAttachment(task.id, {
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      url: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }} />
                <Paperclip size={14} className="text-gray-500" />
              </label>

              <div className="relative group">
                <button
                  className="p-1 hover:bg-gray-100 text-gray-500 rounded"
                  title="Reminder"
                >
                  <Bell size={14} />
                </button>
                <div className={`absolute right-0 mt-1 hidden group-hover:block z-10 rounded border shadow ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button onClick={() => handleSnooze(5)} className="block px-3 py-1 text-xs w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700">Snooze 5m</button>
                  <button onClick={() => handleSnooze(10)} className="block px-3 py-1 text-xs w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700">Snooze 10m</button>
                  <button onClick={() => handleSnooze(60)} className="block px-3 py-1 text-xs w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700">Snooze 1h</button>
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {task.subtasks.length > 0 && (
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {completedSubtasks} of {totalSubtasks} subtasks completed
            </div>
          )}

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSubtask(task.id, subtask.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      subtask.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {subtask.completed && <Check size={10} />}
                  </button>
                  <span className={`text-sm ${
                    subtask.completed
                      ? darkMode 
                        ? 'line-through text-gray-400' 
                        : 'line-through text-gray-500'
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-700'
                  }`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => deleteSubtask(task.id, subtask.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask..."
                  className={`flex-1 px-2 py-1 text-sm border rounded ${
                    darkMode
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
                <button
                  type="submit"
                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
