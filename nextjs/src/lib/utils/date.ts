import { format, formatDistanceToNow, isPast } from 'date-fns';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy');
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function isOverdue(iso: string): boolean {
  return isPast(new Date(iso));
}

export function toDateInputValue(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}
