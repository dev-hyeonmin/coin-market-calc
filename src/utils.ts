export const TOP_COINS: string = 'TOP_COINS';

export function formattedDate(date: Date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getDate();
}