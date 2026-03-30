/**
 * DEVORA index 조회수 기능 추가용 Apps Script 조각입니다.
 * 기존 스크립트에 아래 action 분기와 함수들을 추가해서 사용하세요.
 *
 * doGet(e) 예시:
 *   var action = (e.parameter.action || '').trim();
 *   if (action === 'trackIndexView') return jsonOutput(trackIndexView_(e));
 *   if (action === 'getIndexViews') return jsonOutput(getIndexViews_(e));
 *
 * jsonOutput(obj) 가 없다면:
 *   function jsonOutput(obj) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify(obj))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 */

var INDEX_VIEWS_SHEET = 'index_views';

function getIndexViewsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(INDEX_VIEWS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(INDEX_VIEWS_SHEET);
    sheet.getRange(1, 1, 1, 2).setValues([['date', 'views']]);
  }
  return sheet;
}

function upsertIndexViewByDate_(dateStr) {
  var sheet = getIndexViewsSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    sheet.appendRow([dateStr, 1]);
    return 1;
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === dateStr) {
      var nextValue = Number(values[i][1] || 0) + 1;
      sheet.getRange(i + 2, 2).setValue(nextValue);
      return nextValue;
    }
  }

  sheet.appendRow([dateStr, 1]);
  return 1;
}

function trackIndexView_(e) {
  var dateStr = (e.parameter.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { result: 'error', message: 'invalid date' };
  }

  var views = upsertIndexViewByDate_(dateStr);
  return { result: 'success', date: dateStr, views: views };
}

function getIndexViews_(e) {
  var days = Math.max(1, Math.min(90, Number(e.parameter.days || 30)));
  var sheet = getIndexViewsSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { result: 'success', items: [] };
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  var items = values.map(function(row) {
    return {
      date: String(row[0]),
      views: Number(row[1] || 0)
    };
  }).sort(function(a, b) {
    return a.date < b.date ? -1 : 1;
  });

  if (items.length > days) {
    items = items.slice(items.length - days);
  }

  return { result: 'success', items: items };
}
