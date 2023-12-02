import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const fromNow = (timestamp: string | number) => {
  return dayjs(timestampToDate(timestamp)).fromNow();
};

export const timestampToDate = (timestamp: string | number) => {
  if (typeof timestamp === 'string') {
    timestamp = parseInt(timestamp.replaceAll(',', ''));
  }

  return new Date(timestamp);
};

export const now = () => {
  return new Date();
};
