import { StoreApi } from 'zustand';
import type { Task, Group } from './store/useStore';

// Simple IndexedDB wrapper via idb-keyval style minimal API
const DB_NAME = 'ticklo-db-v1';
const STORE_KEY = 'ticklo-state';

// Removed unused openDb helper

async function putRaw(value: any) {
  // Fallback to localStorage for simplicity and robustness in CRA
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {}
}

async function getRaw<T>(): Promise<T | null> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function reviveDatesTask(task: Task): Task {
  return {
    ...task,
    doDate: task.doDate ? new Date(task.doDate) : undefined,
    deadline: task.deadline ? new Date(task.deadline) : undefined,
    reminder: task.reminder ? new Date(task.reminder) : undefined,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    subtasks: task.subtasks?.map(s => ({ ...s })),
    attachments: task.attachments?.map(a => ({ ...a, uploadedAt: new Date(a.uploadedAt) })),
  };
}

function reviveDates(groups: Group[]): Group[] {
  return groups.map(g => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
    tasks: g.tasks.map(reviveDatesTask),
  }));
}

export async function rehydrateStore(useStore: StoreApi<any>) {
  const saved = await getRaw<any>();
  if (!saved) return;
  if (saved.groups) {
    saved.groups = reviveDates(saved.groups);
  }
  if (saved.selectedDate) saved.selectedDate = new Date(saved.selectedDate);
  useStore.setState(saved);
}

export function startPersistence(useStore: StoreApi<any>) {
  let timeout: number | undefined;
  const save = () => {
    const state = useStore.getState();
    // Avoid saving large derived values
    const toSave = { ...state };
    // Functions must not be serialized
    delete (toSave as any).addGroup;
    delete (toSave as any).updateGroup;
    delete (toSave as any).deleteGroup;
    delete (toSave as any).archiveGroup;
    delete (toSave as any).setSelectedGroup;
    delete (toSave as any).setView;
    delete (toSave as any).addTask;
    delete (toSave as any).updateTask;
    delete (toSave as any).deleteTask;
    delete (toSave as any).toggleTask;
    delete (toSave as any).duplicateTask;
    delete (toSave as any).moveTask;
    delete (toSave as any).pinTask;
    delete (toSave as any).unpinTask;
    delete (toSave as any).addSubtask;
    delete (toSave as any).updateSubtask;
    delete (toSave as any).toggleSubtask;
    delete (toSave as any).deleteSubtask;
    delete (toSave as any).createRecurringTask;
    delete (toSave as any).generateRecurringInstances;
    delete (toSave as any).setFilter;
    delete (toSave as any).clearFilter;
    delete (toSave as any).setSort;
    delete (toSave as any).getFilteredTasks;
    delete (toSave as any).searchTasks;
    delete (toSave as any).saveAsTemplate;
    delete (toSave as any).createFromTemplate;
    delete (toSave as any).deleteTemplate;
    delete (toSave as any).startTimer;
    delete (toSave as any).stopTimer;
    delete (toSave as any).addTimeSpent;
    delete (toSave as any).addAttachment;
    delete (toSave as any).removeAttachment;
    delete (toSave as any).addDependency;
    delete (toSave as any).removeDependency;
    delete (toSave as any).toggleDarkMode;
    delete (toSave as any).setSelectedDate;
    delete (toSave as any).getProductivityStats;
    delete (toSave as any).getTasksForDate;
    delete (toSave as any).getOverdueTasks;
    delete (toSave as any).getUpcomingTasks;
    putRaw(toSave).catch(() => {});
  };

  // Debounce state saves
  useStore.subscribe(() => {
    if (timeout) window.clearTimeout(timeout);
    timeout = window.setTimeout(save, 300);
  });
}
