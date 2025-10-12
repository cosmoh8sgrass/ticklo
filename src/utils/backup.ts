import { StoreApi } from 'zustand';

export function exportBackup(useStore: StoreApi<any>) {
  const state = useStore.getState();
  const data = JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
  });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticklo-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackup(useStore: StoreApi<any>, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || !data.state) throw new Error('Invalid backup file');
        useStore.setState(data.state);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
