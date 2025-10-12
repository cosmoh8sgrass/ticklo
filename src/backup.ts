import { StoreApi } from 'zustand';

export function exportBackup(useStore: StoreApi<any>) {
  const state = useStore.getState();
  const blob = new Blob([JSON.stringify(state, (_k, v) => (v instanceof Date ? v.toISOString() : v), 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticklo-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(useStore: StoreApi<any>, file: File) {
  const text = await file.text();
  const json = JSON.parse(text);
  useStore.setState(json);
}
