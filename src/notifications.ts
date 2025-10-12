import { StoreApi } from 'zustand';
import type { Task } from './store/useStore';

function canNotify(): boolean {
  return 'Notification' in window;
}

async function ensurePermission() {
  if (!canNotify()) return;
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {}
  }
}

// Removed unused scheduleTimeout helper

function notifyTask(task: Task, actions?: Array<{ action: string; title: string }>) {
  if (!canNotify() || Notification.permission !== 'granted') return;
  const title = task.title;
  const body = task.description || 'Task reminder';
  try {
    new Notification(title, {
      body,
      tag: task.id,
      requireInteraction: false,
    });
  } catch {}
}

export function initNotifications(useStore: StoreApi<any>) {
  ensurePermission();

  const timers = new Map<string, number>();

  const clearAll = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers.clear();
  };

  const schedule = (task: Task) => {
    if (!task.reminder || task.completed) return;
    const existing = timers.get(task.id);
    if (existing) window.clearTimeout(existing);
    const handle = window.setTimeout(() => {
      notifyTask(task);
      const state = useStore.getState();
      if (state.preferences?.enableNagMe) {
        // Repeat after configured interval until completed
        const minutes = state.preferences.nagMeIntervalMinutes || 15;
        const repeat = window.setInterval(() => {
          const s = useStore.getState();
          const t = s.groups.flatMap((g: any) => g.tasks).find((x: Task) => x.id === task.id) as Task | undefined;
          if (!t || t.completed) {
            window.clearInterval(repeat);
            timers.delete(task.id);
            return;
          }
          notifyTask(t);
        }, minutes * 60 * 1000);
        timers.set(task.id, repeat as unknown as number);
      } else {
        timers.delete(task.id);
      }
    }, Math.max(0, new Date(task.reminder).getTime() - Date.now()));
    timers.set(task.id, handle);
  };

  const rescheduleAll = () => {
    clearAll();
    const state = useStore.getState();
    const all = state.groups.flatMap((g: any) => g.tasks) as Task[];
    all.forEach(schedule);
  };

  // Reschedule on state change
  useStore.subscribe(() => {
    rescheduleAll();
  });

  // Initial schedule
  rescheduleAll();
}

export function snoozeTask(useStore: StoreApi<any>, taskId: string, minutes: number) {
  const state = useStore.getState();
  const task = state.groups.flatMap((g: any) => g.tasks).find((t: Task) => t.id === taskId);
  if (!task) return;
  const newTime = new Date(Date.now() + minutes * 60 * 1000);
  state.updateTask(taskId, { reminder: newTime });
}
