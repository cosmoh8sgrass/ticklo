import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { exportBackup, importBackup } from '../utils/backup';
import { parseICS } from '../utils/ics';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { darkMode, toggleDarkMode, preferences, setPreferences } = useStore();
  const [nagMe, setNagMe] = useState(preferences.enableNagMe);
  const [nagInterval, setNagInterval] = useState(preferences.nagMeIntervalMinutes);
  const [defaultReminder, setDefaultReminder] = useState(preferences.defaultReminderMinutesBefore);
  const [timeFormat, setTimeFormat] = useState(preferences.timeFormat);
  const [weekStartsOn, setWeekStartsOn] = useState(preferences.weekStartsOn);
  const [ttsEnabled, setTtsEnabled] = useState(preferences.ttsEnabled);

  const saveAndClose = () => {
    setPreferences({
      enableNagMe: nagMe,
      nagMeIntervalMinutes: nagInterval,
      defaultReminderMinutesBefore: defaultReminder,
      timeFormat,
      weekStartsOn,
      ttsEnabled,
    });
    onClose();
  };

  const handleExport = () => exportBackup(useStore);
  const handleImport = async (file?: File) => {
    if (!file) return;
    await importBackup(useStore, file);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-lg rounded-lg border p-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-2 rounded bg-blue-600 text-white"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nag Me</label>
              <input type="checkbox" checked={nagMe} onChange={(e) => setNagMe(e.target.checked)} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Interval (min)</label>
              <input type="number" className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} value={nagInterval} onChange={(e) => setNagInterval(parseInt(e.target.value || '15', 10))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Default Reminder</label>
              <input type="number" className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} value={defaultReminder} onChange={(e) => setDefaultReminder(parseInt(e.target.value || '30', 10))} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Format</label>
              <select className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} value={timeFormat} onChange={(e) => setTimeFormat(e.target.value as '12h' | '24h')}>
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Week Starts On</label>
            <select className={`w-full px-3 py-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} value={weekStartsOn} onChange={(e) => setWeekStartsOn(parseInt(e.target.value, 10) as 0 | 1)}>
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Read Aloud</label>
            <input type="checkbox" checked={ttsEnabled} onChange={(e) => setTtsEnabled(e.target.checked)} />
          </div>
        </div>

        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Backup & Restore</h3>
          <div className="flex items-center space-x-3">
            <button onClick={() => exportBackup(useStore)} className="px-4 py-2 rounded bg-blue-600 text-white">Export Backup</button>
            <label className="px-4 py-2 rounded bg-gray-600 text-white cursor-pointer">
              Import Backup
              <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try { await importBackup(useStore, file); } catch {}
                }
              }} />
            </label>
            <label className="px-4 py-2 rounded bg-gray-600 text-white cursor-pointer">
              Import ICS
              <input type="file" accept="text/calendar,.ics" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const events = parseICS(text);
                useStore.getState().setCalendarEvents(events);
              }} />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className={`px-4 py-2 rounded ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Cancel</button>
          <button onClick={saveAndClose} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
        </div>
      </motion.div>
    </div>
  );
}
