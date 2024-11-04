import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export const getLastSeen = (createdAt: string): string => {
  const now = dayjs();
  const messageTime = dayjs(createdAt);

  const diffInSeconds = now.diff(messageTime, 'second');

  if (diffInSeconds < 60) {
    return 'now';
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} min ago`;
  } else if (diffInSeconds < 86400 && messageTime.isSame(now, 'day')) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday at ${messageTime.format('HH:mm')}`;
  } else {
    return messageTime.format('MMM DD YYYY HH:mm');
  }
};
