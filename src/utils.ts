export const parseDate = (dateStr: string, format: string): string => {
  const regex = format
    .toLocaleLowerCase()
    .replace(/\bd+\b/, '(?<day>\\d+)')
    .replace(/\bm+\b/, '(?<month>\\d+)')
    .replace(/\by+\b/, '(?<year>\\d+)');

  const parts = new RegExp(regex).exec(dateStr);
  const { year, month, day } = parts?.groups || {};
  const date = new Date(parseFloat(year), parseFloat(month) - 1, parseFloat(day));

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
};
