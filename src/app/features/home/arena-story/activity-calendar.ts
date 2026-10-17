export interface ActivityYear {
  year: number;
  total: number;
  source: string;
  days: readonly (readonly [date: string, count: number, level: number])[];
}
export interface ActivitySnapshot {
  profileUrl: string;
  retrievedAt: string;
  years: readonly ActivityYear[];
}

export const ACTIVITY_CALENDAR_END = .78;
export const ACTIVITY_CALENDAR_START = .06;

export function activityPlayback(snapshot: ActivitySnapshot, progress: number, firstYear = 2025) {
  const periods = snapshot.years
    .filter(year => year.year >= firstYear)
    .map(data => ({ data, count: data.days.filter(([date]) => date <= snapshot.retrievedAt).length }))
    .filter(period => period.count > 0)
    .sort((left, right) => left.data.year - right.data.year);
  const totalDays = periods.reduce((total, period) => total + period.count, 0);
  if (!totalDays) return null;
  const calendarProgress = Math.max(0, Math.min(1, (progress - ACTIVITY_CALENDAR_START) / (ACTIVITY_CALENDAR_END - ACTIVITY_CALENDAR_START)));
  let dayIndex = Math.min(totalDays - 1, Math.floor(calendarProgress * totalDays));
  for (const period of periods) {
    if (dayIndex < period.count) return { year: period.data.year, dayIndex, date: period.data.days[dayIndex][0] };
    dayIndex -= period.count;
  }
  return null;
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export function activityCalendar(data: ActivityYear, retrievedAt: string) {
  const offset = new Date(Date.UTC(data.year, 0, 1)).getUTCDay();
  const columns = Math.ceil((offset + data.days.length) / 7);
  const days = data.days.map(([date, count, level], index) => {
    const slot = offset + index;
    return {
      date, count, level, index, week: Math.floor(slot / 7), row: slot % 7,
      future: date > retrievedAt,
      label: `${count} ${count === 1 ? 'contribuição' : 'contribuições'} em ${dateFormat.format(new Date(date + 'T00:00:00Z'))}`,
    };
  });
  const months = monthNames.map((label, month) => {
    const index = days.findIndex(day => day.date.slice(5, 7) === String(month + 1).padStart(2, '0'));
    return { label, column: days[index].week + 1 };
  });
  return { days, months, columns, lastAvailable: days.filter(day => !day.future).length - 1 };
}

export function activityKeyIndex(key: string, index: number, row: number, last: number): number {
  const step = ({ ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1, Home: -row, End: 6 - row } as Record<string, number>)[key] ?? 0;
  return Math.max(0, Math.min(last, index + step));
}
