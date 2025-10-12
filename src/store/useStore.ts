import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay, isAfter, isBefore, addDays } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  doDate?: Date;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  subtasks: Subtask[];
  groupId: string;
  color?: string;
  icon?: string;
  recurring?: RecurringPattern;
  reminder?: Date;
  attachments: Attachment[];
  timeSpent: number; // in minutes
  estimatedTime?: number; // in minutes
  dependencies: string[]; // task IDs this task depends on
  isPinned: boolean;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  maxOccurrences?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Group {
  id: string;
  name: string;
  color: string;
  icon: string;
  tasks: Task[];
  description?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Filter {
  search: string;
  tags: string[];
  priority: ('low' | 'medium' | 'high')[];
  status: ('completed' | 'pending' | 'overdue')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  groupId?: string;
}

export interface SortOption {
  field: 'title' | 'createdAt' | 'doDate' | 'deadline' | 'priority' | 'timeSpent';
  direction: 'asc' | 'desc';
}

export interface ProductivityStats {
  tasksCompleted: number;
  totalTasks: number;
  averageCompletionTime: number;
  mostProductiveDay: string;
  tasksByPriority: Record<string, number>;
  tasksByGroup: Record<string, number>;
  weeklyProgress: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

interface Store {
  groups: Group[];
  selectedGroupId: string | null;
  view: 'list' | 'board' | 'calendar' | 'stats';
  filter: Filter;
  sort: SortOption;
  darkMode: boolean;
  selectedDate: Date;
  templates: Task[];
  activeTimer: string | null; // task ID with active timer
  
  // Basic Actions
  addGroup: (name: string, color: string, icon: string, description?: string) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  archiveGroup: (id: string) => void;
  setSelectedGroup: (id: string | null) => void;
  setView: (view: 'list' | 'board' | 'calendar' | 'stats') => void;
  
  // Task Actions
  addTask: (groupId: string, task: Omit<Task, 'id' | 'groupId' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  moveTask: (taskId: string, newGroupId: string) => void;
  pinTask: (taskId: string) => void;
  unpinTask: (taskId: string) => void;
  
  // Subtask Actions
  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // Recurring Tasks
  createRecurringTask: (groupId: string, task: Omit<Task, 'id' | 'groupId' | 'createdAt' | 'updatedAt'>, pattern: RecurringPattern) => void;
  generateRecurringInstances: (taskId: string) => void;
  
  // Filtering & Sorting
  setFilter: (filter: Partial<Filter>) => void;
  clearFilter: () => void;
  setSort: (sort: SortOption) => void;
  getFilteredTasks: () => Task[];
  
  // Search
  searchTasks: (query: string) => Task[];
  
  // Templates
  saveAsTemplate: (taskId: string) => void;
  createFromTemplate: (templateId: string, groupId: string) => void;
  deleteTemplate: (templateId: string) => void;
  
  // Time Tracking
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  addTimeSpent: (taskId: string, minutes: number) => void;
  
  // Attachments
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  
  // Dependencies
  addDependency: (taskId: string, dependsOnTaskId: string) => void;
  removeDependency: (taskId: string, dependsOnTaskId: string) => void;
  
  // UI State
  toggleDarkMode: () => void;
  setSelectedDate: (date: Date) => void;
  
  // Statistics
  getProductivityStats: () => ProductivityStats;
  getTasksForDate: (date: Date) => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
}

export const useStore = create<Store>((set, get) => ({
  groups: [
    {
      id: '1',
      name: 'Work',
      color: '#3B82F6',
      icon: '💼',
      description: 'Professional tasks and projects',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Write and submit the Q1 project proposal',
          completed: false,
          doDate: new Date(),
          priority: 'high',
          tags: ['work', 'urgent'],
          subtasks: [],
          groupId: '1',
          color: '#3B82F6',
          recurring: undefined,
          reminder: undefined,
          attachments: [],
          timeSpent: 0,
          estimatedTime: 120,
          dependencies: [],
          isPinned: true,
          isTemplate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Team meeting',
          description: 'Weekly standup with the development team',
          completed: false,
          doDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 'medium',
          tags: ['meeting'],
          subtasks: [],
          groupId: '1',
          color: '#3B82F6',
          recurring: {
            type: 'weekly',
            interval: 1,
            daysOfWeek: [1], // Monday
          },
          reminder: new Date(Date.now() + 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // 30 min before
          attachments: [],
          timeSpent: 0,
          estimatedTime: 60,
          dependencies: [],
          isPinned: false,
          isTemplate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Personal',
      color: '#10B981',
      icon: '🏠',
      description: 'Personal tasks and errands',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [
        {
          id: '3',
          title: 'Grocery shopping',
          description: 'Buy ingredients for weekend cooking',
          completed: false,
          doDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          priority: 'low',
          tags: ['shopping', 'home'],
          subtasks: [],
          groupId: '2',
          color: '#10B981',
          recurring: undefined,
          reminder: undefined,
          attachments: [],
          timeSpent: 0,
          estimatedTime: 45,
          dependencies: [],
          isPinned: false,
          isTemplate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ],
  selectedGroupId: '1',
  view: 'list',
  filter: {
    search: '',
    tags: [],
    priority: [],
    status: [],
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  darkMode: true,
  selectedDate: new Date(),
  templates: [],
  activeTimer: null,

  // Basic Actions
  addGroup: (name, color, icon, description) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      color,
      icon,
      description,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    };
    set((state) => ({
      groups: [...state.groups, newGroup],
    }));
  },

  updateGroup: (id, updates) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...updates, updatedAt: new Date() } : group
      ),
    }));
  },

  deleteGroup: (id) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
      selectedGroupId: state.selectedGroupId === id ? null : state.selectedGroupId,
    }));
  },

  archiveGroup: (id) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, isArchived: true, updatedAt: new Date() } : group
      ),
    }));
  },

  setSelectedGroup: (id) => {
    set({ selectedGroupId: id });
  },

  setView: (view) => {
    set({ view });
  },

  // Task Actions
  addTask: (groupId, task) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      groupId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? { ...group, tasks: [...group.tasks, newTask], updatedAt: new Date() }
          : group
      ),
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.filter((task) => task.id !== taskId),
        updatedAt: new Date(),
      })),
    }));
  },

  toggleTask: (taskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : undefined,
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  duplicateTask: (taskId) => {
    const state = get();
    const task = state.groups
      .flatMap(g => g.tasks)
      .find(t => t.id === taskId);
    
    if (task) {
      const duplicatedTask: Task = {
        ...task,
        id: uuidv4(),
        title: `${task.title} (Copy)`,
        completed: false,
        completedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({
        groups: state.groups.map((group) =>
          group.id === task.groupId
            ? { ...group, tasks: [...group.tasks, duplicatedTask], updatedAt: new Date() }
            : group
        ),
      }));
    }
  },

  moveTask: (taskId, newGroupId) => {
    set((state) => {
      const task = state.groups
        .flatMap(g => g.tasks)
        .find(t => t.id === taskId);
      
      if (!task) return state;
      
      return {
        groups: state.groups.map((group) => {
          if (group.id === task.groupId) {
            return {
              ...group,
              tasks: group.tasks.filter(t => t.id !== taskId),
              updatedAt: new Date(),
            };
          }
          if (group.id === newGroupId) {
            return {
              ...group,
              tasks: [...group.tasks, { ...task, groupId: newGroupId, updatedAt: new Date() }],
              updatedAt: new Date(),
            };
          }
          return group;
        }),
      };
    });
  },

  pinTask: (taskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId ? { ...task, isPinned: true, updatedAt: new Date() } : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  unpinTask: (taskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId ? { ...task, isPinned: false, updatedAt: new Date() } : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  // Subtask Actions
  addSubtask: (taskId, title) => {
    const newSubtask: Subtask = {
      id: uuidv4(),
      title,
      completed: false,
    };
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, newSubtask], updatedAt: new Date() }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  updateSubtask: (taskId, subtaskId, updates) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                ),
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  deleteSubtask: (taskId, subtaskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  // Recurring Tasks
  createRecurringTask: (groupId, task, pattern) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      groupId,
      recurring: pattern,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? { ...group, tasks: [...group.tasks, newTask], updatedAt: new Date() }
          : group
      ),
    }));
  },

  generateRecurringInstances: (taskId) => {
    const state = get();
    const task = state.groups
      .flatMap(g => g.tasks)
      .find(t => t.id === taskId);
    
    if (!task || !task.recurring) return;
    
    // This is a simplified implementation
    // In a real app, you'd generate instances based on the recurring pattern
    console.log('Generating recurring instances for task:', task.title);
  },

  // Filtering & Sorting
  setFilter: (filter) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
  },

  clearFilter: () => {
    set({
      filter: {
        search: '',
        tags: [],
        priority: [],
        status: [],
      },
    });
  },

  setSort: (sort) => {
    set({ sort });
  },

  getFilteredTasks: () => {
    const state = get();
    let tasks = state.groups.flatMap(g => g.tasks);
    
    // Apply filters
    if (state.filter.search) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(state.filter.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(state.filter.search.toLowerCase())
      );
    }
    
    if (state.filter.tags.length > 0) {
      tasks = tasks.filter(task =>
        state.filter.tags.some(tag => task.tags.includes(tag))
      );
    }
    
    if (state.filter.priority.length > 0) {
      tasks = tasks.filter(task =>
        state.filter.priority.includes(task.priority)
      );
    }
    
    if (state.filter.status.length > 0) {
      tasks = tasks.filter(task => {
        if (state.filter.status.includes('completed') && task.completed) return true;
        if (state.filter.status.includes('pending') && !task.completed) return true;
        if (state.filter.status.includes('overdue') && !task.completed && task.deadline && isAfter(new Date(), task.deadline)) return true;
        return false;
      });
    }
    
    if (state.filter.groupId) {
      tasks = tasks.filter(task => task.groupId === state.filter.groupId);
    }
    
    // Apply sorting
    tasks.sort((a, b) => {
      let aValue: any = a[state.sort.field];
      let bValue: any = b[state.sort.field];
      
      if (state.sort.field === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }
      
      if (aValue < bValue) return state.sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return state.sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return tasks;
  },

  // Search
  searchTasks: (query) => {
    const state = get();
    return state.groups.flatMap(g => g.tasks).filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description?.toLowerCase().includes(query.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Templates
  saveAsTemplate: (taskId) => {
    const state = get();
    const task = state.groups
      .flatMap(g => g.tasks)
      .find(t => t.id === taskId);
    
    if (task) {
      const template: Task = {
        ...task,
        id: uuidv4(),
        isTemplate: true,
        completed: false,
        completedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({
        templates: [...state.templates, template],
      }));
    }
  },

  createFromTemplate: (templateId, groupId) => {
    const state = get();
    const template = state.templates.find(t => t.id === templateId);
    
    if (template) {
      const newTask: Task = {
        ...template,
        id: uuidv4(),
        groupId,
        isTemplate: false,
        completed: false,
        completedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({
        groups: state.groups.map((group) =>
          group.id === groupId
            ? { ...group, tasks: [...group.tasks, newTask], updatedAt: new Date() }
            : group
        ),
      }));
    }
  },

  deleteTemplate: (templateId) => {
    set((state) => ({
      templates: state.templates.filter(t => t.id !== templateId),
    }));
  },

  // Time Tracking
  startTimer: (taskId) => {
    set({ activeTimer: taskId });
  },

  stopTimer: (taskId) => {
    const state = get();
    if (state.activeTimer === taskId) {
      set({ activeTimer: null });
    }
  },

  addTimeSpent: (taskId, minutes) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? { ...task, timeSpent: task.timeSpent + minutes, updatedAt: new Date() }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  // Attachments
  addAttachment: (taskId, attachment) => {
    const newAttachment: Attachment = {
      ...attachment,
      id: uuidv4(),
      uploadedAt: new Date(),
    };
    
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? { ...task, attachments: [...task.attachments, newAttachment], updatedAt: new Date() }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  removeAttachment: (taskId, attachmentId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                attachments: task.attachments.filter(a => a.id !== attachmentId),
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  // Dependencies
  addDependency: (taskId, dependsOnTaskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                dependencies: [...task.dependencies, dependsOnTaskId],
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  removeDependency: (taskId, dependsOnTaskId) => {
    set((state) => ({
      groups: state.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                dependencies: task.dependencies.filter(id => id !== dependsOnTaskId),
                updatedAt: new Date(),
              }
            : task
        ),
        updatedAt: new Date(),
      })),
    }));
  },

  // UI State
  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  // Statistics
  getProductivityStats: () => {
    const state = get();
    const allTasks = state.groups.flatMap(g => g.tasks);
    const completedTasks = allTasks.filter(t => t.completed);
    
    return {
      tasksCompleted: completedTasks.length,
      totalTasks: allTasks.length,
      averageCompletionTime: completedTasks.reduce((acc, task) => acc + task.timeSpent, 0) / completedTasks.length || 0,
      mostProductiveDay: 'Monday', // Simplified
      tasksByPriority: {
        high: allTasks.filter(t => t.priority === 'high').length,
        medium: allTasks.filter(t => t.priority === 'medium').length,
        low: allTasks.filter(t => t.priority === 'low').length,
      },
      tasksByGroup: state.groups.reduce((acc, group) => {
        acc[group.name] = group.tasks.length;
        return acc;
      }, {} as Record<string, number>),
      weeklyProgress: [], // Simplified
    };
  },

  getTasksForDate: (date) => {
    const state = get();
    return state.groups.flatMap(g => g.tasks).filter(task =>
      task.doDate && isSameDay(task.doDate, date)
    );
  },

  getOverdueTasks: () => {
    const state = get();
    return state.groups.flatMap(g => g.tasks).filter(task =>
      !task.completed && task.deadline && isAfter(new Date(), task.deadline)
    );
  },

  getUpcomingTasks: (days) => {
    const state = get();
    const futureDate = addDays(new Date(), days);
    return state.groups.flatMap(g => g.tasks).filter(task =>
      !task.completed && task.doDate && isAfter(task.doDate, new Date()) && isBefore(task.doDate, futureDate)
    );
  },
}));