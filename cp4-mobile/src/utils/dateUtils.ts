export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().substring(0, 5);
}