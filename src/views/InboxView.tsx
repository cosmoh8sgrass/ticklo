import React from 'react';
import { useStore } from '../store/useStore';
import TaskItem from '../components/TaskItem';

const InboxView: React.FC = () => {
  const { getFilteredTasks, darkMode, selectedGroupId } = useStore();
  const tasks = getFilteredTasks().filter(t => !selectedGroupId || t.groupId === selectedGroupId);

  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nothing in Inbox</div>
        )}
      </div>
    </div>
  );
};

export default InboxView;
