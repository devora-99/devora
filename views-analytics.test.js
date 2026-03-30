const assert = require('assert');
const views = require('./views-analytics.js');

function createStorage(initial) {
  const store = Object.assign({}, initial);
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    }
  };
}

const today = '2026-03-30';
const key = views.buildDailyViewKey(today);
const storage = createStorage({});

assert.strictEqual(views.shouldTrackToday(storage, today), true);
views.markTrackedToday(storage, today);
assert.strictEqual(views.shouldTrackToday(storage, today), false);

const summary = views.summarizeRows([
  { date: '2026-03-29', views: 3 },
  { date: '2026-03-30', views: 7 },
  { date: '2026-03-28', views: 2 }
], { today: today, seriesDays: 3 });

assert.strictEqual(summary.todayViews, 7);
assert.strictEqual(summary.yesterdayViews, 3);
assert.strictEqual(summary.last7DaysViews, 12);
assert.strictEqual(summary.chartRows.length, 3);
assert.strictEqual(summary.chartRows[0].date, '2026-03-28');
assert.strictEqual(summary.chartRows[2].views, 7);

console.log('views-analytics.test.js: ok');
