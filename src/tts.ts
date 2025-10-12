import { StoreApi } from 'zustand';

export function readAloud(useStore: StoreApi<any>) {
  const s = useStore.getState();
  if (!('speechSynthesis' in window) || !s.preferences?.ttsEnabled) return;
  const tasks = s.groups.flatMap((g: any) => g.tasks).filter((t: any) => !t.completed && t.doDate);
  const text = tasks.slice(0, 10).map((t: any) => `${t.title}`).join('. ');
  if (!text) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  } catch {}
}
