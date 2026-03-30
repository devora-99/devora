(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DevoraViews = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function toKstDateParts(dateInput) {
    var date = dateInput ? new Date(dateInput) : new Date();
    var kstString = date.toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' });
    var parts = kstString.split(/[\s:-]/);
    return {
      year: Number(parts[0]),
      month: Number(parts[1]),
      day: Number(parts[2]),
      hour: Number(parts[3] || 0),
      minute: Number(parts[4] || 0),
      second: Number(parts[5] || 0)
    };
  }

  function getTodayKst(dateInput) {
    var parts = toKstDateParts(dateInput);
    return parts.year + '-' + pad(parts.month) + '-' + pad(parts.day);
  }

  function buildDailyViewKey(dateStr) {
    return 'devora_index_view_' + dateStr;
  }

  function shouldTrackToday(storage, dateStr) {
    if (!storage || !dateStr) return false;
    try {
      return storage.getItem(buildDailyViewKey(dateStr)) !== '1';
    } catch (e) {
      return true;
    }
  }

  function markTrackedToday(storage, dateStr) {
    if (!storage || !dateStr) return;
    try {
      storage.setItem(buildDailyViewKey(dateStr), '1');
    } catch (e) {}
  }

  function normalizeRows(rows) {
    return (rows || [])
      .map(function(row) {
        return {
          date: String(row.date || ''),
          views: Math.max(0, Number(row.views || 0))
        };
      })
      .filter(function(row) { return /^\d{4}-\d{2}-\d{2}$/.test(row.date); })
      .sort(function(a, b) { return a.date < b.date ? -1 : 1; });
  }

  function buildDateSeries(days, todayStr) {
    var parts = todayStr.split('-').map(Number);
    var base = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    var series = [];
    for (var i = days - 1; i >= 0; i--) {
      var current = new Date(base.getTime() - i * 86400000);
      series.push(
        current.getUTCFullYear() + '-' +
        pad(current.getUTCMonth() + 1) + '-' +
        pad(current.getUTCDate())
      );
    }
    return series;
  }

  function summarizeRows(rows, options) {
    var normalized = normalizeRows(rows);
    var today = (options && options.today) || getTodayKst();
    var seriesDays = (options && options.seriesDays) || 14;
    var viewsByDate = {};

    normalized.forEach(function(row) {
      viewsByDate[row.date] = row.views;
    });

    var seriesDates = buildDateSeries(seriesDays, today);
    var chartRows = seriesDates.map(function(date) {
      return { date: date, views: viewsByDate[date] || 0 };
    });

    var todayViews = viewsByDate[today] || 0;
    var yesterday = buildDateSeries(2, today)[0];
    var yesterdayViews = viewsByDate[yesterday] || 0;
    var recent7Days = buildDateSeries(7, today);
    var last7DaysViews = recent7Days.reduce(function(sum, date) {
      return sum + (viewsByDate[date] || 0);
    }, 0);
    var last14DaysViews = chartRows.reduce(function(sum, row) {
      return sum + row.views;
    }, 0);

    return {
      rows: normalized,
      chartRows: chartRows,
      today: today,
      todayViews: todayViews,
      yesterday: yesterday,
      yesterdayViews: yesterdayViews,
      last7DaysViews: last7DaysViews,
      last14DaysViews: last14DaysViews
    };
  }

  return {
    getTodayKst: getTodayKst,
    buildDailyViewKey: buildDailyViewKey,
    shouldTrackToday: shouldTrackToday,
    markTrackedToday: markTrackedToday,
    normalizeRows: normalizeRows,
    summarizeRows: summarizeRows
  };
}));
