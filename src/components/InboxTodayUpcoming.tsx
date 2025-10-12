import React from 'react';
import { useStore } from '../store/useStore';
import { isToday, isTomorrow, isAfter, startOfDay } from 'date-fns';
import TaskItem from './TaskItem';

export const InboxView: React.FC = () => {
  const { getFilteredTasks, darkMode } = useStore();
  const tasks = getFilteredTasks().filter(t => !t.completed);
  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-3">
        {tasks.map(t => <TaskItem key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Inbox is empty.</p>
        )}
      </div>
    </div>
  );
};

export const TodayView: React.FC = () => {
  const { getFilteredTasks, darkMode } = useStore();
  const tasks = getFilteredTasks().filter(t => t.doDate && isToday(t.doDate));
  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-3">
        {tasks.map(t => <TaskItem key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tasks for today.</p>
        )}
      </div>
    </div>
  );
};

export const UpcomingView: React.FC = () => {
  const { getFilteredTasks, darkMode } = useStore();
  const now = startOfDay(new Date());
  const tasks = getFilteredTasks().filter(t => t.doDate && isAfter(t.doDate, now));
  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-3">
        {tasks.map(t => <TaskItem key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No upcoming tasks.</p>
        )}
      </div>
    </div>
  );
};
