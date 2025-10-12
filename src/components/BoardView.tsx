import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Clock, AlertCircle, CheckCircle, Pin } from 'lucide-react';
import { useStore, Task } from '../store/useStore';
import { format } from 'date-fns';

const BoardView: React.FC = () => {
  const { groups, selectedGroupId, addTask, updateTask, moveTask, darkMode } = useStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const selectedGroup = groups.find(group => group.id === selectedGroupId);
  if (!selectedGroup) return null;

  // Group tasks by status
  const todoTasks = selectedGroup.tasks.filter(task => !task.completed);
  const inProgressTasks = selectedGroup.tasks.filter(task => !task.completed && task.timeSpent > 0);
  const completedTasks = selectedGroup.tasks.filter(task => task.completed);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (targetStatus === 'completed') {
      updateTask(draggedTask.id, { completed: true, completedAt: new Date() });
    } else if (targetStatus === 'todo') {
      updateTask(draggedTask.id, { completed: false, completedAt: undefined });
    }

    setDraggedTask(null);
  };

  const handleAddTask = (e: React.FormEvent, status: string) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      addTask(selectedGroupId!, {
        ...newTask,
        completed: status === 'completed',
        doDate: new Date(),
        tags: [],
        subtasks: [],
        recurring: undefined,
        reminder: undefined,
        attachments: [],
        timeSpent: 0,
        dependencies: [],
        isPinned: false,
        isTemplate: false,
      });
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowAddForm(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (darkMode) {
      switch (priority) {
        case 'high': return 'border-l-red-500 bg-red-900/20';
        case 'medium': return 'border-l-yellow-500 bg-yellow-900/20';
        case 'low': return 'border-l-green-500 bg-green-900/20';
        default: return 'border-l-gray-500 bg-gray-700';
      }
    } else {
      switch (priority) {
        case 'high': return 'border-l-red-500 bg-red-50';
        case 'medium': return 'border-l-yellow-500 bg-yellow-50';
        case 'low': return 'border-l-green-500 bg-green-50';
        default: return 'border-l-gray-500 bg-gray-50';
      }
    }
  };

  const TaskCard: React.FC<{ task: Task; status: string }> = ({ task, status }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      draggable
      onDragStart={() => handleDragStart(task)}
      className={`p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all cursor-move ${getPriorityColor(task.priority)} ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`text-sm font-medium ${
          task.completed 
            ? darkMode 
              ? 'line-through text-gray-500' 
              : 'line-through text-gray-500'
            : darkMode 
              ? 'text-white' 
              : 'text-gray-900'
        }`}>
          {task.title}
        </h4>
        <div className="flex items-center space-x-1">
          {task.isPinned && <Pin size={12} className="text-blue-500" />}
          <button className={`p-1 rounded transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}>
            <MoreHorizontal size={12} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className={`text-xs mb-2 line-clamp-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {task.description}
        </p>
      )}

      <div className={`flex items-center justify-between text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center space-x-2">
          {task.doDate && (
            <span className="flex items-center">
              <Clock size={10} className="mr-1" />
              {format(task.doDate, 'MMM d')}
            </span>
          )}
          {task.timeSpent > 0 && (
            <span>{Math.round(task.timeSpent / 60)}h</span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {task.completed ? (
            <CheckCircle size={12} className="text-green-500" />
          ) : (
            <div className={`w-2 h-2 rounded-full ${
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
          )}
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              darkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  const Column: React.FC<{
    title: string;
    tasks: Task[];
    status: string;
    color: string;
    count: number;
  }> = ({ title, tasks, status, color, count }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold flex items-center ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`} />
          {title}
          <span className={`ml-2 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>({count})</span>
        </h3>
        <button
          onClick={() => setShowAddForm(status)}
          className={`p-1 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div
        className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${
          darkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDragEnd(e, status)}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} status={status} />
          ))}
          
          {showAddForm === status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <form onSubmit={(e) => handleAddTask(e, status)} className="space-y-3">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  autoFocus
                />
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  rows={2}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode
                      ? 'border-gray-600 bg-gray-800 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(null)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:bg-gray-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex-1 p-6 transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Board View</h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{selectedGroup.name}</p>
          </div>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="To Do"
            tasks={todoTasks}
            status="todo"
            color="bg-gray-400"
            count={todoTasks.length}
          />
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            status="in-progress"
            color="bg-blue-400"
            count={inProgressTasks.length}
          />
          <Column
            title="Completed"
            tasks={completedTasks}
            status="completed"
            color="bg-green-400"
            count={completedTasks.length}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardView;
