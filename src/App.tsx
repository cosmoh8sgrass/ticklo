import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import BoardView from './components/BoardView';
import StatsView from './components/StatsView';
import { TodayView, UpcomingView } from './components/InboxTodayUpcoming';
import { useStore } from './store/useStore';

function App() {
  const { view, darkMode } = useStore();

  const renderView = () => {
    switch (view) {
      case 'list':
        return <TaskList />;
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'board':
        return <BoardView />;
      case 'calendar':
        return <CalendarView />;
      case 'stats':
        return <StatsView />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className={`h-screen flex flex-col transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1f2937' : '#363636',
            color: '#fff',
          },
        }}
      />
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;
