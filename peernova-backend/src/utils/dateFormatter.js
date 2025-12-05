const { formatDistanceToNow, format } = require('date-fns');

/**
 * Format date as "X days ago" or "X hours ago"
 */
const formatDateLabel = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return '';
  }
};

/**
 * Format date for display
 */
const formatDate = (date, formatStr = 'PPp') => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
};

module.exports = {
  formatDateLabel,
  formatDate,
};

