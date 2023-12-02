import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const fromNow = (timestamp: string | number) => {
  if (typeof timestamp === 'string') {
    timestamp = parseInt(timestamp.replaceAll(',', ''));
  }

  return dayjs(timestamp).fromNow();
};
