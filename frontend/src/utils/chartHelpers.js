export function groupByMonth(items, dateKey) {
  const list = Array.isArray(items) ? items : [];
  const map = {};
  list.forEach((item) => {
    const val = item[dateKey];
    if (!val) return;
    const month = val.slice(0, 7);
    map[month] = (map[month] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

export function groupByKey(items, key) {
  const list = Array.isArray(items) ? items : [];
  const map = {};
  list.forEach((item) => {
    const k = String(item[key]);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
}

export function pctChange(data) {
  if (data.length < 2) return null;
  const prev = data[data.length - 2].count;
  const curr = data[data.length - 1].count;
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}
