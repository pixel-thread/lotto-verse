export function formatMonth(date: string) {
  return new Date(date + '-01').toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
}
export function formatMonthWithTime(date?: string) {
  return date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date TBA';
}
