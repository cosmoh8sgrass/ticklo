import type { CalendarEvent } from '../store/useStore';

function parseDate(value: string): Date | undefined {
  // Handles formats like 20250130T130000Z or 20250130
  const m = value.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z)?/);
  if (!m) return undefined;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  if (!m[4]) return new Date(year, month, day);
  const hour = parseInt(m[5], 10);
  const minute = parseInt(m[6], 10);
  const second = parseInt(m[7], 10);
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

export function parseICS(text: string): CalendarEvent[] {
  const lines = text.split(/\r?\n/);
  const events: CalendarEvent[] = [];
  let current: any = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT') {
      if (current && current.DTSTART && current.SUMMARY) {
        const ev: CalendarEvent = {
          id: current.UID || Math.random().toString(36).slice(2),
          title: current.SUMMARY,
          start: parseDate(current.DTSTART) || new Date(),
          end: current.DTEND ? parseDate(current.DTEND) : undefined,
        };
        events.push(ev);
      }
      current = null;
    } else if (current) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).split(';')[0];
        const value = line.slice(idx + 1);
        current[key] = value;
      }
    }
  }
  return events;
}
