import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView: React.FC = () => {
  const { selectedDate, setSelectedDate, getTasksForDate, getOverdueTasks, getUpcomingTasks, darkMode, calendarEvents } = useStore();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const tasksForSelectedDate = getTasksForDate(selectedDate);
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(7);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  const getTasksForDay = (day: Date) => {
    return getTasksForDate(day);
  };

  const getDayClasses = (day: Date) => {
    const baseClasses = "h-10 w-10 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors";
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate);
    const hasTasks = getTasksForDay(day).length > 0;

    let classes = baseClasses;
    
    if (!isCurrentMonth) {
      classes += darkMode ? " text-gray-600" : " text-gray-400";
    } else if (isToday) {
      classes += " bg-blue-600 text-white font-bold";
    } else if (isSelected) {
      classes += darkMode 
        ? " bg-blue-500/20 text-blue-400 font-medium" 
        : " bg-blue-100 text-blue-600 font-medium";
    } else if (hasTasks) {
      classes += darkMode 
        ? " bg-gray-700 text-gray-200 hover:bg-gray-600" 
        : " bg-gray-100 text-gray-900 hover:bg-gray-200";
    } else {
      classes += darkMode 
        ? " text-gray-300 hover:bg-gray-700" 
        : " text-gray-700 hover:bg-gray-100";
    }

    return classes;
  };

  

  return (
    <div className={`flex-1 p-6 transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Calendar</h1>
          <div className="flex items-center space-x-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className={`h-10 flex items-center justify-center text-sm font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayTasks = getTasksForDay(day);
                  return (
                    <div key={index} className={`min-h-[80px] border p-1 transition-colors ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <div
                        className={getDayClasses(day)}
                        onClick={() => setSelectedDate(day)}
                      >
                        {format(day, 'd')}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${
                              task.completed 
                                ? darkMode 
                                  ? 'bg-green-900/20 text-green-400' 
                                  : 'bg-green-100 text-green-800'
                                : darkMode 
                                  ? 'bg-blue-900/20 text-blue-400' 
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {calendarEvents.filter(ev => isSameDay(ev.start, day)).slice(0, 2).map(ev => (
                          <div key={ev.id} className={`text-xs p-1 rounded truncate ${darkMode ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-100 text-purple-800'}`} title={ev.title}>
                            {ev.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className={`text-xs text-center ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Tasks */}
            <div className={`rounded-lg shadow-sm border p-4 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              
              {tasksForSelectedDate.length === 0 ? (
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>No tasks for this date</p>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
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
                          {task.description && (
                            <p className={`text-xs mt-1 truncate ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          {task.completed && <CheckCircle size={14} className="text-green-500" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className={`rounded-lg shadow-sm border p-4 transition-colors ${
                darkMode 
                  ? 'bg-gray-800 border-red-800' 
                  : 'bg-white border-red-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-red-400' : 'text-red-900'
                }`}>
                  <AlertCircle size={20} className="mr-2" />
                  Overdue
                </h3>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className={`p-2 rounded border transition-colors ${
                      darkMode 
                        ? 'bg-red-900/20 border-red-800' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <h4 className={`text-sm font-medium truncate ${
                        darkMode ? 'text-red-300' : 'text-red-900'
                      }`}>
                        {task.title}
                      </h4>
                      <p className={`text-xs ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        Due {format(task.deadline!, 'MMM d')}
                      </p>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <p className={`text-xs text-center ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      +{overdueTasks.length - 3} more overdue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            <div className={`rounded-lg shadow-sm border p-4 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock size={20} className="mr-2" />
                Upcoming
              </h3>
              <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className={`p-2 rounded border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h4 className={`text-sm font-medium truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h4>
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {format(task.doDate!, 'MMM d')}
                    </p>
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>No upcoming tasks</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
