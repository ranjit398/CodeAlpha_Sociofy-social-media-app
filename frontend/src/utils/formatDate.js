import { formatDistanceToNow, format, isThisYear } from 'date-fns';

export const timeAgo = (dateString) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return '';
  }
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return isThisYear(date) ? format(date, 'MMM d') : format(date, 'MMM d, yyyy');
  } catch {
    return '';
  }
};

export const formatFullDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return '';
  }
};