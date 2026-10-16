import test from 'node:test';
import assert from 'node:assert/strict';
import { activityCalendar, activityKeyIndex } from '../.test-output/app/features/home/arena-story/activity-calendar.mjs';
import { GITHUB_ACTIVITY } from '../.test-output/app/features/home/arena-story/github-activity-data.mjs';

test('GitHub snapshots have every date exactly once and daily counts agree with their annual total', () => {
  for (const snapshot of GITHUB_ACTIVITY.years) {
    const days = (Date.UTC(snapshot.year + 1, 0, 1) - Date.UTC(snapshot.year, 0, 1)) / 86400000;
    assert.equal(snapshot.days.length, days);
    assert.equal(snapshot.days.reduce((sum, day) => sum + day[1], 0), snapshot.total);
    snapshot.days.forEach(([date, count, level], index) => {
      assert.equal(date, new Date(Date.UTC(snapshot.year, 0, 1 + index)).toISOString().slice(0, 10));
      assert.ok(Number.isInteger(count) && count >= 0);
      assert.ok(Number.isInteger(level) && level >= 0 && level <= 4);
      if (date > GITHUB_ACTIVITY.retrievedAt) assert.equal(count, 0);
    });
  }
});
test('calendar aligns weekdays, leap days and month labels in UTC, excluding future dates from navigation', () => {
  const days = Array.from({ length: 366 }, (_, i) => [new Date(Date.UTC(2024, 0, i + 1)).toISOString().slice(0, 10), 0, 0]);
  const calendar = activityCalendar({ year: 2024, total: 0, source: '', days }, '2024-02-29');
  assert.equal(calendar.days[0].row, 1); // Monday, even in a negative-offset timezone.
  assert.equal(calendar.days[59].date, '2024-02-29');
  assert.equal(calendar.days[59].row, 4);
  assert.match(calendar.days[59].label, /29 de fevereiro de 2024/);
  assert.equal(calendar.lastAvailable, 59);
  assert.equal(calendar.days[59].future, false);
  assert.equal(calendar.days[60].future, true);
  assert.equal(calendar.months[2].column, calendar.days[60].week + 1);
  assert.equal(calendar.columns, 53);
});
test('calendar keyboard navigation follows seven-day columns and stays inside available dates', () => {
  assert.equal(activityKeyIndex('ArrowRight', 20, 3, 100), 27);
  assert.equal(activityKeyIndex('ArrowLeft', 20, 3, 100), 13);
  assert.equal(activityKeyIndex('ArrowUp', 20, 3, 100), 19);
  assert.equal(activityKeyIndex('ArrowDown', 20, 3, 100), 21);
  assert.equal(activityKeyIndex('Home', 20, 3, 100), 17);
  assert.equal(activityKeyIndex('End', 20, 3, 100), 23);
  assert.equal(activityKeyIndex('ArrowLeft', 3, 3, 100), 0);
  assert.equal(activityKeyIndex('ArrowRight', 98, 3, 100), 100);
});
