import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView: React.FC = () => {
  const { selectedDate, setSelectedDate, getTasksForDate, getOverdueTasks, getUpcomingTasks } = useStore();
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
      classes += " text-gray-400";
    } else if (isToday) {
      classes += " bg-blue-600 text-white font-bold";
    } else if (isSelected) {
      classes += " bg-blue-100 text-blue-600 font-medium";
    } else if (hasTasks) {
      classes += " bg-gray-100 text-gray-900 hover:bg-gray-200";
    } else {
      classes += " text-gray-700 hover:bg-gray-100";
    }

    return classes;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayTasks = getTasksForDay(day);
                  return (
                    <div key={index} className="min-h-[80px] border border-gray-100 p-1">
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
                              task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks for this date</p>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
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
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  Overdue
                </h3>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-2 bg-red-50 rounded border border-red-200">
                      <h4 className="text-sm font-medium text-red-900 truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-red-600">
                        Due {format(task.deadline!, 'MMM d')}
                      </p>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <p className="text-xs text-red-600 text-center">
                      +{overdueTasks.length - 3} more overdue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2" />
                Upcoming
              </h3>
              <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {format(task.doDate!, 'MMM d')}
                    </p>
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-gray-500 text-sm">No upcoming tasks</p>
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
